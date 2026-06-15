# Frontend PR Review Instructions

Use these rules when reviewing pull requests for this repository.

## Source Of Truth
- Follow .github/instructions/frontend-review.instructions.md
- Follow CLAUDE.md
- Follow review.md

## General Review Checklist

### 1. Code Quality & Maintainability
- Clean code principles followed
- Components are small and focused (Single Responsibility)
- Consistent naming and code style
- No duplication
- File sizes are reasonable for component, hook, service, and utility files

### 2. Architecture - Feature-Sliced Design (FSD) / Domain-Driven Structure
- Project follows Feature-Sliced Design
- Code is organized by features or domains, not by type only
- Layer boundaries are respected: app, pages, widgets, features, entities, shared
- Public APIs are enforced through index.ts files
- No deep imports or cross-layer violations

### 3. React Best Practices
- Functional components and hooks only
- Hooks are used correctly
- Memoization and dependency arrays are correct

### 4. Data Fetching - TanStack Query
- TanStack Query is used for server state
- Query keys are structured and stable
- Mutations handle invalidation or optimistic updates correctly

### 5. React Server Components (RSC) & Next.js
- If applicable to the changed code, use server-first patterns and client boundaries correctly

### 6. State Management
- Local state: useState
- Server state: TanStack Query
- Global client state: Zustand or Jotai

### 7. Performance, Accessibility & Security
- Avoid unnecessary re-renders and expensive work in render
- Strong accessibility practices
- Strict TypeScript (no any)
- No XSS risks or unsafe HTML rendering

## Required Review Output
Always include these sections in this exact order:

1. Summary
2. Code Quality
3. Security
4. Performance
5. React Patterns
6. Testing
7. Accessibility
8. SOLID Principles
9. Final Verdict

If a section has no issues, write: No major issues found.

For each Critical or High issue:
- Include file path and line reference
- Explain why it matters
- Provide a concrete fix

Review changed files first, and use surrounding files only for context.

