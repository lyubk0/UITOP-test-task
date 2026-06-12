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

| Layer    | Technology                                                 |
| -------- | ---------------------------------------------------------- |
| Frontend | Vite + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui |
| Forms    | react-hook-form                                            |
| HTTP     | axios                                                      |
| Toasts   | react-hot-toast                                            |
| Backend  | NestJS                                                     |
| Database | SQLite via Prisma 7                                        |
| Tests    | Jest (backend) + Vitest + React Testing Library (frontend) |

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

| Method   | Endpoint               | Description                           |
| -------- | ---------------------- | ------------------------------------- |
| `GET`    | `/categories`          | List all categories                   |
| `GET`    | `/todos?category=Work` | List todos (optional category filter) |
| `POST`   | `/todos`               | Create a todo `{ text, categoryId }`  |
| `PATCH`  | `/todos/:id`           | Update `{ completed: true/false }`    |
| `DELETE` | `/todos/:id`           | Delete a todo                         |

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

Yes, I used AI during the development process because it helps speed up routine work, validate ideas, and improve productivity. I still made the key technical decisions myself and reviewed the generated code before using it.

### 2. What kind of problems or uncertainties did AI help you resolve?

I used AI to help plan the basic project structure, clarify implementation details, and speed up the development of some frontend components and backend logic. I also used Vercel Skills, specifically `vercel-react-best-practices`, to check React-related patterns and follow better practices.
