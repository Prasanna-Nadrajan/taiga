<h1 align="center">
  <br>
  🛒 TAIGA
  <br>
</h1>

<h4 align="center">A full-stack e-commerce platform with role-based access control, built on the MERN stack and containerised with Docker.</h4>

<p align="center">
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-features">Features</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-environment-variables">Environment Variables</a> •
  <a href="#-api-reference">API Reference</a> •
  <a href="#-project-structure">Project Structure</a> •
  <a href="#-license">License</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Node.js-18-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-7-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/Nginx-1.27-009639?style=for-the-badge&logo=nginx&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=for-the-badge" />
</p>

---

## 📖 Overview

**TAIGA** is a production-ready e-commerce web application featuring a clean role-based user system with three distinct personas — **Customer**, **Vendor**, and **Delivery Agent** — each with their own dedicated dashboard and privileges. The entire application is orchestrated with Docker Compose, making it trivial to spin up locally or deploy to any cloud provider.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **JWT Authentication** | Stateless, secure authentication with `jsonwebtoken` and password hashing via `bcryptjs` |
| 👥 **Role-Based Access Control** | Three distinct roles: `customer`, `vendor`, `delivery_agent` with protected routes |
| 🛍️ **Product Catalogue** | Full product and category management |
| 📦 **Order Management** | End-to-end order lifecycle tracked across roles |
| 🚚 **Delivery Dashboard** | Dedicated interface for delivery agents to manage dispatches |
| 🐳 **Fully Dockerised** | Single `docker compose up` bootstraps the entire stack |
| ⚡ **Nginx Reverse Proxy** | Production-grade static serving with API proxying — no CORS issues |
| 📱 **Responsive UI** | Mobile-first design built with React and React Router v7 |

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Role |
|---|---|---|
| [React](https://react.dev/) | 18 | UI library |
| [Vite](https://vitejs.dev/) | 5 | Build tool & dev server |
| [React Router DOM](https://reactrouter.com/) | 7 | Client-side routing |
| [Axios](https://axios-http.com/) | 1.x | HTTP client |
| [React Icons](https://react-icons.github.io/react-icons/) | 5 | Icon library |
| [Nginx](https://nginx.org/) | alpine | Static file server + API reverse proxy |

### Backend
| Technology | Version | Role |
|---|---|---|
| [Node.js](https://nodejs.org/) | 18 | Runtime environment |
| [Express](https://expressjs.com/) | 5 | Web framework |
| [Mongoose](https://mongoosejs.com/) | 9 | MongoDB ODM |
| [JSON Web Token](https://github.com/auth0/node-jsonwebtoken) | 9 | Stateless auth |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | 3 | Password hashing |
| [dotenv](https://github.com/motdotla/dotenv) | 17 | Environment variable management |
| [CORS](https://github.com/expressjs/cors) | 2.x | Cross-origin resource sharing |
| [Nodemon](https://nodemon.io/) | 3 | Dev hot-reload |

### Database & Infrastructure
| Technology | Role |
|---|---|
| [MongoDB](https://www.mongodb.com/) | Primary NoSQL database |
| [Docker](https://www.docker.com/) | Containerisation |
| [Docker Compose](https://docs.docker.com/compose/) | Multi-container orchestration |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────┐
│            Docker Compose               │
│                                         │
│  ┌──────────┐    ┌──────────────────┐   │
│  │          │    │                  │   │
│  │  React   │───▶│  Nginx :5173→80  │   │
│  │  (Vite)  │    │  (Static + Proxy)│   │
│  │          │    │                  │   │
│  └──────────┘    └────────┬─────────┘   │
│                           │ /api/*      │
│                  ┌────────▼─────────┐   │
│                  │                  │   │
│                  │  Express API     │   │
│                  │  Node.js :5000   │   │
│                  │                  │   │
│                  └────────┬─────────┘   │
│                           │             │
│                  ┌────────▼─────────┐   │
│                  │                  │   │
│                  │    MongoDB       │   │
│                  │    :27017        │   │
│                  │                  │   │
│                  └──────────────────┘   │
└─────────────────────────────────────────┘
```

**Request Flow:** Browser → Nginx (port `5173`) → serves React SPA for `/` routes; proxies `/api/*` requests upstream to the Express server on port `5000` → Express queries MongoDB → response flows back.

---

## 🚀 Getting Started

### Prerequisites

| Tool | Minimum Version |
|---|---|
| [Docker](https://docs.docker.com/get-docker/) | 24+ |
| [Docker Compose](https://docs.docker.com/compose/install/) | v2+ |

> **Note:** Node.js is **not** required on your host machine — everything runs inside Docker containers.

---

### ⚡ Quickstart (Docker — Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/Prasanna-Nadrajan/taiga.git
cd taiga

# 2. Set up the backend environment variables (see section below)
cp server/.env.example server/.env   # then edit server/.env

# 3. Build and launch the entire stack
docker compose up --build

# 4. Open the application
#    Frontend  →  http://localhost:5173
#    API       →  http://localhost:5000
```

To run in detached (background) mode:

```bash
docker compose up --build -d
```

To stop all services:

```bash
docker compose down
```

To stop and remove all data volumes (full reset):

```bash
docker compose down -v
```

---

### 🧑‍💻 Local Development (Without Docker)

If you prefer to run the services natively:

```bash
# --- Terminal 1: Backend ---
cd server
npm install
npm run dev          # starts with nodemon on :5000

# --- Terminal 2: Frontend ---
cd client
npm install
npm run dev          # starts Vite dev server on :5173
```

> A running MongoDB instance is required at `mongodb://localhost:27017`.

---

## 🔑 Environment Variables

Create a `.env` file inside the `server/` directory:

```env
# server/.env

# MongoDB connection string (overridden by Docker Compose internally)
MONGO_URI=mongodb://localhost:27017/taiga_db

# JWT secret — change this to a long, random string in production
JWT_SECRET=your_super_secret_jwt_key

# Server port
PORT=5000

# Node environment
NODE_ENV=development
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

---

## 📡 API Reference

All routes are prefixed with `/api`.

### Authentication — `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login and receive a JWT |

### Products — `/api/products`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/products` | Public | List all products |
| `POST` | `/api/products` | Vendor | Create a new product |
| `PUT` | `/api/products/:id` | Vendor | Update a product |
| `DELETE` | `/api/products/:id` | Vendor | Delete a product |

### Categories — `/api/categories`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/categories` | Public | List all categories |
| `POST` | `/api/categories` | Vendor | Create a category |

### Orders — `/api/orders`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/orders` | Customer | Place a new order |
| `GET` | `/api/orders` | Vendor | List all orders |
| `GET` | `/api/orders/my` | Customer | Get own orders |
| `PUT` | `/api/orders/:id` | Vendor | Update order status |

### Delivery — `/api/delivery`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/delivery` | Delivery Agent | Get assigned deliveries |
| `PUT` | `/api/delivery/:id` | Delivery Agent | Update delivery status |

---

## 📁 Project Structure

```
taiga/
├── compose.yaml               # Docker Compose orchestration
│
├── client/                    # React Frontend
│   ├── Dockerfile             # Multi-stage build → Nginx
│   ├── nginx.conf             # Nginx config with API proxy
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── components/        # Reusable UI components
│       ├── pages/             # Route-level pages (Customer, Vendor, Delivery)
│       └── main.jsx
│
└── server/                    # Express Backend
    ├── Dockerfile             # Node.js 18 Alpine image
    ├── server.js              # Entry point
    ├── config/                # DB connection & config
    ├── controllers/           # Route handler logic
    ├── middleware/            # Auth & role-guard middleware
    ├── models/                # Mongoose schemas
    │   ├── User.js            # Role: customer | vendor | delivery_agent
    │   ├── Product.js
    │   ├── Category.js
    │   └── Order.js
    └── routes/                # Express routers
        ├── auth.js
        ├── products.js
        ├── categories.js
        ├── orders.js
        └── delivery.js
```

---

## 👤 User Roles

| Role | Capabilities |
|---|---|
| `customer` | Browse products, place orders, track order history |
| `vendor` | Manage product listings, view & update all orders |
| `delivery_agent` | View assigned deliveries, update delivery status |

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ using the MERN Stack
</p>
