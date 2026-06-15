# Frontend (React) Code Review Guidelines

## Purpose
Ensure scalable, maintainable, performant, and consistent React/Next.js code across a **50-developer** team.

---

## 🔍 General Review Checklist

### 1. Code Quality & Maintainability
- [ ] Clean code principles followed
- [ ] Components are small and focused (Single Responsibility)
- [ ] Consistent naming and code style
- [ ] No duplication
- [ ] Files stay within the file-size guidelines below (oversized files usually signal a missing extraction or refactor)

#### File Size Guidelines
These are guidelines, not hard limits. Exceeding a range is a prompt to review the file for extraction or decomposition — not an automatic failure.

| File type          | Guideline (lines) |
|--------------------|-------------------|
| React Component    | 100–300           |
| Complex Component  | 300–500           |
| Service/API File   | 100–300           |
| Custom Hook        | 50–200            |
| Utility File       | 50–200            |

### 2. Architecture – Feature-Sliced Design (FSD) / Domain-Driven Structure
- [ ] Project strictly follows **Feature-Sliced Design (FSD)**
- [ ] Code organized by **features/domains** (not by type)
- [ ] Proper layer structure:
  - `app/`          → App setup, routing, providers, global styles
  - `processes/`    → Multi-step complex flows (optional)
  - `pages/`        → Page composition
  - `widgets/`      → Complex, self-contained UI blocks
  - `features/`     → Business use cases (e.g., `auth`, `checkout`, `dashboard`)
  - `entities/`     → Business entities (e.g., `user`, `product`, `order`)
  - `shared/`       → Reusable UI, utils, hooks, API, config, UI Kit
- [ ] Each slice has standard internal folders: `ui/`, `model/`, `api/`, `lib/`, `config/`
- [ ] Public API pattern enforced (`index.ts` barrel files only)
- [ ] No deep imports or cross-layer violations
- [ ] ESLint FSD rules are passing

### 3. React Best Practices
- [ ] Functional components with hooks only
- [ ] Proper `useState`, `useEffect`, `useCallback`, `useMemo`, `useRef`
- [ ] Strategic memoization and correct dependency arrays

### 4. Data Fetching – TanStack Query
- [ ] TanStack Query used for all server state
- [ ] Well-designed query keys (e.g. `['user', userId]`)
- [ ] Proper mutations, optimistic updates, and invalidation

### 5. React Server Components (RSC) & Next.js
- [ ] Server Components used by default
- [ ] `"use client"` only when necessary
- [ ] Server Actions preferred for mutations

### 6. State Management
- Local → `useState`
- Server → **TanStack Query**
- Global client → **Zustand** / **Jotai**

### 7. Performance, Accessibility & Security
- [ ] Proper memoization and virtualization
- [ ] Strong a11y practices
- [ ] Strict TypeScript (no `any`)
- [ ] No XSS risks

---

## 🛠️ ESLint + lint-staged Configuration for FSD Enforcement

Add this to your `.eslintrc.json` (or `.eslintrc.js`):

```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript"
  ],
  "plugins": ["import", "feature-sliced"],
  "rules": {
    "import/no-restricted-paths": [
      "error",
      {
        "zones": [
          { "target": "./src/entities", "from": "./src/features" },
          { "target": "./src/shared", "from": ["./src/features", "./src/entities", "./src/widgets"] }
        ]
      }
    ],
    "feature-sliced/layers-slices": "error",
    "feature-sliced/public-api": "error",
    "import/no-deep-import": "error"
  },
  "settings": {
    "import/resolver": {
      "typescript": true
    }
  }
}