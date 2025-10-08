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
   * Payments handled via **ABA Pay QR** (manual webhook confirm at first).

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
* Power-seller subscriptions.
* Local ad network.
* Native mobile apps.

---

## Developer Notes

* **Auction logic:** use Postgres transactions (`SELECT ... FOR UPDATE`) for atomic bidding.
* **Search:** start with Postgres full-text + trigram, later upgrade to Elasticsearch.
* **Notifications:** auction closing worker can run as a cron/worker (Render Starter tier).
* **Scaling path:** move DB off free tier when approaching 500 MB, add Redis for real-time scale, adopt CDN for images.

---

⚡ **Instruction to Codex/GPT-5**:
When writing code, **always assume you are contributing to this system**.
Use **TypeScript**, **Next.js (PWA)**, **Supabase (Postgres/Auth/Storage)**, and **Socket.IO**.
Focus on clarity, reliability, and Cambodia’s context (mobile-first, Khmer/English, SMS OTP).

---
