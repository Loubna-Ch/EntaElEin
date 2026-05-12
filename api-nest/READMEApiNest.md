# API-Nest Documentation

This folder contains the NestJS backend for EntaElEin.

## What this API does
- Auth (JWT login/register/refresh).
- Reports, participants, regions, hadas, alerts, feedback.
- REST + GraphQL in the same app.

## How to run
1. Open terminal in `api-nest`.
2. Install packages:
   - `npm install`
3. Create `.env`:
   - `DB_HOST=localhost`
   - `DB_PORT=5432`
   - `DB_USER=postgres`
   - `DB_PASSWORD=password`
   - `DB_NAME=EntaElEin`
   - `JWT_SECRET=your-secret-key`
   - `PORT=3000`
4. Start dev server:
   - `npm run start:dev`

## Swagger (REST Docs)
- URL: `http://localhost:3000/docs`
- JWT auth supported via Bearer token input.

## GraphQL
- URL: `http://localhost:3000/graphql`
- Queries: `reports`, `regions`, `users`, etc.
- Mutations: `login`, `createReport`, etc.

## Project Structure
```
api-nest/
└── src/
    ├── app.module.ts
    ├── main.ts
    ├── common/
    ├── config/
    └── features/
        ├── auth/
        ├── users/
        ├── region/
        ├── hadas/
        ├── feedback/
        ├── alerts/
        ├── participant/
        └── report/
```

## Method Documentation
Every function added or updated in this phase includes a short comment above the function explaining its purpose and what it returns. This keeps the code self-documented without extra files.
