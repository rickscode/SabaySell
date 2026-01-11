import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { generateCategoryMetadata } from '@/lib/seo/metadata';
import { getCategoryBySlug } from '@/lib/constants/categories';

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const { name } = await params;
  const categoryName = decodeURIComponent(name);

  // Try to map the category name to slug
  // Since URLs might use full names like "Mobile Phones", we need to handle both
  const categorySlugMap: Record<string, string> = {
    "Mobile Phones": "phones",
    "Tablets & iPads": "tablets",
    "Laptops & Computers": "laptops",
    "Accessories": "accessories",
    // Also support direct slug access
    "phones": "phones",
    "tablets": "tablets",
    "laptops": "laptops",
    "accessories": "accessories",
  };

  const slug = categorySlugMap[categoryName];

  if (!slug) {
    redirect('/');
  }

  const categoryConfig = getCategoryBySlug(slug);

  // Route guard: Redirect to homepage if category is disabled
  if (!categoryConfig || !categoryConfig.enabled) {
    redirect('/');
  }

  return generateCategoryMetadata(slug);
}

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
}
