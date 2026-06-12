# Todo with Categories

A full-stack task management app built with **NestJS + Prisma + SQLite** (backend) and **Vite + React 19 + shadcn/ui** (frontend).

## Features

- Create tasks with a text and a category
- Filter tasks by category
- Mark tasks as completed — 5-second undo window with a toast notification
- Delete tasks — 5-second undo window
- Enforced limit of **5 active tasks per category** (backend validation, 400 error)
- **Bulk select + mark as done** (bonus)

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vite + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui |
| Forms | react-hook-form |
| HTTP | axios |
| Toasts | react-hot-toast |
| Backend | NestJS |
| Database | SQLite via Prisma 7 |
| Tests | Jest (backend) + Vitest + React Testing Library (frontend) |

## Project Structure

```
test-tasks/
├── frontend/        React app (Vite)
├── backend/         NestJS API
├── package.json     Root workspace with concurrently scripts
└── README.md
```

## Prerequisites

- Node.js ≥ 20
- pnpm ≥ 11

## Getting Started

### 1. Clone and install dependencies

```bash
git clone <your-repo-url>
cd test-tasks
pnpm install:all
```

### 2. Configure environment variables

**Backend** (`backend/.env`):
```
DATABASE_URL="file:./dev.db"
FRONTEND_URL="http://localhost:5173"
PORT=3000
```

**Frontend** (`frontend/.env`):
```
VITE_API_URL=http://localhost:3000
```

Both files are already present in the repository with the development defaults.

### 3. Set up the database

```bash
cd backend
pnpm exec prisma migrate dev
pnpm exec tsx prisma/seed.ts
```

This creates `dev.db` (SQLite file) and seeds the five default categories (Work, Personal, Shopping, Health, Other).

### 4. Run the app

```bash
# from the repo root — starts both servers in parallel
pnpm dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## Running Tests

```bash
# backend (Jest)
pnpm --dir backend test

# frontend (Vitest + RTL)
pnpm --dir frontend test

# both at once
pnpm test
```

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/categories` | List all categories |
| `GET` | `/todos?category=Work` | List todos (optional category filter) |
| `POST` | `/todos` | Create a todo `{ text, categoryId }` |
| `PATCH` | `/todos/:id` | Update `{ completed: true/false }` |
| `DELETE` | `/todos/:id` | Delete a todo |

**400 error**: `POST /todos` returns `{ message: "..." }` when the selected category already has 5 active tasks.

## Deployment

### Frontend → Vercel

1. Push to GitHub.
2. Import the repository on [vercel.com](https://vercel.com).
3. Set **Root Directory** to `frontend`.
4. Add environment variable: `VITE_API_URL=<your-backend-url>`.

### Backend → Render (or Railway)

SQLite writes to disk, so the host must support **persistent storage**.

**Render:**
1. Create a new **Web Service**, set root directory to `backend`.
2. Build command: `pnpm install && pnpm exec prisma migrate deploy && pnpm exec prisma generate && pnpm build`
3. Start command: `node dist/main`
4. Attach a **Persistent Disk** mounted at `/data`.
5. Set env var: `DATABASE_URL=file:/data/prod.db`, `FRONTEND_URL=<your-vercel-url>`.

**Railway:** Similar setup — add a volume, point `DATABASE_URL` at the mounted path.

---

## Questions

### 1. Did you use AI at any stage while working on this task? Why?

Yes. I used an AI coding assistant (Cursor) throughout the task. The primary reason was to accelerate the implementation of well-established patterns (NestJS module boilerplate, Prisma schema, React hook patterns) so I could focus mental energy on the non-trivial parts: the undo / grace-period flow, the 5-task business rule, and keeping the smart/dummy component boundary clean. AI is especially useful for catching TypeScript errors early and suggesting idiomatic code for libraries I use less frequently (e.g. Prisma 7's new `prisma-client` generator and `prisma.config.ts`).

### 2. What kind of problems or uncertainties did AI help you resolve?

- **Prisma 7 breaking changes**: Prisma 7 introduced a mandatory `prisma.config.ts`, a new `prisma-client` generator (replacing `prisma-client-js`), and the requirement to use a driver adapter (`@prisma/adapter-better-sqlite3`) for SQLite. The official docs exist but are scattered; AI synthesised them quickly.
- **Tailwind v4 + shadcn/ui integration**: Tailwind v4 moved configuration from `tailwind.config.js` to CSS (`@theme inline`). AI helped write the correct `index.css` with the OKLCH-based zinc theme that shadcn components expect.
- **Jest + ESM**: The Prisma 7 generated client uses `import.meta.url` (ESM), which Jest's CommonJS mode cannot parse. AI suggested using `jest.mock()` with a factory function to prevent Jest from loading the module's import chain, unblocking the unit tests.
- **React-hot-toast JSX in `.ts` files**: Caught the error that a hook rendering JSX must use the `.tsx` extension.
