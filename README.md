# AlgoLens DSA Visualizer

AlgoLens is a full-stack DSA code visualization platform with:
- `Main/frontend`: Vite + React UI
- `Main/backend`: Express API for code recognition and trace generation

## Project Structure

- `Main/frontend` - user/admin web app
- `Main/backend` - recognition engine, trace generators, stats routes

## Prerequisites

- Node.js 18+
- npm

## Setup

Install dependencies for both apps:

```bash
npm --prefix Main/backend install
npm --prefix Main/frontend install
```

## Run Locally

Start backend:

```bash
npm --prefix Main/backend run dev
```

Start frontend (in another terminal):

```bash
npm --prefix Main/frontend run dev
```

Frontend runs on `http://localhost:5173` and proxies `/api` requests to backend on `http://localhost:3001`.

## Environment Variables

Backend env example: `Main/backend/.env.example`

Set this in `Main/backend/.env` (file is git-ignored):

```env
ADMIN_PASSWORD=your_secure_admin_password
```

Frontend optional env (`Main/frontend/.env.local`):

```env
VITE_API_URL=http://localhost:3001
```

If `VITE_API_URL` is not set, frontend uses same-origin `/api` and relies on Vite dev proxy.

## Build

```bash
npm --prefix Main/frontend run build
```
