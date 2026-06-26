# Real-Time Chat App (MERN)

A full-stack real-time messaging application built with the MERN stack. Users can sign up, chat one-on-one with text and images, see who is online, and manage their profile — all with instant updates powered by Socket.IO.

---

## Live Link

| Service   | URL |
|-----------|-----|
| Frontend  | [snipurl.vercel.app](https://chat-ghx5byhfm-harshitsinghshakya23-8383s-projects.vercel.app) |
| Backend   | [render.api](https://chat-app-backend-ze6a.onrender.com) |

---

## Project Screenshot

> Add a screenshot or GIF of your app here. Recommended: place the image in `docs/screenshots/` and update the path below.
<img width="1440" height="900" alt="Screenshot 2026-06-26 at 1 39 01 PM" src="https://github.com/user-attachments/assets/b8fe9c1c-9f0d-4fc4-b63b-1cf82002e4d4" />
<img width="1440" height="900" alt="Screenshot 2026-06-26 at 1 39 24 PM" src="https://github.com/user-attachments/assets/e02ce406-6203-4169-80d9-19be72ab8a15" />
<img width="1440" height="900" alt="Screenshot 2026-06-26 at 1 39 32 PM" src="https://github.com/user-attachments/assets/7d5e78c3-d05d-40fc-af3a-61d86a53ef60" />

---

## Features

- **User authentication** — Sign up (two-step onboarding with bio) and login with JWT-based sessions
- **Real-time messaging** — Instant text delivery via Socket.IO
- **Image sharing** — Send images in chat; uploads handled through Cloudinary
- **Online presence** — Live online/offline status for all connected users
- **Read receipts** — Unread message counts in the sidebar; messages marked as seen when opened
- **User profiles** — Update display name, bio, and profile picture
- **Responsive UI** — Mobile-friendly layout with glassmorphism design (Tailwind CSS)
- **Protected routes** — Auth-gated pages on the client; JWT middleware on the server
- **Docker support** — Run the full stack (MongoDB, server, client) with Docker Compose

---

## Tech Stack

### Frontend (`client/`)
| Technology | Purpose |
|------------|---------|
| React 19 | UI library |
| TypeScript | Type safety |
| Vite | Build tool & dev server |
| React Router | Client-side routing |
| Tailwind CSS 4 | Styling |
| Axios | HTTP requests |
| Socket.IO Client | Real-time events |
| React Hot Toast | Notifications |

### Backend (`server/`)
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express 5 | REST API |
| TypeScript | Type safety |
| MongoDB + Mongoose | Database & ODM |
| Socket.IO | WebSocket server |
| JWT + bcryptjs | Auth & password hashing |
| Cloudinary | Image uploads |
| CORS | Cross-origin configuration |

### DevOps
| Technology | Purpose |
|------------|---------|
| Docker & Docker Compose | Containerized local development |
| Vercel | Frontend deployment (configured in server CORS) |

---

## Project Structure

```
chat-app(mern)/
├── client/                     # React frontend
│   ├── context/
│   │   ├── authContext.tsx     # Auth state, socket connection, JWT
│   │   └── chatContext.tsx     # Messages, users, real-time handlers
│   ├── src/
│   │   ├── components/
│   │   │   ├── SideBar.tsx         # Contact list & online users
│   │   │   ├── ChatContainer.tsx   # Message thread & input
│   │   │   └── RightSideBar.tsx    # Selected user details
│   │   ├── pages/
│   │   │   ├── HomePage.tsx        # Main chat layout
│   │   │   ├── LoginPage.tsx       # Login & sign-up
│   │   │   └── ProfilePage.tsx     # Profile editor
│   │   ├── lib/utils.ts
│   │   └── App.tsx
│   ├── dockerfile
│   └── package.json
│
├── server/                     # Express + Socket.IO backend
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── userController.ts   # Signup, login, profile
│   │   │   └── messageController.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   └── Message.ts
│   │   ├── routes/
│   │   │   ├── userRoutes.ts
│   │   │   └── messageRoutes.ts
│   │   ├── middleware/auth.ts
│   │   ├── lib/
│   │   │   ├── db.ts
│   │   │   ├── cloudinary.ts
│   │   │   └── utils.ts
│   │   └── server.ts           # App entry, Socket.IO setup
│   ├── dockerfile
│   └── package.json
│
├── docker-compose.yml          # MongoDB + server + client
└── README.md
```

---

## Installation and Setup

### Prerequisites

- [Node.js](https://nodejs.org/) v18+ (v22 recommended)
- [MongoDB](https://www.mongodb.com/) — local instance, [MongoDB Atlas](https://www.mongodb.com/atlas), or Docker
- [Cloudinary](https://cloudinary.com/) account (for profile pictures and image messages)

### 1. Clone the repository

```bash
git clone https://github.com/Harshit2N/Chat-app.git
cd Chat-app
```

### 2. Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Configure environment variables

Create `server/.env` and `client/.env` using the [Environment Variables](#environment-variables) section below.

### 4. Run locally (development)

**Terminal 1 — Server**

```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 — Client**

```bash
cd client
npm run dev
# Client runs on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Run with Docker Compose

```bash
# From the project root — ensure server/.env and client/.env exist first
docker compose up --build
```

| Service  | URL |
|----------|-----|
| Client   | http://localhost:5173 |
| Server   | http://localhost:5000 |
| MongoDB  | mongodb://localhost:27017 |

### Production build

```bash
# Server
cd server && npm run build && npm start

# Client
cd client && npm run build && npm run preview
```

---

## Environment Variables

### Server (`server/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | Yes | MongoDB connection string. Example: `mongodb://localhost:27017/chat-app` |
| `JWT_SECRET` | Yes | Secret key for signing JWT tokens |
| `PORT` | No | Server port (default: `5000`) |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret |

**Example `server/.env`:**

```env
MONGO_URI=mongodb://localhost:27017/chat-app
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

When using Docker Compose, set `MONGO_URI` to:

```env
MONGO_URI=mongodb://mongodb:27017/chat-app
```

### Client (`client/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_BACKEND_URL` | Yes | Backend API & Socket.IO URL. Example: `http://localhost:5000` |

**Example `client/.env`:**

```env
VITE_BACKEND_URL=http://localhost:5000
```

---

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Log in |
| `GET` | `/api/auth/check` | Verify JWT (protected) |
| `PUT` | `/api/auth/update-profile` | Update profile (protected) |
| `GET` | `/api/messages/users` | List users for sidebar (protected) |
| `GET` | `/api/messages/:id` | Get conversation messages (protected) |
| `POST` | `/api/messages/send/:id` | Send a message (protected) |
| `PUT` | `/api/messages/mark/:id` | Mark message as seen (protected) |
| `GET` | `/api/status` | Health check |

### Socket.IO Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `getOnlineUsers` | Server → Client | Broadcast list of online user IDs |
| `newMessage` | Server → Client | Deliver a new message to the receiver |


Built by [Harshit Singh Shakya](https://github.com/Harshit2N)
