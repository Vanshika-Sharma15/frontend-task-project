const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: [
    "https://frontend-task-project1.vercel.app",
    "http://localhost:3000"
  ],
  credentials: true
}));
app.use(express.json());

// routes
const apiRoutes = require("./routes/apiRoutes");
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});