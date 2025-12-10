"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { ArrowLeft, SlidersHorizontal, Grid3x3, List } from "lucide-react";
import { Product, ProductCard } from "./product-card";
import { FiltersSidebar } from "./filters-sidebar";

interface CategoryBrowseProps {
  category: string;
  onBack: () => void;
  onProductClick: (product: Product) => void;
  products: Product[];
  onSaveToWatchlist?: (product: Product) => void;
  onBuyNow?: (product: Product) => void;
  onMakeOffer?: (product: Product) => void;
}

const subcategories: Record<string, string[]> = {
  Electronics: ["Laptops", "Desktops", "Tablets", "Components", "Accessories"],
  "Mobile Phones": ["Smartphones", "Feature Phones", "Accessories", "Parts"],
  Cameras: ["DSLR", "Mirrorless", "Point & Shoot", "Lenses", "Accessories"],
  Audio: ["Headphones", "Speakers", "Amplifiers", "Microphones", "DJ Equipment"],
  Watches: ["Smart Watches", "Luxury Watches", "Sport Watches", "Vintage", "Accessories"],
  "Home & Garden": ["Furniture", "Decor", "Kitchen", "Garden", "Storage"],
  Fashion: ["Clothing", "Shoes", "Bags", "Accessories", "Jewelry"],
  Books: ["Fiction", "Non-Fiction", "Educational", "Comics", "Rare Books"],
};

export function CategoryBrowse({
  category,
  onBack,
  onProductClick,
  products,
  onSaveToWatchlist,
  onBuyNow,
  onMakeOffer,
}: CategoryBrowseProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");

  const categorySubcategories = subcategories[category] || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1>{category}</h1>
              <p className="text-sm text-gray-600">{products.length} items available</p>
            </div>
          </div>

          {/* Subcategories */}
          {categorySubcategories.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <Button
                variant={selectedSubcategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSubcategory("all")}
                className={
                  selectedSubcategory === "all" ? "bg-blue-600 hover:bg-blue-700" : ""
                }
              >
                All
              </Button>
              {categorySubcategories.map((sub) => (
                <Button
                  key={sub}
                  variant={selectedSubcategory === sub ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSubcategory(sub)}
                  className={
                    selectedSubcategory === sub ? "bg-blue-600 hover:bg-blue-700" : ""
                  }
                >
                  {sub}
                </Button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Filters and Sort Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {/* Mobile Filter Button */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <FiltersSidebar onClose={() => setIsFilterOpen(false)} isMobile />
              </SheetContent>
            </Sheet>

            <span className="text-sm text-gray-600">
              <span className="hidden sm:inline">Showing </span>
              {products.length} results
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center border rounded-lg p-1">
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${viewMode === "grid" ? "bg-gray-100" : ""}`}
                onClick={() => setViewMode("grid")}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${viewMode === "list" ? "bg-gray-100" : ""}`}
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            {/* Sort */}
            <Select defaultValue="best-match">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="best-match">Best Match</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="ending">Ending Soonest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <FiltersSidebar />
          </aside>

          {/* Product Grid/List */}
          <div className="flex-1">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div key={product.id} onClick={() => onProductClick(product)}>
                    <ProductCard 
                      product={product}
                      onSaveToWatchlist={onSaveToWatchlist}
                      onBuyNow={onBuyNow}
                      onMakeOffer={onMakeOffer}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => onProductClick(product)}
                    className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex gap-4">
                      <div className="w-32 h-32 shrink-0">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="mb-2 line-clamp-2">{product.title}</h3>
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <Badge variant="outline">{product.condition}</Badge>
                          {product.auction ? (
                            <>
                              <Badge variant="secondary">Auction</Badge>
                              {product.bids && <Badge>{product.bids} bids</Badge>}
                            </>
                          ) : (
                            <Badge className="bg-[#fa6723]">Buy Now</Badge>
                          )}
                        </div>
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-xl">${product.price.toFixed(2)}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              ${product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {product.shipping} • {product.location}
                        </div>
                        {product.timeLeft && (
                          <div className="text-sm text-red-600 mt-1">{product.timeLeft}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Load More */}
            <div className="mt-8 text-center">
              <Button variant="outline" size="lg">
                Load More Items
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
