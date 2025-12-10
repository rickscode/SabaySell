# 🛍 Sabay Sell — Developer Brief

## Overview

**Sabay Sell** is a Cambodian online marketplace inspired by eBay.
It enables locals to **list unwanted or produced goods**, sell them either at **fixed prices or auctions**, and connect with buyers through **in-app chat**.

The core vision: **free to list** (to attract mass users), with monetization through **optional paid boosts** for visibility.
All payments and deliveries are handled **off-platform** (cash, ABA, Wing, etc.), so the app focuses only on listings, exposure, and user interaction.

---

## Core Features (MVP)

1. **Listings (Free)**

   * Sellers upload photos, set title, description, price, category, location.
   * Quick mobile-first flow (camera → post).
   * Khmer + English support.

2. **Auctions**

   * Sellers can choose “Auction” type instead of fixed price.
   * Define start price, bid increment, and end time.
   * Buyers place bids in real-time (Socket.IO).
   * Notifications: outbid, auction ending soon, you won.
   * At end: seller sees winner’s phone number to close the deal directly.

3. **Boosts (Monetization)**

   * Sellers can pay to **feature** or **highlight** their posts.
   * Boost types: “Featured,” “Top of Category,” “Urgent/Ending Soon.”
   * Payments handled via KHQR (bankong or aba merchant) but we dont have API access to aba payway as need a cambodian business reg number. We can generate qr codes so we need to think how link payment to a  user so there post is boostedand db update as (we wont have access to tradtional webhook confirm at first). 

4. **Search & Browse**

   * Search across Khmer + English titles/descriptions.
   * Filters: category, price, location, condition.
   * Infinite scroll feed.

5. **Chat**

   * Buyer ↔ seller messaging (WebSockets).
   * Features: unread counts, typing, report/block.
   * Simple moderation queue.

6. **Login & Identity**

   * Phone-number login via OTP (SMS).
   * Profiles with display name, ratings/reputation.

7. **Notifications**

   * Push (FCM) + SMS.
   * Events: OTP, new chat, outbid, auction ending soon.

8. **Admin Panel**

   * Manage users, listings, boosts, reports.
   * Ban/unban users, remove posts, refund boosts.

---

## Technical Constraints

* **Budget:** <$100/month infra at start.
* **Hosting:** Render (Free/Starter).
* **Database/Auth/Storage:** Supabase Free (500 MB DB, 1 GB storage).
* **Realtime:** Socket.IO over WebSockets.
* **Images:** Supabase Storage or Cloudflare R2.
* **Payments:** ABA Pay QR (for boosts only).
* **Language:** Khmer + English.

* **Device focus:** Mobile-first PWA (Next.js).

---

## Initial Data Model (Simplified)

* **Users**: id, phone, display_name, ratings.
* **Listings**: id, user_id, type (fixed/auction), title, desc, category, price, location, status.
* **Images**: listing_id, storage_path.
* **Auctions**: listing_id, start_price, min_increment, ends_at, status.
* **Bids**: auction_id, user_id, amount, timestamp.
* **Threads/Messages**: buyer_id, seller_id, listing_id, body, timestamp.

* **Boosts**: listing_id, type, status, start/end.
* **Transactions**: id, user_id, amount, type, provider, status.
* **Reports**: reporter_id, target_id, reason, status.

---

## Future Roadmap (Post-MVP)

* Delivery integrations (Nham24/Grab).
* Buyer protection via escrow.
* Power-seller subscriptions (online shops).
* Local ad network.
* Native mobile apps.
* Sell afvertising space once all eyeballs on app and usage is high

---

## Developer Notes

* **Auction logic:** use Postgres transactions (`SELECT ... FOR UPDATE`) for atomic bidding.
* **Search:** start with Postgres full-text + trigram, later upgrade to Elasticsearch.
* **Notifications:** auction closing worker can run as a cron/worker (Render Starter tier).
* **Scaling path:** move DB off free tier when approaching 500 MB, add Redis for real-time scale, adopt CDN for images.

---

## SEO Strategy (Critical for Marketplace Growth)

### Technical SEO Foundation
* **Next.js App Router:** Server-side rendering for all listing pages
* **Dynamic metadata:** Unique title, description, OG tags per listing
* **Structured data:** Schema.org Product/Offer markup for listings
* **Sitemap:** Auto-generated XML sitemap (categories, listings)
* **robots.txt:** Proper crawl rules
* **Canonical URLs:** Prevent duplicate content

### Content Optimization
* **URL structure:** `/listings/[category]/[id]-[slug]` (Khmer + English slugs)
* **Title format:** "[Product Name] - [Price] | [Category] | SabaySell"
* **Meta descriptions:** Auto-generated from listing desc (150-160 chars)
* **Image alt text:** Product title + category in Khmer/English
* **Open Graph:** Rich previews for Facebook/Telegram sharing

### Cambodia-Specific SEO
* **Khmer keywords:** Optimize for Khmer search terms (Google supports Khmer)
* **Local schema:** LocalBusiness markup with Cambodia location
* **Bilingual content:** Both km/en in meta tags for broader reach
* **Mobile-first:** Google's mobile-first indexing (critical for Cambodia)

### Performance (SEO Ranking Factor)
* **Core Web Vitals:** Target LCP <2.5s, FID <100ms, CLS <0.1
* **Image optimization:** WebP format, lazy loading, responsive images
* **Code splitting:** Route-based chunking in Next.js
* **CDN:** Cloudflare for static assets (free tier)

### Social & Growth
* **Facebook Open Graph:** Preview cards for sharing in groups/messenger
* **Telegram preview:** OG tags work in Telegram (popular in Cambodia)
* **PWA sharing:** Native share API for mobile
* **Backlinks:** Submit to Cambodian directories, Facebook groups

---

## Implementation Plan

### Phase 1: Foundation (Week 1-2)
1. **Project Setup**
   - Next.js 14 (App Router, TypeScript, Tailwind CSS)
   - PWA configuration (manifest, service worker)
   - i18n setup (next-i18next: km/en)
   - Noto Sans Khmer font

2. **Database Schema (Supabase)**
   - Users, Listings, Images, Auctions, Bids
   - Threads, Messages, Boosts, Transactions, Reports
   - Row Level Security (RLS) policies

3. **Authentication**
   - Supabase Auth (phone OTP via SMS)
   - Profile creation flow
   - Protected routes middleware

### Phase 2: Core Features (Week 3-5)
4. **Listings System**
   - Create listing flow (mobile-first, camera upload)
   - Image upload to Supabase Storage (max 6 images)
   - Fixed price vs Auction toggle
   - Edit/delete listings
   - SEO-optimized listing detail pages

5. **Search & Browse**
   - Home feed with infinite scroll
   - Postgres full-text search (pg_trgm for Khmer)
   - Filters: category, price, location, condition
   - Category pages with proper meta tags

6. **Auction System**
   - Real-time bidding (Socket.IO)
   - Atomic bid logic (Postgres transactions)
   - Live countdown timer
   - Winner notification

### Phase 3: Communication (Week 6-7)
7. **Real-time Chat**
   - Socket.IO messaging
   - Unread counts, typing indicators
   - Report/block functionality

8. **Notifications**
   - FCM push notifications
   - Events: outbid, auction ending, new message
   - SMS fallback for critical events

### Phase 4: Monetization (Week 8)
9. **Boost System (Manual Payment Verification)**
   - Generate unique KHQR codes with reference IDs
   - Screenshot upload flow
   - Admin approval panel
   - Auto-expire unverified boosts (24h)

10. **Admin Panel**
    - Payment verification (screenshot review)
    - User/listing moderation
    - Reports queue
    - Analytics dashboard

### Phase 5: SEO & Launch (Week 9-10)
11. **SEO Implementation**
    - Dynamic metadata per listing
    - Schema.org Product markup
    - Sitemap generation
    - robots.txt, canonical URLs
    - Open Graph tags for social sharing

12. **Performance Optimization**
    - Next.js Image component
    - Code splitting & lazy loading
    - Service worker caching
    - Core Web Vitals optimization

13. **Deployment & Testing**
    - Render deployment (render.yaml)
    - Supabase RLS testing
    - Mobile testing (Cambodia devices)
    - SEO audit (Google Search Console)
    - Full user flow testing

---

## Technology Stack Summary

| Component | Technology | Cost |
|-----------|-----------|------|
| **Frontend** | Next.js 14 (App Router) + Tailwind | Free |
| **Backend** | Next.js API Routes + Express + Socket.IO | Free |
| **Database** | Supabase PostgreSQL (500MB) | Free |
| **Auth** | Supabase Auth (phone OTP) | Free |
| **Storage** | Supabase Storage (1GB) | Free |
| **Hosting** | Render Free → Starter ($7 when needed) | $0-7 |
| **Real-time** | Socket.IO (WebSockets) | Free |
| **Notifications** | Firebase FCM | Free |
| **i18n** | next-i18next | Free |
| **SEO** | Next.js SSR + Schema.org | Free |
| **CDN** | Cloudflare (optional) | Free |
| **Total** | | **$0-7/month** |

---
