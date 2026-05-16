# backend-auth

Minimal backend containing registration and login flows copied from practice-backend.

Setup:

1. Copy `.env.example` to `.env` and update secrets and DB URI.
2. Install deps:

```bash
npm install
```

3. Run in dev:

```bash
npm run dev
```

Endpoints:
- POST `/api/v1/users/register` { fullName, email, username, password }
- POST `/api/v1/users/login` { username|email, password }
- POST `/api/v1/users/refresh-token` { refreshToken? }
- POST `/api/v1/users/logout` (requires access token cookie or header)
