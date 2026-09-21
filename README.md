# FitZone Gym — Full Stack (MERN)

## What's included
- **Backend** (`/backend`) — Node/Express + MongoDB (Mongoose)
  - Member register/login (JWT)
  - Admin login via email + password (from `.env`, no separate admin DB row)
  - Trainers CRUD (admin adds/removes, everyone can view)
  - Membership plans CRUD (admin adds/removes, everyone can view)
  - Member subscribes to a plan → auto-assigned the least-loaded trainer
  - Admin can view **all users**, the **membership each user took**, and the
    **trainer assigned to them** — and can reassign a trainer from the dashboard
- **Frontend** (`/frontend`) — React (Vite) + Tailwind + React Router
  - Public: Home, Workouts, Trainers, Membership plans
  - Member: Register, Login, Profile (shows their plan + assigned trainer)
  - Admin: Admin Login (`/admin/login`), Admin Dashboard (`/admin/dashboard`)
    with tabs for **Users**, **Memberships**, **Trainers**

## Setup

### Backend
```
cd backend
cp .env.example .env      # fill in MONGO_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm install
npm run dev                # starts on http://localhost:5000
```

### Frontend
```
cd frontend
cp .env.example .env       # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                # starts on http://localhost:5173
```

## Admin login
Set `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `backend/.env`, then log in at
`/admin/login` in the frontend. From there you land on `/admin/dashboard`.

## Notes
- `pages/workouts.jsx` and `pages/admin/addworkouts.jsx` were left as-is
  (localStorage-based) since they weren't part of this request.
- `pages/attendance.jsx` was left untouched/empty — not part of this request.
