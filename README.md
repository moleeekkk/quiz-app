# ⚡ Quizify - Full-Stack MERN Quiz Application

Quizify is an industry-standard, production-grade MERN stack web application featuring real-time quiz taking, automatic grading, detailed performance breakdown, and an Admin Management Portal with full CRUD capabilities over MongoDB.

---

## 🌟 Key Features

- **Interactive Quiz Runner**: Countdown timers, question step indicators, quick-jump matrix, and immediate score submission.
- **Detailed Performance Analytics**: SVG circular score indicator, breakdown of correct/incorrect answers, points calculation, and answer rationale explanations.
- **Admin Portal (Full CRUD)**:
  - Secure JWT authentication (`admin@quiz.com` / `admin123`).
  - Create, view, update, and delete quizzes stored in MongoDB.
  - Multi-question editor modal with dynamic choice management.
  - One-click Seed Data database reset.
- **Resilient MongoDB Connection**: Primary connection with automatic in-memory fallback (`mongodb-memory-server`) to run out-of-the-box without manual database setup.
- **Industry Architecture**: Clean separation of `client/` (Vite + React 19) and `server/` (Node.js + Express API) orchestrating a monorepo workspace.

---

## 📁 Repository Directory Structure

```text
QUIZ-APP/
├── client/                     # Frontend Application (Vite + React 19)
│   ├── public/                 # Static public files & favicon
│   ├── src/                    # React Source Code
│   │   ├── assets/             # Images & static assets
│   │   ├── components/         # Modular feature-based UI components
│   │   │   ├── admin/          # Admin Portal (AdminDashboard, AdminLoginModal, QuizEditorModal)
│   │   │   ├── common/         # Layout & Common UI (Navbar, Footer, ConfirmModal)
│   │   │   └── quiz/           # Quiz Gameplay (Hero, QuizCard, QuizRunner, QuizResult)
│   │   ├── context/            # React AuthContext Provider
│   │   ├── services/           # HTTP API client (api.js)
│   │   ├── App.jsx             # Root layout & view router
│   │   ├── main.jsx            # React entrypoint
│   │   └── index.css           # Global Design Tokens & Styling
│   ├── index.html              # Frontend HTML entry point
│   ├── vite.config.js          # Vite build configuration
│   ├── eslint.config.js        # ESLint code quality rules
│   └── package.json            # Client dependencies & scripts
│
├── server/                     # Backend API Server (Node.js + Express + MongoDB)
│   ├── config/                 # Database connection & MongoMemoryServer fallback (db.js)
│   ├── controllers/            # Request handlers (authController.js, quizController.js)
│   ├── middleware/             # Auth JWT middleware & error handlers
│   ├── models/                 # Mongoose database models (User.js, Quiz.js)
│   ├── routes/                 # Express API routes (authRoutes.js, quizRoutes.js)
│   ├── utils/                  # Seed data & password hashing utilities
│   ├── .env                    # Server environment variables
│   ├── package.json            # Server dependencies & scripts
│   └── server.js               # Express application entrypoint
│
├── .gitignore                  # Git ignore rules
├── README.md                   # Complete system documentation
└── package.json                # Monorepo root orchestrator package.json
```

---

## 🛠️ Tech Stack

### Frontend (`/client`)
- **Library**: React 19 SPA
- **Build Tool**: Vite 8
- **Icons**: Lucide React
- **Styling**: Modern Vanilla CSS with CSS Variables & Glassmorphism design system

### Backend (`/server`)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM (and `mongodb-memory-server` fallback)
- **Security**: JSON Web Tokens (JWT) & `bcryptjs` password hashing

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (v9 or higher)

### 1. Installation
Install all dependencies across the monorepo root, client, and server:
```bash
npm run install:all
```

### 2. Running the Application (Development Mode)
Run both frontend and backend concurrently with a single command:
```bash
npm start
```
- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

### 3. Alternative Commands
| Command | Description |
| :--- | :--- |
| `npm start` / `npm run dev` | Runs both `client` and `server` concurrently |
| `npm run client` | Runs Vite frontend dev server (`http://localhost:5173`) |
| `npm run server` | Runs Express backend API (`http://localhost:5000`) |
| `npm run build` | Builds client production bundle into `client/dist` |

---

## 🔑 Default Admin Credentials

Access the Admin Portal via the top navigation bar using the following default credentials:
- **Email**: `admin@quiz.com`
- **Password**: `admin123`

---

## 📡 API Endpoint Overview

### Public Endpoints
- `GET /api/quizzes`: Fetch all quizzes (supports `?category=...&difficulty=...&search=...` filters).
- `GET /api/quizzes/:id`: Fetch a single quiz by ID.
- `POST /api/quizzes/:id/submit`: Grade submitted quiz answers and return score breakdown.
- `POST /api/auth/login`: Admin authentication endpoint.

### Protected Admin Endpoints (Requires `Authorization: Bearer <JWT_TOKEN>`)
- `GET /api/auth/me`: Verify active admin token.
- `GET /api/quizzes/admin/stats`: Fetch dashboard statistics.
- `POST /api/quizzes`: Create a new quiz.
- `PUT /api/quizzes/:id`: Update an existing quiz.
- `DELETE /api/quizzes/:id`: Delete a quiz from the database.
- `POST /api/quizzes/seed`: Reset seed data in database.