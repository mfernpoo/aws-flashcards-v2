# Repository Guidelines

## Project Structure & Module Organization
The checked-in application lives in `frontend/`, a React + TypeScript + Vite app. Source files are under `frontend/src`: shared UI in `src/components`, route-facing containers in `src/containers`, hooks in `src/hooks`, constants in `src/constants`, and persistence or sync helpers in `src/lib` and `src/utils`. Seed content is stored in `src/data/seed.json`. Test setup lives in `src/test`, and current unit tests follow the pattern `src/utils/*.test.ts`. Deployment configuration is kept at the repository root in `swarm.yml`.

## Build, Test, and Development Commands
Run frontend commands from `frontend/`.

- `npm install` installs project dependencies.
- `npm run dev` starts the local Vite dev server.
- `npm run build` runs `tsc` and outputs a production build to `frontend/dist`.
- `npm run preview` serves the built bundle for a final smoke check.
- `npm run test` runs Vitest with the `jsdom` environment configured in `vite.config.ts`.

## Coding Style & Naming Conventions
Use strict TypeScript and preserve the existing React style: functional components, explicit imports, and semicolon-terminated statements. Use `PascalCase` for components and containers (`StudyViewContainer.tsx`), `camelCase` for hooks and utilities (`useFlashcards.ts`, `deckTransfer.ts`), and keep test files adjacent to the code they cover when practical. Match the surrounding file’s formatting; there is no dedicated lint or Prettier script in this repo today.

## Testing Guidelines
Vitest and Testing Library are already configured. Add tests for utility logic, data transforms, and any behavior with regression risk. Name tests `*.test.ts` or `*.test.tsx`, mirror the source path when possible, and keep assertions focused on observable behavior. Run `npm run test` before opening a PR; run `npm run build` as a type-safety check for broader changes.

## Commit & Pull Request Guidelines
Recent history uses short, imperative summaries in Spanish, for example `cambio arquitectura` and `bug normalización prematura`. Keep commit messages brief, specific, and scoped to one change. PRs should include a concise description, testing notes, linked issues when applicable, and screenshots or short recordings for visible UI changes. Avoid mixing unrelated refactors with feature or bug-fix work.

## Configuration & Deployment Notes
Use `frontend/.env.example` as the baseline for local configuration. Do not commit secrets. If you touch deployment behavior, document the change against `swarm.yml` and verify any required PocketBase or Docker Swarm settings in the PR description.
