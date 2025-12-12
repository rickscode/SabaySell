"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import { getListing } from "@/lib/queries/listings";
import { Loader2 } from "lucide-react";
import type { ListingFull } from "@/lib/database.types";

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [listing, setListing] = useState<ListingFull | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListing() {
      try {
        const data = await getListing(id);
        if (!data) {
          router.push('/');
          return;
        }
        setListing(data);
      } catch (error) {
        console.error("Error fetching listing:", error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    }

    fetchListing();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#fa6723]" />
      </div>
    );
  }

  if (!listing) {
    return null;
  }

  // Convert database listing to Product format for ProductDetail component
  const product = {
    id: listing.id,
    title: listing.title_en || listing.title_km || "Untitled",
    price: listing.price || 0,
    image: listing.images?.[0]?.url || "/placeholder-image.png",
    images: listing.images?.map((img: any) => img.url) || [],
    condition: listing.condition || "used",
    location: listing.location || "",
    description: listing.description_en || listing.description_km || "",
    seller: {
      id: listing.user?.id || "",
      name: listing.user?.display_name || "Unknown",
      avatar: listing.user?.avatar_url || "",
      rating: listing.user?.rating || 0,
      totalRatings: listing.user?.total_ratings || 0,
      totalSales: listing.user?.total_sales || 0,
    },
    auction: listing.type === "auction",
    bids: listing.auction?.total_bids || 0,
    timeLeft: listing.auction?.ends_at ? calculateTimeLeft(listing.auction.ends_at) : undefined,
    buyNow: listing.type === "fixed",
    shipping: "Contact seller",
  };

  // Build auctionData prop if this is an auction
  const auctionData = listing.type === "auction" && listing.auction ? {
    id: listing.auction.id,
    currentPrice: parseFloat(listing.auction.current_price || listing.auction.start_price),
    minIncrement: parseFloat(listing.auction.min_increment || "1.00"),
    totalBids: listing.auction.total_bids || 0,
    endsAt: listing.auction.ends_at,
    status: listing.auction.status,
    leadingBidderId: listing.auction.leading_bidder_id,
  } : undefined;

  return (
    <ProductDetail
      product={product}
      onBack={() => router.back()}
      similarProducts={[]}
      onSaveToWatchlist={() => {}}
      onContactSeller={() => {}}
      auctionData={auctionData}
      currentUserId={listing.user_id}
    />
  );
}

function calculateTimeLeft(endsAt: string): string {
  const now = new Date();
  const end = new Date(endsAt);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return "Ended";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days}d ${hours}h left`;
  return `${hours}h left`;
}
