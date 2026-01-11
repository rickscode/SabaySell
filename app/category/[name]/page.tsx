"use client";

import { useRouter, useParams } from "next/navigation";
import { CategoryBrowse } from "@/components/category-browse";
import { useState, useEffect } from "react";
import { getListings } from "@/lib/queries/listings";
import type { ListingWithImages } from "@/lib/database.types";
import type { Product } from "@/components/product-card";
import { getCategoryBySlug } from "@/lib/constants/categories";

// Helper function to convert database listing to Product format
function convertListingToProduct(listing: any): Product {
  const primaryImage = (listing.images as any[])?.find((img: any) => img.is_primary) || (listing.images as any[])?.[0];

  return {
    id: listing.id,
    title: listing.title_en || "Untitled",
    price: listing.price || 0,
    image: primaryImage?.url || "/placeholder-product.jpg",
    condition: listing.condition ? listing.condition.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : "New",
    shipping: "Free shipping",
    location: listing.location || "Cambodia",
    buyNow: listing.type === 'fixed',
    auction: listing.type === 'auction',
    active_boost: listing.active_boost || null,
  };
}

export default function CategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryName = decodeURIComponent(params.name as string);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Route guard: Redirect to homepage if category is disabled
  useEffect(() => {
    const categorySlugMap: Record<string, string> = {
      "Mobile Phones": "phones",
      "Tablets & iPads": "tablets",
      "Laptops & Computers": "laptops",
      "Accessories": "accessories",
      "phones": "phones",
      "tablets": "tablets",
      "laptops": "laptops",
      "accessories": "accessories",
    };

    const categorySlug = categorySlugMap[categoryName];
    const categoryConfig = getCategoryBySlug(categorySlug);

    if (!categoryConfig || !categoryConfig.enabled) {
      router.push('/');
    }
  }, [categoryName, router]);

  // Load listings for this category
  useEffect(() => {
    async function loadCategoryListings() {
      try {
        const { data: listings } = await getListings(
          { category: categoryName },
          { sortBy: 'newest', limit: 100 }
        );
        const convertedProducts = listings.map(convertListingToProduct);
        setProducts(convertedProducts);
      } catch (error) {
        console.error('Error loading category listings:', error);
      } finally {
        setLoading(false);
      }
    }

    loadCategoryListings();
  }, [categoryName]);

  const handleBack = () => {
    router.push('/');
  };

  const handleProductClick = (product: Product) => {
    router.push(`/listings/${product.id}`);
  };

  const handleSaveToWatchlist = (product: Product) => {
    // TODO: Implement watchlist functionality
    console.log('Save to watchlist:', product);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fa6723] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading {categoryName}...</p>
        </div>
      </div>
    );
  }

  return (
    <CategoryBrowse
      category={categoryName}
      onBack={handleBack}
      onProductClick={handleProductClick}
      products={products}
      onSaveToWatchlist={handleSaveToWatchlist}
      onBuyNow={handleProductClick}
      onMakeOffer={handleProductClick}
    />
  );
}
