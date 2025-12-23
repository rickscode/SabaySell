# Tomorrow's Pre-Launch Cleanup Plan (Dec 23, 2025)

## 🎯 Goal
Clean up codebase, finalize content, and prepare for Vercel launch.

---

## 1. Footer Pages - Keep or Remove?

### Current Footer Pages (12 total):
1. ✅ **KEEP - Need Content**: `contact-us-page.tsx`
2. ✅ **KEEP - Need Content**: `company-info-page.tsx` (About Us)
3. ⚠️ **MAYBE KEEP**: `start-selling-page.tsx` (How to sell guide - could be useful)
4. ⚠️ **MAYBE KEEP**: `stores-page.tsx` (Seller directory - future feature)
5. ❌ **LIKELY REMOVE**: `registration-page.tsx` (Not used - OAuth login only)
6. ❌ **LIKELY REMOVE**: `bidding-help-page.tsx` (Auctions disabled for MVP)
7. ❌ **LIKELY REMOVE**: `news-page.tsx` (No news for MVP)
8. ❌ **LIKELY REMOVE**: `careers-page.tsx` (No hiring for MVP)
9. ❌ **LIKELY REMOVE**: `seller-help-page.tsx` (Duplicate of contact?)
10. ❌ **LIKELY REMOVE**: `resolution-center-page.tsx` (No disputes for MVP)
11. ❌ **LIKELY REMOVE**: `business-sellers-page.tsx` (Enterprise feature - post-MVP)
12. ❌ **LIKELY REMOVE**: `learn-to-sell-page.tsx` (Could combine with Start Selling?)

### Recommended Footer Structure (Minimal MVP):
```
Buy                    Sell                   About              Help
- Browse              - Start Selling        - About Us         - Contact Us
- [maybe] Stores      - [maybe] How to Sell  - [later] News     - [later] FAQ
```

**Content Needed**:
- **Contact Us**: Email, Telegram community, or contact form
- **About Us**: Brief story about SabaySell, mission, team (optional)
- **Start Selling**: 3-step guide (signup → create listing → get contacted via Telegram/WhatsApp)

---

## 2. Codebase Cleanup Tasks

### A. Remove Unused Files
**Decision needed**: Remove or keep commented code for future re-enable?
- Option 1: Keep all commented auction/messaging code (easier to re-enable later)
- Option 2: Remove completely, rely on git history (cleaner codebase)

**My Recommendation**: Keep commented code with feature flags - you worked hard on auctions/messaging!

### B. Files to Consider Removing
```bash
# Footer pages (if decided to remove):
components/bidding-help-page.tsx
components/news-page.tsx
components/careers-page.tsx
components/seller-help-page.tsx
components/resolution-center-page.tsx
components/business-sellers-page.tsx
components/learn-to-sell-page.tsx (maybe merge into start-selling)
components/registration-page.tsx

# Unused components (check if used):
# Run grep to check usage before deleting!
```

### C. Clean Up Console Logs
Search and remove development console.logs:
```bash
grep -r "console.log" app/ components/ lib/
# Review each one - keep error logs, remove debug logs
```

### D. Remove Mock Data
Check these files for hardcoded mock data:
- `components/product-detail.tsx` - Mock reviews?
- Any other components with placeholder data

### E. Environment Variables Check
Verify all required env vars are documented:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_SOCKET_URL (can disable for MVP)
NEXT_PUBLIC_APP_URL
```

---

## 3. GitHub Branch Strategy

### Create Dev Branch
```bash
# Make sure all changes are committed
git add .
git commit -m "MVP simplification complete - ready for cleanup"

# Create and push dev branch
git checkout -b dev
git push -u origin dev

# Switch back to main
git checkout main

# From now on:
# - Work on 'dev' branch
# - Merge to 'main' only for production deploys
```

### Branch Protection (on GitHub)
1. Go to repo Settings → Branches
2. Add rule for `main` branch:
   - Require pull request reviews
   - Require status checks to pass
   - No direct pushes to main

---

## 4. Final Testing Checklist

### User Flows to Test
- [ ] Signup (Google/Facebook OAuth)
- [ ] Create fixed-price listing with Telegram/WhatsApp (required)
- [ ] Browse electronics categories
- [ ] Search for "iphone" in Khmer and English
- [ ] Add to favorites/watchlist
- [ ] View product detail
- [ ] Click "Chat on Telegram" button → Opens `t.me/username`
- [ ] Click "Chat on WhatsApp" button → Opens `wa.me/+855...`
- [ ] Test with real Cambodian phone number format (+855...)
- [ ] Verify no auction features visible anywhere
- [ ] Verify no messaging features visible anywhere

### Performance Check
- [ ] Run Lighthouse audit (aim for 90+ score)
- [ ] Check image loading speed
- [ ] Test on mobile device
- [ ] Test on slow 3G connection (common in Cambodia)

### SEO Check
- [ ] Verify meta tags on all pages
- [ ] Check category pages have SEO titles/descriptions
- [ ] Verify structured data (if implemented)

---

## 5. Deployment Setup

### Your Architecture:
1. **Next.js App** → Vercel (free tier)
   - Frontend + Server Actions + API Routes
   - This is 90% of your app

2. **Socket.IO Server** → Railway or Render (NOT NEEDED FOR MVP!)
   - Port 3001 WebSocket server
   - Only needed when messaging is re-enabled
   - Can deploy later when you turn on `ENABLE_MESSAGING = true`

3. **Database** → Supabase (already cloud-hosted)
   - PostgreSQL + Storage
   - Already configured

### MVP Deployment (Messaging Disabled):

**GOOD NEWS**: Since you've hidden messaging (`ENABLE_MESSAGING = false`), you DON'T need to deploy the Socket.IO server yet! Just deploy Next.js to Vercel.

### Vercel Deployment Steps
```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview (test first)
vercel

# Deploy to production
vercel --prod
```

### Before Deploy to Vercel
- [ ] Create production Supabase project (if not already done)
- [ ] Set up environment variables in Vercel dashboard:
  ```
  NEXT_PUBLIC_SUPABASE_URL=your_prod_supabase_url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_prod_anon_key
  SUPABASE_SERVICE_ROLE_KEY=your_prod_service_role_key
  NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
  ```
- [ ] Remove Socket.IO env vars (not needed for MVP):
  - ~~NEXT_PUBLIC_SOCKET_URL~~ (skip for now)

### When You Re-Enable Messaging Later:

**Then you'll need Railway or Render for Socket.IO:**

**Railway** (Recommended):
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Create new project
railway init

# Deploy Socket.IO server
railway up
```

**OR Render**:
1. Create new "Web Service" on Render
2. Build command: `npm install`
3. Start command: `npm run socket`
4. Set environment variables
5. Deploy

### Post-Deployment
- [ ] Test all flows on production URL
- [ ] Verify Telegram/WhatsApp links work
- [ ] Submit to Google Search Console
- [ ] Create sitemap.xml
- [ ] Set up Google Analytics (optional)

---

## 6. Launch Readiness Checklist

### Must Have Before Launch
- [x] MVP features working (fixed-price, Telegram/WhatsApp)
- [x] Electronics categories with SEO
- [x] Cascading spec dropdowns
- [x] Favorites/Watchlist
- [x] Search (Khmer + English)
- [ ] Footer pages content written
- [ ] Codebase cleaned up
- [ ] Final testing complete
- [ ] Deployed to Vercel

### Nice to Have (Post-Launch)
- [ ] Google Analytics tracking
- [ ] Facebook Pixel (for ads later)
- [ ] Sitemap submitted to Google
- [ ] First 10 test listings created

---

## 7. Post-Launch Plan

### Week 1 After Launch
1. Monitor for bugs/errors
2. Gather user feedback from first sellers
3. Track Google Search Console impressions
4. Post in Cambodian Facebook groups (if allowed)
5. Get first real transactions

### Month 1 Goals
- 50-100 active listings
- 10+ successful Telegram/WhatsApp connections
- Google indexing key pages
- User feedback on what to improve

### When to Re-Enable Features
- **Auctions**: After 100+ active users and feedback requesting it
- **Messaging**: If users complain about Telegram/WhatsApp friction
- **Notifications**: If users miss important updates

---

## 8. Quick Wins for Tomorrow

**Priority Order** (Do these first):
1. ✅ Decide which footer pages to keep
2. ✅ Write content for Contact Us and About Us pages
3. ✅ Remove unused footer page files
4. ✅ Create `dev` branch on GitHub
5. ✅ Remove console.logs from production code
6. ✅ Test all user flows end-to-end
7. ✅ Deploy to Vercel
8. 🎉 **LAUNCH!**

---

**Estimated Time**: 4-6 hours for full cleanup and deployment
**You're 95% there!** Just need to polish and ship 🚀
