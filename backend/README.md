# Diabetic Supplies Buy-Back Backend

FastAPI backend for the diabetic supplies buy-back frontend. The API uses PostgreSQL, SQLAlchemy async ORM, Alembic migrations, JWT admin auth, password reset email, and local image uploads.

## Run Locally

1. Create a virtual environment and install dependencies:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

2. Start PostgreSQL and create the database:

```bash
createdb diabetic_buyback
```

3. Update `.env` if your database credentials differ.

4. Run migrations and seed the admin account:

```bash
alembic upgrade head
python scripts/seed.py
```

5. Start the API:

```bash
uvicorn app.main:app --reload
```

Swagger docs are available at `http://localhost:8000/docs`.

## Docker

```bash
docker compose up --build
docker compose exec api alembic upgrade head
docker compose exec api python scripts/seed.py
```

## Frontend Env

Set this in `frontend/.env.local`:

```bash
VITE_API_URL=http://localhost:8000/api
```

Seeded admin defaults:

```text
Email: admin@diabcare.com
Password: admin123
```

Change these in `.env` before production.

Password reset emails use:

```text
FRONTEND_URL
SMTP_HOST
SMTP_PORT
SMTP_USERNAME
SMTP_PASSWORD
SMTP_FROM_EMAIL
SMTP_USE_TLS
```

If SMTP is not configured in development, the API returns the reset URL in the response for local testing.
