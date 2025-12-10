"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getListings } from "@/lib/queries/listings";
import { ProductCard } from "@/components/product-card";
import { FiltersSidebar } from "@/components/filters-sidebar";
import { Loader2, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { ListingWithImages } from "@/lib/database.types";

export default function ListingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<ListingWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || undefined,
    priceMin: searchParams.get('priceMin') ? parseFloat(searchParams.get('priceMin')!) : undefined,
    priceMax: searchParams.get('priceMax') ? parseFloat(searchParams.get('priceMax')!) : undefined,
  });

  useEffect(() => {
    async function fetchListings() {
      try {
        const { data } = await getListings(filters, { sortBy: 'newest', limit: 50 });
        setListings(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, [filters]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const convertToProduct = (listing: ListingWithImages) => {
    const primaryImage = (listing as any).images?.find((img: any) => img.is_primary) || (listing as any).images?.[0];
    return {
      id: listing.id,
      title: (listing as any).title_en || (listing as any).title_km || "Untitled",
      price: (listing as any).price || 0,
      image: primaryImage?.url || "/placeholder-image.png",
      condition: (listing as any).condition || "used",
      location: (listing as any).location || "",
      buyNow: (listing as any).type === "fixed",
      auction: (listing as any).type === "auction",
      shipping: "Contact seller",
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Browse Listings</h1>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <FiltersSidebar onFilterChange={handleFilterChange} />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-24">
              <FiltersSidebar onFilterChange={handleFilterChange} />
            </div>
          </aside>

          {/* Listings Grid */}
          <main className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#fa6723]" />
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No listings found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {listings.map((listing) => (
                  <ProductCard
                    key={listing.id}
                    product={convertToProduct(listing)}
                    onAddToWatchlist={() => {}}
                    onClick={() => router.push(`/listings/${listing.id}`)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
