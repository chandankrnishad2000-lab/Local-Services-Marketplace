# Local Services Backend

Node.js + Express + MongoDB (Mongoose) API for the Local Services marketplace.

## Run locally

```bash
npm install
cp .env.example .env
npm run seed    # creates admin + sample listings
npm start       # http://localhost:8000
# or
npm run dev     # auto-restart on file changes
```

## Seed data

```bash
npm run seed
```

Admin user (created by seed):
- Email: admin@localservices.test
- Password: Admin123!

Sample local pros and listings are also inserted on first run.

## Environment

Create `backend/.env` (or set env vars). See `.env.example` for all options:

```
MONGODB_URI=mongodb://localhost:27017/local-services
SESSION_SECRET=change-me-to-a-random-string
FRONTEND_ORIGIN=http://localhost:3000
APP_BASE_URL=http://localhost:3000
BACKEND_BASE_URL=http://localhost:8000
```

### Email OTP

Email OTP uses your SMTP provider. Set these environment variables before enabling it:

```
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
SMTP_SECURE=false
EMAIL_FROM="LocalPulse <no-reply@example.com>"
OTP_SECRET=a-long-random-secret
```

Codes are six digits, expire after 10 minutes by default, and are sent only by email; they are never returned by the API or stored in plaintext. Set `OTP_EXPIRY_MINUTES` to change the expiry.

Set `NODE_ENV=production` in deployed environments so session cookies are
issued with `SameSite=None; Secure` (required for cross-domain fetch).

## API

- `POST /api/auth/register` - register (role: CUSTOMER | LOCAL_PRO)
- `POST /api/auth/login` - login
- `POST /api/auth/logout` - logout
- `GET /api/auth/me` - current user
- `POST /api/auth/otp/request` / `POST /api/auth/otp/verify` - email OTP login
- `GET|POST /api/listings` - list / create listings
- `GET /api/listings/:id` - listing detail
- `PUT|PATCH|DELETE /api/listings/:id` - owner update/delete
- `GET|POST /api/bookings` - list / create bookings
- `GET /api/bookings/:id` - booking detail
- `PATCH /api/bookings/:id` - update booking status
- `POST /api/reviews` - leave a review (completed bookings only)
- `GET|POST /api/messages?threadId=...` - booking messages
- `GET /api/reports` - admin reports
- `POST /api/stripe/checkout` / `connect` / `webhook` - dummy Stripe

## Notes
- Sessions are stored in MongoDB via `connect-mongo`.
- Fetch from the frontend must use `credentials: "include"`.
- All Stripe endpoints are **dummy**.
- Email OTP requires the SMTP settings above.
