# 📚 Book Library - Complete Setup Guide

## Project Name: book-library

This guide will help you set up and run the Book Library Management System using a **unified Dockerfile** approach.

---

## 🎯 What's New

✅ **Single Dockerfile**: One Dockerfile builds and runs both frontend and backend
✅ **Simplified docker-compose**: Single service configuration
✅ **Updated project name**: All references changed to "book-library"
✅ **Easy run script**: Just execute `./run.sh` to start

---

## 📋 Prerequisites

### For Docker Deployment (Recommended)
- Docker Desktop installed and running
- MongoDB Atlas account (free tier is fine)

### For Local Development
- Node.js 18+ installed
- MongoDB Atlas account
- npm package manager

---

## 🚀 Method 1: Docker (Recommended)

### Step 1: Configure MongoDB

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free cluster (if you don't have one)
3. Click "Connect" → "Connect your application"
4. Copy your connection string

### Step 2: Set Environment Variables

Edit the `.env` file in the root directory:

```bash
# Open .env file
nano .env
```

Add your MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/book-library?retryWrites=true&w=majority
JWT_SECRET=book_library_secret_change_this_in_production
```

**Important**: Replace `YOUR_USERNAME`, `YOUR_PASSWORD`, and the cluster URL with your actual MongoDB credentials.

### Step 3: Build and Run with Docker

```bash
# Build and start the application
docker-compose up --build
```

This will:
- ✅ Build the unified Docker image
- ✅ Install all dependencies
- ✅ Build the React frontend
- ✅ Start both backend (port 5000) and frontend (port 3000)

### Step 4: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

### Step 5: Login

Default admin credentials:
```
Email: admin@luminabooks.com
Password: Admin@123
```

### Stop the Application

```bash
# Stop and remove containers
docker-compose down

# Stop and remove containers + volumes
docker-compose down -v
```

---

## 🛠️ Method 2: Local Development

### Step 1: Configure Backend Environment

Create `backend/.env`:

```bash
cd backend
cp .env.example .env
nano .env
```

Add your MongoDB URI:

```env
PORT=5000
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/book-library?retryWrites=true&w=majority
JWT_SECRET=book_library_secret_2024
NODE_ENV=development
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 3: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### Step 4: Run Both Services

**Option A - Using the run script:**
```bash
cd ..
./run.sh
# Choose option 2 for Local Development
```

**Option B - Manual (Two terminals):**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### Step 5: Access the Application

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## 📁 Project Structure

```
book-library/
├── backend/                # Express.js Backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Auth middleware
│   └── server.js          # Entry point
│
├── frontend/              # React Frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── context/      # State management
│   │   └── api/          # API client
│   └── ...
│
├── docs/                  # Documentation
│   ├── notes.md          # Technical notes
│   ├── ENV_SETUP.md      # Environment setup
│   └── screenshots/      # App screenshots
│
├── Dockerfile            # Unified build file
├── docker-compose.yml    # Docker orchestration
├── run.sh               # Easy run script
└── README.md            # Full documentation
```

---

## 🐳 Docker Architecture

### Unified Dockerfile Explained

The new `Dockerfile` uses a multi-stage build:

**Stage 1 - Build:**
1. Installs backend dependencies
2. Installs frontend dependencies
3. Builds React production bundle

**Stage 2 - Production:**
1. Copies backend code
2. Copies frontend build
3. Installs only production dependencies
4. Uses `concurrently` to run both services

**Benefits:**
✅ Single image for both services
✅ Reduced complexity
✅ Faster builds with layer caching
✅ Production-ready setup

---

## 🔧 Troubleshooting

### MongoDB Connection Error

**Error**: "MongoDB Connection Error"

**Solutions**:
1. Check your connection string in `.env`
2. Verify MongoDB Atlas IP whitelist (add `0.0.0.0/0` for testing)
3. Ensure database user has read/write permissions
4. Check if cluster is paused (free tier auto-pauses after inactivity)

### Port Already in Use

**Error**: "Port 5000 already in use"

**Solution** (macOS):
1. System Preferences → Sharing
2. Disable "AirPlay Receiver"

Or change the port in docker-compose.yml:
```yaml
ports:
  - "5001:5000"  # Change host port to 5001
```

### Docker Build Fails

**Error**: "Docker build failed"

**Solutions**:
1. Ensure Docker Desktop is running
2. Check `.env` file exists in root directory
3. Try cleaning Docker:
   ```bash
   docker-compose down -v
   docker system prune -a
   docker-compose up --build
   ```

### npm Command Not Found

**Error**: "zsh: command not found: npm"

**Solution**:
Install Node.js from [nodejs.org](https://nodejs.org/) or use:
```bash
# macOS with Homebrew
brew install node

# Verify installation
node --version
npm --version
```

---

## ✨ Features to Test

### User Features
- [ ] Register new account
- [ ] Login with credentials
- [ ] Browse approved books
- [ ] Search books by title/author
- [ ] Upload a new book
- [ ] Rate books (1-5 stars)
- [ ] View book details
- [ ] Toggle Dark/Light mode

### Admin Features
- [ ] Login with admin account
- [ ] Access Admin Panel
- [ ] View pending books
- [ ] Approve books
- [ ] Reject books
- [ ] Verify approvals appear in library

---

## 📸 Screenshots Needed

For your assignment, take screenshots of:

1. **docker-desktop.png** - Docker Desktop showing running container
2. **app-dark-mode.png** - Application in dark mode
3. **app-light-mode.png** - Application in light mode
4. **admin-panel.png** - Admin dashboard
5. **browse-books.png** - Books grid view
6. **book-details.png** - Book details with rating

Save in: `docs/screenshots/`

---

## 📝 Quick Commands Reference

```bash
# Docker Commands
docker-compose up --build      # Build and start
docker-compose up -d           # Run in background
docker-compose down            # Stop containers
docker-compose logs -f         # View logs
docker-compose restart         # Restart services

# Local Development
npm install                    # Install dependencies
npm run dev                    # Start dev server
npm run build                  # Build for production

# Project Commands
./run.sh                       # Interactive run script
chmod +x run.sh               # Make script executable
```

---

## 🎓 Assignment Bonus Points

### ✅ Bonus A - Docker Compose
- Single docker-compose.yml file
- Unified service configuration
- Environment variable management
- Network configuration

### ✅ Bonus C - Optimized Build
- Multi-stage Dockerfile
- Separate build and production stages
- Minimal final image size
- Production-ready deployment

---

## 🆘 Need Help?

1. **Check the logs**:
   ```bash
   docker-compose logs -f
   ```

2. **Verify MongoDB connection**:
   - Login to MongoDB Atlas
   - Check database access
   - Verify IP whitelist

3. **Review documentation**:
   - `README.md` - Full documentation
   - `docs/notes.md` - Technical challenges
   - `TESTING_CHECKLIST.md` - Complete test guide

---

## 🎯 Next Steps

1. ✅ Configure MongoDB Atlas
2. ✅ Set up `.env` file
3. ✅ Run with Docker or locally
4. ✅ Login with admin credentials
5. ✅ Test all features
6. ✅ Take screenshots
7. ✅ Submit assignment

---

**Default Admin Account:**
```
Email: admin@luminabooks.com
Password: Admin@123
```

**Remember**: Change these credentials in production!

---

*Book Library - Professional Book Management System* 📚✨
