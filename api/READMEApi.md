# API Folder Documentation 

This folder contains the backend API of EntaElEin.

## What this API does
- Handles authentication (login/register).
- Saves and retrieves incident reports.
- Manages participants linked to reports.
- Serves admin/citizen data for dashboards.
- Validates input and returns structured errors.

## How to run
1. Open terminal in `api`.
2. Install packages:
   - `npm install`
3. Configure `.env` values (database, JWT, port, client URL).
4. Start dev server:
   - `npm run dev`
5. Build:
   - `npm run build`

## Main files (root)
- `package.json`: scripts and dependencies.
- `.env`: environment variables.
- `.prettierrc`: formatting rules.
- `tsconfig.json`: TypeScript config.
- `sql/`: database schema/init script(s).

## `src` folder

### `index.ts`
- API entry point.
- Starts the Express server.

### `app.ts`
- Express app setup.
- Applies middleware (CORS, security, parsing, logging).
- Registers routes.
- Adds `notFound` + `errorHandler` middleware.

### `config/`
- Core configs and helpers.
- Example: database pool, JWT utilities.

### `routes/`
- Route definitions by feature.
- Examples:
  - `authRoutes`
  - `reportRoutes`
  - `participantRoutes`
  - `regionRoutes`

### `controllers/`
- Handles request/response logic.
- Calls service layer.

### `services/`
- Business logic layer.
- Orchestrates operations and validations beyond route level.

### `repositories/`
- Database query layer.
- Reads/writes PostgreSQL data.

### `validators/`
- Request validation rules (mostly `express-validator`).

### `middlewares/`
- Shared middleware.
- Includes:
  - auth middleware
  - `notFound` middleware
  - centralized `errorHandler`
  - validation middleware

## API base path
From `app.ts`, all endpoints are mounted under `/api/...`.

Examples:
- `/api/auth`
- `/api/report`
- `/api/participant`
- `/api/region`
- `/api/involvedin`

## Error handling 
- If route does not exist -> `notFound` middleware creates a 404 ApiError.
- Central `errorHandler` formats and sends final error response.

## Notes
- Role-based access is enforced with auth and role checks.
- Keep controller/service/repository separation for cleaner code quality.
