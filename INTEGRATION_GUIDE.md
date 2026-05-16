# Frontend-Backend Integration Guide

## Overview

This guide explains how to connect the frontend React application with the backend Node.js/Express server using REST API.

## Architecture

```
Frontend (React)          Backend (Node.js/Express)     MongoDB Atlas
http://localhost:3000  <-> http://localhost:5000    <-> Cloud Database
   (Port 3000)             (Port 5000)
```

## Configuration

### Backend Configuration (.env)

```
MONGODB_URI=mongodb+srv://FarmanAhsan:Farman123@farman.9ceu08h.mongodb.net
DB_NAME=backend_auth_db
PORT=5000
JWT_SECRET=your-secret-key-here
ACCESS_TOKEN_SECRET=your-access-token-secret-key-12345
REFRESH_TOKEN_SECRET=your-refresh-token-secret-key-12345
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

### Frontend Configuration (.env)

```
REACT_APP_API_URL=http://localhost:5000/api/v1
```

## API Endpoints

### 1. Register User
```
POST /api/v1/users/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "User Name",        // Optional
  "username": "username"          // Optional
}

Response (201):
{
  "user": {
    "_id": "...",
    "email": "user@example.com",
    "fullName": "User Name",
    "username": "username"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "message": "User registered Successfully"
}
```

### 2. Login User
```
POST /api/v1/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response (200):
{
  "user": {
    "_id": "...",
    "email": "user@example.com",
    "fullName": "User Name",
    "username": "username"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "message": "User Logged in Successfully"
}
```

### 3. Logout User
```
POST /api/v1/users/logout
Authorization: Bearer {accessToken}

Response (200):
{
  "message": "User Logged Out"
}
```

### 4. Refresh Token
```
POST /api/v1/users/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}

Response (200):
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "message": "Access token refreshed"
}
```

## Setup Instructions

### Prerequisites
- Node.js and npm installed
- MongoDB Atlas account with connection string
- Two terminal windows

### Step 1: Start the Backend Server

```bash
# Navigate to backend folder
cd backend-auth

# Install dependencies (if not already done)
npm install

# Start the server
npm run dev
```

Expected output:
```
[nodemon] starting `node src/index.js`
MongoDB connected
Server listening on port 5000
```

### Step 2: Start the Frontend Application

```bash
# In a new terminal, navigate to frontend folder
cd frontend-auth

# Install dependencies (if not already done)
npm install

# Start the development server
npm start
```

Expected output:
```
Compiled successfully!
You can now view frontend-auth in the browser.
Local:            http://localhost:3000
```

## Frontend API Integration (src/services/api.js)

The frontend uses Axios with interceptors for:

1. **Automatic Token Attachment**: Adds JWT token to all requests
2. **Token Refresh**: Automatically refreshes expired tokens
3. **Error Handling**: Handles authentication errors gracefully

```javascript
// Login example
const response = await authAPI.login(email, password);
const { accessToken, refreshToken, user } = response.data;

// Store tokens
localStorage.setItem('accessToken', accessToken);
localStorage.setItem('refreshToken', refreshToken);
localStorage.setItem('user', JSON.stringify(user));
```

## Testing the Integration

### Test Registration

1. Open `http://localhost:3000` in browser
2. Click "Sign up" link
3. Enter email and password
4. Click "Get Started"
5. You should be redirected to dashboard

### Test Login

1. Go back to login page
2. Enter registered email and password
3. Click "Get Started"
4. You should see dashboard with your email

### Test Logout

1. Click "Logout" button on dashboard
2. You should be redirected to login page
3. Tokens should be cleared from localStorage

## Troubleshooting

### CORS Error
**Problem**: "Access to XMLHttpRequest has been blocked by CORS policy"

**Solution**: Ensure backend .env has:
```
CORS_ORIGIN=http://localhost:3000
```

### Port Already in Use

**Problem**: "Error: listen EADDRINUSE: address already in use :::3000"

**Solution**: Change frontend port:
```bash
PORT=3001 npm start
```

### Backend Connection Error

**Problem**: "Failed to connect to backend"

**Solution**:
1. Check backend is running on port 5000
2. Check frontend .env has correct API URL
3. Check MongoDB connection

### Invalid Token Error

**Problem**: "Token is expired or invalid"

**Solution**:
1. Clear browser localStorage
2. Log in again
3. Check JWT secrets in backend .env

## Token Flow

```
User Registration/Login
        ↓
Backend generates access & refresh tokens
        ↓
Frontend stores tokens in localStorage
        ↓
Frontend attaches accessToken to every request
        ↓
If accessToken expired (401), use refreshToken
        ↓
Backend generates new accessToken
        ↓
Frontend retries original request with new token
```

## Security Notes

- ✅ Access tokens expire in 15 minutes
- ✅ Refresh tokens expire in 7 days
- ✅ Tokens sent via Authorization header
- ✅ Passwords hashed with bcrypt
- ✅ CORS enabled only for frontend origin
- ✅ HTTP-only cookies for token storage (production)

## Next Steps

After successful integration:

1. **Add Task Management**: Create task CRUD endpoints
2. **Add User Profile**: Create profile update endpoint
3. **Add Password Reset**: Implement password reset flow
4. **Add Email Verification**: Implement email confirmation
5. **Add Social Login**: Implement OAuth integration
6. **Deploy**: Deploy to cloud services (AWS, Azure, Heroku)

## File Structure

```
Team Task Manager/
├── backend-auth/
│   ├── src/
│   │   ├── app.js              (Express app with CORS)
│   │   ├── index.js            (Server entry point)
│   │   ├── controllers/
│   │   │   └── user.controller.js
│   │   ├── models/
│   │   │   └── user.models.js
│   │   ├── routes/
│   │   │   └── user.route.js
│   │   └── db/
│   │       └── index.js
│   ├── .env
│   └── package.json
│
└── frontend-auth/
    ├── src/
    │   ├── services/
    │   │   └── api.js          (Axios client with interceptors)
    │   ├── pages/
    │   │   ├── LoginPage.js
    │   │   ├── RegisterPage.js
    │   │   └── DashboardPage.js
    │   ├── App.js              (Routing)
    │   └── index.js
    ├── .env
    └── package.json
```

## Quick Start Commands

**Terminal 1 (Backend):**
```bash
cd backend-auth
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend-auth
npm start
```

Done! Both applications are now running and connected. 🎉
