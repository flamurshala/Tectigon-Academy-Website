# Tectigon Backend

Standalone API service for the Tectigon frontend.

## PHP Database Config

The PHP MySQL configuration lives in `config/database.php`.

Use `config/connection.php` in API files to get a PDO connection:

```php
<?php

$pdo = require __DIR__ . '/../config/connection.php';
```

Default local phpMyAdmin/Laragon settings are:

| Setting | Default |
| --- | --- |
| Host | `127.0.0.1` |
| Port | `3306` |
| Database | `tectigon` |
| Username | `root` |
| Password | empty |

Apply the admin users table from the command line:

```bash
php backend/scripts/migrate.php
```

Or import it manually in phpMyAdmin:

```sql
source backend/database/users.sql;
```

Or open `backend/database/users.sql` in phpMyAdmin and run the SQL.

Create or update an admin user with a hashed password:

```bash
php backend/scripts/create-admin.php "Admin Name" admin@example.com "StrongPassword" admin
```

## Auth Endpoints

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/auth/login.php` | Starts an HTTP-only staff session |
| `GET` | `/api/auth/me.php` | Returns the authenticated staff/admin user |
| `POST` | `/api/auth/logout.php` | Clears the active staff session |

Only active users with role `admin` or `staff` can log in.

If the Next.js frontend and PHP API are served from different origins, set
`API_ALLOWED_ORIGIN` to the frontend origin and set `NEXT_PUBLIC_AUTH_API_URL`
in the frontend to the PHP API base URL.

## Run Locally

```bash
cd backend
npm run dev
```

The API runs on `http://localhost:4000` by default.

## Environment

Copy `.env.example` to `.env` when local configuration is needed.

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `4000` | Backend HTTP port |
| `FRONTEND_URL` | `http://localhost:3000` | Allowed frontend origin for CORS |
| `API_ALLOWED_ORIGIN` | empty | Optional frontend origin for cross-origin PHP API requests |
| `AUTH_SESSION_NAME` | `tectigon_staff_session` | Staff session cookie name |
| `AUTH_SESSION_LIFETIME` | `86400` | Staff session lifetime in seconds |
| `DB_HOST` | `127.0.0.1` | MySQL host |
| `DB_PORT` | `3306` | MySQL port |
| `DB_DATABASE` | `tectigon` | MySQL database name |
| `DB_USERNAME` | `root` | MySQL username |
| `DB_PASSWORD` | empty | MySQL password |
| `DB_CHARSET` | `utf8mb4` | MySQL charset |

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Backend health check |

## Frontend Usage

Set the frontend API URL to this backend service:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```
