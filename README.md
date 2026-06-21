# PixelOrCode Ops

Internal CRM and outreach workspace for PixelOrCode lead management.

## Stack

- Vite
- React
- Supabase Auth, Postgres, and Storage
- Vercel deployment

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Required environment variables:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_AUTH_REDIRECT_URL=
```

For database seed/import scripts only:

```bash
SUPABASE_SERVICE_ROLE_KEY=
```

Do not commit `.env.local` or any service role key.

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run db:seed
```

## Deployment

The production app is deployed on Vercel:

https://pixelorcode-ops.vercel.app

Set the same public Vite env vars in Vercel, and keep the Supabase service role key local-only unless a secure server-side job is added later.
