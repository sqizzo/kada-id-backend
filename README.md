# Kada-ID Backend

> Minimal Node.js/Express backend for authentication (login/register)

---

## Table of contents

- About
- Requirements
- Quick start
- Environment
- Scripts
- Useful endpoints
- Notes

## About

This repository contains a small Express-based backend for handling authentication (login/register). It includes database configuration in `config/database.js`, a `User` model in `models/`, controllers in `controllers/`, and auth routes in `routes/auth.routes.js`.

## Requirements

- Node.js 16+ (or your project's target Node version)
- A running database (as configured in `config/database.js`) — e.g., PostgreSQL, MySQL, or SQLite depending on your setup

## Quick start

1. Install dependencies:

```powershell
npm install
```

2. Create environment variables (see Environment below) and ensure your database is reachable.

3. Start the development server:

```powershell
npm run dev
```

The app defaults to `http://localhost:3000` unless changed in your start script or environment.

## Environment

Create a `.env` file in the project root or configure environment variables for your shell. Common variables used by this project:

- `PORT` — Port for the server (default 3000)
- `DATABASE_URL` or DB-specific variables — connection string used by `config/database.js`
- `JWT_SECRET` — secret used to sign authentication tokens
- `NODE_ENV` — `development` / `production`

Example `.env`:

```
PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/mydb
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```

Note: This repo may also include other DB config fields in `config/database.js`; adapt your `.env` accordingly.

## Scripts

- `npm run dev` — runs the server in development mode (use this while developing)
- `npm start` — production start (if defined in `package.json`)

Add test or lint scripts as needed.

## Useful endpoints

These examples assume the server is running at `http://localhost:3000` and that `routes/auth.routes.js` mounts routes under `/auth`.

- POST `/auth/login` — body: `{ "email": "user@example.com", "password": "Password123" }` — returns JWT or error on failure.

Use the REST Client file at `test/auth.http` to exercise these endpoints quickly from VS Code, or use `curl`/Postman.
