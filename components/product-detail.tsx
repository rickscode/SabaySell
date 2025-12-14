"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Heart,
  Share2,
  Star,
  MapPin,
  Truck,
  Shield,
  Clock,
  MessageSquare,
  MessageCircle,
  ChevronLeft,
  Plus,
  Minus,
  Phone,
  DollarSign,
  Gavel,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Product } from "./product-card";
import { ProductCard } from "./product-card";
import { placeBid } from "@/app/actions/auctions";
import { toast } from "sonner";

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  similarProducts: Product[];
  onContactSeller: (product: Product, initialMessage?: string, startInOfferMode?: boolean) => void;
  onSaveToWatchlist: (product: Product) => void;
  auctionData?: {
    id: string;
    currentPrice: number;
    minIncrement: number;
    totalBids: number;
    endsAt: string;
    leadingBidderId?: string;
    bidHistory?: Array<{
      id: string;
      userId: string;
      userName: string;
      amount: number;
      createdAt: string;
    }>;
  };
  currentUserId?: string;
}

export function ProductDetail({ product, onBack, similarProducts, onContactSeller, onSaveToWatchlist, auctionData, currentUserId }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [interestAmount, setInterestAmount] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  // Live countdown timer for auctions
  useEffect(() => {
    if (!auctionData) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const end = new Date(auctionData.endsAt).getTime();
      const distance = end - now;

      if (distance < 0) {
        setTimeLeft("Auction ended");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [auctionData]);

  // Calculate minimum bid
  const minimumBid = auctionData
    ? auctionData.currentPrice + auctionData.minIncrement
    : 0;

  // Check if user is leading bidder
  const isLeadingBidder = auctionData?.leadingBidderId === currentUserId;

  // Handle bid placement
  const handlePlaceBid = async () => {
    if (!auctionData || !bidAmount) {
      toast.error("Please enter a bid amount");
      return;
    }

    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount < minimumBid) {
      toast.error(`Minimum bid is $${minimumBid.toFixed(2)}`);
      return;
    }

    setIsPlacingBid(true);

    try {
      const result = await placeBid(auctionData.id, amount);

      if (result.success) {
        toast.success(`Your bid of $${amount.toFixed(2)} has been placed successfully!`);
        setBidAmount("");
        // Optionally refresh the page to show updated auction data
        window.location.reload();
      } else {
        toast.error(result.error || "Failed to place bid");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsPlacingBid(false);
    }
  };

  // Mock additional images - in real app these would come from product data
  const images = [
    product.image,
    product.image,
    product.image,
    product.image,
  ];

  const mockReviews = [
    {
      id: "1",
      author: "John D.",
      rating: 5,
      date: "2 days ago",
      comment: "Great product! Fast shipping and exactly as described.",
    },
    {
      id: "2",
      author: "Sarah M.",
      rating: 4,
      date: "1 week ago",
      comment: "Good quality, minor scratch but seller was responsive.",
    },
  ];

  const mockQuestions = [
    {
      id: "1",
      question: "Does this come with original packaging?",
      answer: "Yes, includes original box and all accessories.",
      askedBy: "Mike R.",
      date: "3 days ago",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Button variant="ghost" onClick={onBack}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to listings
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="aspect-square bg-gray-100">
                <ImageWithFallback
                  src={images[selectedImage]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>
            <div className="grid grid-cols-4 gap-2">
              {images.map((img, idx) => (
                <Card
                  key={idx}
                  className={`overflow-hidden cursor-pointer border-2 ${
                    selectedImage === idx ? "border-[#fa6723]" : "border-transparent"
                  }`}
                  onClick={() => setSelectedImage(idx)}
                >
                  <div className="aspect-square bg-gray-100">
                    <ImageWithFallback
                      src={img}
                      alt={`${product.title} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="mb-2">{product.title}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Badge variant="outline">{product.condition}</Badge>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {product.location}
                </span>
              </div>
            </div>

            <Separator />

            {/* Pricing */}
            <div>
              {auctionData ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Current bid</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-gray-900">
                        ${auctionData.currentPrice.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {auctionData.totalBids} bid{auctionData.totalBids !== 1 ? 's' : ''}
                    </p>
                  </div>
                  {isLeadingBidder && (
                    <Badge className="bg-green-500 hover:bg-green-600">
                      You're the leading bidder!
                    </Badge>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className={`w-4 h-4 ${timeLeft.includes('ended') ? 'text-gray-500' : 'text-red-500'}`} />
                    <span className={timeLeft.includes('ended') ? 'text-gray-500' : 'text-red-500'}>
                      {timeLeft.includes('ended') ? 'Auction ended' : `Ends in ${timeLeft}`}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Price</p>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900">${product.price.toFixed(2)}</span>
                      {product.originalPrice && (
                        <>
                          <span className="text-gray-400 line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                          <Badge className="bg-red-500 hover:bg-red-600">
                            {Math.round(
                              ((product.originalPrice - product.price) /
                                product.originalPrice) *
                                100
                            )}
                            % OFF
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Shipping */}
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Truck className="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <p>{product.shipping}</p>
                  <p className="text-sm text-gray-600">Estimated delivery: Oct 25-28</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <p>Buyer Protection</p>
                  <p className="text-sm text-gray-600">Money back guarantee</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Contact & Actions */}
            <div className="space-y-3">
              {auctionData && !timeLeft.includes('ended') ? (
                <>
                  {/* Bidding UI */}
                  <Card className="p-4 bg-orange-50 border-orange-200">
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="bidAmount" className="text-sm font-medium">
                          Place your bid
                        </Label>
                        <p className="text-xs text-gray-600 mt-1">
                          Minimum bid: ${minimumBid.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <Input
                            id="bidAmount"
                            type="number"
                            step="0.01"
                            min={minimumBid}
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            placeholder={minimumBid.toFixed(2)}
                            className="pl-7"
                          />
                        </div>
                        <Button
                          onClick={handlePlaceBid}
                          disabled={isPlacingBid || !bidAmount}
                          className="bg-[#fa6723] hover:bg-[#e55a1f]"
                        >
                          <Gavel className="w-4 h-4 mr-2" />
                          {isPlacingBid ? "Placing..." : "Place Bid"}
                        </Button>
                      </div>
                    </div>
                  </Card>

                  <Button
                    variant="outline"
                    className="w-full"
                    size="lg"
                    onClick={() => onContactSeller(product)}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Seller
                  </Button>
                </>
              ) : auctionData ? (
                <>
                  {/* Auction ended */}
                  <div className="p-4 bg-gray-100 rounded-lg text-center">
                    <p className="text-gray-600">This auction has ended</p>
                    {isLeadingBidder && (
                      <p className="text-green-600 font-medium mt-2">Congratulations! You won this auction.</p>
                    )}
                  </div>
                  <Button
                    className="w-full bg-[#fa6723] hover:bg-[#e55a1f]"
                    size="lg"
                    onClick={() => onContactSeller(product)}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Seller
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="lg"
                  onClick={() => onContactSeller(product, "I would like to make an offer for this item.", true)}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Make an Offer
                </Button>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => onSaveToWatchlist(product)}
                >
                  <Heart className={`w-4 h-4 mr-2 ${product.isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                  {product.isFavorited ? 'Saved' : 'Save to Watchlist'}
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Seller Info */}
            <Card className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={product.seller?.avatar || ""} />
                    <AvatarFallback>
                      {product.seller?.name?.[0]?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p>{product.seller?.name || "Unknown Seller"}</p>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>
                        {product.seller?.rating || 0} ({product.seller?.totalRatings || 0} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• {Math.round(((product.seller?.rating || 0) / 5) * 100)}% positive feedback</p>
                <p>• {product.seller?.totalSales || 0} items sold</p>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                {/* Row 1: Telegram and WhatsApp */}
                <Button
                  variant="outline"
                  onClick={() => window.open(`https://t.me/${product.seller?.telegram?.replace('@', '')}`, '_blank')}
                  disabled={!product.seller?.telegram}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Telegram
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open(`https://wa.me/${product.seller?.whatsapp?.replace(/\s/g, '')}`, '_blank')}
                  disabled={!product.seller?.whatsapp}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>

                {/* Row 2: Call and Message (in-platform) */}
                <Button
                  variant="outline"
                  onClick={() => window.open(`tel:${product.seller?.phone}`)}
                  disabled={!product.seller?.phone}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onContactSeller(product)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Card className="mb-8">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b h-auto p-0">
              <TabsTrigger value="description" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#fa6723]">
                Description
              </TabsTrigger>
              {auctionData && (
                <TabsTrigger value="bids" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#fa6723]">
                  Bid History ({auctionData.bidHistory?.length || 0})
                </TabsTrigger>
              )}
              <TabsTrigger value="specs" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#fa6723]">
                Specifications
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#fa6723]">
                Reviews ({mockReviews.length})
              </TabsTrigger>
              <TabsTrigger value="qa" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#fa6723]">
                Q&A
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="p-6">
              <div className="prose max-w-none">
                <p>
                  This is a premium {product.title.toLowerCase()} in {product.condition.toLowerCase()} condition.
                  Perfect for both professional and personal use.
                </p>
                <h3>Key Features:</h3>
                <ul>
                  <li>High-quality construction and materials</li>
                  <li>Excellent performance and reliability</li>
                  <li>Comes with manufacturer warranty</li>
                  <li>Authentic product guaranteed</li>
                </ul>
                <h3>What's Included:</h3>
                <ul>
                  <li>Main product unit</li>
                  <li>Original packaging</li>
                  <li>All accessories and cables</li>
                  <li>User manual and documentation</li>
                </ul>
              </div>
            </TabsContent>

            {auctionData && (
              <TabsContent value="bids" className="p-6">
                <div className="space-y-4">
                  {auctionData.bidHistory && auctionData.bidHistory.length > 0 ? (
                    <>
                      <h3 className="font-semibold text-lg">Bid History</h3>
                      <div className="space-y-3">
                        {auctionData.bidHistory.map((bid, index) => (
                          <div
                            key={bid.id}
                            className={`flex items-center justify-between p-4 rounded-lg border ${
                              index === 0 ? 'bg-green-50 border-green-200' : 'bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback>
                                  {bid.userName ? bid.userName.charAt(0).toUpperCase() : 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {bid.userId === currentUserId ? 'You' : bid.userName || 'Anonymous'}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {new Date(bid.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-900">
                                ${bid.amount.toFixed(2)}
                              </p>
                              {index === 0 && (
                                <Badge className="bg-green-500 hover:bg-green-600 mt-1">
                                  Leading bid
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <Gavel className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No bids yet</p>
                      <p className="text-sm text-gray-500 mt-2">Be the first to place a bid!</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            )}

            <TabsContent value="specs" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Condition</span>
                    <span>{product.condition}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Location</span>
                    <span>{product.location}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Shipping</span>
                    <span>{product.shipping}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Brand</span>
                    <span>Premium Brand</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Model</span>
                    <span>Latest 2023</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Color</span>
                    <span>As Shown</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="p-6">
              <div className="space-y-6">
                <div className="flex items-center gap-6 pb-6 border-b">
                  <div className="text-center">
                    <div className="text-gray-900 mb-1">4.5</div>
                    <div className="flex gap-0.5 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= 4
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">Based on {mockReviews.length} reviews</p>
                  </div>
                </div>

                {mockReviews.map((review) => (
                  <div key={review.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>{review.author[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm">{review.author}</p>
                          <p className="text-xs text-gray-600">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${
                              star <= review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{review.comment}</p>
                    <Separator />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="qa" className="p-6">
              <div className="space-y-6">
                {mockQuestions.map((qa) => (
                  <div key={qa.id} className="space-y-3">
                    <div className="flex gap-3">
                      <MessageSquare className="w-5 h-5 text-gray-400 shrink-0 mt-1" />
                      <div className="flex-1">
                        <p>{qa.question}</p>
                        <p className="text-sm text-gray-600">
                          Asked by {qa.askedBy} • {qa.date}
                        </p>
                      </div>
                    </div>
                    <div className="ml-8 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm">{qa.answer}</p>
                      <p className="text-xs text-gray-600 mt-1">Seller response</p>
                    </div>
                    <Separator />
                  </div>
                ))}

                <Card className="p-4 bg-[#fff5f0] border-[#fec5a7]">
                  <h3 className="mb-3">Ask a Question</h3>
                  <Textarea
                    placeholder="Type your question here..."
                    className="mb-3 bg-white"
                  />
                  <Button className="bg-[#fa6723] hover:bg-[#e55a1f]">
                    Submit Question
                  </Button>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Similar Items */}
        {similarProducts && similarProducts.length > 0 && (
          <div>
            <h2 className="mb-4">Similar Items</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {similarProducts.slice(0, 4).map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onSaveToWatchlist={onSaveToWatchlist}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
