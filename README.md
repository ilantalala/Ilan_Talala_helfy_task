# Task Manager

A full-stack task manager built as a learning exercise: a React (Vite) frontend talking to an Express backend with in-memory storage. The centerpiece is a hand-built infinite carousel for the task list — no carousel library, implemented from scratch with CSS transforms and a clone-padding technique.

## Tech Stack

- **Backend**: Node.js, Express 5, in-memory storage (`Map`), ES Modules
- **Frontend**: React 19 (via Vite), Context API for state, plain CSS (no frameworks/preprocessors/CSS-in-JS)

## Project Structure

```
task-manager/
├── backend/
│   ├── server.js              # entry point: middleware, mounts routes, listen
│   ├── routes/tasks.js        # HTTP verb+path → controller mapping
│   ├── controllers/taskController.js
│   ├── data/tasks.js          # in-memory Map + id generation
│   ├── middleware/errorHandler.js
│   └── .env                   # PORT config
├── frontend/
│   └── src/
│       ├── components/        # TaskList, TaskItem, TaskForm, TaskFilter
│       ├── context/           # TasksContext, ThemeContext
│       ├── services/api.js    # fetch wrappers for the backend API
│       ├── styles/            # one .css file per component + global.css
│       └── App.jsx
└── README.md
```

## Setup & Installation

Requires Node.js v20.6+ (uses native `.env` file loading and `process.loadEnvFile`). Developed and tested on Node v25.

```bash
# Backend
cd backend
npm install

# Frontend (separate terminal)
cd frontend
npm install
```

## Running the App

**Backend** (from `backend/`) — runs on `http://localhost:4000`:
```bash
npm start        # plain node
npm run dev       # nodemon, auto-restarts on file changes
```

**Frontend** (from `frontend/`) — runs on `http://localhost:5173` (or the next free port):
```bash
npm run dev
```

Both must be running simultaneously — the frontend calls the backend directly at `http://localhost:4000/api/tasks`. The backend needs `cors` enabled for this (already configured) since the two run on different ports/origins.

Note: the backend's task list is **in-memory only** — restarting the backend resets it back to the 3 seed tasks. This is by design, per the spec (no database).

## API Documentation

Base URL: `http://localhost:4000/api/tasks`

| Method | Path | Description | Body | Success | Errors |
|---|---|---|---|---|---|
| GET | `/` | Get all tasks | — | `200` + array of tasks | — |
| POST | `/` | Create a task | `{ title, description?, priority?, dueDate? }` | `201` + created task | `400` invalid title/priority/dueDate |
| PUT | `/:id` | Update a task | `{ title, description?, priority?, completed?, dueDate? }` (title required, rest merged if present) | `200` + updated task | `400` invalid input, `404` not found |
| PUT | `/reorder` | Reorder all tasks | `{ orderedIds: [id, id, ...] }` (must contain exactly the current task ids) | `200` + reordered array | `400` invalid/mismatched ids |
| PATCH | `/:id/toggle` | Toggle completion status | — | `200` + updated task | `404` not found |
| DELETE | `/:id` | Delete a task | — | `204` no content | `404` not found |

Any unmatched route returns `404 { "error": "Route not found" }`; unexpected server errors return `500 { "error": "Internal server error" }`.

**Task shape:**
```ts
{
  id: number,
  title: string,
  description: string,
  completed: boolean,
  createdAt: string,   // ISO date, set by server
  priority: 'low' | 'medium' | 'high',
  dueDate: string | null   // ISO date, optional
}
```

## Design Decisions & Assumptions

- **ES Modules throughout the backend** (`import`/`export`, `"type": "module"`), for consistency with the frontend's module syntax.
- **In-memory storage uses a `Map` keyed by task id**, not a plain array, for O(1) lookup/update/delete instead of O(n) `.find()`/`.splice()`. `GET /` converts it to an array via `Array.from(tasksMap.values())` since JSON/REST responses expect a list.
- **PUT semantics**: `title` is required (validated like on create); `description`, `priority`, `completed`, `dueDate` are only updated if included in the request body. `id` and `createdAt` are never client-editable. This is a pragmatic middle ground between strict REST (full resource replacement) and PATCH-style partial updates.
- **Filtering (All/Completed/Pending) and search happen client-side**, not via query params — the frontend already holds the full task list in memory, so filtering it locally avoids an unnecessary network round-trip on every tab switch or keystroke.
- **The carousel** (`TaskList.jsx`) is hand-built with no external library: the task array is padded with clones of the first/last few items, the whole padded track slides via `transform: translateX()`, and crossing into a cloned region triggers an instant, un-animated "reset jump" back to the equivalent real position — the classic technique behind most production carousels. Auto-advances every 4s, pauses on hover, and supports manual prev/next.
- **Drag-and-drop reordering is only enabled when viewing the default, unfiltered/unsorted/unsearched list.** Dragging within a filtered, sorted, or searched subset doesn't have an unambiguous mapping back to the full task order, so it's disabled (not draggable) in those views rather than guessing. Uses native HTML5 drag-and-drop, so it works with a mouse but not touch/mobile — a real limitation worth knowing about.
- **`localStorage` is a cache, not a data store.** The backend is always the source of truth; the frontend caches the last-known task list so a page refresh shows content instantly instead of a blank loading state, then reconciles with a fresh fetch from the server in the background.
- **Dark/light theme** is implemented entirely through CSS custom properties (`--color-*` variables) redefined under a `[data-theme='dark']` selector — no per-component dark-mode styling needed. Defaults to the OS/browser's `prefers-color-scheme` on first visit, then remembers manual toggles via `localStorage`.
- **No comments in code** beyond what's needed to explain non-obvious behavior — favored clear naming and small functions over documentation-heavy code throughout.

### Bonus features implemented

All six were built: search, sorting (by newest/oldest/priority/title), task due dates (with overdue highlighting), dark/light theme toggle, localStorage persistence, and drag-and-drop reordering.

## Time Spent

This was built interactively and iteratively rather than against a stopwatch, so exact durations per section weren't tracked. Roughly, in order of effort: the carousel mechanism (clone-padding + reset-jump) was the single most time-consuming piece to get right, followed by the backend CRUD + validation layer, then the CSS/theming pass, with the six bonus features (search, sort, due dates, theme, localStorage, drag-and-drop) making up the remaining, larger share of total effort — drag-and-drop being the most involved of those given its interaction with the carousel.
