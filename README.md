# HomeLib

HomeLib is a Next.js 16 app for browsing and adding books. It uses NextAuth for authentication, Postgres with Drizzle ORM for persistence, and Cloudinary for cover image uploads.

## Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- NextAuth authentication
- Postgres
- Drizzle ORM / drizzle-kit
- Cloudinary uploads
- pnpm

## Prerequisites

Before running or deploying the app, make sure you have:

- Node.js LTS compatible with Next.js 16
- pnpm installed
- A Postgres database
- A GitHub OAuth application for NextAuth
- A Cloudinary account with upload credentials

## Environment Variables

The app depends on the following environment variables.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXTAUTH_URL` | Yes | Public base URL used by NextAuth callbacks |
| `NEXTAUTH_SECRET` | Yes | Secret used to sign and encrypt NextAuth session tokens |
| `GITHUB_ID` | Yes | GitHub OAuth app client ID used by the sign-in flow |
| `GITHUB_SECRET` | Yes | GitHub OAuth app client secret used by the sign-in flow |
| `DATABASE_URL` | Yes | Postgres connection string used by the main Drizzle database client |
| `POSTGRES_URL` | Yes | Postgres connection string used by query helpers and `drizzle-kit` |
| `CLOUD_NAME` | Yes | Cloudinary cloud name |
| `API_KEY` | Yes | Cloudinary API key |
| `API_SECRET` | Yes | Cloudinary API secret |

### Important note about database variables

This codebase currently reads both `DATABASE_URL` and `POSTGRES_URL` in different places. For a working local setup and a successful deployment, set both variables to the same Postgres database unless you intentionally split them.

Example:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace_with_a_long_random_secret
GITHUB_ID=your_github_oauth_app_client_id
GITHUB_SECRET=your_github_oauth_app_client_secret

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
- A production GitHub OAuth app configured for the deployed domain
- A Cloudinary account with valid upload credentials
- All required environment variables configured in the deployment platform
- The database schema applied to the production database before or during first release

## Deploying to Vercel

Vercel is the most direct deployment target for this repo.

1. Push the repository to GitHub, GitLab, or Bitbucket.
2. Import the project into Vercel.
3. Set the framework preset to Next.js if Vercel does not detect it automatically.
4. Add these environment variables in Vercel Project Settings:

```text
NEXTAUTH_URL
NEXTAUTH_SECRET
GITHUB_ID
GITHUB_SECRET
DATABASE_URL
POSTGRES_URL
CLOUD_NAME
API_KEY
API_SECRET
```

5. Set `DATABASE_URL` and `POSTGRES_URL` to the same production database connection string.
6. Deploy the app.
7. Apply the schema to the production database before sending traffic to the app:

```bash
pnpm install
pnpm db:push
```

You can run the database command from your machine, from CI, or from a one-off environment that has access to the same production database.

8. In GitHub OAuth app settings, add your production callback URL:

```text
https://your-domain.com/api/auth/callback/github
```

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

## Deployment Checklist

Use this before marking the deployment complete:

- `pnpm build` succeeds
- All required env vars are present in the target environment
- `DATABASE_URL` and `POSTGRES_URL` both point to the intended production database
- Production database schema has been applied
- NextAuth secret is configured in production
- GitHub OAuth callback URLs include the production URL
- Cloudinary credentials are valid and uploads succeed
- The deployed app can read books and add a book with an uploaded cover image

## Notes

- The repo contains a secondary `clerk-nextjs` example app, but the main deployable app is the project root.
- If you want a cleaner production setup later, the database configuration should be unified so the app uses one canonical Postgres connection variable.
