# EntaElEin - Community Safety Platform

EntaElEin is a full-stack community safety platform for Lebanon that connects citizens with security officers through real-time incident reporting, role-based dashboards, and operational analytics.

## 1. Project Idea 

### Problem
Traditional public safety reporting is often slow, fragmented, and lacks two-way coordination between citizens and responders.

### Innovation
EntaElEin introduces a unified workflow:
- Citizen-side incident reporting with optional evidence images.
- Officer-side lifecycle management (Pending, In Progress, Resolved, Rejected).
- Participant linkage for investigations (create/edit/delete and report association).
- Role-based access control across the entire app.
- Regional/statistical insights for decision support.

## 2. Functionality 

### Citizen Features
- Register/Login with role-aware access.
- Submit reports with:
  - incident category
  - crime date/time
  - location (region)
  - description
  - optional evidence image (URL or uploaded image data URL)
- Track report statuses from dashboard.
- Submit feedback.

### Officer/Admin Features
- View active report queue.
- Update report status:
  - Pending
  - In Progress
  - Resolved
  - Rejected
- Manage participants per report:
  - create
  - edit
  - delete
- Browse resolved reports.
- Browse participants involved.
- Open dedicated Statistics page with:
  - date filter
  - status filter
  - region filter
  - CSV export
  - trend and breakdown charts

### Backend/API Highlights
- Express + PostgreSQL architecture.
- Repository/service/controller layering.
- Validation with `express-validator`.
- Centralized error handling (`ApiError`, `notFound`, `errorHandler`).
- JWT-based authentication and role checks.

## 3. User Interface 

- Consistent dashboard visual language across roles.
- Reusable component structure:
  - `dashboards/`
  - `forms/`
  - `modals/`
  - `layout/`
  - `routing/`
- Responsive layouts (cards, grids, charts).
- Clear action hierarchy and feedback messages for user actions.

## 4. Code Quality 

### Folder Organization
- Frontend separated by responsibility (`dashboards`, `forms`, `modals`, `layout`, `routing`).
- Backend structured by concern (`controllers`, `services`, `repositories`, `validators`, `middlewares`).

### Quality Practices
- TypeScript on frontend and backend.
- ESLint + formatting configuration.
- Route guards (`RoleBasedRoute`) to enforce role access.
- Removed legacy/unused components to reduce confusion and tech debt.


## 5. Tech Stack

### Frontend
- React + TypeScript + Vite
- React Router
- TailwindCSS
- Recharts
- Lucide icons

### Backend
- Node.js + Express + TypeScript
- PostgreSQL (`pg`)
- JWT auth (`jsonwebtoken`)
- Validation (`express-validator`)

## 6. Run Instructions

## Prerequisites
- Node.js (LTS)
- PostgreSQL

### Backend
1. `cd api`
2. `npm install`
3. Configure environment variables (DB, JWT, PORT)
4. Start API: `npm run dev`

### Frontend
1. `cd app`
2. `npm install`
3. Start app: `npm run dev`

## Build
- Frontend: `cd app && npm run build`
- Backend: `cd api && npm run build`

## 7. Suggested Future Enhancements

- Live notifications/websocket updates.
- Interactive map integration (Leaflet/Google Maps).
- Automated anomaly detection from report streams.

