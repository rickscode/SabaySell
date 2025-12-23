import type { Metadata } from 'next';
import { generateCategoryMetadata } from '@/lib/seo/metadata';

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

  const slug = categorySlugMap[categoryName] || "phones";
  return generateCategoryMetadata(slug);
}

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
}
