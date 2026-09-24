# Full-Stack MERN Quiz Application

<p align="center">
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-4.19-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose_8.5-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/License-MIT-green.style=for-the-badge" alt="License" />
</p>

This is a high-performance, industry-standard **Full-Stack MERN (MongoDB, Express, React, Node.js)** Quiz Application. It features real-time quiz taking, dynamic question navigation, automatic grading with answer explanations, and an Admin Management Portal with complete **CRUD** functionality and **JWT Authentication**.

---



## 🌟 Features

### 🎓 Quiz Experience (Client Side)
- **Real-Time Timer**: Live countdown timer per quiz with visual warning alerts as time runs low.
- **Question Matrix Quick-Jump**: Interactive matrix showing answered, unattempted, and active questions.
- **Auto-Grading & Review**: Instant score calculation featuring an SVG circular progress ring, score percentages, pass/fail status, and full question-by-question rationale explanations.
- **Multi-Filter & Search Bar**: Live search by title, category (React, JavaScript, Node.js, CSS), and difficulty level (Easy, Medium, Hard).

### 🛡️ Admin Portal (Full CRUD)
- **Secure JWT Auth**: State-persistent authentication using JSON Web Tokens and bcrypt hashed credentials.
- **Quiz Management**:
  - **Create**: Add new quizzes with custom time limits, passing scores, categories, and multiple choice questions.
  - **Read**: Live search, filter, and analytics stats dashboard (Total Quizzes, Questions, Categories).
  - **Update**: Full edit modal for existing quiz titles, options, correct answers, and explanations.
  - **Delete**: Soft and hard delete confirmation modals with instant UI sync.
- **One-Click Database Reset**: Restore default seed data directly from the Admin UI.

### 💾 Database Configuration
- Connects to standard local or remote MongoDB instance via `MONGODB_URI`.

---

## 🏗️ System Architecture

```text
 ┌────────────────────────────────────────────────────────┐
 │                   React 19 SPA (Client)                │
 │       (Hero, QuizRunner, QuizResult, AdminPortal)      │
 └──────────────────────────┬─────────────────────────────┘
                            │  HTTP / REST API (Fetch)
                            ▼
 ┌────────────────────────────────────────────────────────┐
 │                  Express API (Server)                  │
 │       (authRoutes, quizRoutes, JWT Auth Middleware)    │
 └──────────────────────────┬─────────────────────────────┘
                            │  Mongoose ODM
                            ▼
 ┌────────────────────────────────────────────────────────┐
 │                   MongoDB (Database)                   │
 │              (Users & Quizzes Collections)             │
 └────────────────────────────────────────────────────────┘
```

---

## 📁 Folder Structure

```text
QUIZ-APP/
├── client/                     # Frontend Application Workspace (Vite + React 19)
│   ├── public/                 # Static web assets & favicon
│   ├── src/                    # React Source Code
│   │   ├── assets/             # Visual design assets
│   │   ├── components/         # Feature-Scoped UI Components
│   │   │   ├── admin/          # Admin Portal (AdminDashboard, AdminLoginModal, QuizEditorModal)
│   │   │   ├── common/         # Layout UI (Navbar, Footer, ConfirmModal)
│   │   │   └── quiz/           # Quiz Gameplay (Hero, QuizCard, QuizRunner, QuizResult)
│   │   ├── context/            # Global State Management (AuthContext)
│   │   ├── services/           # HTTP API client wrapper (api.js)
│   │   ├── App.jsx             # Main Application Router & Layout
│   │   ├── main.jsx            # React DOM Entrypoint
│   │   └── index.css           # Design Tokens, Glassmorphism & Responsive CSS
│   ├── index.html              # HTML Index Entrypoint
│   ├── vite.config.js          # Vite Build Configuration
│   ├── eslint.config.js        # ESLint Configuration
│   └── package.json            # Client Dependencies
│
├── server/                     # Backend API Workspace (Node.js + Express + MongoDB)
│   ├── config/                 # DB Connection setup (db.js)
│   ├── controllers/            # Business Logic Handlers (authController.js, quizController.js)
│   ├── middleware/             # JWT Authentication Middleware (authMiddleware.js)
│   ├── models/                 # Mongoose Data Schemas (User.js, Quiz.js)
│   ├── routes/                 # Express API Endpoint Routes (authRoutes.js, quizRoutes.js)
│   ├── utils/                  # Seed Data & Hashing Helpers (seedData.js)
│   ├── .env                    # Environment Configuration
│   ├── package.json            # Server Dependencies
│   └── server.js               # Express Server Entrypoint
│
├── .gitignore                  # Monorepo Git ignore configuration
├── README.md                   # System Documentation
└── package.json                # Root Monorepo Orchestrator package.json
```

---

## 🛠️ Tech Stack

### Frontend (`/client`)
- **Framework**: React 19 SPA
- **Build System**: Vite 8
- **Icons**: Lucide React
- **Styling**: Vanilla CSS with HSL design variables & glassmorphism theme

### Backend (`/server`)
- **Runtime**: Node.js (v18+)
- **Web Server**: Express.js
- **Database**: MongoDB with Mongoose 8 ODM
- **Security**: JWT (jsonwebtoken) & bcryptjs

---

## 🔑 Default Admin Credentials
- **Email**: `admin@quiz.com`
- **Password**: `admin123`

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/QUIZ-APP.git
cd QUIZ-APP
```

### 2. Install Dependencies
Install packages for root monorepo, client, and server in one command:
```bash
npm run install:all
```

### 3. Run Development Servers
Launch both frontend client (`http://localhost:5173`) and Express server (`http://localhost:5000`) concurrently:
```bash
npm start
```

---

## ⚙️ Environment Variables

The server configuration file is located at `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/quiz_db
JWT_SECRET=super_secret_jwt_key_quiz_app_2026_mca
NODE_ENV=development
```

---

## 📡 API Endpoint Reference

### Public API Routes
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/quizzes` | Fetch quizzes (supports `?category=`, `?difficulty=`, `?search=`) |
| `GET` | `/api/quizzes/:id` | Fetch quiz details by ID |
| `POST` | `/api/quizzes/:id/submit` | Grade submitted answers and return score analysis |
| `POST` | `/api/auth/login` | Authenticate admin user & receive JWT token |

### Protected Admin Routes (`Authorization: Bearer <TOKEN>`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/auth/me` | Verify active JWT admin session |
| `GET` | `/api/quizzes/admin/stats` | Fetch summary statistics for admin dashboard |
| `POST` | `/api/quizzes` | Create a new quiz with questions |
| `PUT` | `/api/quizzes/:id` | Update an existing quiz by ID |
| `DELETE` | `/api/quizzes/:id` | Delete quiz from MongoDB |
| `POST` | `/api/quizzes/seed` | Reset database with initial seed quizzes |

---

## 🔍 Troubleshooting

<details>
<summary><b>1. Port 5000 is already in use</b></summary>
Change the <code>PORT</code> variable in <code>server/.env</code> to another port like <code>PORT=5001</code>, and update <code>API_BASE_URL</code> in <code>client/src/services/api.js</code>.
</details>

<details>
<summary><b>2. MongoDB fails to connect locally</b></summary>
Ensure MongoDB service is installed and running locally, or specify a valid MongoDB Atlas connection string in <code>server/.env</code> under <code>MONGODB_URI</code>.
</details>

<details>
<summary><b>3. Client build issues</b></summary>
Run <code>npm run build</code> from the root folder. Ensure Node version is 18+.
</details>