## Quick context (what this repo is)

- Full-stack TypeScript portfolio site using Vite + React for the client and an Express-based API for runtime.
- Frontend lives in `client/` (Vite root). Server runtime code is in `api/` for serverless deployment and `server/` contains a small runner used for local dev.
- Shared DB schema and types live in `shared/schema.ts` and are used by server code via Drizzle ORM.

## Key commands

- npm run dev — start the full development environment (tsx runner runs `server/index.ts` which attaches Vite middleware in dev). Use this for local end-to-end dev.
- npm run build — builds the frontend (Vite) and bundles the server with esbuild to `dist/` (frontend out at `dist/public`, server bundle at `dist/index.js`).
- npm run start — run the production bundle (expects `dist/index.js`).
- npm run check — TypeScript typecheck via `tsc`.
- npm run db:push — push schema/migrations via `drizzle-kit push` (requires DATABASE_URL).

## Important environment variables

- DATABASE_URL — required by `api/db.ts` (Postgres + drizzle). Fails fast if missing.
- NODE_ENV — controls dev vs production behavior (plugins and middleware attach in dev).
- PORT — port used by local server runner (`server/index.ts`).
- REPL_ID — repo contains Replit-specific Vite plugins; when present the Cartographer plugin is enabled.

## Architecture & patterns (what to know)

- Client vs Server split
  - `client/` is the Vite root and exports a single-page React app (see `client/src/main.tsx` and `client/src/App.tsx`).
  - `api/` contains the Express app and serverless-friendly handlers (this is what gets deployed to serverless platforms such as Vercel).
  - `server/` contains a small HTTP runner used for local development which imports the `api` Express app and attaches Vite middleware in dev mode.

- Shared types & DB
  - `shared/schema.ts` is the single source of truth for database tables and Zod/Drizzle insert schemas. Use these types for end-to-end type-safety between server and DB.
  - `api/db.ts` wires a Postgres `pg` Pool + drizzle-orm (`drizzle-orm/node-postgres`).

- Import aliases (affects code-gen and refactors)
  - `@` -> `client/src`
  - `@shared` -> `shared`
  - `@assets` -> `attached_assets`
  Check `vite.config.ts` for the exact mapping. When editing server code, prefer explicit relative imports or match aliases used in each runtime.

## Project-specific conventions

- Server vs serverless: runtime code in `api/` must be compatible with serverless deployment (small handlers, no long-lived global state). The `server/` runner is only for local dev.
- DB schema changes: update `shared/schema.ts` (Drizzle) and run `npm run db:push` to apply. The repo uses Drizzle + drizzle-zod; prefer the `createInsertSchema` helpers already present.
- Frontend routing: uses `wouter` (see `client/src/App.tsx`). React Query is used for server communication (`@tanstack/react-query`). Look at `client/src/lib/queryClient.ts` for conventions around caching.
- Analytics & side-effects: `client/src/App.tsx` calls `initGA()` — global side effects like analytics are initialized at app root.

## Debugging & local dev tips

- To run the whole stack locally run `npm run dev` from the repo root (ensure NODE_ENV=development and DATABASE_URL set if you need DB access).
- If you only want to iterate on the frontend without the server middleware, run Vite from the client folder (tools expect the Vite `root` to be `client/`). The repo scripts wire this up automatically in `npm run dev`.

## Integration points / external deps to be aware of

- Database: Supabase Postgres (or any Postgres) + drizzle-orm. See `api/db.ts` and `shared/schema.ts`. Ensure `DATABASE_URL` is a valid Postgres connection string (Supabase recommended).
- File storage: `@google-cloud/storage` is included — search `api/` for usages when adding uploads.
- Third-party: Stripe identifiers may be stored on services/packages rows (see `services` table fields like `stripeProductId` and `stripePriceId`).

## Files to inspect first (fast onboarding)

- `package.json` — scripts and dependencies
- `vite.config.ts` — alias and root config
- `server/index.ts` — dev runner that attaches Vite middleware
- `api/index.ts` — main Express app (serverless entrypoints)
- `api/db.ts` — DB wiring for Postgres (pg) + drizzle
- `shared/schema.ts` — database schema and types (canonical source)
- `client/src/App.tsx` and `client/src/main.tsx` — frontend entry and top-level providers

## Examples (copyable patterns)

- Access DB: `import { db } from '../api/db';` — `api/db.ts` exports `db` (drizzle client) and expects `DATABASE_URL`.
- Use insert schema from shared: `import { insertServiceSchema } from '@shared/schema';` — use the pre-built Zod/Drizzle insert schemas for validation.

If anything is missing or a section looks wrong, tell me which area (build, DB, serverless, imports) and I'll iterate.
