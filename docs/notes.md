# Lumina Book Hub - Project Notes & Troubleshooting Log

This document records the technical challenges encountered during the development of Lumina Book Hub and the specific solutions implemented to resolve them.

---

## 🛠️ Critical Technical Challenges & Solutions

### 1. The "Port 5000" Conflict (macOS)
**🔴 Problem:** 
The application failed to start on macOS with `Error: listen EADDRINUSE: address already in use :::5000`.
**🔍 Root Cause:** 
On macOS Monterey and later, the "AirPlay Receiver" feature automatically listens on Port 5000, blocking our backend server.
**✅ Solution:**
1.  **Instruction**: We instructed the user to disable AirPlay Receiver (`System Settings > General > AirDrop & Handoff > AirPlay Receiver`).
2.  **Configuration**: We kept the port mapping as `5000:5000` in `docker-compose.yml` but added specific warnings in documentation.
3.  *Alternative Attempted*: We briefly tried mapping `5001:5000`, but the user requested to stick to Port 5000 standard.

### 2. CORS (Cross-Origin Resource Sharing) Errors
**🔴 Problem:** 
The frontend (React) running on Port 3000 could not communicate with the backend on Port 5000, receiving `403 Forbidden` or Network Errors.
**🔍 Root Cause:** 
Browsers block cross-origin requests by default. The backend was not configured to accept requests from the frontend's origin (`http://localhost:3000`).
**✅ Solution:**
1.  Installed `cors` package: `npm install cors`.
2.  Updated `server.js` to use the middleware globally:
    ```javascript
    const cors = require('cors');
    app.use(cors()); // Allow all origins (or granularly configure for production)
    ```

### 3. Docker "Module Not Found: concurrently"
**🔴 Problem:** 
The Docker container kept crashing with `sh: concurrently: not found` or `Error: Cannot find module '/app/concurrently'`.
**🔍 Root Cause:** 
We initially used `npm install -g concurrently` (global install) in the Alpine Linux container. The global bin path was not correctly in the shell's `$PATH` for the `CMD` instruction, or `npm install` wasn't persisting correctly in the final stage.
**✅ Solution:**
1.  **Local Install**: Switched to installing utilities locally in the project directory: `npm install concurrently serve`.
2.  **Use NPX**: Updated the Dockerfile `CMD` to execute via `npx`, which robustly locates binaries in `node_modules/.bin`:
    ```dockerfile
    CMD ["npx", "concurrently", "\"cd backend && node server.js\"", "\"npx serve ...\""]
    ```

### 4. Redundant Docker Configuration
**🔴 Problem:** 
The project had multiple `Dockerfile`s (`/backend/Dockerfile`, `/frontend/Dockerfile`, and `/Dockerfile`), causing confusion on which one was the source of truth.
**✅ Solution:**
1.  **Consolidation**: Deleted the sub-directory Dockerfiles.
2.  **Root Dockerfile**: Created a single "Multi-Service" Dockerfile in the root that handles the build process for both frontend and backend using multi-stage builds.

### 5. Docker Networking & Host Access
**🔴 Problem:** 
Frontend trying to access `http://localhost:5000`. Inside a URL container, "localhost" refers to the container itself, not the host machine or other containers.
**✅ Solution:**
1.  **Browser Context**: Since React runs in the *user's browser*, `localhost:5000` IS correct for API calls (as long as port 5000 is mapped to the host).
2.  **Environment Variable**: We ensured `vite.config.js` and `axios.js` use `import.meta.env.VITE_API_URL` which defaults to `http://localhost:5000/api`.

---

## 🚀 Key Features Implemented

- **Single Command Start**: `make all` (or `docker-compose up --build`) starts everything.
- **Health Checks**: Backend automatically reports its health status to Docker.
- **CI/CD**: GitHub Actions pipeline ensures the build never breaks.
- **Unified Infrastructure**: Simpler project structure with everything managed from the root level.
