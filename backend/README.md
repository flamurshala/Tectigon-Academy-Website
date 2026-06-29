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

## Training Management

Apply the `users` and `trainings` tables:

```bash
php backend/scripts/migrate.php
```

Training images are uploaded to `backend/uploads/trainings/`. The uploads
folder includes `.htaccess` rules to block PHP execution and directory indexes.

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/api/trainings/public-list.php` | Public | Active trainings for the website |
| `GET` | `/api/trainings/list.php` | Staff/admin | All trainings for the admin |
| `GET` | `/api/trainings/show.php?id=ID` | Staff/admin | One training |
| `POST` | `/api/trainings/create.php` | Staff/admin | Create training with optional image |
| `POST` | `/api/trainings/update.php` | Staff/admin | Update training with optional image |
| `POST` | `/api/trainings/delete.php` | Staff/admin | Delete training |
| `POST` | `/api/trainings/toggle-status.php` | Staff/admin | Toggle active/inactive |

The admin UI is available at `/admin/trainings` after staff login.

## Payment Management

Apply the payment tables with the same migration command:

```bash
php backend/scripts/migrate.php
```

Payment/order records are stored in `orders`, `payments`, and `payment_logs`.
The app does not collect or store card data. Bank Hosted Payment Page integration
can be added inside the PHP payment endpoints later.

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/api/payments/create-order.php` | Public | Create pending order/payment from a training |
| `POST` | `/api/payments/check-order.php` | Public | Check saved order/payment status |
| `GET` | `/api/admin/payments/list.php` | Staff/admin | List and filter payments |
| `GET` | `/api/admin/payments/show.php?id=ID` | Staff/admin | Payment details and logs |
| `POST` | `/api/admin/payments/update-status.php` | Staff/admin | Manual status update with logging |
| `POST` | `/api/admin/payments/recheck.php` | Staff/admin | Placeholder provider re-check log |
| `GET` | `/api/admin/payments/export.php` | Staff/admin | CSV export |

The admin UI is available at `/admin/payments`.

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
