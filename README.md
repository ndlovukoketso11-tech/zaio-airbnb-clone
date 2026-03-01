# Airbnb Clone – Full Stack Project

A full-stack Airbnb-style application with an **Admin Dashboard** (React + Node/Express + MongoDB + JWT) and a **Guest Frontend** (React) for browsing locations and making reservations.

## What’s included

- **Backend (Node.js, Express, MongoDB)**  
  - CRUD for accommodations, reservations, user login  
  - JWT authentication, auth middleware  
  - Mongoose models and REST API  

- **Admin Dashboard (React)**  
  - Login (email/password, validation, JWT)  
  - Create / view / update / delete listings  
  - Header with user greeting and dropdown (reservations, log out)  
  - Image URLs supported for listings  

- **Guest Frontend (React)**  
  - Home page: hero, inspiration cards, experiences, Shop section, footer  
  - Location page: filter by location, list of accommodations  
  - Listing details: gallery, details, cost calculator, reserve (with dates and guests)  

## Prerequisites

- **Node.js** (v18 or similar)
- **MongoDB** running locally or a connection string (e.g. MongoDB Atlas)

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env and set MONGODB_URI and JWT_SECRET
npm install
node seedUsers.js   # Create sample users (john@example.com / password123, jane@example.com / password321)
npm start
```

Server runs at **http://localhost:5000**.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at **http://localhost:3000**. Vite proxies `/api` to the backend.

## Default users (after seed)

| Email             | Password    | Role  |
|------------------|------------|-------|
| john@example.com | password123 | user  |
| jane@example.com  | password321 | host  |

Use either to log in to the admin dashboard.

## Usage

1. **Guest site**  
   - Open http://localhost:3000  
   - Use the search bar or “Inspiration” cards to go to a location (e.g. New York).  
   - Open a listing to see details, use the cost calculator and **Reserve** (requires login).  

2. **Admin**  
   - Click **Become a host** or go to http://localhost:3000/admin  
   - Log in with one of the seeded users.  
   - Create listings, edit/delete them, and view reservations from the header dropdown.  

## Project structure

```
airbnb-clone/
├── backend/
│   ├── controllers/    # accommodation, reservation, user
│   ├── models/         # Accommodation, Reservation, User
│   ├── routes/         # API routes
│   ├── middleware/    # auth.js (JWT)
│   ├── server.js
│   ├── seedUsers.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/ # Header, Footer
│   │   ├── context/    # AuthContext
│   │   ├── pages/      # Home, Location, LocationDetails, admin/*
│   │   ├── services/   # api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## API overview

- `POST /api/users/login` – login (email, password) → JWT + user
- `GET /api/accommodations` – list all
- `GET /api/accommodations/location/:location` – by location
- `GET /api/accommodations/:id` – one listing
- `POST /api/accommodations` – create (auth)
- `PUT /api/accommodations/:id` – update (auth)
- `DELETE /api/accommodations/:id` – delete (auth)
- `POST /api/reservations` – create reservation (auth)
- `GET /api/reservations/user` – my reservations (auth)
- `GET /api/reservations/host` – reservations as host (auth)
- `DELETE /api/reservations/:id` – cancel (auth)

## Optional: image uploads

The backend is set up for optional **Multer** file uploads. Listings currently support **image URLs** (one per line or comma-separated in the form). To add real file uploads you would:

1. Add a `POST /api/upload` route using `multer` and save files to an `uploads` folder.
2. In the create/update listing form, upload files and then send the returned paths in the `images` array.

## Notes for students

- Code is structured in small, readable functions with comments where useful.
- Validation and error messages are handled on both client and server.
- JWT is stored in `localStorage`; protected admin routes redirect to login when not authenticated.
