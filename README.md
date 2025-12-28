# Book Library 📚

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-18.x-green.svg)
![React](https://img.shields.io/badge/react-18.2-blue.svg)
![Docker](https://img.shields.io/badge/docker-ready-brightgreen.svg)

**A Professional Book Library Management System**

Built for OS Lab Assignment | Full Stack MERN Application with Docker

[Features](#features) • [Installation](#installation) • [Docker](#docker) • [API Documentation](#api-documentation) • [Screenshots](#screenshots)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Docker Deployment](#docker-deployment)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Commit Conventions](#commit-conventions)
- [License](#license)

---

## 🌟 Overview

Book Library is a comprehensive Book Library Management System that allows users to browse, upload, and rate books. The application features a robust admin panel for managing book submissions, complete with an approval workflow. Built with modern web technologies and fully containerized with Docker.

**Key Highlights:**
- ✅ **Bonus A**: Docker Compose for multi-service orchestration
- ✅ **Bonus C**: Multi-stage Dockerfile for optimized frontend builds
- 🎨 Beautiful Dark/Light mode theming
- 🔐 Secure JWT-based authentication
- ⭐ Interactive book rating system
- 👑 Admin approval workflow for book submissions

---

## ✨ Features

### User Features
- 🔍 **Browse Books**: View all approved books in an elegant grid layout
- 📤 **Upload Books**: Submit new books with title, author, and description
- ⭐ **Rate Books**: Interactive star rating system (1-5 stars)
- 📖 **Read Details**: View complete book information and ratings
- 🌓 **Theme Toggle**: Switch between Dark and Light modes
- 🔐 **Authentication**: Secure login and registration system

### Admin Features
- 📊 **Admin Dashboard**: View all pending book submissions
- ✅ **Approve Books**: Review and approve quality submissions
- ❌ **Reject Books**: Remove inappropriate or duplicate submissions
- 📧 **Uploader Information**: See who submitted each book

### Technical Features
- 🐳 **Docker Ready**: Complete containerization with Docker Compose
- 🚀 **Multi-stage Build**: Optimized production builds
- 📱 **Responsive Design**: Works on all devices
- 🎯 **Modern UI/UX**: Built with Tailwind CSS
- 🔒 **Security**: Password hashing, JWT tokens, CORS protection

---

## 🛠️ Tech Stack

### Frontend
- **React.js 18** - Modern UI library
- **Vite** - Next-generation build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Web server (production)
- **Node Alpine** - Lightweight base images

---

## 📁 Project Structure

```
book-library/
├── backend/                 # Node.js backend
│   ├── models/             # Mongoose models
│   │   ├── User.js
│   │   └── Book.js
│   ├── routes/             # API routes
│   │   ├── auth.js
│   │   └── books.js
│   ├── middleware/         # Custom middleware
│   │   └── auth.js
│   ├── server.js           # Entry point
│   ├── package.json
│   ├── Dockerfile          # Backend Dockerfile
│   └── .env.example        # Environment template
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   └── Navbar.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── UploadBook.jsx
│   │   │   ├── BookDetails.jsx
│   │   │   └── AdminPanel.jsx
│   │   ├── context/       # React Context
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── api/           # API configuration
│   │   │   └── axios.js
│   │   ├── App.jsx        # Main component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── Dockerfile          # Multi-stage frontend Dockerfile
│   ├── nginx.conf          # Nginx configuration
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
│
├── docs/
│   ├── notes.md            # Technical documentation
│   └── screenshots/        # Application screenshots
│
├── docker-compose.yml      # Docker orchestration
├── .dockerignore
├── .gitignore
├── .env.example            # Root env template
└── README.md
```

---

## 🚀 Installation

### Prerequisites
- Node.js 18 or higher
- MongoDB Atlas account (or local MongoDB)
- npm or yarn package manager

### Local Development Setup

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd book-library
```

#### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env and add your MongoDB URI and JWT secret
```

#### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Create .env file (optional for local dev)
cp .env.example .env
```

#### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Backend running on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Frontend running on http://localhost:3000
```

---

## 🐳 Docker Deployment

### Prerequisites
- Docker Desktop installed
- Docker Compose installed

### Quick Start with Docker

#### 1. Configure Environment
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your credentials
nano .env
```

Add your MongoDB URI and JWT secret:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lumina-book-hub
JWT_SECRET=your_secure_secret_key_here
```

#### 2. Build and Run
```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d
```

#### 3. Access the Application
- **Frontend**: http://localhost
- **Backend API**: http://localhost:5000

#### 4. Stop Services
```bash
docker-compose down
```

### Docker Commands

```bash
# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f frontend
docker-compose logs -f backend

# Rebuild specific service
docker-compose build frontend

# Restart services
docker-compose restart

# Remove containers and volumes
docker-compose down -v
```

### Multi-stage Build Details (Bonus C)

The frontend Dockerfile uses a **multi-stage build** to optimize the final image size:

**Stage 1 - Builder:**
- Uses `node:18-alpine` to build the React application
- Installs dependencies and creates production build
- Results in ~1.2GB intermediate image

**Stage 2 - Production:**
- Uses `nginx:alpine` (only ~25MB)
- Copies only the built files from Stage 1
- Final image size: ~25MB (98% reduction!)

---

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### Frontend (.env) - Optional
```env
VITE_API_URL=http://localhost:5000/api
```

### Docker Compose (.env)
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

---

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Book Endpoints

#### Get All Approved Books
```http
GET /api/books
```

#### Get Single Book
```http
GET /api/books/:id
```

#### Upload New Book (Authenticated)
```http
POST /api/books
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Book Title",
  "author": "Author Name",
  "description": "Book description"
}
```

#### Rate Book (Authenticated)
```http
POST /api/books/:id/rate
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5
}
```

### Admin Endpoints

#### Get Pending Books (Admin Only)
```http
GET /api/books/pending
Authorization: Bearer <admin-token>
```

#### Approve Book (Admin Only)
```http
PUT /api/books/:id/approve
Authorization: Bearer <admin-token>
```

#### Reject Book (Admin Only)
```http
PUT /api/books/:id/reject
Authorization: Bearer <admin-token>
```

---

## 💻 Usage

### Default Admin Account
```
Email: admin@luminabooks.com
Password: Admin@123
```
⚠️ **Important**: Change these credentials after first login in production!

### User Workflow
1. Register a new account or login
2. Browse approved books on the home page
3. Click on a book to view details and rate it
4. Upload new books using the "Upload Book" button
5. Toggle between Dark/Light mode using the theme button

### Admin Workflow
1. Login with admin credentials
2. Click "Admin Panel" in the navbar
3. Review pending books
4. Approve quality submissions
5. Reject inappropriate content
6. Approved books appear in the main library

---

## 📸 Screenshots

Screenshots are stored in the `docs/screenshots/` directory:

- Docker Desktop running containers
- Application in Dark mode
- Application in Light mode
- Admin Panel interface
- Browse books page
- Book details with ratings
- Upload book form

*(Screenshots to be added during testing phase)*

---

## 📝 Commit Conventions

This project follows conventional commit message patterns:

```bash
feat: Add new feature
fix: Bug fix
docker: Docker configuration changes
docs: Documentation updates
style: Code style changes
refactor: Code refactoring
test: Test updates
chore: Maintenance tasks
```

**Examples:**
```bash
git commit -m "feat: Add book rating system"
git commit -m "docker: Implement multi-stage frontend build"
git commit -m "fix: Resolve CORS issues in production"
git commit -m "docs: Update API documentation"
```

---

## 🏆 Bonus Features Implemented

### ✅ Bonus A - Docker Compose
Implemented complete docker-compose.yml file that orchestrates both frontend and backend services with:
- Custom bridge network for inter-service communication
- Environment variable configuration
- Automatic service dependency management
- Health checks and restart policies

### ✅ Bonus C - Multi-stage Build
Frontend Dockerfile uses multi-stage build:
- **Build stage**: Compiles React application
- **Production stage**: Serves with Nginx
- **Result**: 98% reduction in final image size

---

## 📄 License

This project is created for educational purposes as part of an OS Lab assignment.

---

## 👨‍💻 Author

Created with ❤️ for OS Lab Assignment

---

## 🙏 Acknowledgments

- MongoDB Atlas for cloud database hosting
- Docker for containerization platform
- React and Node.js communities for excellent documentation
- Tailwind CSS for the beautiful UI framework

---

<div align="center">

**Lumina Book Hub** - Illuminate Your Reading Journey 📚✨

</div>
