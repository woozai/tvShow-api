# 🎬 TV Shows Explorer (MVP)

A simple full-stack application built with **Node.js + Express (TypeScript)** on the backend and **React + Vite (TypeScript)** on the frontend.  
It integrates with the [TVMaze API](https://www.tvmaze.com/api) to search and display TV shows and episodes.

## ⚙️ Tech Stack

**Backend**
- Node.js + Express
- TypeScript
- Native Fetch wrapper
- Simple Logger & Error Handler

**Frontend**
- React + Vite
- TypeScript
- TailwindCSS
- React Router

## 🏗️ Project Structure
- backend → Express server (API routes, controllers, services)
- frontend → React client (Vite app)

## 🚀 Setup & Run

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/tv-shows-api.git
   cd tv-shows-api

2. Install dependencies
   ```bash
   cd backend && npm install
   cd ../frontend && npm install

3. Create `.env` files for backend and frontend
   (see .env.example in each folder for reference)

4. Run both servers
   ```bash
   # Backend
   cd backend
   npm run dev

   # Frontend
   cd ../frontend
   npm run dev

5. Visit the app at:
   ```arduino
   http://localhost:5173
---

### 💡 Features
```md
## 💡 Features

- 🔍 Search shows by name  
- ⭐ Browse popular shows  
- 📺 View show details and episodes  
- ⚙️ Clean architecture: controllers → services → utils  
- 🌈 Simple logger & error handler for clarity  
- 📦 Minimal dependencies, focused on robustness and readability
   
