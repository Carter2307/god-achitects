# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Production build (outputs to ./build)
npm run start        # Start production server
npm run typecheck    # Generate React Router types + TypeScript check
```

No test or lint scripts configured.

## Architecture

React Router 7 full-stack app with SSR enabled. Uses TypeScript strict mode.

**Path alias:** `~/*` maps to `./app/*`

### Key Directories

- `app/routes/` - Page components (file-based routing via `app/routes.ts`)
- `app/ui/` - Reusable UI components using CVA for variants
- `app/hooks/` - Custom hooks, primarily API data fetching
- `app/lib/` - Utilities and axios configuration
- `app/providers/` - React context providers (TanStack Query)

### Data Fetching Pattern

TanStack Query + Axios for all API calls. Generic hooks in `app/hooks/use-api.ts`:
- `useApiQuery<T>` - GET requests with caching
- `useApiMutation<TData, TVariables>` - POST requests
- `useApiPut<TData, TVariables>` - PUT requests
- `useApiDelete<TData>` - DELETE requests
- `useInvalidateQueries()` - Cache invalidation

Axios instance (`app/lib/axios.ts`) includes:
- Bearer token from localStorage automatically injected
- 401 responses trigger logout and redirect to `/login`
- Base URL from `VITE_API_URL` env var (defaults to `/api`)

### UI Components

Components in `app/ui/` use class-variance-authority (CVA) for variants. Button has variants: default, destructive, outline, secondary, ghost, link. Sizes: sm, default, lg.

### Styling

Tailwind CSS v4 with theme variables defined in `app/app.css`. Supports dark mode via `prefers-color-scheme`.

## Environment Variables

- `VITE_API_URL` - API base URL (default: `/api`)