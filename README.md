# 🍽️ Shivam Restaurant — Full Stack MVP

> **A New Experience. A New Destination.**  
> Jodhpur Road, Ghumti, Pali, Rajasthan | EST. 2026  
> Instagram: [@shivam_resort_pali](https://www.instagram.com/shivam_resort_pali)

---

## 🗂 Project Structure

```
shivam-restaurant/
├── backend/            ← Node.js + Express + MongoDB API
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── seed.js         ← Run once to seed admin & menu data
│   └── .env
├── frontend/           ← React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── admin/      ← Admin panel pages
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/      ← Public website pages
│   └── .env
└── README.md
```

---

## ⚙️ Prerequisites

- **Node.js** v18+
- **MongoDB** running locally on port 27017  
  → Install: https://www.mongodb.com/try/download/community  
  → Or use MongoDB Atlas (update `MONGO_URI` in `.env`)

---

## 🚀 Setup & Run

### 1. Backend

```bash
cd backend
npm install
```

Configure environment (already set for local dev):
```bash
# backend/.env is pre-configured. Edit if needed:
MONGO_URI=mongodb://localhost:27017/shivam_restaurant
JWT_SECRET=shivam_super_secret_jwt_key_change_in_production_2026
PORT=5000
ADMIN_EMAIL=admin@shivamrestaurant.com
ADMIN_PASSWORD=Admin@123
```

**Seed the database** (run once — creates admin user + 28 menu items):
```bash
node seed.js
```

**Start the server:**
```bash
# Development (auto-restart)
npm run dev

# OR Production
npm start
```

API runs at: `http://localhost:5000`

---

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🌐 Pages & URLs

### Public Website
| Page              | URL                         |
|-------------------|-----------------------------|
| Home              | `/`                         |
| About             | `/about`                    |
| Digital Menu      | `/menu`                     |
| Gallery           | `/gallery`                  |
| Reserve Table     | `/reserve-table`            |
| Book Room         | `/reserve-room`             |
| Contact           | `/contact`                  |

### Admin Panel
| Page                  | URL                             |
|-----------------------|---------------------------------|
| Admin Login           | `/admin/login`                  |
| Dashboard             | `/admin/dashboard`              |
| Manage Menu           | `/admin/menu`                   |
| Table Reservations    | `/admin/table-reservations`     |
| Room Reservations     | `/admin/room-reservations`      |
| Contact Enquiries     | `/admin/enquiries`              |

---

## 🔐 Default Admin Credentials

```
Email:    admin@shivamrestaurant.com
Password: Admin@123
```

> ⚠️ Change these in `backend/.env` before going to production.

---

## 🛠 REST API Endpoints

### Auth
| Method | Endpoint          | Access  |
|--------|-------------------|---------|
| POST   | `/api/auth/login` | Public  |
| GET    | `/api/auth/me`    | Private |

### Menu
| Method | Endpoint          | Access  |
|--------|-------------------|---------|
| GET    | `/api/menu`       | Public  |
| GET    | `/api/menu/:id`   | Public  |
| POST   | `/api/menu`       | Admin   |
| PUT    | `/api/menu/:id`   | Admin   |
| DELETE | `/api/menu/:id`   | Admin   |

### Table Reservations
| Method | Endpoint                        | Access |
|--------|---------------------------------|--------|
| POST   | `/api/reservations/table`       | Public |
| GET    | `/api/reservations/table`       | Admin  |
| PUT    | `/api/reservations/table/:id`   | Admin  |
| DELETE | `/api/reservations/table/:id`   | Admin  |

### Room Reservations
| Method | Endpoint                       | Access |
|--------|--------------------------------|--------|
| POST   | `/api/reservations/room`       | Public |
| GET    | `/api/reservations/room`       | Admin  |
| PUT    | `/api/reservations/room/:id`   | Admin  |
| DELETE | `/api/reservations/room/:id`   | Admin  |

### Contact
| Method | Endpoint            | Access |
|--------|---------------------|--------|
| POST   | `/api/contact`      | Public |
| GET    | `/api/contact`      | Admin  |
| PUT    | `/api/contact/:id`  | Admin  |
| DELETE | `/api/contact/:id`  | Admin  |

### Dashboard
| Method | Endpoint                  | Access |
|--------|---------------------------|--------|
| GET    | `/api/dashboard/stats`    | Admin  |

---

## 🎨 Theme

| Color   | Value     |
|---------|-----------|
| Cream   | `#FBF6EC` |
| Gold    | `#C99B3F` |
| Black   | `#141414` |

Fonts: **Playfair Display** (headings) + **Poppins** (body)

---

## 🏗 Tech Stack

| Layer     | Technology              |
|-----------|-------------------------|
| Frontend  | React 18, Vite, Tailwind CSS |
| Backend   | Node.js, Express 4      |
| Database  | MongoDB, Mongoose       |
| Auth      | JWT (jsonwebtoken)      |
| Validation| express-validator       |

---

## 📦 Build for Production

```bash
# Frontend
cd frontend
npm run build
# Output: frontend/dist/

# Backend — serve the dist folder via Express or deploy to a cloud platform
```

---

## 📞 Contact / Social

- 📍 Jodhpur Road, Ghumti, Pali, Rajasthan
- 📷 [@shivam_resort_pali](https://www.instagram.com/shivam_resort_pali)
