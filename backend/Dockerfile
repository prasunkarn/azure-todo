# Backend Dockerfile

FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose backend port
EXPOSE 3001

# Environment variable (important for Docker)
ENV NODE_ENV=production

# Start server
CMD ["node", "server.js"]