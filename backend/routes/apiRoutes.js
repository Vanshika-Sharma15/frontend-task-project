const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const pool = require("../config/db");
const authenticateUser = require("../middleware/authMiddleware");

// Google client
const client = new OAuth2Client(
  "309763414359-a35cqecc3roaia0rsve35n6d1da5ghtm.apps.googleusercontent.com"
);

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields are required" });

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (existingUser.rows.length > 0)
      return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING *",
      [name, email, hashedPassword]
    );

    res.json({
      message: "User created successfully",
      user: result.rows[0],
    });
  } catch {
    res.status(500).json({ error: "Signup failed" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0)
      return res.status(400).json({ error: "User not found" });

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch {
    res.status(500).json({ error: "Login failed" });
  }
});

// PROFILE
router.get("/profile", authenticateUser, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id,name,email FROM users WHERE id=$1",
      [req.user.id]
    );

    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// GOOGLE LOGIN
router.post("/google-login", async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience:
        "309763414359-a35cqecc3roaia0rsve35n6d1da5ghtm.apps.googleusercontent.com",
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;

    let result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    let user;

    if (result.rows.length === 0) {
      const newUser = await pool.query(
        "INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING *",
        [name, email, "google_auth"]
      );
      user = newUser.rows[0];
    } else {
      user = result.rows[0];
    }

    const authToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Google login successful", token: authToken });
  } catch {
    res.status(400).json({ error: "Google login failed" });
  }
});

// TASKS — CREATE
router.post("/tasks", authenticateUser, async (req, res) => {
  const { title } = req.body;

  if (!title)
    return res.status(400).json({ error: "Task title required" });

  const result = await pool.query(
    "INSERT INTO tasks (title,user_id) VALUES ($1,$2) RETURNING *",
    [title, req.user.id]
  );

  res.json(result.rows[0]);
});

// TASKS — GET
router.get("/tasks", authenticateUser, async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM tasks WHERE user_id=$1 ORDER BY id DESC",
    [req.user.id]
  );

  res.json(result.rows);
});

// TASKS — UPDATE
router.put("/tasks/:id", authenticateUser, async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  if (!title)
    return res.status(400).json({ error: "Task title required" });

  const result = await pool.query(
    "UPDATE tasks SET title=$1 WHERE id=$2 AND user_id=$3 RETURNING *",
    [title, id, req.user.id]
  );

  if (result.rows.length === 0)
    return res.status(404).json({ error: "Task not found or not authorized" });

  res.json(result.rows[0]);
});

// TASKS — DELETE
router.delete("/tasks/:id", authenticateUser, async (req, res) => {
  const { id } = req.params;

  await pool.query(
    "DELETE FROM tasks WHERE id=$1 AND user_id=$2",
    [id, req.user.id]
  );

  res.json({ message: "Task deleted" });
});

module.exports = router;