# Stage 1: Build the application
FROM node:alpine AS builder

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Accept the backend URL as an argument
ARG NEXT_PUBLIC_BACKEND_BASE_URL

# Set the environment variable for the frontend
ENV NEXT_PUBLIC_BACKEND_BASE_URL=$NEXT_PUBLIC_BACKEND_BASE_URL

# Build the application
RUN npm run build

# Stage 2: Final production image
FROM node:alpine

# Set working directory
WORKDIR /app

# Copy build files from the builder stage
COPY --from=builder /app ./

# Expose the port used by the Next.js app
EXPOSE 8080

# Start the application
CMD ["npm", "run", "start"]
