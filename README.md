# Hildam Couture 👗✨

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)  
[![Build Status](https://github.com/your-username/hildam-couture/workflows/CI/badge.svg)](https://github.com/your-username/hildam-couture/actions)  
[![Stars](https://img.shields.io/github/stars/your-username/hildam-couture)](https://github.com/your-username/hildam-couture/stargazers)  

A next-gen tailoring management platform built for fashion houses, small ateliers and freelance tailors. Streamline customer intake, assignment workflows, real-time reviews and final approvals—all in one beautiful dashboard.

---

## 🚀 Table of Contents

1. [Demo & Screenshots](#-demo--screenshots)  
2. [Key Features](#-key-features)  
3. [Tech Stack](#-tech-stack)  
4. [Getting Started](#-getting-started)  
   - [Prerequisites](#prerequisites)  
   - [Installation](#installation)  
   - [Running Locally](#running-locally)  
5. [Usage](#-usage)  
6. [Folder Structure](#-folder-structure)  
7. [Contributing](#-contributing)  
8. [Roadmap](#-roadmap)  
9. [License](#-license)  
10. [Contact](#-contact)  

---

## 🎬 Demo & Screenshots

![Dashboard Overview](./docs/screenshots/dashboard.png)  
*Dashboard showing active projects, progress bars and quick-action cards.*

![Project Workflow](./docs/screenshots/workflow.png)  
*Visual “In Design → Under Review → Customer Review → Completed” pipeline.*

_For a live preview, check out our [Deployed App](https://hildam-couture.example.com)._  

---

## ✨ Key Features

- **Customer Intake Form**  
  Structured fields for sizes, fabric choices, style references and special instructions.  
- **Role-Based Dashboards**  
  - Account Managers see all projects  
  - Project Managers assign tasks to Tailors & Designers  
  - Tailors & Designers get individualized work queues  
- **Iterative Review Cycle**  
  In-app annotations on uploaded images + threaded comments for precise feedback.  
- **Milestone Tracking & Notifications**  
  Real-time in-app and email alerts when projects move through stages.  
- **Mobile-Friendly UI**  
  Fully responsive, with touch-optimized controls for on-the-go updates.  
- **Analytics & Reporting**  
  Exportable reports on turnaround times, order volume and team performance.

---

## 🛠️ Tech Stack

- **Frontend:**  
  - Next.js (App Router, SSR/SSG)  
  - Tailwind CSS, Framer Motion  
  - React Hook Form + Zod for client-side validation  
- **Backend:**  
  - Node.js + Express API  
  - MongoDB Atlas + Prisma ORM  
  - NextAuth.js for authentication  
- **DevOps & CI/CD:**  
  - GitHub Actions (lint, tests, build)  
  - Vercel for seamless deployments  
- **Notifications:**  
  - Nodemailer (email)  
  - In-app WebSockets via Socket.io  

---

## 🏁 Getting Started

### Prerequisites

- Node.js ≥ 18.x  
- npm or Yarn  
- MongoDB URI (Atlas or local)  

### Installation

1. **Clone the repo**  
   ```bash
   git clone https://github.com/your-username/hildam-couture.git
   cd hildam-couture
