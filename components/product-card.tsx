"use client";

import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Heart, ShoppingCart, DollarSign, Star, Flame } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  condition: string;
  shipping: string;
  location: string;
  bids?: number;
  timeLeft?: string;
  buyNow?: boolean;
  auction?: boolean;
  isFavorited?: boolean;
  active_boost?: {
    id: string;
    type: 'featured' | 'top_category';
    ends_at: string;
  } | null;
}

interface ProductCardProps {
  product: Product;
  onSaveToWatchlist?: (product: Product) => void;
  onBuyNow?: (product: Product) => void;
  onMakeOffer?: (product: Product) => void;
  isLoading?: boolean;
}

export function ProductCard({ product, onSaveToWatchlist, onBuyNow, onMakeOffer, isLoading }: ProductCardProps) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors disabled:opacity-50"
          onClick={(e) => {
            e.stopPropagation();
            onSaveToWatchlist?.(product);
          }}
          disabled={isLoading}
        >
          <Heart
            className={`w-4 h-4 ${product.isFavorited ? 'fill-red-500 text-red-500' : ''}`}
          />
        </button>

        {/* Boost badges - prominently displayed */}
        {product.active_boost?.type === 'featured' && (
          <Badge className="absolute top-2 left-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold shadow-lg flex items-center gap-1">
            <Star className="w-3 h-3 fill-white" />
            FEATURED
          </Badge>
        )}
        {product.active_boost?.type === 'top_category' && (
          <Badge className="absolute top-2 left-2 bg-[#fa6723] hover:bg-[#e55a1f] text-white font-semibold shadow-lg flex items-center gap-1">
            <Flame className="w-3 h-3 fill-white" />
            FEATURED
          </Badge>
        )}

        {/* Discount badge - shown below boost badge if both exist */}
        {discount > 0 && (
          <Badge className={`absolute left-2 bg-red-500 hover:bg-red-600 ${product.active_boost ? 'top-12' : 'top-2'}`}>
            {discount}% OFF
          </Badge>
        )}

        {product.auction && product.timeLeft && (
          <Badge className="absolute bottom-2 left-2 bg-[#fa6723] hover:bg-[#e55a1f]">
            {product.timeLeft}
          </Badge>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="line-clamp-2 text-gray-800 mb-2 min-h-[2.5rem]">
          {product.title}
        </h3>
        
        <div className="flex items-center gap-2 mb-2">
          <span className="text-gray-900">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-gray-400 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {product.bids !== undefined && (
          <p className="text-sm text-gray-600 mb-1">{product.bids} bids</p>
        )}
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span className="truncate">{product.shipping}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {product.condition}
          </Badge>
          <span className="text-xs text-gray-500">{product.location}</span>
        </div>

        {product.buyNow && (
          <button 
            className="w-full mt-3 flex items-center justify-center gap-2 bg-[#fa6723] text-white py-2 px-4 rounded-md hover:bg-[#e55a1f] transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onBuyNow?.(product);
            }}
          >
            <ShoppingCart className="w-4 h-4" />
            Buy Now
          </button>
        )}

        {product.auction && (
          <button 
            className="w-full mt-3 flex items-center justify-center gap-2 bg-[#fa6723] text-white py-2 px-4 rounded-md hover:bg-[#e55a1f] transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onMakeOffer?.(product);
            }}
          >
            <DollarSign className="w-4 h-4" />
            Make Offer
          </button>
        )}
      </div>
    </Card>
  );
}
