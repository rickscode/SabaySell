# Customization Guide

This guide explains how to customize the Next.js Marketplace Template for your specific use case.

---

## 1. Branding & Site Configuration

### Quick Rebrand
Edit `lib/config/branding.ts` to customize your marketplace:

```typescript
export const SITE_CONFIG = {
  // Site Identity
  name: "Your Marketplace Name",
  tagline: "Your unique value proposition",
  description: "A brief description of your marketplace",

  // Localization
  defaultLocale: "en",
  supportedLocales: ["en"], // Add more: ["en", "es", "fr"]

  // Currency
  currency: "USD",
  currencySymbol: "$",

  // Contact
  supportEmail: "support@yourmarketplace.com",
  contactEmail: "contact@yourmarketplace.com",

  // Social Media
  social: {
    twitter: "https://twitter.com/yourhandle",
    facebook: "https://facebook.com/yourpage",
    instagram: "https://instagram.com/yourhandle",
  },

  // SEO
  seo: {
    defaultTitle: "Your Marketplace - Buy & Sell Online",
    titleTemplate: "%s | Your Marketplace",
    defaultDescription: "Your marketplace description for SEO",
    siteUrl: "https://yourmarketplace.com",
  },

  // Features
  features: {
    enableAuctions: true,      // Toggle auction functionality
    enableMessaging: true,      // Toggle in-app messaging
    enableBoosts: true,         // Toggle paid promotions
    enableReviews: false,       // Future feature
    enableNotifications: false, // Future feature
  },
}
```

### Update Favicon & Logo
1. Replace `public/favicon.ico` with your icon
2. Update logo in `app/layout.tsx` or create a Logo component
3. Update `public/manifest.json` for PWA support

---

## 2. Categories & Products

### Changing Categories
The template uses electronics as an example. To add your own categories:

#### Step 1: Define Category Types
Edit `lib/constants/categories.ts`:

```typescript
// Replace electronics with your category type
export type YourCategory =
  | "Category 1"
  | "Category 2"
  | "Category 3";

export interface CategoryConfig {
  id: YourCategory;
  slug: string;
  icon: string; // Lucide icon name
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  subcategories: string[];
  enabled: boolean;
}
```

#### Step 2: Configure Categories
```typescript
export const YOUR_CATEGORIES: Record<YourCategory, CategoryConfig> = {
  "Category 1": {
    id: "Category 1",
    slug: "category-1",
    icon: "Package", // Lucide React icon name
    seoTitle: "Buy & Sell Category 1 | Your Marketplace",
    seoDescription: "Your category description for SEO",
    seoKeywords: ["keyword1", "keyword2", "keyword3"],
    subcategories: ["Subcategory A", "Subcategory B"],
    enabled: true
  },
  // Add more categories...
};
```

#### Step 3: Update Database Schema
If your products need different fields than electronics (brand, model, storage):

1. Edit `supabase/migrations/20251015000000_initial_schema.sql`
2. Modify the `listings` table to add/remove columns:
```sql
-- Example: Replace electronics fields with your own
ALTER TABLE listings
  DROP COLUMN IF EXISTS brand,
  DROP COLUMN IF EXISTS model,
  ADD COLUMN your_field_1 TEXT,
  ADD COLUMN your_field_2 INTEGER;
```
3. Run migration: `supabase db push`

#### Step 4: Update TypeScript Types
Edit `lib/database.types.ts` to match your schema changes.

#### Step 5: Update Create Listing Form
Edit `components/create-listing.tsx` to reflect your new fields and remove electronics-specific inputs.

---

## 3. Styling & Theme

### Colors
Edit `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: "#your-color",
        foreground: "#ffffff",
      },
      // Add more custom colors
    }
  }
}
```

### Global Styles
Edit `app/globals.css` for global style overrides.

### Component Styling
shadcn/ui components are in `components/ui/`. Customize them or generate new ones:

```bash
npx shadcn-ui@latest add button
```

---

## 4. Feature Toggles

### Disable Auctions
To convert to fixed-price only:

1. Set in `lib/config/branding.ts`:
```typescript
features: {
  enableAuctions: false,
}
```

2. Or use feature flags in components:
```typescript
const ENABLE_AUCTIONS = false;
```

This will:
- Hide auction creation in listing form
- Hide bidding UI on product pages
- Show only "Buy Now" prices

### Disable In-App Messaging
To use external messaging (WhatsApp, Telegram):

1. Set in `lib/config/branding.ts`:
```typescript
features: {
  enableMessaging: false,
}
```

2. Update `components/product-detail.tsx` to show contact buttons instead:
```typescript
// Show WhatsApp/Telegram buttons
<a href={`https://wa.me/${sellerPhone}`}>Contact on WhatsApp</a>
```

---

## 5. Internationalization (i18n)

### Add a New Language

#### Step 1: Add Language to Config
Edit `lib/config/branding.ts`:
```typescript
supportedLocales: ["en", "es", "fr"], // Add Spanish, French, etc.
```

#### Step 2: Create Translation Files
Create `public/locales/es/common.json`:
```json
{
  "navigation": {
    "home": "Inicio",
    "browse": "Explorar",
    "sell": "Vender"
  }
  // Add more translations
}
```

#### Step 3: Use Translations
```typescript
import { useTranslation } from 'react-i18next';

function Component() {
  const { t } = useTranslation();
  return <h1>{t('navigation.home')}</h1>;
}
```

---

## 6. Authentication

### Add More OAuth Providers

Supabase supports many OAuth providers. To add one:

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable provider (GitHub, Twitter, etc.)
3. Update `app/auth/login/page.tsx`:
```typescript
<Button onClick={() => supabase.auth.signInWithOAuth({ provider: 'github' })}>
  Continue with GitHub
</Button>
```

### Email/Password Authentication
To enable email/password signup:

1. Enable in Supabase Dashboard → Authentication → Providers
2. Create signup/login forms in `app/auth/`
3. Use Supabase Auth methods:
```typescript
supabase.auth.signUp({ email, password })
supabase.auth.signInWithPassword({ email, password })
```

---

## 7. Payment Integration

### Configure PayPal (Boost System)
The template includes PayPal integration for promoted listings:

1. Get PayPal API credentials
2. Add to `.env.local`:
```env
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_SECRET=your_secret
```
3. Test boost flow in `app/boost-payment/page.tsx`

### Add Stripe Integration
To add Stripe for transactions:

1. Install Stripe SDK:
```bash
npm install @stripe/stripe-js stripe
```

2. Add environment variables:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

3. Create API route `app/api/create-payment-intent/route.ts`
4. Integrate in checkout flow

---

## 8. Database Customization

### Add New Tables
To add features, create new migrations:

```bash
# Create new migration file
supabase migration new add_reviews_table
```

Edit the migration file:
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  listing_id UUID REFERENCES listings(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all reviews"
  ON reviews FOR SELECT
  USING (true);
```

Apply migration:
```bash
supabase db push
```

### Modify Existing Tables
Create a new migration to alter existing tables:
```sql
ALTER TABLE listings ADD COLUMN featured BOOLEAN DEFAULT false;
```

---

## 9. SEO Optimization

### Dynamic Metadata
Edit `app/category/[name]/page.tsx` and `app/product/[id]/page.tsx` to customize metadata:

```typescript
export async function generateMetadata({ params }) {
  const product = await getProduct(params.id);

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      images: [product.images[0]],
    },
  };
}
```

### Sitemap
Create `app/sitemap.ts`:
```typescript
export default function sitemap() {
  return [
    {
      url: 'https://yoursite.com',
      lastModified: new Date(),
    },
    // Add more URLs
  ];
}
```

---

## 10. Deployment Customization

### Environment Variables by Environment
Create different `.env` files:
- `.env.local` - Local development
- `.env.production` - Production (set in Vercel/Railway)

### Custom Domain
1. Add domain in Vercel/Netlify
2. Update `NEXT_PUBLIC_APP_URL` in production env vars
3. Update OAuth redirect URLs in Supabase

---

## Common Customization Examples

### 1. Car Marketplace
- Categories: SUVs, Sedans, Trucks
- Custom fields: Make, Model, Year, Mileage
- Remove auctions, keep fixed-price
- Add VIN validation

### 2. Real Estate Marketplace
- Categories: Houses, Apartments, Commercial
- Custom fields: Bedrooms, Bathrooms, Square Feet
- Keep auctions for bidding wars
- Add map integration (Google Maps API)

### 3. Fashion Marketplace
- Categories: Men, Women, Kids, Accessories
- Custom fields: Size, Brand, Condition
- Remove messaging, use contact buttons
- Add Instagram integration

---

## Need Help?

- Check `DEVELOPMENT_HISTORY.md` for implementation details
- Review existing code for patterns
- Open GitHub issues for bugs or questions

---

**Remember:** After any database schema changes, regenerate TypeScript types:
```bash
supabase gen types typescript --project-id your-project-id > lib/database.types.ts
```
