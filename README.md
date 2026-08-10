# Samwel Portfolio — Backend

Express backend scaffold for the Wakuru portfolio. The new structure is centered on Prisma + PostgreSQL, JWT admin auth, and a modular service layout.

Quick start

1. Copy `.env.example` to `.env` and set the database and auth values.
2. Install dependencies:

```bash
cd backend
npm install
```

3. Generate the Prisma client and apply the schema:

```bash
npm run prisma:generate
npm run prisma:migrate
```

4. Seed starter portfolio data:

```bash
npm run seed
```

5. Run the API in development:

```bash
npm run dev
```

Deployment notes

- On Render, set `DATABASE_URL` to your Render PostgreSQL connection string.
- Set `CORS_ORIGIN` to your Vercel frontend URL.
- Set `JWT_SECRET` to a strong secret for admin authentication.
- Multiple allowed origins can be supplied as a comma-separated list.

API layout

- Public read: `GET /api/profile`, `/api/about`, `/api/skills`, `/api/projects`, `/api/education`
- Public write: `POST /api/contact` only
- Admin CRUD: `/api/admin/*` (JWT Bearer token from `POST /api/admin/login`)

After deploying schema changes or adding profile fields, re-run `npm run seed` against production so hero stats, intro, and email are populated.

Default admin (from seed): `wakuru@gmail.com` / `wakuru@123` — change the password in production.
