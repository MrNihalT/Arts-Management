# 🎭 Arts & Sports Event Management System

An interactive, premium web application built to manage, track, and score arts and sports competitions. It features a modern **React (Vite) + Tailwind CSS** frontend and a robust **Django REST Framework** backend powered by a **PostgreSQL** database.

---

## 📂 Project Architecture & Directory Structure

The project is structured into three main directories:

```text
Arts/
├── backend/                  # Django REST Framework Backend
│   ├── arts/                 # Main Django project settings & apps
│   │   ├── accounts/         # User roles, Custom User model, JWT authentication
│   │   ├── announcement/     # Announcements & notifications
│   │   ├── complaints/       # User complaints and feedback system
│   │   ├── gallery/          # Images/gallery management
│   │   ├── participation/    # Participant event registration
│   │   ├── programs/         # Event programs, scheduling, and metadata
│   │   ├── results/          # Standings and winner declarations
│   │   ├── scores/           # Judging panel scoring & point systems
│   │   ├── manage.py         # Django CLI entrypoint
│   │   └── requirements.txt  # Python requirements
│   └── venv/                 # Python local Virtual Environment (git-ignored)
│
├── frontend/                 # React + Vite + Tailwind CSS Frontend
│   ├── src/                  # React components, pages, Redux state
│   ├── public/               # Static public assets
│   ├── package.json          # Node package definition
│   └── vite.config.js        # Vite configurations
│
└── design/                   # UI/UX Wireframes & Mockups
    └── (Mockup PNGs of point tables, registration, results, etc.)
```

---

## 🛠️ Technology Stack

### Frontend

- **Core**: React 19, Vite (Fast HMR)
- **State Management**: Redux Toolkit & React-Redux
- **Routing**: React Router DOM (v7)
- **Styling**: Tailwind CSS & PostCSS
- **API Client**: Axios (with interceptors for JWT token handling)
- **Notifications**: React Hot Toast & React Toastify
- **Data Export**: SheetsJS (XLSX) & File-Saver (for reports/tables)

### Backend

- **Core**: Django 6.0.3, Django REST Framework (DRF)
- **Authentication**: JWT (JSON Web Tokens) via `djangorestframework-simplejwt`
- **Database**: PostgreSQL
- **API Schema / Documentation**: OpenAPI 3 with Swagger UI via `drf-spectacular`
- **Configurations**: Decouple (using `.env`)
- **Image Processing**: Pillow (for media & gallery uploads)

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (v3.10+)
- [PostgreSQL](https://www.postgresql.org/) (running locally or remotely)

---

### Step 1: Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Activate your Virtual Environment:
   - **Windows (PowerShell)**:
     ```powershell
     .\venv\Scripts\activate
     ```
   - **Linux/macOS**:
     ```bash
     source venv/bin/activate
     ```
3. Navigate to the Django root and install requirements:
   ```bash
   cd arts
   pip install -r requirements.txt
   ```
4. Create a `.env` file in `backend/arts/` with the following variables:
   ```env
   SECRET_KEY=your_django_secret_key
   DEBUG=True
   DB_NAME=your_postgres_db_name
   DB_USER=your_postgres_user
   DB_PASSWORD=your_postgres_password
   DB_HOST=localhost
   ```
5. Apply database migrations:
   ```bash
   python manage.py migrate
   ```
6. Start the backend development server:
   ```bash
   python manage.py runserver
   ```
   _The backend will run on `http://127.0.0.1:8000/`._

---

### Step 2: Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
   _The frontend will run on `http://localhost:5173/`._

---

## 🎨 UI/UX Design Reference

The `design/` folder contains UI mockups and screenshots showing key pages of the application:

- **Home Page & About**: Portal overview
- **Registration**: Dynamic forms to sign up for events
- **Point Table & Running Order**: Live score standings and schedules
- **Results & Gallery**: Interactive media and winner updates

---

## 📝 License

This project is part of a Final Year Project. All rights reserved.
