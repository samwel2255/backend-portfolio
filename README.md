# Wakuru Portfolio — Backend

Express backend for the Wakuru portfolio. Provides REST APIs for skills, projects, contact messages, and about content. Data is stored in PostgreSQL.

Quick start

1. Copy `.env.example` to `.env` and set `DATABASE_URL`.
2. Install dependencies:

```bash
cd backend
npm install
```

3. Create the database and run the SQL schema in `migrations/schema.sql`:

```bash
# using psql
psql <connection-string> -f migrations/schema.sql
```

4. Run the server in development:

```bash
npm run dev
```

API endpoints are mounted under `/api` (e.g. `/api/skills`).
