# React Application — Beginner's Guide

**Audience:** Engineers who are new to React, or new to *this* React project.
**Goal:** By the end, you understand what every file does, how a click in the browser turns into an API call, and where to add your first feature.

> If you already know React and just want the architecture rules, read [02-React-Frontend-Architecture.md](./02-React-Frontend-Architecture.md) instead. This document is the *narrative version* — it explains the **why** before the **what**.

---

## Table of Contents

1. [What is React, in 60 seconds](#1-what-is-react-in-60-seconds)
2. [What this project does](#2-what-this-project-does)
3. [The tech stack — what each tool is for](#3-the-tech-stack--what-each-tool-is-for)
4. [Setup — running it on your machine](#4-setup--running-it-on-your-machine)
5. [How the page actually loads (the boot sequence)](#5-how-the-page-actually-loads-the-boot-sequence)
6. [Tour of the folder structure](#6-tour-of-the-folder-structure)
7. [Anatomy of a feature — Users, end to end](#7-anatomy-of-a-feature--users-end-to-end)
8. [How data flows from API to screen](#8-how-data-flows-from-api-to-screen)
9. [Common patterns you will see everywhere](#9-common-patterns-you-will-see-everywhere)
10. [Your first task — adding a feature](#10-your-first-task--adding-a-feature)
11. [Glossary](#11-glossary)
12. [Where to go next](#12-where-to-go-next)

---

## 1. What is React, in 60 seconds

React is a **JavaScript library for building user interfaces**. The mental model is:

> **UI = f(state)** — the screen is a *function* of your data.

You don't manipulate the DOM directly (no `document.getElementById`). Instead:

1. You write **components** — functions that return what the screen should look like.
2. You hold **state** — variables that describe what the user is doing or seeing.
3. When state changes, React **re-runs your component** and updates the screen for you.

Tiny example — the world's smallest React component:

```tsx
function Counter() {
  const [count, setCount] = useState(0);   // state: a number

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}
```

That's the entire core idea. Everything else in this project — routing, API calls, forms, styling — is **layers on top of this pattern**.

Three vocabulary words you'll see constantly:

| Word | Meaning |
|---|---|
| **Component** | A function (or class) that returns JSX. The Lego brick of React. |
| **Props** | Inputs to a component. Read-only. Passed like HTML attributes. |
| **Hook** | A function whose name starts with `use*` (e.g. `useState`, `useEffect`, `useQuery`). Hooks let components remember things and trigger side-effects. |
| **JSX** | The HTML-looking syntax inside `.tsx` files. It's JavaScript — `<div>` is sugar for `React.createElement('div', ...)`. |

---

## 2. What this project does

This is an **enterprise SPA (Single Page Application)** built with React 19 + TypeScript. "Single page" means the browser loads the HTML *once* and JavaScript handles all subsequent navigation — no full-page reloads when you click a link.

Conceptually the app has:

- An **auth flow** (login / refresh tokens / protected routes)
- **Feature modules** like `users`, `billing`, `reporting`
- A **shared UI kit** (`Button`, `Input`, `Table`, etc.)
- A **backend API** it talks to over HTTPS using `axios`

The browser shows React; the data lives on a backend; the two talk via JSON over HTTP.

```
   ┌────────────────┐         HTTPS + JSON          ┌────────────────┐
   │                │  ────────────────────────►    │                │
   │  React (this   │                                │  Backend API   │
   │  project)      │  ◄────────────────────────    │  (.NET/Node)   │
   │                │                                │                │
   └────────────────┘                                └────────────────┘
        ▲
        │ user clicks, types
        │
   ┌────────────────┐
   │     Browser    │
   └────────────────┘
```

---

## 3. The tech stack — what each tool is for

You'll see many libraries imported. Here's what each one **does** and **why we have it**:

| Library | What it does | Why we chose it |
|---|---|---|
| **React 19** | Component framework | Industry standard, huge ecosystem |
| **TypeScript** | Adds types to JavaScript | Catches bugs at compile time instead of in production |
| **Vite** | Dev server + build tool | Starts in ~300ms; Webpack used to take 30s |
| **React Router** | Maps URLs to components | `/users/42` → `<UserDetail userId="42" />` |
| **TanStack Query** | Caches data from APIs | Handles loading/error/refetch for you — no manual `useEffect + fetch` |
| **Zustand** | Stores UI state globally | Like Redux but ~50× less boilerplate |
| **Axios** | HTTP client | Cleaner than `fetch` for interceptors (auth, retry) |
| **React Hook Form** | Manages form state | Performant — only re-renders changed fields |
| **Zod** | Validates data at runtime | "Is this object actually a User?" — TypeScript can't check that at runtime |
| **shadcn/ui + Radix** | Accessible UI primitives | Copy-pasted components you own (not a dependency) |
| **Tailwind CSS** | Utility-first styling | `className="p-4 text-red-500"` instead of writing CSS files |
| **Vitest** | Test runner | Vite-native, very fast |
| **React Testing Library** | Tests components from the user's POV | Encourages testing behavior, not implementation |

**Mental shortcut:** *State that lives on the server → TanStack Query. State that lives in the user's head → Zustand or `useState`. Styling → Tailwind. Routing → React Router. Validation → Zod.*

---

## 4. Setup — running it on your machine

### Prerequisites

- **Node.js 20+** ([nodejs.org](https://nodejs.org))
- **pnpm** — install once with `npm install -g pnpm`
- A code editor — **VS Code** is the team default

### First-time setup

```bash
# 1. Install dependencies (creates node_modules/)
pnpm install

# 2. Create your local environment file
cp .env.example .env.local
# Then edit .env.local and set VITE_API_BASE_URL to your backend URL

# 3. Start the dev server
pnpm dev
```

You'll see something like:

```
  VITE v5.x.x  ready in 312 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open <http://localhost:5173> in your browser. **Hot Module Replacement (HMR)** is on by default — save a file, the browser updates instantly without losing your scroll position or form input.

### Other useful commands

| Command | What it does |
|---|---|
| `pnpm dev` | Start the dev server |
| `pnpm build` | Production build into `dist/` |
| `pnpm preview` | Serve the production build locally to check it |
| `pnpm test` | Run unit tests (Vitest) |
| `pnpm test:ui` | Open the Vitest UI in the browser |
| `pnpm lint` | Check code style with ESLint |
| `pnpm typecheck` | Run TypeScript compiler — verifies types only |

---

## 5. How the page actually loads (the boot sequence)

Open the app and follow what happens, step by step. This is the single most important thing to understand.

### Step 1 — The browser requests `index.html`

```html
<!-- index.html (project root) -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>MyApp</title>
  </head>
  <body>
    <div id="root"></div>                          <!-- React will mount here -->
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

That's it — a nearly empty HTML file with a `<div id="root">` placeholder and a single `<script>`. Vite serves this.

### Step 2 — `main.tsx` boots React

```tsx
// src/main.tsx — the entry point
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';                              // Tailwind base styles

ReactDOM
  .createRoot(document.getElementById('root')!)   // grab the <div id="root">
  .render(<App />);                                // render <App /> inside it
```

In plain English: *"Find the empty div in the HTML, and put my React tree inside it."*

### Step 3 — `App.tsx` sets up global providers

```tsx
// src/App.tsx (simplified)
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>    {/* enables useQuery anywhere */}
      <BrowserRouter>                              {/* enables routing */}
        <AuthProvider>                             {/* knows who's logged in */}
          <AppRouter />                            {/* the actual routes */}
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
```

**Providers** are React's way of saying *"every component inside me has access to this."* They use a feature called **Context**. You'll see this pattern everywhere — providers wrap the tree so deeper components can read shared things without "prop drilling."

### Step 4 — The router decides what to show

```tsx
// src/app/router.tsx (simplified)
const router = createBrowserRouter([
  { path: '/auth/login', element: <LoginPage /> },
  {
    path: '/',
    element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <DashboardPage /> },             // matches "/"
      { path: 'users', element: <UsersPage /> },               // matches "/users"
      { path: 'users/:userId', element: <UserDetailPage /> },  // matches "/users/42"
    ],
  },
]);
```

The URL in the address bar picks one of these. Visit `/users` → `UsersPage` renders. Change the URL → React Router swaps the component, no full reload.

### The boot sequence in one picture

```
  index.html
     │  loads
     ▼
  main.tsx          ──►  ReactDOM.createRoot(...).render(<App />)
     │
     ▼
  App.tsx           ──►  wraps everything in providers
     │
     ▼
  router.tsx        ──►  reads window.location, picks a page
     │
     ▼
  UsersPage.tsx     ──►  the actual content the user sees
     │
     ▼
  UsersList.tsx     ──►  fetches data, renders rows
```

---

## 6. Tour of the folder structure

```
frontend/
├── index.html                ← The single HTML file (Step 1)
├── package.json              ← Lists dependencies and scripts
├── vite.config.ts            ← Vite (dev server + bundler) config
├── tsconfig.json             ← TypeScript compiler config
├── tailwind.config.js        ← Tailwind theme + content paths
└── src/                      ← All your code lives here
    ├── main.tsx              ← Entry point — boots React (Step 2)
    ├── App.tsx               ← Global providers (Step 3)
    ├── index.css             ← Tailwind directives + global CSS
    │
    ├── app/                  ← App-level wiring
    │   ├── router.tsx        ← URL → component mapping (Step 4)
    │   └── providers.tsx     ← Sometimes split out of App.tsx
    │
    ├── pages/                ← One file per route — usually thin
    │   ├── dashboard/
    │   │   └── DashboardPage.tsx
    │   └── users/
    │       ├── UsersPage.tsx
    │       └── UserDetailPage.tsx
    │
    ├── features/             ← THE IMPORTANT FOLDER. One subfolder per domain.
    │   ├── auth/             ← Login, logout, current user, ProtectedRoute
    │   └── users/            ← Everything about users (see section 7)
    │
    ├── widgets/              ← Bigger composed UI blocks used by pages
    │   └── UserStatsCard/    ← e.g. a card that mixes data + chart
    │
    ├── shared/               ← Reusable code that any feature can import
    │   ├── components/
    │   │   ├── ui/           ← shadcn primitives: Button, Input, Dialog…
    │   │   ├── layout/       ← AppLayout, Sidebar, Header
    │   │   └── feedback/     ← LoadingSpinner, EmptyState, Toast
    │   ├── hooks/            ← useDebounce, useLocalStorage, …
    │   ├── lib/              ← axios instance, queryClient, utils (cn)
    │   ├── store/            ← Zustand stores for UI state
    │   └── types/            ← Shared TypeScript types
    │
    └── test/                 ← Test setup, MSW mocks, test helpers
        ├── setup.ts
        └── mocks/
```

### The mental rule: *where does my code go?*

Ask yourself, in order:

1. **Is it specific to one domain (users, billing, reports)?**
   → `features/<domain>/`
2. **Is it a building block used by multiple features?**
   → `shared/`
3. **Is it the screen shown for a specific URL?**
   → `pages/`
4. **Is it a composed widget mixing several features?**
   → `widgets/`

When in doubt, **start inside the feature folder**. Promote to `shared/` *only* when a second feature actually needs it. Premature sharing is a common mistake.

---

## 7. Anatomy of a feature — Users, end to end

A "feature" is a **vertical slice** — everything related to one domain lives together. Here's `features/users/`:

```
features/users/
├── api/
│   └── usersApi.ts            ← HTTP calls: getUsers, getUser, createUser…
├── hooks/
│   ├── useUsers.ts            ← React hook around getUsers (uses TanStack Query)
│   └── useCreateUser.ts       ← Mutation hook
├── components/
│   ├── UsersList.tsx          ← The table component
│   ├── UserCard.tsx           ← One row
│   ├── UserForm.tsx           ← The create/edit form
│   └── UserDetailPanel.tsx    ← Side panel with details
├── types/
│   └── user.types.ts          ← `interface User { ... }`, payloads, filters
└── index.ts                   ← The feature's public API
```

Let's walk through each layer, **bottom-up**.

### 7.1 The type — describing what a User looks like

```ts
// features/users/types/user.types.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'teacher' | 'student';
  isActive: boolean;
  createdAt: string;
}

export interface CreateUserPayload {
  email: string;
  name: string;
  password: string;
  role: User['role'];
}
```

This is **TypeScript only** — it disappears at runtime. Its job is to make the editor red-squiggle when you misspell `email` as `emial`, and to give you autocomplete everywhere a `User` is used.

### 7.2 The API layer — talking to the backend

```ts
// features/users/api/usersApi.ts
import { apiClient } from '@/shared/lib/axios';   // pre-configured axios
import type { User, CreateUserPayload } from '../types/user.types';

export async function getUsers(): Promise<User[]> {
  const { data } = await apiClient.get<{ items: User[] }>('/users');
  return data.items;
}

export async function getUser(id: string): Promise<User> {
  const { data } = await apiClient.get<User>(`/users/${id}`);
  return data;
}

export async function createUser(payload: CreateUserPayload): Promise<User> {
  const { data } = await apiClient.post<User>('/users', payload);
  return data;
}
```

These are **plain async functions**. They know nothing about React. You could call them from a Node script. That's intentional — it makes them easy to test and reuse.

The `apiClient` is pre-configured (see `shared/lib/axios.ts`) to automatically attach the auth token and handle 401 retries.

### 7.3 The hook — bridging React and the API

```ts
// features/users/hooks/useUsers.ts
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../api/usersApi';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],          // unique cache key
    queryFn: getUsers,            // function that fetches
    staleTime: 5 * 60 * 1000,     // data is "fresh" for 5 min
  });
}
```

This is where the magic happens. `useQuery` gives you back:

```ts
const { data, isLoading, error, refetch } = useUsers();
```

- **Cache:** mount the component again — no second HTTP call.
- **Loading state:** `isLoading` is `true` while fetching.
- **Error state:** `error` is set if the request fails.
- **Refetch:** call `refetch()` to force a reload.
- **Background updates:** auto-refetches when the window regains focus (configurable).

Without TanStack Query you'd write 30 lines of `useState` + `useEffect` for each of these features. Now it's three lines.

### 7.4 The component — what the user actually sees

```tsx
// features/users/components/UsersList.tsx
import { useUsers } from '../hooks/useUsers';
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';
import { ErrorMessage } from '@/shared/components/feedback/ErrorMessage';

export function UsersList() {
  const { data: users, isLoading, error } = useUsers();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!users?.length) return <p>No users found.</p>;

  return (
    <table className="w-full">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

Three things to notice:

1. **The component has no `fetch` call.** It asks the hook for data and renders it. Clean separation.
2. **`key={user.id}`** — React needs a unique key when rendering lists, so it knows which row is which when data changes.
3. **Loading and error are explicit.** Every screen handles all three states (loading, error, success). No exceptions.

### 7.5 The page — wiring it into a route

```tsx
// pages/users/UsersPage.tsx
import { UsersList } from '@/features/users/components/UsersList';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { Button } from '@/shared/components/ui/button';

export default function UsersPage() {
  return (
    <div className="p-6 space-y-4">
      <PageHeader title="Users" actions={<Button>Add user</Button>} />
      <UsersList />
    </div>
  );
}
```

**Pages are thin.** They compose feature components and layout primitives. Business logic lives in features, not pages.

### 7.6 The public API — `index.ts`

```ts
// features/users/index.ts
export { UsersList } from './components/UsersList';
export { useUsers } from './hooks/useUsers';
export type { User } from './types/user.types';
// Note: CreateUserPayload is NOT exported — it's internal to this feature
```

Other features should import like this:

```ts
import { UsersList, type User } from '@/features/users';   // ✅ public surface
```

And **not** like this:

```ts
import { UsersList } from '@/features/users/components/UsersList';  // ❌ reaching into internals
```

The `index.ts` is the feature's **contract** with the rest of the app. Change internal files freely; the contract stays stable.

---

## 8. How data flows from API to screen

Here is what happens when a user navigates to `/users`:

```
   ┌─────────────────────────────────────────────────────────┐
   │ 1. URL changes to /users                                │
   │    React Router matches the route                       │
   └─────────────────────────────────────────────────────────┘
                              │
                              ▼
   ┌─────────────────────────────────────────────────────────┐
   │ 2. <UsersPage /> mounts                                 │
   │    It renders <UsersList />                             │
   └─────────────────────────────────────────────────────────┘
                              │
                              ▼
   ┌─────────────────────────────────────────────────────────┐
   │ 3. <UsersList /> calls useUsers()                       │
   │    TanStack Query checks its cache:                     │
   │      - Cache hit + fresh?  → return data instantly      │
   │      - Cache miss or stale? → call queryFn (getUsers)   │
   └─────────────────────────────────────────────────────────┘
                              │
                              ▼
   ┌─────────────────────────────────────────────────────────┐
   │ 4. getUsers() calls apiClient.get('/users')             │
   │    Axios interceptor attaches the Bearer token          │
   │    Request goes out                                     │
   └─────────────────────────────────────────────────────────┘
                              │
                              ▼
   ┌─────────────────────────────────────────────────────────┐
   │ 5. Backend responds with JSON: { items: [...] }         │
   └─────────────────────────────────────────────────────────┘
                              │
                              ▼
   ┌─────────────────────────────────────────────────────────┐
   │ 6. TanStack Query stores it in the cache                │
   │    keyed by ['users']                                   │
   └─────────────────────────────────────────────────────────┘
                              │
                              ▼
   ┌─────────────────────────────────────────────────────────┐
   │ 7. The hook returns { data, isLoading: false }          │
   │    React re-renders <UsersList />                       │
   │    The table appears on screen                          │
   └─────────────────────────────────────────────────────────┘
```

**Now click "Add user" and submit the form.** The mutation flow:

```
   1. <UserForm /> calls useCreateUser().mutate({ name, email, … })
   2. createUser() POSTs /users
   3. Backend responds 201 with the new user
   4. onSuccess fires:
        queryClient.invalidateQueries({ queryKey: ['users'] })
   5. TanStack Query refetches /users automatically
   6. <UsersList /> re-renders with the new row included
```

You never wrote "after creating, refetch and update the list." You said "after success, invalidate the users cache" — and TanStack Query did the rest. **This declarative style is the heart of modern React.**

---

## 9. Common patterns you will see everywhere

### 9.1 Conditional rendering

```tsx
{isLoading && <Spinner />}
{error && <ErrorMessage error={error} />}
{users.length === 0 ? <EmptyState /> : <UsersList users={users} />}
```

`&&` and ternary `? :` work because JSX is just expressions. `false`, `null`, `undefined` render nothing.

### 9.2 Lists with `.map()`

```tsx
<ul>
  {users.map((user) => (
    <li key={user.id}>{user.name}</li>
  ))}
</ul>
```

Always provide a stable `key`. **Never use the array index as a key** if the list can be reordered or filtered.

### 9.3 Composition over props bloat

Instead of `<Card title="X" body="Y" footer="Z" />`, prefer:

```tsx
<Card>
  <Card.Header>X</Card.Header>
  <Card.Body>Y</Card.Body>
  <Card.Footer>Z</Card.Footer>
</Card>
```

`children` is a special prop that holds whatever you put between the tags.

### 9.4 Forms — controlled by React Hook Form

```tsx
const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(schema),
});

<form onSubmit={handleSubmit(onSubmit)}>
  <input {...register('email')} />
  {errors.email && <span>{errors.email.message}</span>}
</form>
```

`register` connects an input to the form state. `handleSubmit` calls your `onSubmit` only if validation passes.

### 9.5 Styling with Tailwind

```tsx
<div className="flex items-center gap-4 p-4 rounded-md border bg-card hover:bg-muted">
```

Each class is a tiny CSS rule. No CSS files needed for 95% of UI. Use the `cn()` helper to combine conditionally:

```tsx
<div className={cn('p-4', isActive && 'bg-primary text-white')}>
```

### 9.6 Custom hooks — extract reusable logic

Anything starting with `use*` and using other hooks is a custom hook:

```ts
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
```

Use it like a built-in hook: `const search = useDebounce(input, 300)`.

---

## 10. Your first task — adding a feature

Let's add a **"products"** feature. Customers want to list and create products. Here's the full path, mirroring how `users` is built.

### Step 1 — Create the folder structure

```
features/products/
├── api/
│   └── productsApi.ts
├── hooks/
│   ├── useProducts.ts
│   └── useCreateProduct.ts
├── components/
│   ├── ProductsList.tsx
│   └── ProductForm.tsx
├── types/
│   └── product.types.ts
└── index.ts
```

### Step 2 — Define the type

```ts
// features/products/types/product.types.ts
export interface Product {
  id: string;
  name: string;
  priceCents: number;
  isActive: boolean;
}

export interface CreateProductPayload {
  name: string;
  priceCents: number;
}
```

### Step 3 — Write the API functions

```ts
// features/products/api/productsApi.ts
import { apiClient } from '@/shared/lib/axios';
import type { Product, CreateProductPayload } from '../types/product.types';

export async function getProducts(): Promise<Product[]> {
  const { data } = await apiClient.get<{ items: Product[] }>('/products');
  return data.items;
}

export async function createProduct(payload: CreateProductPayload): Promise<Product> {
  const { data } = await apiClient.post<Product>('/products', payload);
  return data;
}
```

### Step 4 — Write the hooks

```ts
// features/products/hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../api/productsApi';

export function useProducts() {
  return useQuery({ queryKey: ['products'], queryFn: getProducts });
}
```

```ts
// features/products/hooks/useCreateProduct.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProduct } from '../api/productsApi';

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });
}
```

### Step 5 — Build the component

```tsx
// features/products/components/ProductsList.tsx
import { useProducts } from '../hooks/useProducts';

export function ProductsList() {
  const { data: products, isLoading } = useProducts();
  if (isLoading) return <p>Loading...</p>;

  return (
    <ul className="space-y-2">
      {products?.map((p) => (
        <li key={p.id} className="p-3 border rounded">
          {p.name} — ${(p.priceCents / 100).toFixed(2)}
        </li>
      ))}
    </ul>
  );
}
```

### Step 6 — Expose a public API

```ts
// features/products/index.ts
export { ProductsList } from './components/ProductsList';
export { useProducts } from './hooks/useProducts';
export type { Product } from './types/product.types';
```

### Step 7 — Create the page and route

```tsx
// pages/products/ProductsPage.tsx
import { ProductsList } from '@/features/products';

export default function ProductsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <ProductsList />
    </div>
  );
}
```

```tsx
// app/router.tsx — add the new route
const ProductsPage = lazy(() => import('@/pages/products/ProductsPage'));

// inside children: [...]
{ path: 'products', element: <ProductsPage /> },
```

Visit `/products` — it works. **That's the entire workflow.**

---

## 11. Glossary

| Term | What it means |
|---|---|
| **JSX** | The `<tag>` syntax inside `.tsx` files. Compiled to JS by Vite. |
| **Component** | A function returning JSX. The unit of UI. |
| **Props** | Inputs to a component. Read-only. |
| **State** | Data a component remembers between renders (`useState`). |
| **Hook** | A function starting with `use*` that uses React features. |
| **Render** | React calls your component function; the result is reconciled with the DOM. |
| **Re-render** | A component runs again because its state or props changed. |
| **Side effect** | Anything outside pure render: API calls, timers, subscriptions. Goes in `useEffect` or event handlers. |
| **Context** | A way to share data through the tree without prop drilling. |
| **Provider** | A component that supplies a Context to everything inside it. |
| **Query** | A read operation. Use `useQuery`. |
| **Mutation** | A write operation. Use `useMutation`. |
| **Invalidate** | "This cached data is stale, refetch it next time someone reads it." |
| **Optimistic update** | Updating the UI immediately, before the server confirms. Roll back on error. |
| **Lazy load** | Load JS for a route/component only when needed. Smaller initial bundle. |
| **HMR** | Hot Module Replacement — Vite updates modules in the browser without a full reload. |
| **SPA** | Single Page Application — one HTML file, JS handles all navigation. |

---

## 12. Where to go next

| You want to… | Read |
|---|---|
| Understand the architecture rules and conventions | [02-React-Frontend-Architecture.md](./02-React-Frontend-Architecture.md) |
| Learn React itself, in depth | [react.dev](https://react.dev/learn) — the official tutorial is excellent |
| Master TanStack Query | [tanstack.com/query](https://tanstack.com/query/latest/docs/framework/react/overview) |
| Get good at TypeScript | [typescriptlang.org/docs/handbook](https://www.typescriptlang.org/docs/handbook/intro.html) |
| Learn Tailwind quickly | [tailwindcss.com/docs/utility-first](https://tailwindcss.com/docs/utility-first) |
| See how a real form is built | Open `features/users/components/UserForm.tsx` |
| See how auth works | Open `features/auth/` |
| Run the test suite | `pnpm test` — read a test file to see how `render` + `screen.getByRole` are used |

### Habits that will save you weeks

1. **Read errors carefully.** TypeScript and React give you very specific messages. The fix is usually in the error itself.
2. **Look at existing features before writing a new one.** Copy the structure. Consistency is more valuable than cleverness.
3. **Keep components small.** If a file is over 200 lines, it probably does too much. Extract.
4. **Don't fight the framework.** If something feels hard, you're probably going against the grain. Search the codebase for "how did someone else solve this?"
5. **Ask in `#frontend-help`.** Five minutes of someone's time beats two hours of yours.

Welcome to the team.

---

*Maintained by the Frontend Architecture team. Pair this with [02-React-Frontend-Architecture.md](./02-React-Frontend-Architecture.md) once you're comfortable with the basics here.*
