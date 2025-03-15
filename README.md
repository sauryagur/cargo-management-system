# CaMaSyst

Submitted by Team Celestial for National Space Hackathon 2025, IIT Delhi

---

## Overview

**CaMaSyst** (short for **Ca**rgo **Ma**nagement **Syst**em) (pronounced "cam assist") is a lightweight web application
designed to manage and optimize cargo storage and
retrieval in space stations. It consists of:

- **Backend:** An Express.js server running on port `8000` (inside Docker) with in-memory storage for cargo data.
- **Frontend:** A Next.js application running on port `3000` (inside Docker), providing a minimal UI for interacting
  with the backend.

Both frontend and backend are containerized and run within a single Docker container.

---

## Setup Instructions

### **Windows (Docker Desktop)**

Ensure **Docker Desktop** is installed and running. Then, execute the following commands in your terminal (PowerShell or
Command Prompt):

```sh
# Build the Docker image
docker build -t cms .

# Run the container and map ports
docker run -p 3000:3000 -p 8000:8000 cms
```

---

### **Linux (using Podman)**

For Linux users, install **Podman** (which emulates Docker CLI):

```sh
# Install podman-docker (if not already installed)
sudo apt install podman-docker

# Build the container image
podman build -t cms .

# Verify the image exists
podman images

# Run the container and expose required ports
podman run --publish 3000:3000 --publish 8000:8000 --name cms-container cms
```

---

## Project Structure

```
├───backend
│   ├───bin
│   ├───models
│   ├───public
│   │   └───stylesheets
│   ├───routes
│   └───services
└───frontend
    ├───app
    ├───components
    │   ├───pages
    │   └───ui
    ├───hooks
    ├───lib
    ├───public
    ├───src
    │   └───components
    │       └───pages
    └───styles
```

---

## Notes

- The **backend** is mapped to port `8000` on the host.
- The **frontend** is mapped to port `3000` on the host.
- No external database is used; all storage is in-memory.
