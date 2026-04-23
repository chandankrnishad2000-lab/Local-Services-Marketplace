# Local Services Marketplace

Full-stack marketplace where customers book local services and providers manage listings, availability, and payouts. Built with Next.js, PostgreSQL, Prisma, and Stripe Connect.

## Features
- Role-based auth (customer, provider, admin)
- Listings, search, and booking flow
- Provider onboarding with Stripe Connect
- Checkout and payment tracking
- Tips and platform fee support
- Reviews and messaging
- Admin moderation dashboard

## Tech Stack
- Next.js (App Router, TypeScript)
- PostgreSQL + Prisma
- Stripe Connect
- Tailwind CSS

## Setup
1. Install dependencies:
   - `npm install`
2. Create a database and set env vars:
   - Copy `.env.example` to `.env`
3. Start the PHP + SQLite backend:
   - `cd backend`
   - `cp .env.example .env`
   - `php -S localhost:8000 -t public`
4. Start the Next.js frontend:
   - `npm run dev`

## Environment
See `.env.example` for all required values.

## Scripts
- `npm run dev` - local dev server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run db:migrate` - apply Prisma migrations
- `npm run db:studio` - Prisma Studio

## Notes
- Stripe endpoints are **dummy** in the PHP backend.
- OTP responses include the code for local testing.
