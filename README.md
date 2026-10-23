# Local Services Marketplace

Full-stack marketplace where customers book local services and providers manage listings, availability, and payouts. Built with Next.js, MongoDB, Express, and session-based auth.

## Features
- Role-based auth (customer, provider, admin)
- Listings, search, and booking flow
- Listing moderation: new listings start `PENDING` and are approved by an admin
- OTP login (dummy, returns code in dev)
- Google/Apple OAuth (configurable)
- Real Stripe Checkout when `STRIPE_SECRET_KEY` is set (dummy fallback otherwise)
- Stripe Connect onboarding for provider payouts
- Tips and platform fee support
- Reviews, reports, and messaging
- Admin moderation dashboard (approve/pause/reject listings, resolve reports, manage users)

## Tech Stack
- Next.js (App Router, TypeScript)
- Node.js + Express + MongoDB (Mongoose)
- Tailwind CSS + Bootstrap
- express-session (MongoStore)

## Setup
1. Start MongoDB:
   - Local install, or `mongod --dbpath ...`
2. Backend:
   - `cd backend`
   - `cp .env.example .env`
   - `npm install`
   - `npm run seed` (creates admin user + sample listings)
   - `npm start` (serves http://localhost:8000)
3. Frontend:
   - `cp .env.example .env`
   - `npm install`
   - `npm run dev` (serves http://localhost:3000)

Admin user (created by seed):
- Email: admin@localservices.test
- Password: Admin123!

## Environment
See `.env.example` files in both `/` and `/backend` for all required values.

## Scripts
- `npm run dev` - local dev server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run dev:all` - run backend + frontend together
- Backend: `cd backend && npm start` / `npm run dev` / `npm run seed` / `npm test`

## Tests
Backend API tests run against an in-memory MongoDB (no local DB required):
- `cd backend && npm test`

## Deploy on Railway (Frontend + Node API)
This project deploys as two Railway services from the same repo. Each service uses its own `railway.json` (repo root for the frontend, `backend/railway.json` for the API).

### 1) Backend service (Node + MongoDB)
- **Root directory:** `backend`
- **Build command:** `npm install`
- **Start command:** `npm start`
- **Healthcheck:** `/api/health`
- **Environment variables:**
   - `MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/local-services`
   - `SESSION_SECRET=<random-string>`
   - `FRONTEND_ORIGIN=https://<your-frontend-domain>`
   - `APP_BASE_URL=https://<your-frontend-domain>`
   - `BACKEND_BASE_URL=https://<your-backend-domain>`
   - `NODE_ENV=production` (sets `SameSite=None; Secure` cookies)
   - Optional: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (leave empty to keep dummy checkout)

### 2) Frontend service (Next.js)
- **Root directory:** `/`
- **Build command:** `npm install && npm run build`
- **Start command:** `npm run start -- -p $PORT`
- **Environment variables:**
   - `NEXT_PUBLIC_API_BASE_URL=https://<your-backend-domain>`

### 3) MongoDB
Use the Railway MongoDB plugin or MongoDB Atlas, then point the backend's `MONGODB_URI` at it.

After deploy, update both services with the final Railway URLs.

## Notes
- Stripe checkout, Connect, and webhooks are fully implemented. Without `STRIPE_SECRET_KEY` the API falls back to a dummy checkout that marks payments as PAID instantly.
- OTP responses include the code for local testing.
- New listings are created as `PENDING` and only appear publicly after an admin approves them.
