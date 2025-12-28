# Book Library - Quick Start

## Using Docker (Recommended)

### Step 1: Configure Environment
Create `.env` file in the root directory:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/book-library?retryWrites=true&w=majority
JWT_SECRET=book_library_secret_2024
```

### Step 2: Build and Run
```bash
docker-compose up --build
```

### Step 3: Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

### Step 4: Login
```
Email: admin@luminabooks.com
Password: Admin@123
```

### Stop the Application
```bash
docker-compose down
```

---

## Local Development (Without Docker)

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup (New Terminal)
```bash
cd frontend
npm install
npm run dev
```

---

## Project Structure

```
book-library/
├── backend/           # Express.js API
├── frontend/          # React application
├── docs/             # Documentation
├── Dockerfile        # Unified container build
└── docker-compose.yml
```

---

## Features

✅ User authentication & authorization
✅ Book browsing and search
✅ Book upload system
✅ Rating system (1-5 stars)
✅ Admin approval workflow
✅ Dark/Light mode theme
✅ Responsive design

---

## Default Admin Account

Email: admin@luminabooks.com  
Password: Admin@123

**Remember to change these credentials in production!**
