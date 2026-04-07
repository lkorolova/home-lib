# HomeLib

HomeLib is a Next.js 16 app for browsing, saving, and adding books. It uses Auth.js credentials-based authentication, Postgres with Drizzle ORM for persistence, and Cloudinary for cover image uploads.

## Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- Auth.js / NextAuth 5
- Postgres
- Drizzle ORM / drizzle-kit
- Cloudinary uploads
- pnpm

## Prerequisites

Before running or deploying the app, make sure you have:

- Node.js LTS compatible with Next.js 16
- pnpm installed
- A Postgres database
- A Cloudinary account with upload credentials

## Environment Variables

The app depends on the following environment variables.

| Variable | Required | Purpose |
| --- | --- | --- |
| `AUTH_SECRET` | Yes | Secret used by Auth.js to sign and verify session tokens |
| `DATABASE_URL` | Yes | Postgres connection string used by the runtime database client |
| `POSTGRES_URL` | Recommended | Fallback Postgres connection string used by `drizzle-kit` when `DATABASE_URL` is not set |
| `CLOUD_NAME` | Yes | Cloudinary cloud name |
| `API_KEY` | Yes | Cloudinary API key |
| `API_SECRET` | Yes | Cloudinary API secret |

`AUTH_URL` can also be set when your hosting platform does not automatically provide the public application URL. It is not required for a standard local setup.

### Important note about database variables

This codebase reads database configuration in two places:

- The runtime app requires `DATABASE_URL`.
- `drizzle-kit` uses `DATABASE_URL` first and falls back to `POSTGRES_URL`.

For the least surprising setup, set both variables to the same Postgres database unless you intentionally need separate values.

Example:

```env
AUTH_SECRET=replace_with_a_long_random_secret
# AUTH_URL=http://localhost:3000

DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require
POSTGRES_URL=postgresql://user:password@host:5432/dbname?sslmode=require

CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

## Local Setup

1. Install dependencies.

```bash
pnpm install
```

2. Copy the example env file and fill in real values.

```bash
cp .env.example .env.local
```

3. Sync the database schema.

```bash
pnpm db:push
```

If you prefer a migration-based workflow, the repo also includes:

```bash
pnpm db:generate
pnpm db:migrate
```

4. Start the development server.

```bash
pnpm dev
```

5. Open the app at `http://localhost:3000`.

## Build Verification

Before deploying, verify the production build locally:

```bash
pnpm build
pnpm start
```

If `pnpm build` fails, do not deploy until the error is fixed.

## Available Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm db:push
pnpm db:generate
pnpm db:migrate
pnpm db:studio
```

## How the App Uses External Services

- NextAuth is mounted globally through the session provider in the root layout, and the sign-in flow is handled at `/api/auth/[...nextauth]`.
- Book data is stored in Postgres through Drizzle.
- Cover images are uploaded to Cloudinary from the server action used by the add-book flow.
- Remote images are served from `res.cloudinary.com`, which is already allowed in `next.config.ts`.

## Deployment Requirements

To deploy this project successfully, you need all of the following in place:

- A production Postgres database reachable from your hosting platform
- A Cloudinary account with valid upload credentials
- All required environment variables configured in the deployment platform
- The database schema applied to the production database before or during first release

## Quick Deploy (Vercel + Postgres + Cloudinary)

Use this for the fastest end-to-end production setup:

1. Create a production Postgres database and copy its connection string.
2. Create or choose a Cloudinary product environment and copy `CLOUD_NAME`, `API_KEY`, and `API_SECRET`.
3. Import this repo into Vercel.
4. In Vercel Project Settings -> Environment Variables, add:
	- `AUTH_SECRET` (long random value)
	- `DATABASE_URL` (your Postgres connection string)
	- `POSTGRES_URL` (same value as `DATABASE_URL`)
	- `CLOUD_NAME`, `API_KEY`, `API_SECRET`
	- `AUTH_URL` only if your platform does not auto-detect the public URL
5. Deploy once so environment variables are available.
6. Run schema sync against the same production database:

```bash
pnpm install
pnpm db:push
```

7. Open the deployed app and verify:
	- Login/register works
	- Explore and library pages read data
	- Adding a book with cover upload succeeds

## Deploying to Vercel

Vercel is the most direct deployment target for this repo.

1. Push the repository to GitHub, GitLab, or Bitbucket.
2. Import the project into Vercel.
3. Set the framework preset to Next.js if Vercel does not detect it automatically.
4. Add these environment variables in Vercel Project Settings:

```text
AUTH_SECRET
DATABASE_URL
POSTGRES_URL
CLOUD_NAME
API_KEY
API_SECRET
```

5. Add `AUTH_URL` only if your deployment environment does not automatically expose the public site URL.
6. Set `DATABASE_URL` and `POSTGRES_URL` to the same production database connection string.
7. Deploy the app.
8. Apply the schema to the production database before sending traffic to the app:

```bash
pnpm install
pnpm db:push
```

You can run the database command from your machine, from CI, or from a one-off environment that has access to the same production database.

## Deploying Outside Vercel

For another platform, the minimum process is:

1. Install dependencies.

```bash
pnpm install
```

2. Provide all required environment variables.

3. Build the application.

```bash
pnpm build
```

4. Start the production server.

```bash
pnpm start
```

5. Run `pnpm db:push` against the production database before handling live traffic.

6. If your platform does not set the public app URL automatically, provide `AUTH_URL`.

## Deployment Checklist

Use this before marking the deployment complete:

- `pnpm build` succeeds
- All required env vars are present in the target environment
- `DATABASE_URL` points to the intended production database
- `POSTGRES_URL` matches `DATABASE_URL` if you use Drizzle tooling in that environment
- Production database schema has been applied
- Auth secret is configured in production
- Cloudinary credentials are valid and uploads succeed
- The deployed app can read books and add a book with an uploaded cover image

## Notes

- The app is credentials-based today. If you later add OAuth providers, update both this README and `.env.example` in the same change.
- If you want a cleaner production setup later, the database configuration should be unified so the app uses one canonical Postgres connection variable.
