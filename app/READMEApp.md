# App Folder Documentation 

This folder contains the frontend of EntaElEin.

## What this app does
- Shows pages for Home, Login, Signup.
- Lets citizens report incidents and track status.
- Lets admins/officers manage reports, participants, and statistics.

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
- Example: auth session and role checks.

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
