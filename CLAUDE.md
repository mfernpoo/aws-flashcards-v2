# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All frontend commands run from `frontend/`:

```bash
npm install          # Install dependencies
npm run dev          # Start Vite dev server
npm run build        # TypeScript check + production build to frontend/dist
npm run preview      # Serve built bundle for smoke testing
npm run test         # Run Vitest (jsdom environment)
```

No dedicated lint or Prettier script exists. Use `npm run build` as a type-safety check for broader changes.

## Architecture

Monorepo with two services:

- **Frontend** (`frontend/`) — React 18 + TypeScript + Vite + TailwindCSS
- **Backend** — PocketBase (Go + SQLite), not checked in; configured via `swarm.yml`

### Hybrid local-first data model

Content (questions/answers) lives in **PocketBase** (cloud). Study progress (box number, next due date, streak) lives in **IndexedDB via Dexie** (local, per-device). These two data sources are merged in `useFlashcards` hook on mount, and PocketBase real-time subscriptions trigger reloads on content changes.

### Spaced repetition algorithm

Implements the Leitner System (5 boxes). Logic is in `src/utils/srs.ts` and tested in `src/utils/srs.test.ts`:
- **Hard (1):** returns to Box 1, review today
- **Good (2):** advances 1 box
- **Easy (3):** advances 2 boxes
- Box intervals: Box 1 = daily, Box 5 = biweekly
- "Learned" = Box 4+

### Key source layout

```
src/
├── App.tsx               # Router (/ → Study, /manage → Manage, /stats → Stats)
├── types.ts              # Shared TypeScript types
├── containers/           # Route-level smart components (own data fetching logic)
├── components/           # Presentational components; manage/ for card management UI
├── hooks/
│   ├── useFlashcards.ts  # Central state: fetches PocketBase + merges local progress
│   └── useDeckTransfer.ts
├── utils/
│   ├── db.ts             # Dexie database instance
│   ├── srs.ts            # Spaced repetition logic
│   ├── stats.ts          # Statistics calculations
│   └── deckTransfer.ts   # Import/export (XLSX via CDN)
├── lib/pocketbase.ts     # PocketBase client singleton
├── constants/domains.ts  # AWS domains/topics
└── data/seed.json        # Seed content
```

### Environment

Copy `frontend/.env.example` to `frontend/.env` for local dev:
```
VITE_POCKETBASE_URL=http://127.0.0.1:8090
```

### Deployment

Docker Swarm + Traefik. Frontend builds to a static Nginx image. PocketBase runs as a separate service. Secrets are managed via Docker Secrets (never commit credentials). See `swarm.yml`.

## Coding conventions

- Functional React components with explicit imports and semicolons
- `PascalCase` for components/containers, `camelCase` for hooks/utils
- Test files: `*.test.ts` / `*.test.tsx`, adjacent to source when practical
- Commit messages: short, imperative, in Spanish (e.g., `agrega validación`, `bug en srs`)
- One logical change per commit; don't mix refactors with features/fixes
- PRs for UI changes should include screenshots or recordings
