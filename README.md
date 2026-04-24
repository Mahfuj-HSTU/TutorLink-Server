# TutorLink — Backend

Express.js + Prisma API server for the TutorLink tutoring platform.

**Deployed:** https://tutorlink-server.onrender.com  
**Frontend repo:** [tutorlink-client](../tutorlink-client/)

---

## Overview

REST API with session-based authentication (Better-Auth), PostgreSQL on Neon, and SSLCommerz for payments. Modular architecture — each domain (tutors, bookings, payments, etc.) lives in its own folder under `src/modules/`.

---

## Stack

- Express.js 5 / TypeScript
- PostgreSQL (Neon Cloud)
- Prisma 7 (ORM, modular schema files)
- Better-Auth (session management)
- SSLCommerz (payment gateway)

---

## Getting started

```bash
npm install
```

Create `.env` in the project root (see `.env.example` or the values below), then:

```bash
npm run db:migrate:dev   # apply Prisma migrations
npm run db:seed          # seed categories + admin account
npm run dev              # tsx watch mode on :5000
```

### Required environment variables

```env
NODE_ENV=development

DATABASE_URL=postgresql://user:password@host/dbname

BETTER_AUTH_SECRET=any-long-random-string
BETTER_AUTH_URL=http://localhost:5000

APP_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

# SSLCommerz (use sandbox credentials for local dev)
SSL_STORE_ID=your-store-id
SSL_STORE_PASSWORD=your-store-password
SSL_IS_LIVE=false

# Seeded admin account
ADMIN_EMAIL=admin@tutorlink.com
ADMIN_PASSWORD=yourpassword
```

---

## Project structure

```
src/
├── app.ts                    # Express setup, middleware, routes
├── server.ts                 # Entry point
├── lib/
│   ├── auth.ts               # Better-Auth config (Prisma adapter, trusted origins)
│   ├── prisma.ts             # Prisma client singleton
│   └── asyncHandler.ts       # Wraps async route handlers
├── middleware/
│   ├── verifyAuth.ts         # Session check + role enforcement
│   ├── globalErrorHandler.ts
│   └── notFound.ts
└── modules/
    ├── admin/
    ├── booking/
    ├── category/
    ├── payment/
    ├── review/
    ├── stats/
    └── tutor/
```

Each module has three files: `*.controller.ts` (request/response), `*.service.ts` (business logic, Prisma queries), `*.route.ts` (Express router).

Prisma schema is split into domain files under `prisma/schema/` and merged at generate time.

---

## API routes

All routes are prefixed with `/api`.

### Auth — `/api/auth/*`
Handled entirely by Better-Auth. Key endpoints:
- `POST /api/auth/sign-up/email`
- `POST /api/auth/sign-in/email`
- `POST /api/auth/sign-out`
- `GET /api/auth/get-session`

### Tutors — `/api/tutors`

| Method | Path | Auth |
|--------|------|------|
| GET | `/tutors` | Public |
| GET | `/tutors/:id` | Public |
| GET | `/tutors/me` | TUTOR |
| POST | `/tutors/profile` | TUTOR |
| PUT | `/tutors/profile` | TUTOR |
| PUT | `/tutors/categories` | TUTOR |
| PUT | `/tutors/availability` | TUTOR |

Query params for `GET /tutors`: `category`, `minRate`, `maxRate`, `search`

### Bookings — `/api/bookings`

| Method | Path | Auth |
|--------|------|------|
| POST | `/bookings` | STUDENT |
| GET | `/bookings/my` | STUDENT |
| GET | `/bookings/tutor` | TUTOR |
| PATCH | `/bookings/:id/status` | STUDENT or TUTOR |

### Payments — `/api/payment`

| Method | Path | Notes |
|--------|------|-------|
| POST | `/payment/init` | Student-authenticated; returns SSLCommerz gateway URL |
| POST | `/payment/success` | SSLCommerz callback |
| POST | `/payment/fail` | SSLCommerz callback |
| POST | `/payment/cancel` | SSLCommerz callback |
| POST | `/payment/ipn` | Instant Payment Notification |

### Reviews — `/api/reviews`

| Method | Path | Auth |
|--------|------|------|
| POST | `/reviews` | STUDENT |
| PATCH | `/reviews/:id` | STUDENT |
| GET | `/reviews/tutor/:id` | Public |

### Categories — `/api/categories`

| Method | Path | Auth |
|--------|------|------|
| GET | `/categories` | Public (active only) |
| GET | `/categories/all` | ADMIN |
| POST | `/categories` | ADMIN |
| PATCH | `/categories/:id` | ADMIN |
| DELETE | `/categories/:id` | ADMIN |

### Admin — `/api/admin`

| Method | Path | Notes |
|--------|------|-------|
| GET | `/admin/users` | List all users |
| PATCH | `/admin/users/:id` | Update user (ban/unban, role change) |

### Stats — `/api/stats`

| Method | Path |
|--------|------|
| GET | `/stats` |
| GET | `/stats/featured-tutor` |

---

## Database

```bash
npm run db:migrate:dev     # create and apply a new migration
npm run db:migrate:prod    # apply migrations in production (no new migration)
npm run db:studio          # open Prisma Studio at localhost:5555
npm run db:seed            # seed categories and admin user
npm run db:push            # push schema without migration (prototyping only)
npm run db:reset           # drop and recreate all tables
```

The schema uses multiple `.prisma` files (one per domain) defined in `prisma/schema/`. Prisma merges them on `generate` via the `prismaSchemaFolder` preview feature.

---

## Auth details

Better-Auth is configured with:
- Prisma adapter against the `User`, `Session`, `Account`, and `Verification` tables
- Custom user fields: `role` (STUDENT/TUTOR/ADMIN), `phone`, `isBanned`
- Trusted origins read from `APP_URL` — add more in `auth.ts` if needed
- Email verification disabled (sign up immediately signs in)
- CSRF check disabled to allow non-browser clients

Session cookies use the prefix `better-auth` and are `httpOnly`. In production, `useSecureCookies` is enabled automatically.

---

## Scripts

```bash
npm run dev          # tsx watch — restarts on file changes
npm run build        # tsc compile to dist/
npm run start        # run compiled output
```
