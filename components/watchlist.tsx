"use client";

import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Heart, Trash2, MessageCircle, Phone } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Product } from "./product-card";

export interface WatchlistItem {
  product: Product;
  savedAt: Date;
}

interface WatchlistProps {
  items: WatchlistItem[];
  onRemoveItem: (productId: string) => void;
  onViewProduct: (product: Product) => void;
  onContactSeller: (product: Product) => void;
  onContinueBrowsing: () => void;
}

export function Watchlist({
  items,
  onRemoveItem,
  onViewProduct,
  onContactSeller,
  onContinueBrowsing,
}: WatchlistProps) {
  const watchlistItems = items || [];

  if (watchlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Card className="p-12 text-center">
            <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="mb-2">Your watchlist is empty</h2>
            <p className="text-gray-600 mb-6">
              Save items you're interested in to view them later
            </p>
            <Button onClick={onContinueBrowsing} className="bg-[#fa6723] hover:bg-[#e55a1f]">
              Browse Items
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="mb-2">My Watchlist</h1>
          <p className="text-gray-600">{watchlistItems.length} items saved</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {watchlistItems.map((item) => (
            <Card key={item.product.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex gap-4">
                {/* Product Image */}
                <div 
                  className="w-32 h-32 bg-gray-100 rounded-md overflow-hidden shrink-0 cursor-pointer"
                  onClick={() => onViewProduct(item.product)}
                >
                  <ImageWithFallback
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-4 mb-2">
                    <h3 
                      className="line-clamp-2 cursor-pointer hover:text-[#fa6723]"
                      onClick={() => onViewProduct(item.product)}
                    >
                      {item.product.title}
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveItem(item.product.id)}
                      className="shrink-0"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {item.product.auction ? (
                      <Badge className="bg-orange-500">Auction</Badge>
                    ) : (
                      <Badge className="bg-[#fa6723]">Buy Now</Badge>
                    )}
                    <Badge variant="outline">{item.product.condition}</Badge>
                    <span className="text-sm text-gray-600">
                      {item.product.location}
                    </span>
                  </div>

                  <div className="mb-3">
                    {item.product.auction ? (
                      <div>
                        <p className="text-sm text-gray-600">Current bid</p>
                        <p className="text-gray-900">${item.product.price.toFixed(2)}</p>
                      </div>
                    ) : (
                      <p className="text-gray-900">${item.product.price.toFixed(2)}</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => onContactSeller(item.product)}
                      className="bg-[#fa6723] hover:bg-[#e55a1f]"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact Seller
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => onViewProduct(item.product)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-6">
          <Button variant="outline" onClick={onContinueBrowsing}>
            Continue Browsing
          </Button>
        </div>
      </div>
    </div>
  );
}
