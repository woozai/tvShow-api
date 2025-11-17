# 🎬 Woozai TV-Show Explorer

Full-stack TVMaze API Client (Node.js + Express + React + Vite + TypeScript)

A clean, interview-ready MVP that integrates with the **public TVMaze API**, using a **TypeScript backend**, a **React/Tailwind frontend**, and a robust architecture with filtering, pagination, caching, and modern UI components.

---

# 📌 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Architecture](#architecture)
5. [Backend](#backend)

   * Routes
   * Filtering
   * Pagination
   * Caching
   * Env variables
   * Scripts
6. [Frontend](#frontend)

   * Pages
   * Components
   * Theme system
   * Favorites
7. [How to Run (Full Setup)](#how-to-run-full-setup)
8. [Folder Structure](#folder-structure)
9. [Future Improvements](#future-improvements)

---

# 🧠 Project Overview

This project is a **full-stack TV show browser** that communicates with TVMaze, adds filtering/searching, caches upstream results, and provides a modern, responsive UI.

It is designed for:

✔️ Clean architecture
✔️ Interview readability
✔️ Minimal dependencies
✔️ Maintainability
✔️ Robust TypeScript types
✔️ Real production patterns (caching, error-handling, pagination, services)

---

# ⚙️ Tech Stack

### **Backend**

* Node.js + Express
* TypeScript
* Native Fetch wrapper
* In-memory TTL caching
* Controllers → Services → Utils architecture
* Zod validation (light usage)
* Pino/Winston-style logging (custom logger)

### **Frontend**

* React (TypeScript)
* Vite
* TailwindCSS
* React Router
* LocalStorage persistence (favorites & recent searches)
* Fully responsive, dark-mode enabled

---

# 🌟 Features

### **Search & Explore**

* 🔍 Live search with debounce
* ⌨️ Recent search history
* ⭐ Popular shows listing
* ❤️ Add/remove favorites
* 📄 Detailed show page (seasons, cast, episodes)

### **Filtering**

Backend + Frontend support:

* Genre
* Language
* Minimum rating

### **Caching & Performance**

* LRU-like simple TTL cache for:

  * `/shows?page=N`
  * Show details
  * Episodes
* Prevents excessive TVMaze calls
* Makes UI faster & smoother

### **Pagination**

* Server-side windowing & scanning for filtered results
* TVMaze pages (0–∞) handled automatically
* Full 20-item UI pages on the frontend
* Bounded upstream scan (max 50 pages)

---

# 🏗️ Architecture

```
backend/
   controllers/
   services/
   utils/
   routes/
   types/

frontend/
   src/
     app/
       components/
       pages/
       providers/
       context/
     api/
     hooks/
     types/
```

### Backend Flow

```
Route → Controller → Service → httpClient → TVMaze API
                                → cache → return
```

### Frontend Flow

```
Component → API wrapper → Backend → Filtering/Cache → Return results
```

---

# 🛠️ Backend

## 📡 API Routes

### **Shows**

```
GET /api/shows?page=N
GET /api/shows/:id
GET /api/shows/:id/episodes
GET /api/shows/filter?genres=Drama&rating_gte=7...
```

### **Search**

```
GET /api/search?q=QUERY
```

### **Seasons**

```
GET /api/seasons/:seasonId/episodes
```

---

## 🎚️ Filtering Logic

The backend supports:

| Filter              | Example               | Notes                            |
| ------------------- | --------------------- | -------------------------------- |
| `genres`            | Drama,Comedy          | default sorting by raiting       |
| `language`          | English               | and order is desc                |
| `rating_gte`        | 7.5                   |                                  |
| `sort`              | rating/name/premiered |                                  |
| `order`             | asc/desc              |                                  |

Backend merges, sorts, and slices results based on `page` and `limit`.

---

## 📄 Pagination

### Popular shows

* Backend fetches **TVMaze page=N**
* Frontend displays **20 at a time**

### Filtered shows

* Backend scans up to **50 TVMaze pages**
* Collects matches
* Sorts + slices based on:

```
page = 0..∞
limit = 20
offset = page * limit
```

---

## 🧩 Caching

Located at:
`backend/src/utils/cache.ts`

TTL durations:

* Shows pages: **10 min**
* Show details: **30 min**
* Episodes: **45 min**

Cache key = full URL.

Example:

```
GET https://api.tvmaze.com/shows?page=0 → cached
```

---

## 🔧 Environment Variables

`backend/.env`

```
PORT=3000
TVMAZE_BASE_URL=https://api.tvmaze.com
```

---

## 📜 Scripts

In `backend/package.json`:

```
npm run dev     // nodemon + ts-node
npm run build   // compile to dist/
npm start       // run compiled JS
```

---

# 🎨 Frontend

## Pages

* `/` — Popular shows + filter system
* `/search?q=` — Live search results
* `/show/:id` — Full show page with:

  * Summary
  * Rating
  * Cast
  * Seasons & episodes
* `/favorites` — LocalStorage-based list

---

## UI Components

* **ShowCard**
* **EpisodeCard**
* **SeasonBlock**
* **CastList**
* **FilterModal / FilterButton / FilterToggle**
* **SearchHeader with history dropdown**
* **ThemeToggle**
* **Loader / Skeleton placeholders**

---

## 🌗 Dark Mode

* Uses class-based `.dark` on `<html>`
* Saves preference in LocalStorage
* Auto-detects system theme

---

## ❤️ Favorites / History

Stored in LocalStorage:

| Key                  | Purpose        |
| -------------------- | -------------- |
| `favorite_shows_v1`  | saved show IDs |
| `recent_searches_v1` | recent queries |

---

# 🚀 How to Run (Full Setup)

## 1. Clone the project

```bash
git clone <repo>
cd woozai-tvshow-api
```

---

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```
PORT=3000
TVMAZE_BASE_URL=https://api.tvmaze.com
```

Start backend:

```bash
npm run dev
```

Backend runs at:

```
http://localhost:3000
```

---

## 3. Frontend setup

```bash
cd ../frontend
npm install
cp .env.example .env
```

Set API URL:

```
VITE_API_URL=http://localhost:3000
```

Run frontend:

```bash
npm run dev
```

Open:

```
http://localhost:5173
```

---

# 📁 Folder Structure (Complete)

See generated structure in your project.
Main folders:

### Backend

```
backend/
  controllers/
  routes/
  services/
  utils/
  middlewares/
  types/
```

### Frontend

```
frontend/src/app/
frontend/src/api/
frontend/src/hooks/
frontend/src/types/
frontend/src/app/components/
```

---

# 🚀 Future Improvements

* Add episode detail page
* Server-side pagination improvements
* Move cache to Redis for distributed deployment
* Dockerization (docker-compose Dev setup)
* Add unit tests & integration tests
* Add CI/CD workflow
* Add filters for:

  * year ranges
  * status (Running/Ended)
  * multi-select genres
* Add sorting options in UI

---

