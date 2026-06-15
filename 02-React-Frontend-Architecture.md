# React Frontend Architecture

**Document Version:** 1.0
**Last Updated:** 2026-03-27
**Status:** Living Document
**Audience:** Frontend Engineers, Full-Stack Engineers, Architects

---

## Table of Contents

1. [Introduction & Goals](#1-introduction--goals)
2. [Project Structure with Vite + TypeScript](#2-project-structure-with-vite--typescript)
3. [Folder / File Organization (Feature-Based)](#3-folder--file-organization-feature-based)
4. [Component Architecture (Atomic Design)](#4-component-architecture-atomic-design)
5. [TypeScript Strict Mode Configuration](#5-typescript-strict-mode-configuration)
6. [State Management](#6-state-management)
7. [React Query (TanStack Query) for Server State](#7-react-query-tanstack-query-for-server-state)
8. [React Router v6+ Setup](#8-react-router-v6-setup)
9. [Form Handling: React Hook Form + Zod](#9-form-handling-react-hook-form--zod)
10. [UI Components: shadcn/ui + Tailwind CSS](#10-ui-components-shadcnui--tailwind-css)
11. [Axios Interceptors for API Calls](#11-axios-interceptors-for-api-calls)
12. [Authentication Flow](#12-authentication-flow)
13. [Error Boundaries and Error Handling](#13-error-boundaries-and-error-handling)
14. [Code Splitting and Lazy Loading](#14-code-splitting-and-lazy-loading)
15. [Performance Optimization](#15-performance-optimization)
16. [Testing: Vitest + React Testing Library + Playwright](#16-testing-vitest--react-testing-library--playwright)
17. [Accessibility (WCAG 2.1 AA)](#17-accessibility-wcag-21-aa)
18. [PWA Configuration](#18-pwa-configuration)
19. [Environment Configuration](#19-environment-configuration)
20. [ESLint + Prettier + Husky](#20-eslint--prettier--husky)
21. [Build Optimization with Vite](#21-build-optimization-with-vite)
22. [Code Examples Reference](#22-code-examples-reference)
23. [Scaling to 50+ Developers (Enterprise Strategy)](#23-scaling-to-50-developers-enterprise-strategy)

---

## 1. Introduction & Goals

### Purpose

This document defines the frontend architecture for the React 19 + TypeScript SPA. It establishes patterns, conventions, and decisions that all frontend engineers must follow.

### Architectural Goals

| Goal | Implementation |
|------|---------------|
| **Type Safety** | TypeScript strict mode end-to-end, Zod for runtime validation |
| **Performance** | Code splitting, lazy loading, virtualization, output caching |
| **Maintainability** | Feature-based folder structure, Atomic Design, clear component contracts |
| **Developer Experience** | Fast HMR via Vite, typed API hooks, component library |
| **Accessibility** | WCAG 2.1 AA compliance baked in via shadcn/ui + aria attributes |
| **Testability** | Pure components, dependency injection via props/context, mock-friendly |
| **i18n Ready** | react-i18next integrated from day one, no hardcoded strings |

### Tech Stack Rationale

**Vite over CRA:** Create React App is no longer maintained. Vite offers dramatically faster build times (10-100x), native ESM, and better plugin ecosystem.

**shadcn/ui over MUI/Ant Design:** shadcn/ui gives you the component source code — it's not a dependency. Full control over styling, zero vendor lock-in, built on Radix UI primitives for accessibility.

**TanStack Query over Redux for server state:** Redux was designed for client state. Using it to cache API data leads to enormous boilerplate and manual cache invalidation. TanStack Query was built exactly for this use case.

**Zustand over Redux for client state:** Redux has too much boilerplate for pure client state (modals, notifications, user preferences). Zustand is minimal, has great TypeScript support, and is easy to test.

---

## 2. Project Structure with Vite + TypeScript

### Initial Setup

```bash
# Create project
pnpm create vite myapp --template react-ts

# Install core dependencies
pnpm add react-router-dom @tanstack/react-query @tanstack/react-query-devtools
pnpm add zustand axios
pnpm add react-hook-form @hookform/resolvers zod
pnpm add i18next react-i18next i18next-browser-languagedetector i18next-http-backend
pnpm add class-variance-authority clsx tailwind-merge

# Dev dependencies
pnpm add -D typescript @types/react @types/react-dom
pnpm add -D tailwindcss postcss autoprefixer
pnpm add -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom
pnpm add -D playwright @playwright/test
pnpm add -D eslint @eslint/js typescript-eslint eslint-plugin-react-hooks
pnpm add -D prettier eslint-config-prettier
pnpm add -D husky lint-staged
```

### `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@features': path.resolve(__dirname, './src/features'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@types': path.resolve(__dirname, './src/types'),
      '@store': path.resolve(__dirname, './src/store'),
      '@api': path.resolve(__dirname, './src/api'),
    },
  },
  build: {
    target: 'esnext',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'query': ['@tanstack/react-query'],
          'forms': ['react-hook-form', 'zod'],
          'i18n': ['i18next', 'react-i18next'],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/'],
    },
  },
});
```

---

## 3. Folder / File Organization (Feature-Based)

```
src/
├── app/                          # App-level setup
│   ├── App.tsx                   # Root component
│   ├── providers.tsx             # All providers composed here
│   └── router.tsx                # Route definitions
│
├── components/                   # Shared/generic UI components (Atomic Design atoms/molecules)
│   ├── ui/                       # shadcn/ui generated components
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── table.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── AppLayout.tsx         # Main app shell (sidebar, header, footer)
│   │   ├── AuthLayout.tsx        # Auth pages layout
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   ├── feedback/
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorMessage.tsx
│   │   ├── EmptyState.tsx
│   │   └── Toast.tsx
│   └── data-display/
│       ├── DataTable.tsx         # Generic paginated table
│       ├── Badge.tsx
│       └── Avatar.tsx
│
├── features/                     # Feature modules (vertical slices)
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── ForgotPasswordForm.tsx
│   │   ├── hooks/
│   │   │   ├── useLogin.ts
│   │   │   └── useCurrentUser.ts
│   │   ├── api/
│   │   │   └── authApi.ts
│   │   ├── store/
│   │   │   └── authStore.ts
│   │   ├── types/
│   │   │   └── auth.types.ts
│   │   └── index.ts              # Public API of this feature
│   │
│   ├── users/
│   │   ├── components/
│   │   │   ├── UsersList.tsx
│   │   │   ├── UserCard.tsx
│   │   │   ├── UserForm.tsx
│   │   │   └── UserDetailPanel.tsx
│   │   ├── hooks/
│   │   │   ├── useUsers.ts
│   │   │   └── useCreateUser.ts
│   │   ├── api/
│   │   │   └── usersApi.ts
│   │   ├── types/
│   │   │   └── user.types.ts
│   │   └── index.ts
│   │
│   └── products/
│       └── ...
│
├── hooks/                        # Shared custom hooks
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   ├── usePagination.ts
│   ├── useMediaQuery.ts
│   └── useKeyboardShortcut.ts
│
├── lib/                          # Utilities and helpers
│   ├── axios.ts                  # Axios instance + interceptors
│   ├── i18n.ts                   # i18next configuration
│   ├── queryClient.ts            # TanStack Query client
│   ├── utils.ts                  # General utilities (cn, formatDate, etc.)
│   └── constants.ts              # App-wide constants
│
├── store/                        # Zustand stores (global client state only)
│   ├── uiStore.ts                # Modals, sidebar, theme
│   ├── notificationStore.ts      # Toast notifications
│   └── tenantStore.ts            # Current tenant context
│
├── types/                        # Shared TypeScript types
│   ├── api.types.ts              # API response shapes
│   ├── pagination.types.ts
│   └── common.types.ts
│
├── pages/                        # Route-level page components (thin, compose features)
│   ├── dashboard/
│   │   └── DashboardPage.tsx
│   ├── users/
│   │   ├── UsersPage.tsx
│   │   └── UserDetailPage.tsx
│   └── settings/
│       └── SettingsPage.tsx
│
└── test/
    ├── setup.ts                  # Global test setup
    ├── mocks/
    │   ├── handlers.ts           # MSW request handlers
    │   └── server.ts             # MSW server
    └── utils/
        └── renderWithProviders.tsx
```

### Example: `features/users/types/user.types.ts`

Every feature's `types/` folder follows the same pattern — domain model, API payloads, API responses, and filters. Below is the full contents of `user.types.ts` to show what belongs in a feature's type file.

```typescript
// ─────────────────────────────────────────────────────────
// 1. Domain model — the User entity
// ─────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "teacher" | "student";
  tenantId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────────────────
// 2. API request payloads
// ─────────────────────────────────────────────────────────
export interface CreateUserPayload {
  email: string;
  name: string;
  role: User["role"];
  password: string;
}

export interface UpdateUserPayload {
  name?: string;
  role?: User["role"];
  isActive?: boolean;
}

// ─────────────────────────────────────────────────────────
// 3. API response shapes
// ─────────────────────────────────────────────────────────
export interface UsersListResponse {
  data: User[];
  total: number;
  page: number;
  pageSize: number;
}

// ─────────────────────────────────────────────────────────
// 4. Query filters / params
// ─────────────────────────────────────────────────────────
export interface UserFilters {
  search?: string;
  role?: User["role"];
  isActive?: boolean;
  page?: number;
  pageSize?: number;
}
```

### How the model flows through the feature

```
user.types.ts  (defines User)
      │
      ├──→ usersApi.ts        : async getUsers(): Promise<UsersListResponse>
      │         │
      │         ↓
      ├──→ useUsers.ts        : useQuery<UsersListResponse>(...)
      │         │
      │         ↓
      └──→ UsersList.tsx      : users.map((u: User) => <UserCard user={u} />)
                │
                ↓
            UserCard.tsx      : props: { user: User }
```

**One definition, many consumers.** Change the `User` interface in one place and every component, hook, and API function picks it up through TypeScript.

### What `index.ts` exposes (the feature's public API)

```typescript
// features/users/index.ts — controlled public surface
export { UsersList } from "./components/UsersList";
export { UserCard } from "./components/UserCard";
export { useUsers } from "./hooks/useUsers";
export type { User } from "./types/user.types";  // only User is public
```

Other features can do `import { User } from "@/features/users"` — but they **cannot** reach `CreateUserPayload` or `UpdateUserPayload` because those are internal to the users feature.

### Apply the same pattern to every feature

| Feature | Type file | Domain model | Payloads | Response |
|---|---|---|---|---|
| `auth` | `auth.types.ts` | `User`, `Session` | `LoginCredentials`, `RegisterPayload` | `LoginResponse` |
| `users` | `user.types.ts` | `User` | `CreateUserPayload`, `UpdateUserPayload` | `UsersListResponse` |
| `products` | `product.types.ts` | `Product` | `CreateProductPayload`, `UpdateProductPayload` | `ProductsListResponse` |
| `orders` | `order.types.ts` | `Order`, `OrderItem` | `CreateOrderPayload` | `OrdersListResponse` |

> **Rule:** if a type is used by **only one feature**, keep it in `features/<name>/types/`. If it's used by **two or more features**, promote it to `src/types/`.

---

## 3.1 ViewModel Pattern (Model → ViewModel → Component)

The `User` interface defined in `user.types.ts` is the **Domain Model** — it mirrors the API/backend shape. But the UI rarely wants raw API data. It usually wants computed, flattened, or formatted values. That's what a **ViewModel** is for.

> **Use a ViewModel when the UI needs a different shape than the API gives you. Skip it when Model and UI shape are already the same.**

### When to introduce a ViewModel

| Situation | Example |
|---|---|
| UI needs **computed/derived** fields | `fullName`, `isOverdue`, `daysSinceJoined`, formatted dates |
| UI **flattens nested** API data | API gives `user.address.city`; table needs flat `city` |
| UI **combines multiple models** | Dashboard row mixing `User` + `LastOrder` + `Subscription` |
| Same data displayed **differently** in two screens | List view vs detail view need different shapes |
| You want UI **stable against API changes** | API rename shouldn't break every component |

### When NOT to bother

- Simple CRUD where the API shape is already what the UI displays.
- One-to-one mapping — a VM only duplicates the Model.
- Single screen using a model — add it later when a second consumer appears.

> **Rule of thumb:** Start with the Model. Introduce a ViewModel the moment you write your second `.map(u => ({ ...u, fullName: ... }))` for the same entity.

### Naming convention

Pick **one** and stay consistent across the codebase:

| Name | Style | Best for |
|---|---|---|
| `UserVM`, `UserListVM` | MVVM-explicit | Teams from Angular / .NET / iOS backgrounds |
| `UserView` | Shorter | Small codebases |
| `UserListItem`, `UserCardData` | Component-scoped | When VM is used by exactly one component |
| `UserPresentation` | Intent-clear | Pure display-only data |

**Recommended for this project:** `UserVM` / `UserListVM` / `UserDetailVM` — explicit and matches the MVVM mental model.

> Avoid the term **DTO** for ViewModels. DTO usually means the wire format on the backend.

### Folder layout when using ViewModels

```
features/users/
├── types/
│   ├── user.types.ts          # Domain Model (User) — matches API
│   └── user.vm.ts             # ViewModels (UserListVM, UserDetailVM)
├── mappers/
│   └── user.mapper.ts         # toUserListVM(user: User): UserListVM
├── hooks/
│   └── useUsers.ts            # returns UserListVM[], not User[]
├── api/
│   └── usersApi.ts            # returns raw User from API
└── components/
    └── UsersList.tsx          # props: { users: UserListVM[] }
```

### Step 1 — Define the ViewModel

```typescript
// features/users/types/user.vm.ts
export interface UserListVM {
  id: string;
  fullName: string;          // computed: firstName + " " + lastName
  email: string;
  roleLabel: string;         // computed: "Administrator" / "Teacher" / "Student"
  location: string;          // flattened: address.city + ", " + address.country
  joinedAgo: string;         // computed: "3 months ago"
  statusBadge: "active" | "inactive";
}

export interface UserDetailVM extends UserListVM {
  phone: string;
  lastLoginAgo: string;
  permissions: string[];
}
```

### Step 2 — Write a mapper (the only place that knows both shapes)

```typescript
// features/users/mappers/user.mapper.ts
import { formatDistanceToNow } from "date-fns";
import type { User } from "../types/user.types";
import type { UserListVM, UserDetailVM } from "../types/user.vm";

const ROLE_LABELS: Record<User["role"], string> = {
  admin: "Administrator",
  teacher: "Teacher",
  student: "Student",
};

export const toUserListVM = (u: User): UserListVM => ({
  id: u.id,
  fullName: `${u.firstName} ${u.lastName}`,
  email: u.email,
  roleLabel: ROLE_LABELS[u.role],
  location: `${u.address.city}, ${u.address.country}`,
  joinedAgo: formatDistanceToNow(new Date(u.createdAt), { addSuffix: true }),
  statusBadge: u.isActive ? "active" : "inactive",
});

export const toUserDetailVM = (u: User): UserDetailVM => ({
  ...toUserListVM(u),
  phone: u.phone,
  lastLoginAgo: u.lastLoginAt
    ? formatDistanceToNow(new Date(u.lastLoginAt), { addSuffix: true })
    : "Never",
  permissions: u.permissions ?? [],
});
```

### Step 3 — Hook returns VMs, not raw models

```typescript
// features/users/hooks/useUsers.ts
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../api/usersApi";
import { toUserListVM } from "../mappers/user.mapper";

export const useUsers = () => {
  const query = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    select: (response) => response.data.map(toUserListVM),  // ← VM transform
  });

  return query;  // query.data is UserListVM[]
};
```

> **Tip:** TanStack Query's `select` runs the mapper *only when data changes*, and memoizes the result — so this is free in re-renders.

### Step 4 — Components never see the raw model

```typescript
// features/users/components/UsersList.tsx
import { useUsers } from "../hooks/useUsers";
import type { UserListVM } from "../types/user.vm";

export const UsersList = () => {
  const { data: users = [], isLoading } = useUsers();
  if (isLoading) return <LoadingSpinner />;

  return (
    <table>
      <thead>
        <tr><th>Name</th><th>Role</th><th>Location</th><th>Joined</th></tr>
      </thead>
      <tbody>
        {users.map((u) => <UserRow key={u.id} user={u} />)}
      </tbody>
    </table>
  );
};

const UserRow = ({ user }: { user: UserListVM }) => (
  <tr>
    <td>{user.fullName}</td>
    <td>{user.roleLabel}</td>
    <td>{user.location}</td>
    <td>{user.joinedAgo}</td>
  </tr>
);
```

### Reverse mapping — Form → API payload

The same pattern applies when sending data back. Form state is a "form ViewModel"; mapper converts it to the API payload:

```typescript
// features/users/types/user.vm.ts
export interface UserFormVM {
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "teacher" | "student";
  password: string;
}

// features/users/mappers/user.mapper.ts
export const toCreateUserPayload = (form: UserFormVM): CreateUserPayload => ({
  email: form.email.trim().toLowerCase(),
  name: `${form.firstName} ${form.lastName}`.trim(),
  role: form.role,
  password: form.password,
});
```

### Data flow summary

```
   API (raw JSON)
         │
         ▼
  ┌─────────────┐
  │  usersApi   │  returns User (Domain Model)
  └─────────────┘
         │
         ▼
  ┌─────────────┐
  │   mapper    │  toUserListVM(user) / toUserDetailVM(user)
  └─────────────┘
         │
         ▼
  ┌─────────────┐
  │  useUsers   │  returns UserListVM[]
  └─────────────┘
         │
         ▼
  ┌─────────────┐
  │ UsersList   │  props: UserListVM[] — never sees raw User
  └─────────────┘
```

### Trade-offs

| Pro | Con |
|---|---|
| Components stay "dumb" — no formatting logic scattered | Extra files per feature (types + vm + mapper) |
| API rename → only mapper changes, components untouched | VM can drift from Model if not maintained |
| Mappers are trivially unit-testable | Discipline needed — never bypass the mapper |
| Form VMs simplify validation libraries (Zod, RHF) | Small wins not worth it for trivial features |

### Testing mappers

Mappers are pure functions — easy to test:

```typescript
// features/users/mappers/user.mapper.test.ts
import { toUserListVM } from "./user.mapper";

describe("toUserListVM", () => {
  it("computes fullName from firstName + lastName", () => {
    const vm = toUserListVM({ firstName: "Jane", lastName: "Doe", ... });
    expect(vm.fullName).toBe("Jane Doe");
  });

  it("maps admin role to 'Administrator' label", () => {
    const vm = toUserListVM({ role: "admin", ... });
    expect(vm.roleLabel).toBe("Administrator");
  });
});
```

### Decision checklist for a new feature

Before adding a `*.vm.ts` to a feature, ask:

1. Does the UI need any field the API doesn't directly provide? *(computed, derived, formatted)*
2. Does the UI flatten or restructure nested API data?
3. Will the same entity be shown in more than one place with different shapes?
4. Is API change risk high enough to want a translation layer?

**If "yes" to 2+ → add a ViewModel.**
**If "no" to all → use the Domain Model directly. Revisit later.**

---

## 4. Component Architecture (Atomic Design)

### Hierarchy

```
Pages (routes)
  └── Templates (layouts)
        └── Organisms (feature-level composed components)
              └── Molecules (reusable composed components)
                    └── Atoms (primitives: Button, Input, Badge)
```

### Atom Example (Button from shadcn/ui extended)

```typescript
// components/ui/button.tsx
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loadingText?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading, loadingText, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            {loadingText ?? children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = 'Button';
```

### Molecule Example (Search Input with Debounce)

```typescript
// components/molecules/SearchInput.tsx
import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchInputProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  debounceMs?: number;
  initialValue?: string;
  className?: string;
}

export function SearchInput({
  placeholder = 'Search...',
  onSearch,
  debounceMs = 300,
  initialValue = '',
  className,
}: SearchInputProps) {
  const [value, setValue] = useState(initialValue);
  const debouncedValue = useDebounce(value, debounceMs);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  return (
    <div className={cn('relative', className)}>
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-9"
        aria-label={placeholder}
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
          onClick={() => setValue('')}
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
```

---

## 5. TypeScript Strict Mode Configuration

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Strict */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,

    /* Paths */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@features/*": ["./src/features/*"],
      "@components/*": ["./src/components/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@lib/*": ["./src/lib/*"],
      "@types/*": ["./src/types/*"],
      "@store/*": ["./src/store/*"],
      "@api/*": ["./src/api/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Common TypeScript Patterns

```typescript
// Discriminated unions for API states
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

// Branded types for IDs
type UserId = string & { readonly brand: unique symbol };
type TenantId = string & { readonly brand: unique symbol };

const createUserId = (id: string): UserId => id as UserId;

// Utility types for API responses
type ApiResponse<T> = {
  data: T;
  message?: string;
  correlationId: string;
};

type PaginatedResponse<T> = ApiResponse<{
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}>;
```

---

## 6. State Management

### Decision: TanStack Query + Zustand

**Rule:** If it comes from the server, use TanStack Query. If it's purely UI state (modal open/closed, sidebar collapsed, notification toasts), use Zustand.

```
State Management Decision Tree:
─────────────────────────────
Does the state come from/sync with an API?
  YES → TanStack Query (handles caching, invalidation, loading, error states)
  NO  → Is it used in more than one component?
          YES → Zustand store
          NO  → Local useState
```

### Zustand Store Pattern

```typescript
// store/uiStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface UIState {
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark' | 'system';
  activeModal: string | null;
  modalData: Record<string, unknown>;
}

interface UIActions {
  toggleSidebar: () => void;
  setTheme: (theme: UIState['theme']) => void;
  openModal: (modalId: string, data?: Record<string, unknown>) => void;
  closeModal: () => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      immer((set) => ({
        // State
        sidebarCollapsed: false,
        theme: 'system',
        activeModal: null,
        modalData: {},

        // Actions
        toggleSidebar: () =>
          set((state) => {
            state.sidebarCollapsed = !state.sidebarCollapsed;
          }),

        setTheme: (theme) =>
          set((state) => {
            state.theme = theme;
          }),

        openModal: (modalId, data = {}) =>
          set((state) => {
            state.activeModal = modalId;
            state.modalData = data;
          }),

        closeModal: () =>
          set((state) => {
            state.activeModal = null;
            state.modalData = {};
          }),
      })),
      {
        name: 'ui-store',
        partialize: (state) => ({
          sidebarCollapsed: state.sidebarCollapsed,
          theme: state.theme,
        }),
      }
    ),
    { name: 'UIStore' }
  )
);
```

---

## 7. React Query (TanStack Query) for Server State

### Query Client Configuration

```typescript
// lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,        // Data is fresh for 5 minutes
      gcTime: 10 * 60 * 1000,          // Cache for 10 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof ApiError && error.status < 500) return false;
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error) => {
        // Global mutation error handler
        console.error('Mutation error:', error);
      },
    },
  },
});
```

### Query Keys Factory Pattern

```typescript
// features/users/api/usersApi.ts
export const usersKeys = {
  all: ['users'] as const,
  lists: () => [...usersKeys.all, 'list'] as const,
  list: (filters: UsersFilters) => [...usersKeys.lists(), filters] as const,
  details: () => [...usersKeys.all, 'detail'] as const,
  detail: (id: string) => [...usersKeys.details(), id] as const,
};

// Usage in hooks
export function useUsers(filters: UsersFilters) {
  return useQuery({
    queryKey: usersKeys.list(filters),
    queryFn: () => fetchUsers(filters),
    placeholderData: keepPreviousData, // Prevents loading flash on pagination
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: () => fetchUser(id),
    enabled: Boolean(id),
  });
}

export function useCreateUser() {
  return useMutation({
    mutationFn: (data: CreateUserRequest) => createUser(data),
    onSuccess: () => {
      // Invalidate all user list queries
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
  });
}

export function useUpdateUser() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      updateUser(id, data),
    onMutate: async ({ id, data }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: usersKeys.detail(id) });
      const previousUser = queryClient.getQueryData<UserDto>(usersKeys.detail(id));

      queryClient.setQueryData<UserDto>(usersKeys.detail(id), (old) =>
        old ? { ...old, ...data } : old
      );

      return { previousUser };
    },
    onError: (_, { id }, context) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(usersKeys.detail(id), context.previousUser);
      }
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.detail(id) });
    },
  });
}
```

---

## 8. React Router v6+ Setup

### Router Configuration with Lazy Loading

```typescript
// app/router.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';

// Lazy load page-level components
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));
const UsersPage = lazy(() => import('@/pages/users/UsersPage'));
const UserDetailPage = lazy(() => import('@/pages/users/UserDetailPage'));
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
    ],
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <DashboardPage /> },
      {
        path: 'users',
        children: [
          { index: true, element: <UsersPage /> },
          { path: ':userId', element: <UserDetailPage /> },
        ],
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute requiredPermission="settings:read">
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export function AppRouter() {
  return (
    <Suspense fallback={<LoadingSpinner fullPage />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
```

### Protected Route Component

```typescript
// features/auth/components/ProtectedRoute.tsx
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: string;
}

export function ProtectedRoute({
  children,
  requiredPermission,
  requiredRole,
}: ProtectedRouteProps) {
  const { isAuthenticated, hasPermission, hasRole, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <LoadingSpinner fullPage />;

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/forbidden" replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <>{children}</>;
}
```

---

## 9. Form Handling: React Hook Form + Zod

### Zod Schema (Shared validation logic)

```typescript
// features/users/types/user.types.ts
import { z } from 'zod';

export const createUserSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(256, 'Email must not exceed 256 characters'),
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name must not exceed 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name contains invalid characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(100),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  roles: z.array(z.string()).min(1, 'At least one role must be selected'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
```

### Form Component with React Hook Form

```typescript
// features/users/components/CreateUserForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateUser } from '../hooks/useCreateUser';
import { createUserSchema, type CreateUserFormData } from '../types/user.types';

export function CreateUserForm({ onSuccess }: { onSuccess: () => void }) {
  const { mutate: createUser, isPending, error } = useCreateUser();
  const { t } = useTranslation('users');

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    reset,
    setError,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    mode: 'onBlur', // Validate on blur for better UX
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
      roles: [],
    },
  });

  const onSubmit = (data: CreateUserFormData) => {
    createUser(
      {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
        roles: data.roles,
      },
      {
        onSuccess: () => {
          reset();
          onSuccess();
        },
        onError: (err) => {
          if (err instanceof ApiError && err.status === 409) {
            setError('email', { message: t('errors.emailAlreadyExists') });
          }
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label={t('createUser.formLabel')}>
      <div className="space-y-4">
        <FormField
          label={t('fields.email')}
          error={errors.email?.message}
          required
        >
          <Input
            {...register('email')}
            type="email"
            autoComplete="email"
            aria-describedby={errors.email ? 'email-error' : undefined}
            aria-invalid={!!errors.email}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label={t('fields.firstName')} error={errors.firstName?.message} required>
            <Input {...register('firstName')} autoComplete="given-name" />
          </FormField>
          <FormField label={t('fields.lastName')} error={errors.lastName?.message} required>
            <Input {...register('lastName')} autoComplete="family-name" />
          </FormField>
        </div>

        {error && (
          <div role="alert" className="text-destructive text-sm">
            {t('errors.createFailed')}
          </div>
        )}

        <Button
          type="submit"
          isLoading={isPending}
          loadingText={t('creating')}
          disabled={!isDirty || !isValid}
          className="w-full"
        >
          {t('createUser.submit')}
        </Button>
      </div>
    </form>
  );
}
```

---

## 10. UI Components: shadcn/ui + Tailwind CSS

### Tailwind Configuration

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // Tenant-customizable brand colors via CSS variables
        brand: {
          50: 'var(--brand-50)',
          500: 'var(--brand-500)',
          900: 'var(--brand-900)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
```

### cn Utility

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## 11. Axios Interceptors for API Calls

```typescript
// lib/axios.ts
import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/features/auth/store/authStore';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': 'en', // Will be overridden by i18n interceptor
  },
  withCredentials: true, // Send cookies (refresh token in httpOnly cookie)
  timeout: 30_000,
});

// Request interceptor: attach access token + language
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  const locale = i18n.language;
  config.headers['Accept-Language'] = locale;

  return config;
});

// Response interceptor: handle 401, retry logic
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = data.accessToken;
        useAuthStore.getState().setAccessToken(newToken);
        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        window.location.href = '/auth/login?reason=session_expired';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Transform error for consistent handling
    if (error.response) {
      throw new ApiError(
        error.response.status,
        (error.response.data as any)?.title ?? 'An error occurred',
        (error.response.data as any)?.detail,
        (error.response.data as any)?.correlationId
      );
    }

    throw error;
  }
);
```

---

## 12. Authentication Flow

### Auth Store

```typescript
// features/auth/store/authStore.ts
import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  user: CurrentUser | null;
  isAuthenticated: boolean;
  setAccessToken: (token: string) => void;
  setUser: (user: CurrentUser) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,

  setAccessToken: (token) => set({ accessToken: token, isAuthenticated: true }),

  setUser: (user) => set({ user }),

  logout: () => set({ accessToken: null, user: null, isAuthenticated: false }),

  hasPermission: (permission) => {
    const user = get().user;
    return user?.permissions.includes(permission) ?? false;
  },

  hasRole: (role) => {
    const user = get().user;
    return user?.roles.includes(role) ?? false;
  },
}));
```

### useAuth Hook

```typescript
// features/auth/hooks/useAuth.ts
export function useAuth() {
  const store = useAuthStore();
  const navigate = useNavigate();

  const login = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await apiClient.post<LoginResponse>('/auth/login', credentials);
      return data;
    },
    onSuccess: (data) => {
      store.setAccessToken(data.accessToken);
      store.setUser(data.user);
      navigate('/');
    },
  });

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      store.logout();
      queryClient.clear();
      navigate('/auth/login');
    }
  };

  return {
    ...store,
    login: login.mutate,
    isLoggingIn: login.isPending,
    loginError: login.error,
    logout,
  };
}
```

---

## 13. Error Boundaries and Error Handling

### Class-based Error Boundary

```typescript
// components/ErrorBoundary.tsx
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
  onError?: (error: Error, info: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, info);
    this.props.onError?.(error, info);
    // Send to error tracking (Sentry, etc.)
    trackError(error, { componentStack: info.componentStack });
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback ?? DefaultErrorFallback;
      return (
        <FallbackComponent
          error={this.state.error}
          reset={() => this.setState({ hasError: false, error: null })}
        />
      );
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center p-8">
      <h2 className="text-2xl font-bold text-destructive mb-2">Something went wrong</h2>
      <p className="text-muted-foreground mb-4">{error.message}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
```

---

## 14. Code Splitting and Lazy Loading

### Route-level Splitting (already shown in router setup)

### Component-level Splitting for Heavy Components

```typescript
// Lazy load heavy chart library only on dashboard
const ChartComponent = lazy(() =>
  import('./ChartComponent').then((module) => ({ default: module.ChartComponent }))
);

function DashboardPage() {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <ChartComponent data={chartData} />
    </Suspense>
  );
}
```

### Dynamic Imports for Feature Flags

```typescript
// Conditionally load premium features
async function loadPremiumFeature() {
  if (await featureFlags.isEnabled('premium-analytics')) {
    const { PremiumAnalytics } = await import('@features/premium-analytics');
    return PremiumAnalytics;
  }
  return null;
}
```

---

## 15. Performance Optimization

### Memoization Guidelines

```typescript
// useMemo: expensive computations (NOT for simple values)
const sortedUsers = useMemo(
  () => [...users].sort((a, b) => a.lastName.localeCompare(b.lastName)),
  [users] // Only recalculate when users changes
);

// useCallback: stable function references for child components
const handleUserSelect = useCallback(
  (userId: string) => {
    navigate(`/users/${userId}`);
  },
  [navigate]
);

// React.memo: prevent re-render when props haven't changed
const UserCard = React.memo(function UserCard({ user, onSelect }: UserCardProps) {
  return (
    <div onClick={() => onSelect(user.id)}>
      {user.firstName} {user.lastName}
    </div>
  );
});
// ONLY use React.memo if profiling shows unnecessary renders
```

### Virtual List for Large Datasets

```typescript
// components/VirtualUserList.tsx
import { useVirtualizer } from '@tanstack/react-virtual';

export function VirtualUserList({ users }: { users: UserDto[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: users.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64, // Estimated row height
    overscan: 5,
  });

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const user = users[virtualItem.index];
          return (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <UserCard user={user} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

---

## 16. Testing: Vitest + React Testing Library + Playwright

### Test Setup

```typescript
// test/setup.ts
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll } from 'vitest';
import { server } from './mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
afterAll(() => server.close());
```

### MSW Mock Handlers

```typescript
// test/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/v1/users', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? '1');

    return HttpResponse.json({
      items: mockUsers.slice((page - 1) * 20, page * 20),
      page,
      pageSize: 20,
      totalCount: mockUsers.length,
      totalPages: Math.ceil(mockUsers.length / 20),
    });
  }),

  http.post('/api/v1/users', async ({ request }) => {
    const body = await request.json() as CreateUserRequest;
    return HttpResponse.json({ id: crypto.randomUUID() }, { status: 201 });
  }),
];
```

### Component Test

```typescript
// features/users/components/__tests__/UsersList.test.tsx
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/utils/renderWithProviders';
import { UsersList } from '../UsersList';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';

describe('UsersList', () => {
  it('renders users from API', async () => {
    renderWithProviders(<UsersList />);

    expect(screen.getByRole('status')).toBeInTheDocument(); // Loading

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    const rows = screen.getAllByRole('row');
    expect(rows.length).toBeGreaterThan(1); // Header + data rows
  });

  it('shows empty state when no users', async () => {
    server.use(
      http.get('/api/v1/users', () =>
        HttpResponse.json({ items: [], page: 1, pageSize: 20, totalCount: 0, totalPages: 0 })
      )
    );

    renderWithProviders(<UsersList />);

    await waitFor(() => {
      expect(screen.getByText(/no users found/i)).toBeInTheDocument();
    });
  });

  it('filters users on search input', async () => {
    const user = userEvent.setup();
    renderWithProviders(<UsersList />);

    await waitFor(() => screen.getAllByRole('row'));

    const searchInput = screen.getByRole('searchbox');
    await user.type(searchInput, 'john');

    await waitFor(() => {
      // Verify the query was called with search param
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });
});
```

---

## 17. Accessibility (WCAG 2.1 AA)

### Core Principles Applied

1. **Keyboard Navigation:** All interactive elements are focusable and operable via keyboard
2. **Screen Reader Support:** Proper ARIA labels, roles, and live regions
3. **Color Contrast:** Minimum 4.5:1 ratio for normal text, 3:1 for large text
4. **Focus Management:** Focus is moved to new content after dynamic changes (modals, navigation)

```typescript
// Example: Accessible data table
export function DataTable<T>({ columns, data, caption }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto" role="region" aria-label={caption}>
      <table className="w-full" aria-label={caption}>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                aria-sort={col.sortable ? (sortConfig.key === col.key ? sortConfig.direction : 'none') : undefined}
                className="..."
              >
                {col.sortable ? (
                  <button
                    onClick={() => handleSort(col.key)}
                    className="flex items-center gap-1"
                    aria-label={`Sort by ${col.header}`}
                  >
                    {col.header}
                    <SortIcon direction={sortConfig.direction} />
                  </button>
                ) : (
                  col.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-muted/50">
              {columns.map((col) => (
                <td key={col.key}>{col.render(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## 18. PWA Configuration

```typescript
// vite.config.ts - add PWA plugin
import { VitePWA } from 'vite-plugin-pwa';

plugins: [
  react(),
  VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
    manifest: {
      name: 'MyApp',
      short_name: 'MyApp',
      description: 'Enterprise application',
      theme_color: '#ffffff',
      icons: [
        { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/api\.myapp\.com\//,
          handler: 'NetworkFirst',
          options: { cacheName: 'api-cache', expiration: { maxAgeSeconds: 60 * 5 } },
        },
      ],
    },
  }),
],
```

---

## 19. Environment Configuration

```bash
# .env (committed to source control - public values only)
VITE_APP_NAME=MyApp
VITE_API_BASE_URL=https://api.myapp.com

# .env.development (not committed)
VITE_API_BASE_URL=http://localhost:5000
VITE_FEATURE_FLAGS_ENABLED=true

# .env.production (not committed - injected in CI/CD)
VITE_API_BASE_URL=https://api.myapp.com
```

```typescript
// lib/env.ts - typed, validated environment access
const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url(),
  VITE_APP_NAME: z.string().default('MyApp'),
  MODE: z.enum(['development', 'staging', 'production']),
});

export const env = envSchema.parse({
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
  MODE: import.meta.env.MODE,
});
```

---

## 20. ESLint + Prettier + Husky

### ESLint Configuration

```javascript
// eslint.config.js
import js from '@eslint/js';
import tsEslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default tsEslint.config(
  { ignores: ['dist', 'node_modules', 'coverage'] },
  {
    extends: [js.configs.recommended, ...tsEslint.configs.strictTypeChecked],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: { project: true, tsconfigRootDir: import.meta.dirname },
    },
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  }
);
```

### Prettier Configuration

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSameLine": false,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### Husky + lint-staged

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,css,md}": ["prettier --write"]
  }
}
```

```bash
# .husky/pre-commit
pnpm lint-staged

# .husky/commit-msg
# Enforce conventional commits format
npx --no -- commitlint --edit ${1}
```

---

## 21. Build Optimization with Vite

### Manual Chunk Strategy

```typescript
// vite.config.ts - production optimizations
export default defineConfig({
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    sourcemap: true, // For error tracking
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Separate vendor chunks by library group
            if (id.includes('react') || id.includes('react-dom')) return 'react-vendor';
            if (id.includes('@radix-ui')) return 'radix-vendor';
            if (id.includes('@tanstack')) return 'query-vendor';
            if (id.includes('i18next')) return 'i18n-vendor';
            if (id.includes('zod') || id.includes('react-hook-form')) return 'forms-vendor';
            return 'vendor'; // All other node_modules
          }
        },
        // Content hash for cache busting
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
});
```

### Bundle Analysis

```bash
# Analyze bundle size
pnpm add -D rollup-plugin-visualizer

# In vite.config.ts
plugins: [
  react(),
  visualizer({
    filename: 'dist/stats.html',
    open: true,
    gzipSize: true,
  }),
]
```

---

## 22. Code Examples Reference

### Custom Hook Pattern

```typescript
// hooks/usePagination.ts
interface PaginationOptions {
  totalCount: number;
  pageSize?: number;
  initialPage?: number;
}

export function usePagination({ totalCount, pageSize = 20, initialPage = 1 }: PaginationOptions) {
  const [page, setPage] = useState(initialPage);
  const totalPages = Math.ceil(totalCount / pageSize);

  const goToPage = useCallback((newPage: number) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)));
  }, [totalPages]);

  const nextPage = useCallback(() => goToPage(page + 1), [page, goToPage]);
  const prevPage = useCallback(() => goToPage(page - 1), [page, goToPage]);

  return {
    page,
    pageSize,
    totalPages,
    totalCount,
    goToPage,
    nextPage,
    prevPage,
    hasPrev: page > 1,
    hasNext: page < totalPages,
  };
}
```

### Render With Providers Test Utility

```typescript
// test/utils/renderWithProviders.tsx
export function renderWithProviders(
  ui: React.ReactElement,
  {
    initialUser,
    initialRoute = '/',
    ...renderOptions
  }: { initialUser?: CurrentUser; initialRoute?: string } = {}
) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  if (initialUser) {
    useAuthStore.setState({ user: initialUser, isAuthenticated: true });
  }

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[initialRoute]}>
          {children}
        </MemoryRouter>
      </QueryClientProvider>
    );
  }

  return {
    queryClient,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
```

---

## 23. Scaling to 50+ Developers (Enterprise Strategy)

> Everything above this section works for a team of 5–15. Past ~20 active contributors, the things that break are **not** the React patterns — they're the *seams* between teams: merge conflicts, shared components diverging, CI minutes, who owns what, and the inevitable "who broke main again." This section is the operating model that keeps a single React product healthy at 50+ engineers.

### 23.1 The Scaling Problem (what actually breaks)

| Pain at 5 devs | Same pain at 50 devs |
|---|---|
| One PR per day | 30+ PRs per day; merge queue saturated |
| `Button` lives in `components/ui` | 6 teams each created their own `Button` |
| CI takes 4 min | CI takes 28 min; full re-build per PR |
| Tribal knowledge of "the auth flow" | Nobody owns auth; everyone touches it |
| One Slack channel | 11 sub-teams, no shared release calendar |
| `git pull` works | 200-file merge conflicts in `package.json` |

The fix is **not** "more rules." It's **architecture that enforces team boundaries automatically** + **tooling that makes the right thing the easy thing**.

### 23.2 Repository Strategy — Monorepo with Nx or Turborepo

For 50+ devs on a single product, use a **monorepo** with a build orchestrator. Polyrepo creates dependency hell; pure monorepo without tooling creates CI hell.

**Recommended:** [Nx](https://nx.dev) (richer for React) or [Turborepo](https://turbo.build) (simpler, faster cold caches). Pick one and don't mix.

```
myapp/
├── apps/
│   ├── web/                       # The React shell app (host)
│   ├── admin/                     # Internal admin SPA (separate deployable)
│   └── e2e/                       # Playwright suite
│
├── packages/
│   ├── ui/                        # Design System (shadcn-based) — owned by Platform team
│   ├── icons/                     # SVG icon set
│   ├── hooks/                     # Cross-feature shared hooks
│   ├── api-client/                # Generated TS client from OpenAPI
│   ├── auth/                      # Auth library (login, refresh, RBAC helpers)
│   ├── feature-flags/             # LaunchDarkly/Unleash wrapper
│   ├── tracking/                  # Sentry + analytics wrapper
│   ├── i18n/                      # Shared i18n resources + helpers
│   ├── eslint-config/             # Org-wide lint rules
│   ├── tsconfig/                  # Shared tsconfig presets
│   └── test-utils/                # renderWithProviders, MSW handlers
│
├── features/                      # Owned by product teams (one folder per team)
│   ├── billing/                   # @team-billing
│   ├── reporting/                 # @team-analytics
│   ├── inventory/                 # @team-supply-chain
│   ├── notifications/             # @team-platform
│   └── ...
│
├── tools/
│   ├── generators/                # Nx generators for "new feature", "new component"
│   └── scripts/                   # CI scripts
│
├── .github/
│   ├── CODEOWNERS                 # Enforces team ownership at PR review
│   └── workflows/
│
├── nx.json                        # Or turbo.json
├── pnpm-workspace.yaml
└── package.json
```

**Why this works:**
- **`packages/*`** = shared platform code, single source of truth, semver-versioned internally.
- **`features/*`** = team-owned vertical slices. Two teams cannot edit the same folder without explicit review.
- **Affected-only builds**: `nx affected --target=test` runs only the projects touched by a PR. CI stays under 10 minutes even with 100+ projects.
- **Distributed cache** (Nx Cloud / Turborepo Remote Cache) means CI never rebuilds something it built yesterday.

### 23.3 Team Boundaries — Feature Ownership + CODEOWNERS

Every folder in `features/` and `packages/` has a single owning team. The `CODEOWNERS` file enforces this at PR-review time — GitHub auto-requests the right reviewers.

```
# .github/CODEOWNERS

# Platform team owns shared infrastructure
/packages/ui/                 @org/team-platform @org/design-system
/packages/auth/               @org/team-platform-security
/packages/api-client/         @org/team-platform
/packages/feature-flags/      @org/team-platform
/.github/                     @org/team-platform
/nx.json                      @org/team-platform

# Product teams own their features
/features/billing/            @org/team-billing
/features/reporting/          @org/team-analytics
/features/inventory/          @org/team-supply-chain
/features/notifications/      @org/team-platform

# Architects review cross-cutting changes
/apps/web/src/app/router.tsx  @org/architects
/packages/tsconfig/           @org/architects
```

**Rule:** A feature team cannot reach into another feature's folder. If they need something from `features/billing`, they request a public export OR promote the shared logic to `packages/`. This is enforced by an ESLint rule:

```javascript
// packages/eslint-config/index.js
'no-restricted-imports': ['error', {
  patterns: [{
    group: ['@/features/*/internal/*', '@/features/*/components/*'],
    message: 'Import only from the feature index — internal modules are private.',
  }],
}],
```

### 23.4 Design System as a Versioned Package

The biggest 50-dev failure mode: **every team forks the Button**. Prevent it by treating the design system as a real product with its own roadmap, owner, and release cadence.

| Aspect | Approach |
|---|---|
| **Location** | `packages/ui/` — installed as `@org/ui` |
| **Ownership** | A dedicated Design System team (2–3 engineers + 1 designer) |
| **Versioning** | Semver via [Changesets](https://github.com/changesets/changesets); breaking changes require a major bump |
| **Distribution** | Built ESM + types; consumers tree-shake unused components |
| **Documentation** | Storybook deployed per-PR with Chromatic for visual regression |
| **Contribution model** | Feature teams open PRs; DS team reviews and merges within 2 days |
| **Theming** | CSS variables per tenant/brand — never hardcoded colors |

**Storybook is non-negotiable at this scale.** It is the contract between design and engineering and the only way 50 devs share a visual vocabulary without meetings.

```bash
# Visual regression in CI — fails the build if Button renders differently
pnpm chromatic --exit-zero-on-changes
```

### 23.5 API Contracts — Generated Client from OpenAPI

50 devs cannot hand-write 800 TypeScript interfaces and keep them in sync with the backend. Generate them.

```
Backend (NestJS / .NET / Spring) ──→ OpenAPI spec (openapi.json)
                                          │
                                          ▼
                              packages/api-client/ (generated)
                                          │
                                          ▼
                              features/billing/api/billingApi.ts (uses it)
```

**Toolchain:**
- Backend serves `/openapi.json` (and commits a snapshot to the repo).
- `packages/api-client/` runs [`openapi-typescript`](https://github.com/drwpow/openapi-typescript) or [`orval`](https://orval.dev) in its build step.
- Orval can generate full TanStack Query hooks: `useGetBillingInvoicesQuery()` is free.
- CI fails the PR if the committed OpenAPI snapshot diverges from the live backend.

**Result:** API rename → TypeScript compile error in every consuming feature, surfaced before merge. No "did anyone tell the frontend?" Slack threads.

### 23.6 Micro-Frontends — Only If You Actually Need Them

A common mistake is reaching for **Module Federation / micro-frontends** at 50 devs because "Spotify did it." Most of the time, a well-structured monorepo solves the same problems with **1/10th the complexity**.

**Stay in the monorepo when:**
- Single product, single domain, single release cadence
- Teams ship features daily; coordination is the *goal*, not the *enemy*
- One auth model, one design system

**Adopt micro-frontends when:**
- Independent deploy cadence per team is a hard requirement (e.g., regulated domain)
- Teams use genuinely different stacks (you have one React app + one Vue app + one legacy Angular app)
- You need runtime composition of third-party plugins (extensible platforms)
- Total monorepo CI exceeds 30 min even with affected-only builds

If you decide micro-frontends are worth it, use **Webpack/Rspack Module Federation** with a thin shell app, and **publish the design system as a CDN-loaded singleton** to avoid React/Radix duplication. Be honest about the cost: shared state, routing, and error handling all get harder.

### 23.7 CI/CD — Affected-Only, Parallel, Distributed

```yaml
# .github/workflows/ci.yml (sketch)
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - run: pnpm nx affected --target=lint --parallel=6

  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shard: [1, 2, 3, 4, 5]
    steps:
      - run: pnpm nx affected --target=test --parallel=4 --shard=${{ matrix.shard }}/5

  build:
    runs-on: ubuntu-latest
    steps:
      - run: pnpm nx affected --target=build --parallel=4

  e2e:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - run: pnpm nx affected --target=e2e --parallel=2

  visual-regression:
    runs-on: ubuntu-latest
    steps:
      - run: pnpm chromatic
```

**Non-negotiables at 50 devs:**
1. **Affected-only**: never run the full suite per PR. Use Nx/Turbo to compute the affected graph.
2. **Distributed cache** (Nx Cloud, Turborepo Remote Cache, or a self-hosted S3 cache). Cache hits should be > 80%.
3. **Parallel sharding** for tests and Playwright (10+ shards is normal).
4. **Merge queue** (GitHub Merge Queue or Aviator/Mergify) to serialize main-branch updates and prevent semantic conflicts.
5. **Preview environments per PR** (Vercel/Netlify/Cloudflare Pages) so reviewers click a link instead of pulling the branch.
6. **Bundle-size budgets per route** enforced in CI — `size-limit` fails the build if a feature crosses its budget.

### 23.8 Branching & Release Strategy

**Trunk-based development** with short-lived feature branches. Long-lived branches die at this scale — too many merge conflicts.

- Branches: `feat/<team>/<short-description>`, lifetime ≤ 3 days.
- All merges go through PR → merge queue → main.
- Releases: continuous deployment to staging on every main merge; production releases gated by feature flags, not branches.
- Hotfixes: `hotfix/...` branched from the production tag, fast-tracked through a slimmed CI.

**Versioning** with [Changesets](https://github.com/changesets/changesets):
- Every PR touching `packages/*` requires a changeset file describing the version bump.
- CI bot opens a "Version Packages" PR that, when merged, publishes to the internal npm registry.

### 23.9 Code Review & PR Workflow

| Rule | Why |
|---|---|
| Max PR size: 400 lines changed | Larger PRs get rubber-stamped — quality drops |
| Two approvals: one from owning team, one from a code-owner | CODEOWNERS handles the second automatically |
| Required checks: lint, type, unit, affected e2e, bundle-size, visual-regression | Block merge if any fails |
| PR template asks: "what changed, why, screenshots, rollback plan" | Forces shared context |
| No self-merge after approval; merge queue does it | Prevents "approved but rebase broke it" |
| Stale-PR bot closes PRs after 14 days of inactivity | Keeps the queue clean |

### 23.10 Documentation Strategy

At 50 devs, **undocumented decisions get re-litigated quarterly**. Three artifacts pay for themselves:

1. **ADRs (Architecture Decision Records)** in `/docs/adr/NNNN-title.md`. One per significant decision. Format: Context → Decision → Consequences. Reviewed in PRs.
2. **Storybook** for every component in `packages/ui/`. Deployed publicly inside the org.
3. **Feature README** in each `features/<name>/README.md`: owner, Slack channel, runbook, on-call rotation, key flows.

`CLAUDE.md` / `AGENTS.md` files in each package guide AI assistants and new joiners alike.

### 23.11 Feature Flags & Progressive Delivery

Without feature flags, 50 devs cannot ship to one trunk safely. With them, you decouple **deploy** from **release**.

- Use **LaunchDarkly**, **Unleash**, or **Statsig** — not a homegrown table.
- Wrap the SDK in `packages/feature-flags/` so swapping providers later is one file.
- Every new feature ships behind a flag, default-off in prod.
- Flags have an **owner** and a **kill date**. A linter (`piranha` or an Nx generator) reports stale flags weekly.

```typescript
// packages/feature-flags/src/useFlag.ts
export function useFlag(key: FlagKey): boolean {
  const client = useFlagClient();
  return client.getBooleanValue(key, false);
}

// In a feature
const showNewBillingUI = useFlag('billing.new-invoice-ui');
return showNewBillingUI ? <NewInvoiceTable /> : <LegacyInvoiceTable />;
```

### 23.12 Observability & Error Tracking

You cannot debug a 50-dev React app from `console.log`. Production needs three things:

| Layer | Tool |
|---|---|
| **Error tracking** | Sentry — source-mapped stack traces, release tagging, alert routing per team via `tags.feature` |
| **Real User Monitoring (RUM)** | Datadog RUM / Sentry Performance — Core Web Vitals per route, per tenant |
| **Session replay** | Sentry Replay / FullStory — opt-in, PII-masked, used for bug reproduction |

Wire it in `packages/tracking/` so every team auto-inherits the right tags:

```typescript
// packages/tracking/src/init.ts
Sentry.init({
  dsn: env.SENTRY_DSN,
  release: env.APP_VERSION,
  environment: env.MODE,
  integrations: [Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true })],
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.01,
  replaysOnErrorSampleRate: 1.0,
  beforeSend(event) {
    event.tags = { ...event.tags, team: detectOwningTeam(event) };
    return event;
  },
});
```

### 23.13 Onboarding & Developer Experience

A new joiner should be running the app and shipping their first PR within **one day**, not one week.

- `pnpm bootstrap` — a single script that installs deps, sets up `.env`, seeds local DB, runs migrations, starts mock auth.
- Devcontainers / GitHub Codespaces config committed so "works on my machine" is the default.
- Nx generators: `nx g feature billing/refunds` scaffolds the entire folder skeleton with types, hooks, components, tests, and storybook stories.
- A `/docs/onboarding.md` checklist with 12 items, including "post a `:wave:` in #frontend".
- **Internal architecture council**: a 30-min weekly office hour run by senior FE engineers — open to anyone, answers "where should this code live?" questions before they become bad PRs.

### 23.14 Performance Budgets — Owned, Not Aspirational

A bundle that grows 5KB per PR is 250KB heavier per year. Budgets only work if **someone is paged** when they break.

```json
// .size-limit.json
[
  { "name": "main bundle (gzipped)", "path": "dist/assets/index-*.js", "limit": "180 KB" },
  { "name": "billing route", "path": "dist/assets/billing-*.js", "limit": "60 KB" },
  { "name": "reporting route", "path": "dist/assets/reporting-*.js", "limit": "80 KB" }
]
```

Route-level budgets are owned by the team that owns the route. A budget overrun blocks the PR; the team either optimizes or files a one-time exception with the architecture council.

### 23.15 Governance — The Architecture Council

At 50 devs, you need a lightweight body to:
- Approve new dependencies (e.g., "do we really need a second date library?")
- Approve new packages added to the monorepo
- Resolve cross-team disputes (`features/billing` wants `features/inventory` to expose X)
- Own ADRs and the architecture roadmap
- Sunset deprecated patterns

**Recommended shape:** 1 staff/principal engineer + 1 senior per major team + design system lead. Meets bi-weekly for 45 min. Decisions are PRs against `/docs/adr/`.

### 23.16 The 50-Dev Checklist (TL;DR)

If you can answer **yes** to all of these, your React app is ready for 50+ developers:

- [ ] Monorepo with Nx or Turborepo, affected-only CI, distributed cache enabled
- [ ] `CODEOWNERS` enforces feature/package ownership per team
- [ ] Design system is a versioned package owned by a dedicated team, with Storybook + visual regression
- [ ] API client is **generated** from OpenAPI; backend changes are surfaced as TS compile errors
- [ ] Trunk-based development, merge queue, preview deploys per PR
- [ ] Feature flags from an SDK (not homegrown), with kill dates
- [ ] Sentry + RUM wired via a shared `tracking` package, errors tagged by owning team
- [ ] Bundle-size budgets per route, enforced in CI, owned per team
- [ ] ADRs for every significant decision; Storybook for every shared component
- [ ] Single bootstrap script + devcontainer; new joiner ships day-one
- [ ] Architecture council meets, ADRs flow through PR review
- [ ] Stale-flag and stale-PR bots running automatically

Everything else from sections 1–22 of this document still applies — the patterns don't change at scale, the **operating model around them** does.

---

*This document is maintained by the Frontend Architecture team. For questions, open a discussion in #frontend-architecture Slack channel.*
