# Frontend Auth System

A modern React-based authentication frontend for Team Task Manager, featuring user registration, login, and dashboard management.

## Features

- ✅ User Registration
- ✅ User Login with JWT tokens
- ✅ Logout functionality
- ✅ Token refresh mechanism
- ✅ Protected routes
- ✅ Responsive design
- ✅ Social login buttons (UI ready)
- ✅ Dashboard for authenticated users
- ✅ Modern, beautiful UI

## Project Structure

```
frontend-auth/
├── public/
│   └── index.html
├── src/
│   ├── pages/
│   │   ├── LoginPage.js
│   │   ├── RegisterPage.js
│   │   ├── DashboardPage.js
│   │   ├── AuthPage.css
│   │   └── DashboardPage.css
│   ├── services/
│   │   └── api.js              # API client and interceptors
│   ├── App.js                  # Main app with routing
│   ├── App.css
│   ├── index.js
│   └── index.css
├── .env                        # Environment variables
├── package.json
└── README.md
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd frontend-auth
npm install
```

### 2. Configure Environment Variables

The `.env` file is already configured to connect to your backend:

```
REACT_APP_API_URL=http://localhost:3000/api/v1
```

Make sure your backend is running on `http://localhost:3000`

### 3. Start the Development Server

```bash
npm start
```

The frontend will open at `http://localhost:3000` (Note: React uses port 3000, so your backend should be on a different port)

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App (irreversible)

## API Integration

The frontend connects to the backend API endpoints:

- **Register**: `POST /api/v1/users/register`
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- **Login**: `POST /api/v1/users/login`
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- **Logout**: `POST /api/v1/users/logout`

- **Refresh Token**: `POST /api/v1/users/refresh-token`
  ```json
  {
    "refreshToken": "your-refresh-token"
  }
  ```

## Features

### Authentication Flow

1. **Registration Page**: Create new account with email and password
2. **Login Page**: Sign in with existing credentials
3. **JWT Token Management**: Automatic token refresh on expiry
4. **Protected Routes**: Dashboard only accessible when authenticated
5. **Logout**: Clear tokens and redirect to login

### Security Features

- JWT-based authentication
- Automatic token refresh
- Secure token storage (localStorage)
- Protected API calls with interceptors
- Error handling and validation

### UI Components

- **Login/Register Forms**: Responsive form inputs
- **Social Login Buttons**: UI for Google, Facebook, Apple (ready for integration)
- **Dashboard**: User welcome message and account information
- **Error Messages**: Clear error display and handling
- **Loading States**: Feedback during API calls

## Styling

- Modern gradient backgrounds
- Responsive design (mobile, tablet, desktop)
- Smooth transitions and hover effects
- Clean and professional UI
- Matches reference design

## Testing the Frontend

1. **Register**: Create a new account
2. **Login**: Sign in with your credentials
3. **Dashboard**: View your profile and account info
4. **Logout**: Sign out and return to login page

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| REACT_APP_API_URL | http://localhost:3000/api/v1 | Backend API base URL |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Backend connection error

If you see "Failed to connect to backend", ensure:
1. Backend is running on `http://localhost:3000`
2. Backend API URL in `.env` is correct
3. Backend has CORS enabled

### Port conflicts

If port 3000 is already in use:
1. Kill the process using port 3000
2. Or set `PORT=3001` before running `npm start`

### Token issues

If you get unauthorized errors:
1. Clear browser localStorage
2. Log in again to get new tokens
3. Check backend is sending valid tokens

## Next Steps

- Implement social login (Google, Facebook, Apple)
- Add password reset functionality
- Add email verification
- Add two-factor authentication
- Add user profile management

## License

MIT
