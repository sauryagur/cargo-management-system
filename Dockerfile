# Use Ubuntu 22.04 as the base image
FROM ubuntu:22.04

# Install necessary dependencies
RUN apt-get update && \
    apt-get install -y curl ca-certificates gnupg && \
    mkdir -p /etc/apt/keyrings && \
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg && \
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list && \
    apt-get update && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PM2 globally to manage multiple processes
RUN npm install -g pm2 pnpm

# Set the working directory inside the container
WORKDIR /app

# Copy package files separately to leverage Docker cache
COPY backend/package*.json backend/
COPY frontend/package*.json frontend/

# Install dependencies
RUN cd backend && npm install
RUN cd frontend && pnpm install

# Copy the entire project into the container
COPY . .

# Expose necessary ports
EXPOSE 5173 8000

# Define PM2 process manager configuration
COPY ecosystem.config.js .

# Start both frontend and backend using PM2
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
