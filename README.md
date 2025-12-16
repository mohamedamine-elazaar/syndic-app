# Syndic Management System

A full-stack residential building management platform.

## Monorepo structure

- `frontend/` – React (Vite) app
- `backend/` – Node.js (Express) API

## Prerequisites

- Node.js 20+ recommended
- MongoDB (local instance or MongoDB Atlas connection string)

## Quick start (Windows PowerShell)

### 1) Backend

```powershell
cd backend
npm install
Copy-Item .env.example .env
npm run dev
```

API runs on: `http://localhost:5000`

### 2) Frontend

```powershell
cd ..\frontend
npm install
Copy-Item .env.example .env
npm run dev
```

App runs on: `http://localhost:5173`

## Environment variables

### Backend (`backend/.env`)

- `NODE_ENV=development`
- `PORT=5000`
- `MONGODB_URI=mongodb://127.0.0.1:27017/syndic_management`
- `JWT_ACCESS_SECRET=...` (required)
- `JWT_ACCESS_EXPIRES_IN=15m`
- `COOKIE_NAME=syndic_token`
- `CORS_ORIGIN=http://localhost:5173`

### Frontend (`frontend/.env`)

- `VITE_API_BASE_URL=http://localhost:5000/api`

## Notes

- Auth uses **JWT stored in HttpOnly cookies**.
- The API enforces **role-based access control**: `admin`, `owner`, `staff`.

## Scripts

- Backend: `npm run dev`, `npm run start`, `npm run lint`
- Frontend: `npm run dev`, `npm run build`, `npm run preview`, `npm run lint`
