# Frontend Coding Standards (React + TypeScript)

## General Rules
- Write clean, readable, and maintainable code
- Keep functions/components small (ideally < 40-50 lines)
- Use meaningful variable and function names
- Prefer explicit over implicit
- Always handle errors properly (loading/error states for every query)
- Add comments only when necessary (code should be self-documenting)

## Language Specific — TypeScript / React
- Use TypeScript strict mode; no `any` — type props, API responses, and store state explicitly.
- Functional components + hooks only (no class components).
- Server state goes through TanStack Query hooks in a feature's `api/` folder; never fetch in components.
- Client/session state lives in Zustand stores under `shared/stores/`; persisted stores use the
  `persist` middleware with an explicit `partialize`.
- Gate UI on permissions with `<Can>` (inline elements) and `PermissionGate` (routes) — never hand-roll
  permission checks in components.
- Style with Tailwind using the semantic CSS variables (`bg-background`, `text-foreground`,
  `bg-primary`, …); do not hard-code hex colors.
- Use the `@/` path aliases (`@/shared`, `@/features`, …) — no deep relative `../../..` imports.

## Architecture Preferences
- Follow SOLID principles; keep components loosely coupled; prefer composition over inheritance.
- Follow Feature-Sliced Design: a layer may only import from layers below it
  (`shared` → `features` → `widgets` → `pages` → `app`). An `entities` layer sits between `shared`
  and `features` in the convention (alias `@/entities` is reserved) but is **not currently used** —
  introduce it only when shared domain models emerge.
- Pages assemble features; features never import pages.
- Frontend permission checks are UX only — real security is enforced on the backend.
