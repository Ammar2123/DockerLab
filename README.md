# 🚀 Docker-Based Institutional Lab Environment

A containerized framework designed to provide pre-configured lab environments for technical institutions. It simplifies software setup, ensures consistency, and supports hands-on learning for courses like Networking, Cybersecurity, DevOps, and more.

## 🔧 Features
- Pre-installed tools for multiple domains
- Electron.js based Desktop application for easy access
- Supports X11 for graphical applications
- Consistent and reproducible environments
- Lightweight and scalable containerized setup

## 🧰 Tech Stack
- Docker
- Kubernetes (Minikube)
- Ubuntu base image
- Electron.js (GUI)
- Gedit, Wireshark, NS2.35, Kathara, etc.

## ⚙️ Getting Started

### Prerequisites
- Docker
- X11 (for GUI apps)

### Run the Container via dekstop app
```bash
git clone https://github.com/Ammar2123/DockerLab-desktop.git
cd DockerLab-desktop/client
npm install
npm run dev
cd DockerLab-desktop/server
npm install
nodemon server.js
