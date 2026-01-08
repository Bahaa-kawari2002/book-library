FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm install --production

# Copy source code
COPY . .

# Set environment to production
ENV NODE_ENV=production

# Expose port (optional, for documentation)
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
