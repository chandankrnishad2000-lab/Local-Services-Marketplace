# PHP + SQLite Backend (Dummy)

This backend replaces the old Next.js API routes. It uses **plain PHP**, **SQLite**, and **PHP sessions**.

## Run locally

```bash
cd backend
php -S localhost:8000 -t public
```

## Environment

Create `backend/.env` (or set env vars):

```
FRONTEND_ORIGIN=http://localhost:3000
SQLITE_PATH=./storage/app.db
```

## Notes
- All Stripe endpoints are **dummy**.
- OTP endpoint returns the OTP code in the response for testing.
- Sessions are stored by PHP; fetch from the frontend must use `credentials: "include"`.
