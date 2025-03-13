# Use Ubuntu 22.04 as the base image (per auto-tester requirements)
FROM ubuntu:22.04

# Set environment variables for PostgreSQL
ENV POSTGRES_USER=admin
ENV POSTGRES_PASSWORD=admin
ENV POSTGRES_DB=cargo_db

# Update package lists and install necessary dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates curl gnupg \
    postgresql postgresql-contrib \
    nodejs npm \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /app

# -----------------------------------
# 1️⃣ SETUP DATABASE (PostgreSQL)
# -----------------------------------
# Copy the database initialization script
COPY database/init.sql /docker-entrypoint-initdb.d/

# Start PostgreSQL service, create database and user
RUN service postgresql start && \
    sudo -u postgres psql -c "ALTER USER $POSTGRES_USER WITH PASSWORD '$POSTGRES_PASSWORD';" && \
    sudo -u postgres psql -c "CREATE DATABASE $POSTGRES_DB;"

# -----------------------------------
# 2️⃣ SETUP BACKEND (Express.js API)
# -----------------------------------
# Copy backend dependencies and install them
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install

# Copy the entire backend source code
COPY backend .

# -----------------------------------
# 3️⃣ SETUP FRONTEND (React)
# -----------------------------------
# Move to frontend directory
WORKDIR /app/frontend

# Copy frontend dependencies and install them
COPY frontend/package*.json ./
RUN npm install

# Copy the entire frontend source code
COPY frontend .

# Build the frontend (React production build)
RUN npm run build

# -----------------------------------
# 4️⃣ RUN EVERYTHING TOGETHER
# -----------------------------------
# Expose port 8000 (required by auto-tester)
EXPOSE 8000

# Command to start PostgreSQL, backend, and serve frontend
CMD service postgresql start && \
    sudo -u postgres psql -c "ALTER USER $POSTGRES_USER WITH PASSWORD '$POSTGRES_PASSWORD';" && \
    sudo -u postgres psql -c "CREATE DATABASE $POSTGRES_DB;" && \
    (cd /app/frontend && npm install -g serve && serve -s build -l 3000 &) && \
    (cd /app/backend && node src/app.js)
