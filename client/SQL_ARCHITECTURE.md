# FuzzyBeats SQL Architecture

## Mental model

MongoDB:
- database -> collection -> document

PostgreSQL / SQL:
- database -> table -> row

Examples:
- `users` collection becomes `users` table
- one user document becomes one user row
- `ObjectId` references become foreign keys

## Active database

The Next.js app targets Supabase PostgreSQL through Prisma.

Prisma schema:
- `prisma/schema.prisma`

Prisma config:
- `prisma.config.ts`

Database bootstrap and seed helper:
- `lib/server/db.ts`

## Core tables

- `users`
  - account identity, local password hash, profile details
- `auth_accounts`
  - provider links for Google and future OAuth expansion
- `otp_codes`
  - hashed OTP records with expiry and used state
- `categories`
  - `headphones`, `speakers`, `earphones`
- `products`
  - product reference data keyed by `slug`
- `cart_items`
  - one row per user/product pair
- `wishlist_items`
  - one row per saved product
- `orders`
  - checkout snapshot and totals
- `order_items`
  - line items for each order

## Relationships

- one user -> many cart items
- one user -> many wishlist items
- one user -> many orders
- one order -> many order items
- one category -> many products
- one product -> many cart items
- one product -> many wishlist items
- one product -> many order items

## Why cart is not a single table row

In MongoDB, it is common to think of a cart as one document with embedded items.

In SQL, it is cleaner to model:
- user identity in `users`
- each selected product in `cart_items`

That gives better querying, easier updates, and proper relational constraints.

## Auth flow

- signup email -> OTP in `otp_codes`
- OTP verification -> password user created in `users`
- login -> validates `users.password_hash`
- session -> signed cookie
- current user -> fetched through `/api/v1/auth/me`

## Commerce flow

- cart sync -> `/api/v1/cart` and `/api/v1/cart/sync`
- wishlist -> `/api/v1/wishlist`
- order placement -> `/api/v1/orders`

## Old server folder

The `server/` folder is now reference material only.

Do not use it as the active runtime.
The active backend logic lives inside the Next app under:
- `app/api`
- `lib/server`

## Deployment

For local development or Vercel deployment:
- create a Supabase project
- copy the Supabase PostgreSQL connection string into `DATABASE_URL`
- run `npm run prisma:generate`
- run `npm run prisma:push`

On Vercel, add the same Supabase environment variables in the project settings.
Use Supabase's pooled connection string for `DATABASE_URL` in serverless
deployments.

Example:

```bash
DATABASE_URL="postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
```

Supabase setup steps:
- open Supabase project settings
- go to Database -> Connection string
- choose the pooled/session connection string for app runtime
- replace `PROJECT_REF`, `REGION`, and `PASSWORD` in `.env.local`
- run `npm run prisma:push` from the `client` folder to create the tables
