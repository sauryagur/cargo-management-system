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
.
├── Dockerfile
├── README.md
├── backend
│   ├── app.js
│   ├── bin
│   │   └── www
│   ├── models
│   │   ├── container.js
│   │   ├── item.js
│   │   ├── logEntry.js
│   │   └── position.js
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   │   └── stylesheets
│   │       └── style.css
│   ├── routes
│   │   ├── import.js
│   │   ├── logs.js
│   │   ├── place.js
│   │   ├── placement.js
│   │   ├── retrieve.js
│   │   ├── search.js
│   │   ├── simulate.js
│   │   └── waste.js
│   └── services
│       └── storageService.js
├── ecosystem.config.js
└── frontend
    ├── app
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── page.tsx
    │   └── providers.tsx
    ├── components
    │   ├── cargo-management-system.tsx
    │   ├── container-view.tsx
    │   ├── pages
    │   │   ├── import-page.tsx
    │   │   ├── logs-page.tsx
    │   │   ├── placement-page.tsx
    │   │   ├── search-page.tsx
    │   │   ├── simulate-page.tsx
    │   │   └── waste-page.tsx
    │   ├── room-display.tsx
    │   ├── sidebar.tsx
    │   ├── theme-provider.tsx
    │   └── ui
    │       ├── accordion.tsx
    │       ├── alert-dialog.tsx
    │       ├── alert.tsx
    │       ├── aspect-ratio.tsx
    │       ├── avatar.tsx
    │       ├── badge.tsx
    │       ├── breadcrumb.tsx
    │       ├── button.tsx
    │       ├── calendar.tsx
    │       ├── card.tsx
    │       ├── carousel.tsx
    │       ├── chart.tsx
    │       ├── checkbox.tsx
    │       ├── collapsible.tsx
    │       ├── command.tsx
    │       ├── context-menu.tsx
    │       ├── dialog.tsx
    │       ├── drawer.tsx
    │       ├── dropdown-menu.tsx
    │       ├── form.tsx
    │       ├── hover-card.tsx
    │       ├── input-otp.tsx
    │       ├── input.tsx
    │       ├── label.tsx
    │       ├── menubar.tsx
    │       ├── navigation-menu.tsx
    │       ├── pagination.tsx
    │       ├── popover.tsx
    │       ├── progress.tsx
    │       ├── radio-group.tsx
    │       ├── resizable.tsx
    │       ├── scroll-area.tsx
    │       ├── select.tsx
    │       ├── separator.tsx
    │       ├── sheet.tsx
    │       ├── sidebar.tsx
    │       ├── skeleton.tsx
    │       ├── slider.tsx
    │       ├── sonner.tsx
    │       ├── switch.tsx
    │       ├── table.tsx
    │       ├── tabs.tsx
    │       ├── textarea.tsx
    │       ├── toast.tsx
    │       ├── toaster.tsx
    │       ├── toggle-group.tsx
    │       ├── toggle.tsx
    │       ├── tooltip.tsx
    │       ├── use-mobile.tsx
    │       └── use-toast.ts
    ├── components.json
    ├── hooks
    │   ├── use-mobile.tsx
    │   └── use-toast.ts
    ├── lib
    │   └── utils.ts
    ├── next.config.mjs
    ├── package.json
    ├── postcss.config.mjs
    ├── src
    │   ├── App.tsx
    │   └── components
    │       ├── cargo-management-system.tsx
    │       ├── container-view.tsx
    │       ├── pages
    │       │   └── placement-page.tsx
    │       ├── room-display.tsx
    │       └── sidebar.tsx
    ├── styles
    │   └── globals.css
    ├── tailwind.config.ts
    └── tsconfig.json

```

---

## Notes

- The **backend** is mapped to port `8000` on the host.
- The **frontend** is mapped to port `3000` on the host.
- No external database is used; all storage is in-memory.
