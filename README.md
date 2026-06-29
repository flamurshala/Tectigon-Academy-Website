# Tectigon

Tectigon is a Next.js application built with React and TypeScript.

## Prerequisites

- Node.js 20.9 or newer
- npm

## Run Locally

1. Install the dependencies:

   ```bash
   npm install
   ```

2. Create a `.env.local` file in the project root:

   ```env
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=your-smtp-username
   SMTP_PASS=your-smtp-password
   MAIL_FROM=sender@example.com
   MAIL_TO=recipient@example.com

   # Optional: leave unset to use the application's mock data.
   NEXT_PUBLIC_API_URL=http://localhost/path-to-your-php-api

   # Optional: set when the staff auth PHP API uses a different base URL.
   NEXT_PUBLIC_AUTH_API_URL=http://localhost/path-to-your-php-api

   # Optional: used by Next.js rewrites for the PHP staff auth endpoints.
   PHP_API_BASE_URL=http://localhost/Tectigon/backend/api
   ```

   The SMTP variables are required for the contact and student registration
   forms to send email. Port `465` uses a secure SMTP connection; other ports
   such as `587` use the standard connection with STARTTLS when supported.

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in a browser.

The development server reloads automatically when source files change.

## Admin Trainings

Staff/admin users can manage public training cards at `/admin/trainings`.
The public homepage and courses page load active trainings from the PHP API and
MySQL database.

Run the backend migration before using training management:

```bash
php backend/scripts/migrate.php
```

## Payments

Orders and payments are managed at `/admin/payments`. Customer checkout starts
at `/checkout/[trainingSlug]` and creates pending `EUR` orders through the PHP
API. Real bank Hosted Payment Page calls are intentionally left as a backend
integration point; no card data is collected by this website.

## Production Build

Create and run an optimized production build:

```bash
npm run build
npm run start
```

The production server is available at
[http://localhost:3000](http://localhost:3000) by default.

## Linting

Run the project lint checks with:

```bash
npm run lint
```

## Package Manager

This repository includes both `package-lock.json` and `pnpm-lock.yaml`. The
instructions above use npm. If the team standardizes on pnpm, use
`pnpm install`, `pnpm dev`, `pnpm build`, and `pnpm start` instead. Avoid
switching package managers between installs because that can produce different
dependency resolutions.
