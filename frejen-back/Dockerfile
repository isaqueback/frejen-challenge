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

# Give execution permission to the wait-for-it script
RUN chmod +x wait-for-it.sh

# Build TypeScript app
RUN npm run build

# Expose backend port
EXPOSE 3001

# Start the application
CMD npm run start
