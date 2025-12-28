# Lumina Book Hub - Technical Notes

## Project Overview
Lumina Book Hub is a full-stack Book Library Management System built for an OS Lab assignment. The application features user authentication, book management with admin approval workflow, rating system, and Dark/Light mode theming.

## Tech Stack
- **Frontend**: React.js 18 with Vite, Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: MongoDB Atlas (Cloud)
- **Containerization**: Docker with multi-stage builds (Single Root Dockerfile)
- **CI/CD**: GitHub Actions

---

## Technical Challenges & Solutions

### 1. Docker Port Conflicts (Port 5000 vs AirPlay)
**Problem**: The user required the backend to run on Port 5000. However, on macOS, Port 5000 is reserved by the AirPlay Receiver service, causing `bind: address already in use` errors.
**Solution**: 
- Documented the conflict in `docs/ENV_SETUP.md`.
- instructed the user to disable AirPlay Receiver in System Settings > General > AirDrop & Handoff.
- Configured `docker-compose.yml` to map `5000:5000` assuming the port is free.

### 2. "concurrently" Module Not Found in Docker
**Problem**: The initial Dockerfile used `npm install -g concurrently` but the `CMD` failed with `sh: concurrently: not found`. This was likely due to PATH issues in the Alpine image or shell context.
**Solution**:
- Switched to **local installation**: `npm install concurrently serve` in the production stage.
- Updated `CMD` to use `npx`: `CMD ["npx", "concurrently", ...]`
- This ensures the binary is reliably found in `node_modules/.bin`.

### 3. Dockerfile Consolidation
**Requirement**: The project initially had separate Dockerfiles for frontend and backend. The user requested a single Dockerfile in the root directory.
**Solution**:
- Created a unified `Dockerfile` in the root.
- It copies both `backend/` and `frontend/` directories.
- Uses a multi-stage process to build the frontend.
- Runs both services using `concurrently` in the final container.

---

## Bonus Features Implemented

### Bonus A: Docker Compose
orchestrates the application with `docker-compose.yml`.

### Bonus B: CI Pipeline
Added `.github/workflows/ci.yml` which triggers a Docker build on every push and pull request to `main`. This ensures code integration stability.

### Bonus C: Multi-stage Build
The root `Dockerfile` uses multi-stage builds:
1. **base**: Installs dependencies.
2. **build**: Builds the React frontend.
3. **production**: Lightweight final image serving the app.

### Bonus D: Health Checks
Added `HEALTHCHECK` instructions in the Dockerfile to periodically ping the `/api/health` endpoint, ensuring the backend is responsive.

### Bonus E: Makefile
Created a `Makefile` to abstract complex Docker commands into simple shortcuts like `make build`, `make run`, and `make logs`.
