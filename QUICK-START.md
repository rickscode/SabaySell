# Sabay Sell - Quick Start Guide

## Phase 2 is Complete! 🎉

You now have a production-ready database schema and authentication system.

## Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Run Database Migration
```bash
# Option 1: Using Supabase CLI
supabase link --project-ref your-project-ref
supabase db push

# Option 2: Manual (Supabase Dashboard)
# Copy supabase/migrations/20251015000000_initial_schema.sql
# Paste into SQL Editor and run
```

### 4. Enable Phone Auth in Supabase
Dashboard → Authentication → Providers → Enable "Phone"

### 5. Test Everything
```bash
# Test database connection
npm run test:db

# Start both dev servers (Next.js + Socket.IO)
npm run dev:all
```

Visit: http://localhost:3000/auth/login

**Note:** Real-time messaging requires both servers running (`npm run dev:all`)

## What You Can Do Now

### Test Authentication
1. Go to `/auth/login`
2. Enter phone: `012345678`
3. Use test OTP from Supabase logs
4. Complete profile setup
5. You're authenticated!

### Protected Routes
These routes now require authentication:
- `/profile` - User profile
- `/listings/new` - Create listing
- `/messages` - Chat
- `/boosts` - Promotions

## Database Overview

### Core Tables
- **users** - 18,000+ users supported with reputation
- **listings** - Fixed price & auction items
- **auctions** - Real-time bidding data
- **threads** - Buyer-seller conversations
- **boosts** - Paid promotions
- **reports** - Content moderation

### Key Features
✅ Khmer language support (full-text search ready)
✅ Row Level Security on all tables
✅ Type-safe TypeScript throughout
✅ Atomic auction bidding
✅ Multilingual content (EN/KM)

## API Examples

### Get Authenticated User
```typescript
import { getCurrentUser, getUserProfile } from '@/lib/auth';

const { user } = await getCurrentUser();
const { data: profile } = await getUserProfile(user.id);
```

### Create a Listing
```typescript
import { supabase } from '@/lib/supabase';

const { data, error } = await supabase
  .from('listings')
  .insert({
    user_id: userId,
    title_en: 'iPhone 13 Pro',
    title_km: 'អាយហ្វូន ១៣ ប្រូ',
    price: 500,
    category: 'electronics',
    status: 'active',
  })
  .select()
  .single();
```

### Search Listings (Khmer Support)
```typescript
const { data } = await supabase
  .from('listings')
  .select('*, user:users(*), images(*)')
  .or(`title_km.ilike.%${query}%,title_en.ilike.%${query}%`)
  .eq('status', 'active')
  .order('created_at', { ascending: false });
```

### Place a Bid
```typescript
const { data, error } = await supabase
  .from('bids')
  .insert({
    auction_id: auctionId,
    user_id: userId,
    amount: bidAmount,
  });
// Trigger automatically updates auction.current_price
```

## File Organization

```
app/
├── auth/           # Authentication pages
│   ├── login/      # Phone OTP login
│   └── setup-profile/  # First-time setup
├── api/
│   └── auth/       # Auth API routes
lib/
├── database.types.ts   # Generated types
├── supabase.ts         # Typed client
└── auth.ts             # Auth utilities
supabase/
└── migrations/         # Database schema
scripts/
└── test-db-connection.ts  # Test script
```

## Common Commands

```bash
# Development
npm run dev              # Start Next.js dev server (http://localhost:3000)
npm run socket           # Start Socket.IO server (http://localhost:3001)
npm run dev:all          # Start both servers concurrently (RECOMMENDED)
npm run build            # Build for production
npm run start            # Start production server

# Testing
npm run test:db          # Test database connection
npm run lint             # Lint code

# Database
supabase db push         # Push migrations
supabase db pull         # Pull schema changes
supabase db reset        # Reset database
```

**Note:** For real-time messaging to work, you must run both servers using `npm run dev:all`.

## Troubleshooting

### "Cannot connect to database"
- Check `.env.local` credentials
- Verify Supabase project is active
- Run `npm run test:db`

### "RLS policy violation"
- Check you're authenticated
- Verify user has permission for action
- Review RLS policies in migration file

### "Phone auth not working"
- Enable Phone provider in Supabase Dashboard
- For testing: use Supabase's test OTP feature
- For production: configure Twilio

### "Khmer text not displaying"
- Ensure Noto Sans Khmer font is loaded
- Check database has pg_trgm extension
- Verify UTF-8 encoding

## What's Next?

### Ready for Phase 3: Core Features

1. **Listings System**
   - Create/edit/delete listings
   - Image upload to Supabase Storage
   - SEO-optimized listing pages

2. **Search & Browse**
   - Home feed with infinite scroll
   - Full-text search
   - Category filters

3. **Auction System**
   - Real-time bidding (Socket.IO)
   - Live countdowns
   - Winner notifications

4. **Chat System**
   - Real-time messaging
   - Unread counts
   - Typing indicators

## Resources

- 📚 [Full Setup Guide](./PHASE2-SETUP.md)
- ✅ [Phase 2 Completion Report](./PHASE2-COMPLETE.md)
- 🏗️ [Architecture Overview](./README-ARCH.md)
- 📊 [Database Schema](./supabase/migrations/20251015000000_initial_schema.sql)

## Need Help?

Check the detailed documentation:
- Database issues → `PHASE2-SETUP.md`
- Schema reference → `supabase/migrations/*.sql`
- Type reference → `lib/database.types.ts`
- Auth reference → `lib/auth.ts`

---

**Status**: Phase 2 Complete ✅ | Ready for Phase 3 🚀
