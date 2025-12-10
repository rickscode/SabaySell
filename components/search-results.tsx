"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Grid3x3,
  List,
  X,
} from "lucide-react";
import { Product, ProductCard } from "./product-card";
import { FiltersSidebar } from "./filters-sidebar";

interface SearchResultsProps {
  searchQuery: string;
  onBack: () => void;
  onProductClick: (product: Product) => void;
  onSearchChange: (query: string) => void;
  products: Product[];
  onSaveToWatchlist?: (product: Product) => void;
  onBuyNow?: (product: Product) => void;
  onMakeOffer?: (product: Product) => void;
}

export function SearchResults({
  searchQuery,
  onBack,
  onProductClick,
  onSearchChange,
  products,
  onSaveToWatchlist,
  onBuyNow,
  onMakeOffer,
}: SearchResultsProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [recentSearches] = useState([
    "MacBook Pro",
    "iPhone 15",
    "Canon Camera",
    "Headphones",
  ]);

  const handleSearch = () => {
    onSearchChange(localSearchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleRecentSearchClick = (query: string) => {
    setLocalSearchQuery(query);
    onSearchChange(query);
  };

  const clearSearch = () => {
    setLocalSearchQuery("");
    onSearchChange("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1 flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search for anything..."
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 pr-10"
                />
                {localSearchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-1/2 -translate-y-1/2"
                    onClick={clearSearch}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
                Search
              </Button>
            </div>
          </div>

          {/* Search Info */}
          <div className="flex items-center justify-between">
            <div>
              {searchQuery ? (
                <p className="text-sm text-gray-600">
                  Search results for <span className="font-medium">"{searchQuery}"</span>
                </p>
              ) : (
                <p className="text-sm text-gray-600">Enter a search term to find items</p>
              )}
            </div>
          </div>

          {/* Recent Searches */}
          {!searchQuery && recentSearches.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Recent Searches</p>
              <div className="flex gap-2 flex-wrap">
                {recentSearches.map((search, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleRecentSearchClick(search)}
                  >
                    {search}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {searchQuery ? (
          <>
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
                {products.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="mb-2">No results found</h3>
                    <p className="text-gray-600 mb-4">
                      Try different keywords or remove some filters
                    </p>
                    <Button variant="outline" onClick={clearSearch}>
                      Clear Search
                    </Button>
                  </div>
                ) : (
                  <>
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
                                  <div className="text-sm text-red-600 mt-1">
                                    {product.timeLeft}
                                  </div>
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
                        Load More Results
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="mb-2">Start Your Search</h3>
            <p className="text-gray-600">
              Enter keywords to find products you're looking for
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
