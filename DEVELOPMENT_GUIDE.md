# TaskForge - Complete Setup & Development Guide

## 🎯 Project Status

This is now an **engineering-grade project management platform** with enterprise features.

## 📋 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ (or Supabase/Neon account)
- npm or yarn
- Git

### Step 1: Clone & Install

```bash
# Backend
cd backend-auth
npm install
npx prisma generate

# Frontend (in separate terminal)
cd frontend-auth
npm install
```

### Step 2: Database Setup

#### Option A: Local PostgreSQL
```bash
# Create database
createdb taskforge_dev

# Set DATABASE_URL in .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/taskforge_dev"

# Run migrations
cd backend-auth
npx prisma migrate dev --name init
```

#### Option B: Supabase/Neon (Recommended)
1. Create account at [Supabase](https://supabase.com) or [Neon](https://neon.tech)
2. Create new project
3. Copy connection string to `.env`:
```
DATABASE_URL="postgresql://user:password@host:5432/database"
```
4. Run migrations:
```bash
npx prisma migrate dev --name init
```

### Step 3: Generate Prisma Client

```bash
cd backend-auth
npx prisma generate
```

### Step 4: Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend-auth
npm run dev
```

Expected output:
```
╔════════════════════════════════════════╗
║  🚀 TaskForge Server Started           ║
║  Port: 5000                            ║
║  Environment: development              ║
║  API Docs: http://localhost:5000/api/docs
╚════════════════════════════════════════╝
```

**Terminal 2 - Frontend:**
```bash
cd frontend-auth
npm start
```

Expected output:
```
Compiled successfully!
You can now view frontend-auth in the browser.
Local: http://localhost:3000
```

## 📚 API Endpoints

### Authentication
```
POST   /api/v1/auth/register           - Create new user
POST   /api/v1/auth/login              - User login
POST   /api/v1/auth/refresh-token      - Refresh access token
POST   /api/v1/auth/logout             - User logout
POST   /api/v1/auth/change-password    - Change password
```

### Health Check
```
GET    /api/v1/health                 - API health status
```

## 🔧 Configuration

### Backend .env
```env
# Database
DATABASE_URL="postgresql://..."

# Server
PORT=5000
NODE_ENV=development

# JWT
ACCESS_TOKEN_SECRET=your-secret-key
REFRESH_TOKEN_SECRET=your-refresh-secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Redis (coming soon)
REDIS_URL=redis://localhost:6379

# Cloudinary (file uploads)
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
```

### Frontend .env
```env
REACT_APP_API_URL=http://localhost:5000/api/v1
```

## 📁 Project Structure

```
backend-auth/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.js      # Prisma client
│   │   └── logger.js        # Winston logger
│   ├── controllers/         # Request handlers
│   │   └── auth.controller.js
│   ├── services/            # Business logic
│   │   ├── auth.service.js
│   │   └── task-prioritization.service.js
│   ├── routes/              # API routes
│   │   └── auth.routes.js
│   ├── middlewares/         # Express middlewares
│   │   ├── auth.middleware.js
│   │   ├── rbac.middleware.js
│   │   └── validation.middleware.js
│   ├── validations/         # Joi schemas
│   │   └── index.js
│   ├── utils/               # Utilities
│   │   ├── constants.js
│   │   ├── errors.js
│   │   ├── helpers.js
│   │   └── jwt.js
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── app.js               # Express app
│   └── server.js            # Entry point
├── .env                     # Environment variables
├── .env.example
└── package.json
```

## 🗄️ Database Models

### User
- `id`, `email`, `name`, `password`, `avatar`, `role`, `status`
- Roles: ADMIN, MANAGER, LEAD, DEVELOPER, VIEWER

### Team
- `id`, `name`, `description`, `avatar`, `createdBy`, `status`
- Relations: members, projects, activityLogs

### Project
- `id`, `name`, `description`, `teamId`, `status`, `priority`, `deadline`
- Relations: tasks, activityLogs, analytics

### Task
- `id`, `title`, `description`, `projectId`, `assignedTo`, `status`, `priority`
- `dueDate`, `estimatedHours`, `actualHours`, `priorityScore`
- Relations: dependencies, comments, activityLogs

### Additional Models
- TaskDependency, Comment, ActivityLog, Notification, Analytics, AuditLog

## 🔐 Authentication Flow

1. **Register** → POST /auth/register
   - Hashes password with bcrypt
   - Creates user with DEVELOPER role
   - Returns accessToken + refreshToken

2. **Login** → POST /auth/login
   - Verifies credentials
   - Returns accessToken (15m) + refreshToken (7d)
   - Sets refreshToken in secure cookie

3. **Token Refresh** → POST /auth/refresh-token
   - Validates refreshToken
   - Issues new accessToken

4. **Logout** → POST /auth/logout
   - Clears refreshToken cookie

## 🎯 Next Steps (Phase 2)

- [ ] Build Team Management API (CRUD + invite members)
- [ ] Build Project Management API
- [ ] Build Task Management API (with Smart Prioritization)
- [ ] Implement Task Dependencies
- [ ] Add Real-time WebSocket updates
- [ ] Build Analytics Service
- [ ] Create AI Recommendation Engine
- [ ] Build Frontend Dashboard Components
- [ ] Setup Docker & Docker Compose
- [ ] Add Swagger API Documentation
- [ ] Setup CI/CD Pipeline

## 🧪 Testing Endpoints

### 1. Register User
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123",
    "name": "John Doe"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123"
  }'
```

### 3. Health Check
```bash
curl http://localhost:5000/api/v1/health
```

## 🚨 Common Issues

### Issue: `Prisma client not generated`
**Solution:**
```bash
cd backend-auth
npx prisma generate
```

### Issue: `Database connection failed`
**Solution:**
- Check DATABASE_URL in .env
- Verify PostgreSQL is running
- Check credentials are correct

### Issue: `Port 5000 already in use`
**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

## 📊 Project Metrics

- **Lines of Code (Backend):** ~1,000+ (growing)
- **Database Models:** 10+
- **API Endpoints:** 5+ (growing to 30+)
- **Security Features:** RBAC, JWT, bcrypt, input validation
- **Error Handling:** Custom error classes, centralized handling
- **Logging:** Winston logger with file rotation
- **Smart Features:** Task prioritization, dependency tracking, analytics

## 🚀 Deployment Checklist

- [ ] Environment variables set
- [ ] Database migrations run
- [ ] SSL/TLS certificates
- [ ] CORS configured for production
- [ ] Logging configured
- [ ] Error handling in place
- [ ] Rate limiting enabled
- [ ] API documentation generated
- [ ] Tests passing (90%+ coverage)
- [ ] Performance optimized

## 📞 Support & Troubleshooting

Check logs:
```bash
tail -f logs/combined.log
tail -f logs/error.log
```

View database state:
```bash
cd backend-auth
npx prisma studio
```

## 🎓 Learning Outcomes

By following this guide and completing the project, you'll learn:

✅ Production backend architecture
✅ Database design with Prisma ORM
✅ API design & REST principles
✅ Authentication & authorization (RBAC)
✅ Error handling & validation
✅ Middleware patterns
✅ Service layer architecture
✅ TypeScript/JavaScript best practices
✅ DevOps & deployment
✅ System design thinking

---

**Current Phase:** Phase 1 - Foundation ✅
**Next Phase:** Phase 2 - Advanced Features (Teams, Projects, Tasks)
**Status:** In Development

Happy Coding! 🚀
