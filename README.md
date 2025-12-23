# Kada-ID Backend

Node.js/Express backend API for KADA CMS with JWT authentication, role-based access control, and program management.

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Requirements](#requirements)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [API Endpoints](#api-endpoints)
  - [Public Routes](#public-routes)
  - [Authentication](#authentication)
  - [Users](#users)
  - [Program Settings](#program-settings)
  - [Activity Logs](#activity-logs)
- [Project Structure](#project-structure)
- [Authentication & Authorization](#authentication--authorization)
- [Response Format](#response-format)

## About

KADA-ID Backend is a RESTful API built with Express.js and MongoDB that provides:

- JWT-based authentication with refresh tokens
- Role-based access control (Admin/Moderator)
- User management
- Program settings management with active program tracking
- Activity logging system
- Standardized API responses and error handling

## Features

- 🔐 **JWT Authentication** - Secure token-based auth with access & refresh tokens
- 👥 **User Management** - CRUD operations with role-based permissions
- 📋 **Program Settings** - Manage program configurations with active/inactive states
- 📊 **Activity Logging** - Comprehensive audit trail of system activities
- 🛡️ **RBAC** - Role-based access control (Admin/Moderator)
- 🔒 **Security** - Helmet, CORS, bcrypt password hashing
- 📝 **Request Logging** - Winston + Morgan for production-grade logging

## Requirements

- **Node.js** 16+
- **MongoDB** 4.4+ (standalone instance)
- **npm** or **yarn**

## Quick Start

1. **Clone the repository:**

```bash
git clone https://github.com/sqizzo/kada-id-backend.git
cd kada-id-backend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create `.env` file:** (See [Environment Variables](#environment-variables))

4. **Start development server:**

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## Environment Variables

Create a `.env` file in the project root:

```env
# Server Configuration
PORT=3000
BASE_URL=http://localhost
CLIENT_BASE_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/kada-id

# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# Security
BCRYPT_SALT_ROUNDS=10
```

## Scripts

- `npm run dev` - Start development server with nodemon (auto-reload)
- `npm start` - Start production server
- `npm test` - Run tests (not configured yet)

## API Endpoints

Base URL: `http://localhost:3000/api`

### Public Routes

| Method | Endpoint                 | Description                  |
| ------ | ------------------------ | ---------------------------- |
| `GET`  | `/public/program/active` | Get currently active program |

### Authentication

| Method | Endpoint        | Description               | Auth Required |
| ------ | --------------- | ------------------------- | ------------- |
| `POST` | `/auth/login`   | Login with email/password | No            |
| `POST` | `/auth/refresh` | Refresh access token      | Cookie        |
| `POST` | `/auth/logout`  | Logout and clear tokens   | No            |
| `GET`  | `/auth/me`      | Get current user profile  | Yes           |

**Login Request:**

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Login Response:**

```json
{
  "status": "success",
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGc...",
    "user": {
      "_id": "...",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin"
    }
  }
}
```

### Users

**All user endpoints require JWT authentication and Admin role.**

| Method   | Endpoint     | Description     |
| -------- | ------------ | --------------- |
| `GET`    | `/users`     | Get all users   |
| `GET`    | `/users/:id` | Get user by ID  |
| `POST`   | `/users`     | Create new user |
| `PATCH`  | `/users/:id` | Update user     |
| `DELETE` | `/users/:id` | Delete user     |

**Create User Request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "moderator"
}
```

### Program Settings

**All program endpoints require JWT authentication and Admin role.**

| Method   | Endpoint       | Description                |
| -------- | -------------- | -------------------------- |
| `GET`    | `/program`     | Get all program settings   |
| `GET`    | `/program/:id` | Get program setting by ID  |
| `POST`   | `/program`     | Create new program setting |
| `PUT`    | `/program/:id` | Update program setting     |
| `PATCH`  | `/program/:id` | Set program as active      |
| `DELETE` | `/program/:id` | Delete program setting     |

**Create Program Request:**

```json
{
  "slug": "program-2024",
  "isActive": false,
  "program": {
    "name": "Program Name",
    "description": "Program Description"
  },
  "schedule": {
    "startDate": "2024-01-01",
    "endDate": "2024-12-31"
  },
  "location": {
    "venue": "Main Hall",
    "address": "123 Street"
  },
  "participants": {
    "maxCapacity": 100
  },
  "programFeatures": ["feature1", "feature2"]
}
```

### Activity Logs

**All log endpoints require JWT authentication and Admin role.**

| Method | Endpoint       | Description              |
| ------ | -------------- | ------------------------ |
| `GET`  | `/logs`        | Get all activity logs    |
| `GET`  | `/logs/recent` | Get recent activity logs |

## Project Structure

```
kada-id-backend/
├── collections/           # Postman collection
├── config/
│   ├── database.js       # MongoDB connection
│   └── passport.js       # Passport JWT strategy
├── controllers/          # Request handlers
│   ├── auth.controller.js
│   ├── log.controller.js
│   ├── program.controller.js
│   └── user.controller.js
├── middlewares/
│   └── rbac.js          # Role-based access control
├── models/              # MongoDB schemas
│   ├── ProgramSetting.js
│   ├── UpdateLog.js
│   └── User.js
├── routes/              # API routes
│   ├── auth.routes.js
│   ├── log.routes.js
│   ├── program.routes.js
│   ├── public.routes.js
│   └── user.routes.js
├── utils/               # Utilities
│   ├── activityLogger.js   # Activity logging
│   ├── errorHandler.js     # Global error handler
│   ├── jwt.js             # JWT utilities
│   ├── logger.js          # Winston logger
│   ├── requestLogger.js   # Morgan HTTP logger
│   └── response.js        # Standardized responses
├── .env                 # Environment variables
├── index.js             # Application entry point
└── package.json
```

## Authentication & Authorization

### Authentication Flow

1. User logs in with email/password
2. Server validates credentials and issues:
   - Access token (JWT) - short-lived, sent in response body
   - Refresh token - long-lived, set as httpOnly cookie
3. Client includes access token in `Authorization: Bearer <token>` header
4. When access token expires, use refresh endpoint to get new access token

### Roles

- **Admin** - Full access to all endpoints
- **Moderator** - Limited access (future implementation)

### Protected Routes

Use JWT middleware: `passport.authenticate("jwt", { session: false })`

Admin-only routes add: `isAdmin` middleware

## Response Format

All API responses follow a standardized format:

**Success Response:**

```json
{
  "status": "success",
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

**Error Response:**

```json
{
  "status": "error",
  "success": false,
  "message": "Error message",
  "errors": null
}
```

## License

ISC

## Author

sqizzo

## Repository

[https://github.com/sqizzo/kada-id-backend](https://github.com/sqizzo/kada-id-backend)
