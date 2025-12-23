import type { Metadata } from 'next';
import { getCategoryBySlug } from '@/lib/constants/categories';

export function generateCategoryMetadata(categorySlug: string): Metadata {
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    return { title: 'Category Not Found | SabaySell' };
  }

  return {
    title: category.seoTitle,
    description: category.seoDescription,
    keywords: category.seoKeywords,
    openGraph: {
      title: category.seoTitle,
      description: category.seoDescription,
      type: 'website',
      locale: 'en_US',
      alternateLocale: 'km_KH',
    },
    alternates: {
      canonical: `https://sabaysell.com/${categorySlug}`,
    },
  };
}

export function generateHomepageMetadata(): Metadata {
  return {
    title: "Buy & Sell iPhone, iPad, MacBook, Laptops in Cambodia | SabaySell",
    description: "Cambodia's #1 marketplace for electronics. Buy & sell iPhones, iPads, MacBooks, Samsung phones, gaming laptops. New & used. Phnom Penh, Siem Reap. Free listings.",
    keywords: ["buy iphone cambodia", "sell iphone phnom penh", "buy ipad phnom penh", "sell my phone cambodia", "macbook cambodia", "sell laptop phnom penh", "samsung phone cambodia", "laptop cambodia"],
    openGraph: {
      title: "Buy & Sell iPhone, iPad, MacBook, Laptops in Cambodia | SabaySell",
      description: "Cambodia's #1 electronics marketplace. Free listings. Trusted sellers.",
      type: 'website',
      locale: 'km_KH',
      alternateLocale: 'en_US',
    },
  };
}
