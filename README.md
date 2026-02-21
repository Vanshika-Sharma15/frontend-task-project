# 🚀 Full Stack Task Manager — Frontend Developer Assignment

A full-stack web application that allows users to register, login and manage personal tasks with secure authentication, user-specific data handling and production deployment.

This project demonstrates modern full-stack development practices including authentication, REST APIs, database integration and cloud deployment.

---

## 🌐 Live Demo

* **Frontend (Vercel):** https://frontend-task-project1.vercel.app/
* **Backend (Render):** https://frontend-task-project.onrender.com/
* **GitHub Repository:** https://github.com/Vanshika-Sharma15/frontend-task-project/tree/main

---

## ✨ Features

### 🔐 Authentication

* User signup and login
* JWT based authentication
* Google OAuth login
* Secure password hashing (bcrypt)

### 👤 User Profile

* Display logged-in user details
* Session-based authentication

### ✅ Task Management (CRUD)

* Create tasks
* Edit tasks inline
* Delete tasks
* User-specific tasks (data isolation)
* Real-time UI updates

### 🎨 UI/UX

* Clean professional interface
* Responsive design
* Interactive hover effects
* Loading states

### 🔒 Security

* JWT protected routes
* User-specific data access
* Password hashing
* CORS configuration

---

## 🏗️ Architecture

Frontend and backend are deployed separately using industry standard architecture:

```
React (Vercel)
      ↓
Node.js / Express API (Render)
      ↓
PostgreSQL Database (Supabase)
```

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Fetch API

### Backend

* Node.js
* Express.js
* JWT Authentication
* bcrypt

### Database

* PostgreSQL (Supabase)

### Deployment

* Vercel (Frontend)
* Render (Backend)

---

## 📂 Project Structure

```
frontend-task-project
│
├── frontend
│   ├── src
│   ├── pages
│   └── components
│
├── backend
│   ├── config
│   ├── middleware
│   ├── routes
│   └── server.js
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```
git clone https://github.com/YOUR-USERNAME/frontend-task-project.git
cd frontend-task-project
```

### 2️⃣ Setup Backend

```
cd backend
npm install
```

Create `.env` file:

```
DATABASE_URL=your_postgresql_url
JWT_SECRET=your_secret_key
```

Run backend:

```
node server.js
```

---

### 3️⃣ Setup Frontend

```
cd frontend
npm install
npm start
```

---

## 🚀 Deployment

* Frontend deployed on Vercel
* Backend deployed on Render
* Database hosted on Supabase

---

## 🤖 AI Tools Used

AI tools like ChatGPT were used for guidance in debugging, deployment setup and understanding best practices. The implementation and integration were done manually.

---

## 🧠 Challenges Faced

The most challenging part was configuring secure communication between frontend, backend and database during deployment and resolving authentication and connectivity issues.

---

## 📌 Future Improvements

* Real-time updates using WebSockets
* Better error handling
* Task categories and filters
* Role-based access control

---

## 👨‍💻 Author

Frontend Developer Assignment Project
