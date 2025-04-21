# Use a lightweight Node.js image
FROM node:alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files for caching
COPY package*.json ./ 
COPY tsconfig.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Install netcat and wait-for-it script
RUN apk add --no-cache netcat-openbsd
COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh

# Build TypeScript app
RUN npm run build

# Expose backend port
EXPOSE 3000

# Start the application
CMD npm run start
