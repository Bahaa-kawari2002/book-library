# Lumina Book Hub - Technical Notes

## Project Overview
Lumina Book Hub is a full-stack Book Library Management System built for an OS Lab assignment. The application features user authentication, book management with admin approval workflow, rating system, and Dark/Light mode theming.

## Tech Stack
- **Frontend**: React.js 18 with Vite, Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: MongoDB Atlas (Cloud)
- **Containerization**: Docker with multi-stage builds

---

## Biggest Challenge Faced: Docker Port Conflicts and Service Communication

### The Problem

During the Docker implementation phase, I encountered a significant challenge related to port conflicts and inter-service communication between the frontend and backend containers. The main issues were:

1. **Port Conflict**: The backend service was configured to run on port 5000, which conflicted with macOS AirPlay Receiver that also uses port 5000 by default.

2. **API Communication**: The frontend container couldn't communicate with the backend container using `localhost:5000` because in Docker, each container has its own network namespace.

3. **CORS Issues**: Even after resolving the network communication, CORS (Cross-Origin Resource Sharing) errors occurred because the frontend was making requests from a different origin.

### The Solution

#### 1. Port Conflict Resolution
**Option A - Change Backend Port**: Modified the backend to use port 5000 inside the container but mapped it to port 5001 on the host machine:
```yaml
backend:
  ports:
    - "5001:5000"  # Host:Container
```

**Option B - Disable AirPlay Receiver**: For development purposes, disabled AirPlay Receiver in macOS System Preferences > Sharing.

#### 2. Docker Network Configuration
Created a custom bridge network in docker-compose.yml to enable service discovery:
```yaml
networks:
  lumina-network:
    driver: bridge
```

All services were connected to this network, allowing them to communicate using service names as hostnames (e.g., `http://backend:5000` instead of `http://localhost:5000`).

#### 3. Environment-Based API URL
Implemented environment variable configuration for the API URL:

**Development** (local): 
```bash
VITE_API_URL=http://localhost:5000/api
```

**Production** (Docker):
Frontend is served by Nginx and makes API calls to the backend service. Since both are in the same Docker network, modified the Nginx configuration to proxy API requests:

```nginx
location /api {
    proxy_pass http://backend:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

This solution allows the frontend to make API calls to `/api/*` which Nginx forwards to the backend container.

#### 4. CORS Configuration
Updated the backend to accept requests from the frontend origin:
```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['http://localhost', 'http://localhost:80']
    : 'http://localhost:3000',
  credentials: true
}));
```

### What I Learned

1. **Docker Networking**: Understanding that `localhost` inside a container refers to the container itself, not the host machine.

2. **Service Discovery**: Docker Compose automatically creates DNS entries for service names, enabling inter-container communication.

3. **Multi-stage Builds**: Using multi-stage builds significantly reduced the frontend image size from ~1.2GB to ~25MB by separating the build stage from the runtime stage.

4. **Environment Configuration**: The importance of having different configurations for development and production environments.

5. **Nginx as Reverse Proxy**: Using Nginx not only to serve static files but also as a reverse proxy to route API requests to the backend.

---

## Additional Notes

### Database Connection
- Using MongoDB Atlas (cloud database) eliminates the need for a database container
- Connection string is stored in environment variables for security
- Implemented automatic admin user creation on first startup

### Docker Optimization
- Used Alpine-based images (node:18-alpine, nginx:alpine) to minimize image sizes
- Implemented proper layer caching by copying package.json before source code
- Added .dockerignore to exclude unnecessary files from build context

### Security Considerations
- JWT tokens for authentication
- Password hashing with bcryptjs
- Environment variables for sensitive data
- Nginx security headers (X-Frame-Options, X-Content-Type-Options, etc.)

### Development Workflow
- Local development uses Vite's dev server with HMR (Hot Module Replacement)
- Production uses optimized build served by Nginx
- Docker Compose orchestrates both services with a single command

---

## Commands Reference

### Local Development
```bash
# Backend
cd backend && npm install && npm run dev

# Frontend
cd frontend && npm install && npm run dev
```

### Docker
```bash
# Build and run all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild specific service
docker-compose build frontend
```

### Testing the Application
1. Access the application at `http://localhost` (or `http://localhost:80`)
2. Login with admin credentials: `admin@luminabooks.com` / `Admin@123`
3. Test all features: upload books, approve/reject, rate books, toggle dark mode

### The Problem: Encountered a 403 Forbidden error when the React frontend tried to fetch data from the Node.js API inside the Docker container.
### The Solution: I identified that it was a CORS (Cross-Origin Resource Sharing) issue. I resolved it by implementing the cors middleware in the Express backend to allow requests from the frontend origin.

