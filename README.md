# Gavikina Admin Dashboard

Internal admin dashboard for Gavikina Energy — manages enquiries (customers, agents,
investors, job applications, abandoned assessments), an overview with stats and
charts, and a Past Projects CRUD used to populate the public site's projects page.

Built with React + Vite. Originally prototyped in Claude Design; this repo is the
real implementation.

## Develop

```
npm install
npm run dev
```

## Build

```
npm run build
```

Outputs a static `dist/` bundle — deployable anywhere that serves static files
(this repo deploys to Vercel with zero configuration).

## Notes

- Auth, and the Past Projects list, persist to `localStorage` — there's no backend
  yet, so data resets if storage is cleared.
- Enquiry data (`src/data.js`) is seed/sample data standing in for a real API.
- The sidebar collapses into an off-canvas drawer with a hamburger toggle below
  960px, and the layout reflows further below 640px.
