# EntaElEin — Community Safety Platform

EntaElEin is a full-stack community safety platform for Lebanon that connects citizens with security officers through incident reporting, role-based dashboards, and operational analytics. This single README combines the migration summary and usage notes so you have one clear source of truth for running and understanding the project.

---

## Quick Start — Development

Prerequisites:
- Node.js 18+ and npm
- PostgreSQL 12+

1. Install frontend deps and run dev server:
   ```bash
   cd app
   npm install
   npm run dev
   ```

2. Install backend deps and run NestJS dev server:
   ```bash
   cd api-nest
   npm install
   # ensure your .env is configured (see section below)
   npm run start:dev
   ```

3. Build for production:
   ```bash
   # backend
   cd api-nest && npm run build && npm run start:prod

   # frontend
   cd app && npm run build
   ```

Server defaults:
- Backend: http://localhost:3000 (REST API base = /api)
- Frontend: Vite dev server (port shown by `npm run dev`)

GraphQL playground: http://localhost:3000/graphql
Swagger docs (REST): http://localhost:3000/docs

---

## Project Overview

Core ideas:
- Citizen-side incident reporting with optional evidence images
- Officer/Admin dashboards to manage reports and participants
- Regional awareness: incidents are tied to regions
- Role-based access control: `CITIZEN`, `OFFICER`, `ADMIN`

Key components:
- Frontend: React + TypeScript + Vite, Redux Toolkit for auth state, Apollo Client for GraphQL
- Backend: NestJS + TypeORM + PostgreSQL, JWT authentication, GraphQL via Apollo

---

## How the Backend Is Organized

- `api-nest/src/app.module.ts` — Root module wiring GraphQL, DB, and features
- `api-nest/src/features/*` — Feature modules (users, auth, region, hadas, report, feedback, participant, alerts)
- Each feature contains: entity, dto, service, controller (REST), resolver (GraphQL), module

Authentication & Authorization:
- Login: `POST /api/auth/login` → returns `{ user, accessToken, refreshToken }`
- Register: `POST /api/users` (signup) accepts `{ username, email, password, regionid, ... }`
- Refresh: `POST /api/auth/refresh` accepts `{ refreshToken }`
- Protected endpoints require `Authorization: Bearer <accessToken>`

---

## Environment (.env)
Create `.env` in `api-nest` with values like:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=entaelein
JWT_SECRET=your-secret-key
NODE_ENV=development
PORT=3000
```

---

## Running & Testing Notes
- Swagger UI available at `/docs` for REST endpoint testing.
- GraphQL playable at `/graphql` (auto-generated schema at `src/schema.gql`).
- Frontend signup now includes a `regionId` selection; the backend stores `regionid` on the user record so dashboards can filter by home region.

---

## Migration Summary & Status

This repo contains a completed migration from Express to NestJS with GraphQL support. Highlights:
- Modular NestJS architecture with TypeORM entities for Users, Regions, Hadas (categories), Reports, Participants, Feedback, Alerts and related junction tables.
- DTO validation via `class-validator`, global `ValidationPipe`, and robust error handling.
- Authentication: bcryptjs password hashing, JWT-based access and refresh tokens, role-based guards.
- Build & compilation: project builds cleanly with no TypeScript errors.

Optional future work listed in the migration notes:
- WebSocket / real-time event broadcasting
- File upload handler for images
- Advanced filtering and search
- Monitoring, metrics and rate limiting

---

## API Reference (short)

REST base: `/api`

Auth:
- `POST /api/users` — create user (signup). JSON body example:
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepass123",
  "role": "citizen",
  "phonenumber": "+961...",
  "address": "Beirut, Lebanon",
  "regionid": 1
}
```
- `POST /api/auth/login` — login
- `POST /api/auth/refresh` — refresh tokens

Reports:
- `POST /api/reports` — create report (authenticated users)
- `GET /api/reports` — list reports

More endpoints and example GraphQL queries are available in the original docs inside the code and via `/docs` and `/graphql` when the server is running.

---
