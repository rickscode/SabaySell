/**
 * Site Branding Configuration
 *
 * Customize your marketplace by editing these values.
 * This centralized config makes it easy to rebrand the entire application.
 */

export const SITE_CONFIG = {
  // Site Identity
  name: "Marketplace Template",
  tagline: "Buy and sell with confidence",
  description: "A full-stack marketplace built with Next.js and Supabase",

  // Localization
  defaultLocale: "en" as const,
  supportedLocales: ["en", "km"] as const, // Example: English, Khmer

  // Currency
  currency: "USD" as const,
  currencySymbol: "$",

  // Contact & Support
  supportEmail: "support@example.com",
  contactEmail: "contact@example.com",

  // Social Media (Optional)
  social: {
    twitter: "",
    facebook: "",
    instagram: "",
    youtube: "",
  },

  // SEO Defaults
  seo: {
    defaultTitle: "Marketplace Template - Buy & Sell Online",
    titleTemplate: "%s | Marketplace Template",
    defaultDescription: "A modern marketplace for buying and selling products with auctions, real-time messaging, and secure payments.",
    siteUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    ogImage: "/og-image.png",
  },

  // Features
  features: {
    enableAuctions: true,
    enableMessaging: true,
    enableBoosts: true,
    enableReviews: false, // Future feature
    enableNotifications: false, // Future feature
  },
} as const;

/**
 * Category Configuration
 *
 * The template uses electronics categories as an example.
 * You can customize categories in lib/constants/categories.ts
 *
 * See docs/CUSTOMIZATION.md for how to add your own categories.
 */

export type SupportedLocale = typeof SITE_CONFIG.supportedLocales[number];
export type Currency = typeof SITE_CONFIG.currency;
