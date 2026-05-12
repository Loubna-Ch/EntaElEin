# App Folder Documentation 

This folder contains the frontend of EntaElEin.

## What this app does
- Shows pages for Home, Login, Signup.
- Lets citizens report incidents and track status.
- Lets admins/officers manage reports, participants, and statistics.
- Uses Redux for shared auth state.
- Uses GraphQL for admin statistics (reports + regions).

## How to run
1. Open terminal in `app`.
2. Install packages:
   - `npm install`
3. Start dev server:
   - `npm run dev`
4. Build for production:
   - `npm run build`

## Main files (root)
- `package.json`: scripts and dependencies.
- `vite.config.ts`: Vite config.
- `tailwind.config.js`: Tailwind config.
- `postcss.config.js`: PostCSS config.
- `index.html`: app entry HTML.

## `src` folder

### `main.tsx`
- React entry point.
- Mounts the app and providers.

### `App.tsx`
- Main router.
- Defines all frontend routes.

### `contexts/`
- Global state/providers.
- Auth wrapper (`useAuth`) backed by Redux store.

### `store/`
- Redux store setup and slices.
- `slices/authSlice.ts` handles login, signup, logout, and auth persistence.
- `slices/reportsSlice.ts` handles loading reports for dashboards.
- `hooks/useAuth.ts` exposes the Redux-backed `useAuth()` API.

### `pages/`
- Page-level screens.
- Example: Login page, Signup page, statistics, resolved, participants involved.

### `components/`
Reusable UI parts grouped by purpose:

- `components/dashboards/`
  - Role-based dashboards.
  - Examples: citizen dashboard, admin dashboard, reports.

- `components/forms/`
  - Forms used in the app.
  - Examples: incident report form, feedback form.

- `components/layout/`
  - Shared layout components.
  - Example: sidebar.

- `components/modals/`
  - Popup dialogs.
  - Examples: contact modal, feedback modal.

- `components/routing/`
  - Route helpers/guards.
  - Example: role-based route protection.

- `components/errors/`
  - Error pages.
  - Example: Not Found page.

### `types/`
- Shared TypeScript types/interfaces.

### `styles/` and `index.css`
- Global styles and Tailwind style files.

### `imports/` and `assets/`
- Images and static assets used by components.

## Quick route map
- `/` -> Home
- `/login` -> Login
- `/signup` -> Signup
- `/report` -> Citizen report form (protected)
- `/dashboard/citizen` -> Citizen dashboard (protected)
- `/dashboard/admin` -> Admin dashboard (protected)
- `/dashboard/admin/statistics` -> Admin statistics (protected)
- `/dashboard/admin/resolved` -> Resolved reports (protected)
- `/dashboard/admin/participants` -> Participants involved (protected)

## Notes
- This app uses role-based access control.
- Build command confirms if imports/routes are valid.

## Redux in This Project: Why and How

This document explains why Redux was introduced and how it is implemented step by step in the CSIS279 React app.

### Why Redux?
Auth is global and required across many screens (routing, dashboards, protected API calls). Redux keeps this shared state in one predictable store and avoids prop drilling.

### Why Redux Toolkit?
Redux Toolkit is the official recommended approach. It reduces boilerplate and makes async flows (login/signup) consistent.

### Implementation Overview
- A Redux store is created in `src/store/index.ts`.
- An auth slice manages user + token (`src/store/slices/authSlice.ts`).
- A Redux-backed `useAuth()` hook is exposed from `src/store/hooks/useAuth.ts`.
- The app entry wraps the UI with `Provider`.

### Data Flow
1. User logs in or signs up.
2. Thunks dispatch and update the `auth` slice.
3. The store subscription syncs credentials to localStorage.
4. Any component using `useAuth()` re-renders with the new auth state.

### Where Redux Is Used
- Auth state: login, signup, logout, role checks.
- Routing decisions (protected pages).
- Reports state: admin and citizen dashboards reuse the shared report list.

## GraphQL Usage

The admin Statistics page uses GraphQL to load `reports` and `regions` from the NestJS `/graphql` endpoint. Other screens still use REST, which satisfies the 25% GraphQL requirement.
