# 🐍 Arts & Sports Event Management Backend

This is the backend server for the **Arts & Sports Event Management System**. Built on **Django 6.0** and **Django REST Framework (DRF)**, it exposes secure REST APIs for users, judges, administrators, and participants.

---

## 🛠️ Tech Stack & Features

- **Django REST Framework (DRF)**: Leveraged for building standard, performant RESTful APIs.
- **SimpleJWT**: Implements secure JSON Web Token authentication with rotating refresh tokens and blacklist capabilities.
- **PostgreSQL**: Serves as the primary production-grade relational database.
- **Decouple (.env)**: Keeps configuration secrets separate from code.
- **Pillow**: Handles profile images, gallery uploads, and event media.
- **drf-spectacular**: Automatically generates OpenAPI 3.0 schema specs and serves clean Swagger/Redoc API documentation.
- **Throttle Rates**: Set up for secure endpoint access (e.g., login, register, and general API calls).

---

## 📂 Backend Project Structure

```text
backend/
├── arts/                      # Django Project Root
│   ├── accounts/              # Custom User accounts (Admins, Judges, Participants)
│   ├── announcement/          # Announcements & Schedule postings
│   ├── arts/                  # Main Settings, WSGI/ASGI configurations, and base urls
│   ├── complaints/            # Feedback, complaints, and resolution systems
│   ├── gallery/               # Gallery uploads and event photo management
│   ├── participation/         # Submissions and participant registration
│   ├── programs/              # Registration of arts/sports programs and events
│   ├── results/               # Dynamic calculation of rankings and results
│   ├── scores/                # Scorecards, judging panel ratings, and program scoring
│   │
│   ├── manage.py              # Django CLI utility
│   ├── requirements.txt       # Project python dependencies
│   └── schema.yml             # Auto-generated OpenAPI schema file
│
└── venv/                      # Local Virtual Environment (Excluded from Git)
```

---

## ⚙️ Setup & Installation

### 1. Initialize Virtual Environment

From the `backend/` directory, create and activate a Python virtual environment:

```bash
# Create venv (if not already created)
python -m venv venv

# Activate venv
# Windows (PowerShell):
.\venv\Scripts\activate

# macOS / Linux:
source venv/bin/activate
```

### 2. Install Dependencies

Change directory to the Django root and install Python libraries:

```bash
cd arts
pip install -r requirements.txt
```

### 3. Environment Variables

Create a file named `.env` in `backend/arts/` containing your local settings:

```env
SECRET_KEY=django-insecure-your-secret-key-goes-here
DEBUG=True
DB_NAME=arts_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
```

### 4. Relational Database Migrations

Create database tables for all models:

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Create a Superuser

To access the Django Admin Portal (`/admin/`):

```bash
python manage.py createsuperuser
```

### 6. Run the Server

Launch the local development server:

```bash
python manage.py runserver
```

API endpoints are available on `http://127.0.0.1:8000/`.

---

## 📡 API Routing & Endpoints

The backend maps routes under `/api/`:

| Endpoint               | App             | Purpose                                             |
| :--------------------- | :-------------- | :-------------------------------------------------- |
| `/admin/`              | Django Admin    | Admin database console                              |
| `/api/auth/`           | `accounts`      | Registration, login, profile, and JWT token refresh |
| `/api/programs/`       | `programs`      | Add, delete, and view competitive events/categories |
| `/api/participations/` | `participation` | Enroll participants into programs                   |
| `/api/scores/`         | `scores`        | Judge scoring operations for programs               |
| `/api/results/`        | `results`       | Retrieve program standings and point tables         |
| `/api/complaints/`     | `complaints`    | File and manage complaints/feedback                 |
| `/api/announcements/`  | `announcement`  | Publish news and event announcements                |
| `/api/schedule/`       | `announcement`  | Manage and fetch event schedules                    |
| `/api/gallery/`        | `gallery`       | Upload, edit, and view gallery images               |

---

## 📖 Interactive API Documentation

Interactive OpenAPI 3.0 document viewers are automatically hosted:

- **Swagger UI**: `http://127.0.0.1:8000/api/docs/` (Enables testing of endpoints directly in browser)
- **Redoc**: `http://127.0.0.1:8000/api/redoc/`
- **Raw Schema (YAML)**: `http://127.0.0.1:8000/api/schema/`

To regenerate the offline YAML schema representation (`schema.yml`):

```bash
python manage.py spectacular --file schema.yml
```
