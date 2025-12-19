FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY src/ ./src/

# Build
RUN npm run build

# Create data directory
RUN mkdir -p ./data

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "dist/server.js"]

