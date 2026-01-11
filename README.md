# Next.js Marketplace Template

A production-ready, full-stack marketplace template with auctions, real-time messaging, and multi-auth. Built with Next.js 15, Supabase, and TypeScript.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Features

### Core Marketplace
- User authentication (Google/Facebook OAuth via Supabase Auth)
- User profiles with reputation system
- Listing management (create, edit, delete)
- Both fixed-price and auction listings
- Category-based browsing with SEO optimization
- Full-text search (multi-language support included)
- Favorites/Watchlist functionality
- Image uploads with Supabase Storage

### Advanced Features
- **Real-time Auctions** - Live bidding with countdown timers
- **Boost System** - PayPal integration for promoted listings
- **i18n Support** - Built-in internationalization (English + Khmer example)
- **Progressive Enhancement** - Feature flags to toggle functionality
- **Row Level Security** - Database-level security policies

### Built for Customization
- Centralized configuration (`lib/config/branding.ts`)
- Electronics categories as example (easily customizable)
- Clean, well-documented codebase
- TypeScript throughout for type safety
- shadcn/ui components for consistent design

---

## Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS
- shadcn/ui (Radix UI)
- i18next

**Backend:**
- Next.js Server Actions
- Supabase Auth
- PostgreSQL (Supabase)

**Features:**
- Row Level Security (RLS)
- Full-text search (pg_trgm)
- OAuth authentication
- Real-time updates

---

## Quick Start

### Prerequisites
- Node.js 18+
- Supabase account (free tier works)
- OAuth apps (Google/Facebook)

### 1. Clone & Install
```bash
git clone repo
cd repo
npm install
```

### 2. Configure Environment
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Setup Database
Run migrations in Supabase:
```bash
# Using Supabase CLI
supabase link --project-ref your-project-ref
supabase db push

# Or copy SQL from supabase/migrations/ to Supabase SQL Editor
```

### 4. Configure OAuth
Set up Google and Facebook OAuth in Supabase Dashboard → Authentication → Providers

### 5. Run Development Server
```bash
npm run dev   # Starts Next.js development server (port 3000)
```

Visit http://localhost:3000

---

## Customization

### 1. Branding
Edit `lib/config/branding.ts`:
```typescript
export const SITE_CONFIG = {
  name: "Your Marketplace Name",
  tagline: "Your tagline here",
  currency: "USD",
  // ... more settings
}
```

### 2. Categories
Edit `lib/constants/categories.ts` to add your own categories. Current template uses electronics as an example.

### 3. Feature Flags
Toggle features in components or centralize in config:
```typescript
const ENABLE_AUCTIONS = true;
const ENABLE_MESSAGING = true;
```

### 4. Styling
- Global styles: `app/globals.css`
- Theme colors: `tailwind.config.ts`
- shadcn/ui components: `components/ui/`

---

## Project Structure

```
├── app/                      # Next.js app directory
│   ├── actions/              # Server actions
│   ├── auth/                 # Authentication pages
│   ├── api/                  # API routes
│   └── page.tsx              # Homepage
├── components/               # React components
│   ├── ui/                   # shadcn/ui components
│   └── ...                   # Feature components
├── lib/                      # Utilities
│   ├── config/               # Site configuration
│   ├── constants/            # Categories, brands, etc.
│   ├── hooks/                # React hooks
│   ├── queries/              # Database queries
│   └── supabase.ts           # Supabase client
├── supabase/
│   └── migrations/           # Database schema
├── public/                   # Static assets
└── package.json
```

---

## Database Schema

8 tables with Row Level Security:
- `users` - User profiles
- `listings` - Products (fixed-price + auction)
- `images` - Product images
- `auctions` - Auction metadata
- `bids` - Bid history
- `boosts` - Promoted listings
- `transactions` - Payment records
- `reports` - Moderation

**Features:**
- Automatic timestamps
- Full-text search indexes
- 20+ performance indexes
- RLS policies on all tables

---

## Deployment

### Vercel (Recommended for Next.js)
```bash
npm run build
```
Deploy to Vercel and configure environment variables.

### Database
Supabase handles PostgreSQL hosting. Update production environment variables.

---

## Development Commands

```bash
npm run dev          # Next.js dev server (port 3000)
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm run test:db      # Test database connection
```

---

## Feature Status

| Feature | Status |
|---------|--------|
| Authentication | Complete |
| Listings CRUD | Complete |
| Auctions | Complete |
| Search | Complete |
| Favorites | Complete |
| Boost System | Complete (PayPal) |
| Messaging | Planned |
| Notifications | Planned |
| Admin Panel | Planned |

---

## Documentation

- `DEVELOPMENT_HISTORY.md` - Complete development history
- `lib/config/branding.ts` - Configuration options
- `lib/constants/categories.ts` - Category customization

---

## License

MIT License - see LICENSE file for details

---

## Support

For questions or issues, please open a GitHub issue.

---

## Contributing

Contributions welcome! Please open an issue or PR.

---

**Built with Next.js, Supabase, and TypeScript**
