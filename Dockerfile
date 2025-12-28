# Multi-service Dockerfile for Book Library
# This Dockerfile can build and run both frontend and backend

FROM node:18-alpine AS base

# Install dependencies for both services
WORKDIR /app

# Copy all package files
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install backend dependencies
WORKDIR /app/backend
RUN npm install

# Install frontend dependencies
WORKDIR /app/frontend
RUN npm install

# Copy source code
WORKDIR /app
COPY backend ./backend
COPY frontend ./frontend

# Build frontend for production
WORKDIR /app/frontend
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy backend
COPY --from=base /app/backend ./backend

# Copy frontend build
COPY --from=base /app/frontend/dist ./frontend/dist

# Install production dependencies for backend
WORKDIR /app/backend
RUN npm install --production

# Install serve and concurrently locally
RUN npm init -y && npm install concurrently serve

# Expose ports
EXPOSE 5000 3000

# Healthcheck to verify backend is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Set environment
ENV NODE_ENV=production

# Start both services using npx concurrently
WORKDIR /app
CMD ["npx", "concurrently", "\"cd backend && node server.js\"", "\"npx serve -s frontend/dist -l 3000\""]
