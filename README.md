# SabaySell

**Cambodian Online Marketplace** - A free-to-list marketplace enabling locals to sell goods via fixed prices or auctions, with real-time messaging and optional paid boosts.

---

## Overview

SabaySell is a full-stack marketplace application built for the Cambodian market, supporting both Khmer and English languages. Users can list items for sale, participate in auctions, communicate with buyers/sellers through real-time chat, and boost their listings for better visibility.

**Key Differentiators:**
- Free to list (no upfront costs)
- Dual-language support (Khmer + English)
- Real-time auctions with live bidding
- In-app messaging with Socket.IO
- Off-platform payments (cash, ABA, Wing)

---

## Tech Stack

### Frontend
- **Next.js 15.5.6** (App Router) - Full-stack React framework
- **React 19.2.0** - UI library
- **TypeScript 5.9.3** - Type safety
- **Tailwind CSS 3.4.18** - Styling
- **shadcn/ui** - Component library (Radix UI primitives)
- **i18next** - Internationalization (Khmer/English)

### Backend
- **Next.js Server Actions** - Server-side functions
- **Socket.IO 4.8.1** - Real-time messaging (separate server on port 3001)
- **Supabase Auth** - Authentication (Google/Facebook OAuth)

### Database
- **PostgreSQL** (via Supabase)
- **Supabase JS Client 2.74.0** - Database operations
- **Row Level Security (RLS)** - Database security
- **pg_trgm** - Full-text search (Khmer + English)

### Storage
- **Supabase Storage** - Image uploads (product images, avatars)

---

## Features

### Implemented
- User authentication (Google/Facebook OAuth)
- User profiles with reputation system
- Listing management (create, edit, delete)
- Fixed price and auction listings
- Real-time bidding system
- Search (full-text, supports Khmer)
- Category filtering
- Favorites/Watchlist
- Real-time messaging (Socket.IO)
- Unread message counts
- Boost system (PayPal integration ready)

### In Progress
- Real-time auction updates
- Notifications system
- Admin panel

### Planned
- Push notifications (FCM)
- SMS notifications
- Content moderation
- Delivery integrations
- Mobile apps (iOS/Android)

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│           Next.js (localhost:3000)              │
│  ┌──────────────────┐  ┌────────────────────┐  │
│  │   Frontend (UI)  │  │  Backend (Server)  │  │
│  │                  │  │                    │  │
│  │  - React Pages   │  │  - Server Actions  │  │
│  │  - Components    │  │  - API Routes      │  │
│  │  - Client Hooks  │  │  - Middleware      │  │
│  └──────────────────┘  └────────────────────┘  │
└─────────────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
  ┌──────────┐  ┌─────────┐  ┌──────────────┐
  │ Supabase │  │Socket.IO│  │   Supabase   │
  │ Database │  │  Server │  │   Storage    │
  │   (DB)   │  │ (port   │  │   (Images)   │
  │          │  │  3001)  │  │              │
  └──────────┘  └─────────┘  └──────────────┘
```

**Data Flow:**
- User actions → Server Actions → Supabase DB
- Real-time messages → Socket.IO → All connected clients
- Authentication → Supabase Auth → RLS policies

---

## Prerequisites

- **Node.js** 18+ (with npm)
- **Supabase Account** (free tier works)
- **Google OAuth App** (for authentication)
- **Facebook OAuth App** (for authentication)

---

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/sabaysell.git
cd sabaysell
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create `.env.local` in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Socket.IO (for real-time messaging)
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
SOCKET_IO_PORT=3001

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Database Setup
Run migrations in your Supabase project:

**Option 1: Using Supabase CLI**
```bash
supabase link --project-ref your-project-ref
supabase db push
```

**Option 2: Manual (Supabase Dashboard)**
1. Go to SQL Editor in Supabase Dashboard
2. Copy contents of `supabase/migrations/*.sql`
3. Execute in order

### 5. Configure OAuth
1. **Google OAuth:**
   - Go to Google Cloud Console
   - Create OAuth 2.0 credentials
   - Add to Supabase Dashboard → Authentication → Providers

2. **Facebook OAuth:**
   - Go to Facebook Developers
   - Create app and get App ID/Secret
   - Add to Supabase Dashboard → Authentication → Providers

---

## Development

### Start Development Servers
```bash
# Start both Next.js and Socket.IO servers (RECOMMENDED)
npm run dev:all

# Or start separately:
npm run dev      # Next.js only (localhost:3000)
npm run socket   # Socket.IO only (localhost:3001)
```

### Other Commands
```bash
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
npm run test:db     # Test database connection
```

### Access the Application
- **Web App**: http://localhost:3000
- **Socket.IO**: http://localhost:3001

---

## Project Structure

```
sabaysell/
├── app/                      # Next.js app directory
│   ├── actions/              # Server actions
│   │   ├── messages.ts       # Messaging logic
│   │   ├── auctions.ts       # Auction logic
│   │   └── favorites.ts      # Favorites logic
│   ├── auth/                 # Authentication pages
│   ├── messages/             # Messages page
│   ├── listings/             # Listings pages
│   └── page.tsx              # Homepage
│
├── components/               # React components
│   ├── ui/                   # shadcn/ui components
│   ├── messages-inbox.tsx    # Messages UI
│   └── ...
│
├── lib/                      # Utilities and helpers
│   ├── supabase.ts           # Supabase client
│   ├── socket.ts             # Socket.IO server
│   ├── database.types.ts     # TypeScript types
│   ├── hooks/                # React hooks
│   │   └── useSocket.ts      # Socket.IO client hook
│   └── queries/              # Database queries
│       ├── messages.ts
│       ├── listings.ts
│       └── ...
│
├── supabase/
│   └── migrations/           # Database migrations
│
├── public/                   # Static assets
├── .env.local                # Environment variables (not in git)
├── middleware.ts             # Next.js middleware (auth)
└── package.json
```

---

## Database Schema

**10 Tables:**
- `users` - User profiles with reputation
- `listings` - Product listings (fixed price + auction)
- `images` - Product images
- `auctions` - Auction data and current bids
- `bids` - Bid history
- `threads` - Message thread metadata
- `messages` - Chat messages
- `boosts` - Paid listing promotions
- `transactions` - Financial records
- `reports` - Content moderation reports

**Key Features:**
- Row Level Security (RLS) on all tables
- Full-text search with pg_trgm
- Automatic timestamps with triggers
- 20+ performance indexes

---

## Key Features Status

| Feature | Status | Notes |
|---------|--------|-------|
| Authentication | Complete | Google/Facebook OAuth |
| Listings CRUD | Complete | Create, edit, delete |
| Auctions | Complete | Real-time bidding tested |
| Search | Complete | Full-text with Khmer support |
| Favorites | Complete | Persisted to database |
| Messaging Backend | Complete | Database + Server Actions |
| Real-time Messaging | Complete | Socket.IO implementation |
| Boost System | Complete | PayPal ready (untested) |
| Notifications | Not Started | Planned |
| Admin Panel | Not Started | Planned |

---

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `NEXT_PUBLIC_SOCKET_URL` | Socket.IO server URL | Yes |
| `SOCKET_IO_PORT` | Socket.IO server port | No (default: 3001) |
| `NEXT_PUBLIC_APP_URL` | Application URL | Yes |

---

## Testing

### Manual Testing

**Authentication:**
1. Visit http://localhost:3000
2. Click "Start Selling" or "Browse Listings"
3. Click "Continue with Google"
4. Complete profile setup

**Real-time Messaging:**
1. Start both servers: `npm run dev:all`
2. Open two browsers with different Google accounts
3. Navigate to same message thread
4. Send messages - should appear instantly

**Auctions:**
1. Create auction listing
2. Open in two browsers (different accounts)
3. Place bids - updates should be immediate

---

## Deployment

### Next.js Application
Deploy to Vercel, Render, or Railway:

```bash
npm run build
npm run start
```

### Socket.IO Server
Requires separate deployment:
- **Option 1:** Deploy to Railway/Render/Fly.io as standalone server
- **Option 2:** Use managed service (Ably, Pusher, Socket.IO Cloud)
- **Option 3:** Custom Next.js server (requires Node.js runtime)

Update production environment variables accordingly.

---

## Documentation

- **CLAUDE.md** - Complete development progress and session notes
- **SOCKET-IO-IMPLEMENTATION.md** - Real-time messaging implementation guide
- **QUICK-START.md** - Quick setup guide
- **README-ARCH.md** - Architecture overview
- **AUCTION-TESTING-CHECKLIST.md** - Auction system testing guide

---

## Contributing

This is a private project. For questions or issues, contact the development team.

---

## License

Proprietary - All rights reserved.

---

## Contact

For questions or support, please contact the project maintainer.

---

**Current Status**: Phase 3 of 5 (Core Features) - MVP Ready for Testing

**Last Updated**: December 16, 2025
