# Agu Brothers Electronics

Next.js e-commerce storefront for [agubrothers.com](https://www.agubrothers.com) — product catalog, cart, Paystack checkout, admin dashboard, and blog.

## Stack

- **Next.js** (App Router) + React + TypeScript
- **MongoDB** + Mongoose
- **NextAuth v5** (Google + credentials)
- **Cloudinary** (product images)
- **Paystack** (payments)
- **Mailgun** (transactional email)
- **Tailwind CSS** + DaisyUI
- **Vercel** (hosting)

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
```

Fill in every value marked in `.env.example`. Minimum for local browsing:

- `MONGODB_URI`
- `AUTH_SECRET` — `openssl rand -base64 32`
- `NEXT_PUBLIC_BASE_URL=http://localhost:3000`
- Cloudinary public vars (for images)

Checkout and emails need Paystack + Mailgun keys as well.

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Production build

```bash
npm run lint
npm run build
npm start
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Run production build |
| `npm run lint` | ESLint |
| `npm run test:e2e` | Playwright smoke tests (uses `PLAYWRIGHT_BASE_URL` or starts dev server) |
| `npm run test:e2e:prod` | Smoke tests against production |

## E2E tests

Smoke tests cover the public storefront (home, search, catalog, product page, cart).

```bash
# Against local dev (starts `next dev` if not running)
npm run test:e2e

# Against production
npm run test:e2e:prod
```

Install browsers once:

```bash
npx playwright install chromium
```

## Deploy

The project is linked to Vercel (`kamharida1s-projects/next-agu-brothers-2`). Production:

```bash
vercel --prod
```

Set all environment variables in the Vercel project dashboard (same keys as `.env.example`).

## Project structure

```
src/
  app/(front)/     # Storefront pages
  app/admin/       # Admin dashboard
  app/api/         # Route handlers
  components/      # UI components
  lib/             # Models, services, auth, utils
e2e/               # Playwright tests
```

## Admin

- Sign in at `/signin` with an admin user (`isAdmin: true` in MongoDB).
- Manage products, orders, categories, blog, and settings under `/admin`.
