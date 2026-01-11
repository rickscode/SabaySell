"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import {
  ArrowLeft,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Heart,
  MessageCircle,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { getCurrentUser } from "@/lib/auth";
import { getUserListings } from "@/lib/queries/listings";
import { getActiveBoostsForUserListings } from "@/app/actions/boosts";
import { deleteListing, updateListing } from "@/app/actions/listings";
import type { ListingWithImages, Boost } from "@/lib/database.types";

interface Listing {
  id: string;
  title: string;
  price: number;
  image: string;
  status: "active" | "sold" | "expired" | "draft";
  type: "buy-now" | "auction";
  views: number;
  watchers: number;
  messages: number;
  bids?: number;
  timeLeft?: string;
  createdAt: Date;
}

interface MyListingsProps {
  onBack: () => void;
  onCreateNew: () => void;
  onEditListing: (listing: any) => void;
  onViewListing: (listing: any) => void;
}

// Mock data

// Mock listings removed - component fetches real listings from database via getUserListings()
const mockListings: Listing[] = [];


export function MyListings({ onBack, onCreateNew, onEditListing, onViewListing }: MyListingsProps) {
  const [listings, setListings] = useState<ListingWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState<ListingWithImages | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [isProcessing, setIsProcessing] = useState(false);
  const [boostsMap, setBoostsMap] = useState<Record<string, Boost[]>>({});

  // Fetch user's listings on mount
  useEffect(() => {
    async function fetchListings() {
      try {
        const { user } = await getCurrentUser();
        if (!user) {
          toast.error("Please log in to view your listings");
          setLoading(false);
          return;
        }

        const data = await getUserListings(user.id);
        setListings(data);

        // Fetch boosts for all listings using server action
        const listingIds = data.map(listing => listing.id);
        const boostsResult = await getActiveBoostsForUserListings(listingIds);

        if (boostsResult.success && boostsResult.boostsMap) {
          setBoostsMap(boostsResult.boostsMap);
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
        toast.error("Failed to load listings");
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, []);

  const handleDeleteListing = (listing: ListingWithImages) => {
    setListingToDelete(listing);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!listingToDelete) return;

    setIsProcessing(true);
    try {
      const result = await deleteListing(listingToDelete.id);

      if (result.success) {
        setListings(listings.filter((l) => l.id !== listingToDelete.id));
        toast.success("Listing deleted");
      } else {
        toast.error(result.error || "Failed to delete listing");
      }
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast.error("Failed to delete listing");
    } finally {
      setIsProcessing(false);
      setDeleteDialogOpen(false);
      setListingToDelete(null);
    }
  };

  const handleMarkAsSold = async (listing: ListingWithImages) => {
    setIsProcessing(true);
    try {
      const result = await updateListing(listing.id, { status: "sold" });

      if (result.success) {
        setListings(
          listings.map((l) =>
            l.id === listing.id ? { ...l, status: "sold" as const } : l
          )
        );
        toast.success("Listing marked as sold");
      } else {
        toast.error(result.error || "Failed to update listing");
      }
    } catch (error) {
      console.error("Error marking as sold:", error);
      toast.error("Failed to update listing");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRelist = async (listing: ListingWithImages) => {
    setIsProcessing(true);
    try {
      const result = await updateListing(listing.id, { status: "active" });

      if (result.success) {
        setListings(
          listings.map((l) =>
            l.id === listing.id ? { ...l, status: "active" as const } : l
          )
        );
        toast.success("Listing is now active");
      } else {
        toast.error(result.error || "Failed to update listing");
      }
    } catch (error) {
      console.error("Error relisting:", error);
      toast.error("Failed to update listing");
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: Listing["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-[#fa6723]">Active</Badge>;
      case "sold":
        return <Badge className="bg-[#fa6723]">Sold</Badge>;
      case "expired":
        return <Badge variant="secondary">Expired</Badge>;
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
    }
  };

  const getBoostBadges = (listingId: string) => {
    const boosts = boostsMap[listingId];
    if (!boosts || boosts.length === 0) return null;

    return boosts.map((boost, index) => {
      if (boost.type === 'featured') {
        return (
          <Badge key={index} className="bg-[#fa6723] text-white">
            🏠 Featured on Homepage
          </Badge>
        );
      } else if (boost.type === 'top_category') {
        return (
          <Badge key={index} className="bg-[#fa6723] text-white">
            ⭐ Featured in Category
          </Badge>
        );
      }
      return null;
    });
  };

  const filterListings = (status?: string) => {
    if (!status || status === "all") return listings;
    return listings.filter((l) => l.status === status);
  };

  const filteredListings = filterListings(activeTab);
  const stats = {
    all: listings.length,
    active: listings.filter((l) => l.status === "active").length,
    sold: listings.filter((l) => l.status === "sold").length,
    expired: listings.filter((l) => l.status === "expired").length,
    draft: listings.filter((l) => l.status === "draft").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1>My Listings</h1>
                <p className="text-sm text-gray-600">Manage your active and past listings</p>
              </div>
            </div>
            <Button onClick={onCreateNew} className="bg-[#fa6723] hover:bg-[#e55a1f]">
              <Plus className="w-4 h-4 mr-2" />
              Create Listing
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#fa6723]" />
          </div>
        ) : (
          <>
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl mb-1">{stats.all}</div>
                <div className="text-sm text-gray-600">Total Listings</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl text-[#fa6723] mb-1">{stats.active}</div>
                <div className="text-sm text-gray-600">Active</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl text-[#fa6723] mb-1">{stats.sold}</div>
                <div className="text-sm text-gray-600">Sold</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl text-gray-600 mb-1">{stats.expired}</div>
                <div className="text-sm text-gray-600">Expired</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl text-gray-600 mb-1">{stats.draft}</div>
                <div className="text-sm text-gray-600">Drafts</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All ({stats.all})</TabsTrigger>
            <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
            <TabsTrigger value="sold">Sold ({stats.sold})</TabsTrigger>
            <TabsTrigger value="expired">Expired ({stats.expired})</TabsTrigger>
            <TabsTrigger value="draft">Drafts ({stats.draft})</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            {filteredListings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <DollarSign className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="mb-2">No listings found</h3>
                  <p className="text-gray-600 mb-4">
                    {activeTab === "all"
                      ? "You haven't created any listings yet"
                      : `You don't have any ${activeTab} listings`}
                  </p>
                  <Button onClick={onCreateNew} className="bg-[#fa6723] hover:bg-[#e55a1f]">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Listing
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredListings.map((listing) => {
                  const primaryImage = (listing as any).images?.find((img: any) => img.is_primary) || (listing as any).images?.[0];
                  const imageUrl = primaryImage?.url || '/placeholder-image.png';
                  const title = (listing as any).title_en || (listing as any).title_km || 'Untitled';
                  const displayPrice = (listing as any).price || 0;

                  return (
                  <Card key={listing.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Image */}
                        <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0">
                          <img
                            src={imageUrl}
                            alt={title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="mb-1 truncate">{title}</h3>
                              <div className="flex items-center gap-2 flex-wrap">
                                {getStatusBadge((listing as any).status)}
                                <Badge variant="outline">
                                  {(listing as any).type === "fixed" ? "Buy Now" : "Auction"}
                                </Badge>
                                {getBoostBadges(listing.id)}
                              </div>
                            </div>

                            {/* Actions Dropdown */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => onViewListing(listing)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Listing
                                </DropdownMenuItem>
                                {(listing.status === "active" || listing.status === "draft") && (
                                  <DropdownMenuItem onClick={() => onEditListing(listing)}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                )}
                                {listing.status === "active" && (
                                  <DropdownMenuItem onClick={() => handleMarkAsSold(listing)}>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Mark as Sold
                                  </DropdownMenuItem>
                                )}
                                {(listing.status === "expired" || listing.status === "sold") && (
                                  <DropdownMenuItem onClick={() => handleRelist(listing)}>
                                    <DollarSign className="w-4 h-4 mr-2" />
                                    Relist
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() => handleDeleteListing(listing)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {/* Price and Time */}
                          <div className="flex items-center gap-4 mb-3">
                            <div>
                              <div className="text-sm text-gray-600">Price</div>
                              <div className="text-lg">${displayPrice.toFixed(2)}</div>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              <span>{(listing as any).views || 0} views</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              <span>{(listing as any).favorites || 0} watchers</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
                })}
              </div>
            )}
          </div>
        </Tabs>
        </>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Listing?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{(listingToDelete as any)?.title_en || (listingToDelete as any)?.title_km || 'this listing'}"? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isProcessing}
            >
              {isProcessing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
