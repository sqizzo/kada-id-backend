# Kada-ID Backend

Minimal Node.js/Express backend for KADA CMS.

---

## Table of contents

- About
- Requirements
- Quick start
- Environment
- Scripts
- Endpoints
- Testing
- Notes

## About

This repository contains a small Express-based backend focused on authentication. Key files:

- `index.js` — server bootstrap and middleware
- `config/database.js` — MongoDB connection
- `config/passport.js` — Passport JWT strategy
- `models/User.js` — Mongoose user model (password hashing hook)
- `controllers/auth.controller.js` — login, refresh, profile (`/me`)
- `routes/auth.routes.js` — mounted at `/api/auth`
- `utils/response.js` — standardized JSON response helpers

## Requirements

- Node.js 16+
- MongoDB (set `MONGODB_URI`)

## Quick start

1. Install dependencies:

```powershell
npm install
```

2. Create a `.env` in the project root. See Environment below.

3. Start the dev server:

```powershell
npm run dev
```

The server listens on `PORT` (default 3000) and mounts auth routes under `/api/auth`.

## Environment

Create a `.env` file with at least the following variables:

- PORT=3000
- BASE_URL=http://localhost
- CLIENT_BASE_URL=
- MONGODB_URI=
- JWT_SECRET=
- JWT_REFRESH_SECRET=

## Scripts

- `npm run dev` — start dev server (nodemon)
- `npm start` — run in production

## Endpoints

All auth endpoints are mounted under `/api/auth`.

- POST `/api/auth/login` — body: `{ "email": "...", "password": "..." }` — returns `{ status:'success', data: { accessToken, user } }` on success and sets a `refreshToken` httpOnly cookie.
- POST `/api/auth/refresh` — exchanges the `refreshToken` cookie for a new access token: returns `{ status:'success', data: { accessToken } }`.
- GET `/api/auth/me` — protected endpoint (Bearer JWT) returning the authenticated user profile.

Responses use a standardized shape from `utils/response.js`:

- Success: `{ status: 'success', success: true, message, data }`
- Error: `{ status: 'error', success: false, message, errors? }`
