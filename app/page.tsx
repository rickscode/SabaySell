"use client";

// Feature Flags - Toggle to enable/disable features
const ENABLE_AUCTIONS = true;
const ENABLE_MESSAGING = true;

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import Logo from "@/components/Logo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  SlidersHorizontal,
  Laptop,
  Smartphone,
  Watch,
  Home,
  Shirt,
  Book,
  Grid3x3,
  X,
  Plus,
  Package,
  DollarSign,
  Car,
  Gamepad2,
  Wrench,
  Dumbbell,
  GraduationCap,
  LogOut,
  UserCircle,
  Tablet,
  Headphones,
} from "lucide-react";
import { ProductCard, Product } from "@/components/product-card";
import { CategoryCard } from "@/components/category-card";
import { FiltersSidebar, FilterState } from "@/components/filters-sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// ProductDetail now accessed via /listings/[id] route
import { Watchlist, WatchlistItem } from "@/components/watchlist";
import { MessagesInbox } from "@/components/messages-inbox";
import { ContactSellerDialog } from "@/components/contact-seller-dialog";
import { Badge as BadgeComponent } from "@/components/ui/badge";
import { Heart, MessageCircle } from "lucide-react";
import { CreateListing } from "@/components/create-listing";
import { MyListings } from "@/components/my-listings";
import { UserProfile } from "@/components/user-profile";
import { UserSettings } from "@/components/user-settings";
import { NotificationsDropdown } from "@/components/notifications-dropdown";
import { CategoryBrowse } from "@/components/category-browse";
import { SearchResults } from "@/components/search-results";
import { MobileNav } from "@/components/mobile-nav";
import { StartSellingPage } from "@/components/start-selling-page";
import { ContactUsPage } from "@/components/contact-us-page";
import { CompanyInfoPage } from "@/components/company-info-page";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCurrentUser, signOut, getUserProfile } from "@/lib/auth";
import type { User as AuthUser } from "@supabase/supabase-js";
import { LanguageSwitcher, LanguageSwitcherMobile } from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { getListings } from "@/lib/queries/listings";
import type { ListingWithImages } from "@/lib/database.types";
import { getFavoriteIdsForUser } from "@/lib/queries/favorites";
import { toggleFavorite } from "@/app/actions/favorites";
import { getUnreadCount } from "@/lib/queries/messages";
import { getAllCategories, getEnabledCategories } from "@/lib/constants/categories";

// Map icon names to Lucide icon components
const iconMap: Record<string, any> = {
  Smartphone,
  Tablet,
  Laptop,
  Headphones,
};

const categoriesConfig = getEnabledCategories().map(cat => ({
  nameKey: `categories.${cat.slug}`,
  icon: iconMap[cat.icon] || Smartphone,
  slug: cat.slug,
  name: cat.id
}));

// Legacy categories array (to be removed after migration)
const categoriesOld = [
  { nameKey: "categories.electronics", icon: Laptop, count: "12.5K items" },
  { nameKey: "categories.mobile_phones", icon: Smartphone, count: "8.2K items" },
  { nameKey: "categories.jewellery_watches", icon: Watch, count: "4.3K items" },
  { nameKey: "categories.home_garden", icon: Home, count: "9.8K items" },
  { nameKey: "categories.fashion", icon: Shirt, count: "15.2K items" },
  { nameKey: "categories.books", icon: Book, count: "6.7K items" },
  { nameKey: "categories.automobiles", icon: Car, count: "3.4K items" },
  { nameKey: "categories.toys", icon: Gamepad2, count: "7.1K items" },
  { nameKey: "categories.tools", icon: Wrench, count: "5.8K items" },
  { nameKey: "categories.sports", icon: Dumbbell, count: "4.9K items" },
  { nameKey: "categories.school", icon: GraduationCap, count: "3.2K items" },
  { nameKey: "categories.other", icon: Grid3x3, count: "8.3K items" },
];

// Helper function to convert database listing to Product format
function convertListingToProduct(listing: any, isFavorited: boolean = false): Product {
  const primaryImage = (listing.images as any[])?.find((img: any) => img.is_primary) || (listing.images as any[])?.[0];

  // MVP: When auctions disabled, treat all listings as fixed price
  const isAuction = ENABLE_AUCTIONS && listing.type === 'auction';

  // For auction listings, use current_price from auction table
  const price = isAuction && listing.auction
    ? parseFloat(listing.auction.current_price || listing.auction.start_price || '0')
    : (listing.price || 0);

  // For auction listings, include bid count and time left
  const bids = isAuction && listing.auction
    ? listing.auction.total_bids
    : undefined;

  const timeLeft = isAuction && listing.auction?.ends_at
    ? calculateTimeLeft(listing.auction.ends_at)
    : undefined;

  return {
    id: listing.id,
    title: listing.title_en || "Untitled",
    price,
    image: primaryImage?.url || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E",
    condition: listing.condition ? listing.condition.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : "New",
    shipping: "Free shipping", // TODO: Add shipping info to listing
    location: listing.location || "Cambodia",
    buyNow: !isAuction,  // MVP: All listings show "Buy Now" when auctions disabled
    auction: isAuction,  // MVP: Will always be false when ENABLE_AUCTIONS is false
    bids,
    timeLeft,
    isFavorited,
    active_boost: listing.active_boost || null,
  };
}

// Helper function to calculate time left for auctions
function calculateTimeLeft(endsAt: string): string {
  const now = new Date();
  const end = new Date(endsAt);
  const diffMs = end.getTime() - now.getTime();

  if (diffMs <= 0) return 'Ended';

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

type View =
  | "home"
  | "product"
  | "watchlist"
  | "messages"
  | "create-listing"
  | "my-listings"
  | "profile"
  | "settings"
  | "category-browse"
  | "search-results"
  | "start-selling"
  | "contact"
  | "company-info";

export default function App() {
  const router = useRouter();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentView, setCurrentView] = useState<View>("home");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([]);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [productToContact, setProductToContact] = useState<Product | null>(null);
  const [contactInitialMessage, setContactInitialMessage] = useState<string>("");
  const [contactStartInOfferMode, setContactStartInOfferMode] = useState<boolean>(false);
  const [editingListing, setEditingListing] = useState<any>(null);

  // Auth state
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // Favorites state
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [favoritesLoading, setFavoritesLoading] = useState(false);

  // Messages state
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Category counts state
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    conditions: [],
    priceMin: 0,
    priceMax: 50000,
    types: [],
    locations: [],
    shippingFree: false,
    shippingPaid: false,
    localPickup: false,
  });

  // Load user on mount
  useEffect(() => {
    async function loadUser() {
      try {
        const { user: currentUser } = await getCurrentUser();
        setUser(currentUser);

        if (currentUser) {
          const { data: profile } = await getUserProfile(currentUser.id);
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  // Load favorites when user changes
  useEffect(() => {
    async function loadFavorites() {
      if (!user) {
        setFavoriteIds(new Set());
        return;
      }

      try {
        const ids = await getFavoriteIdsForUser(user.id);
        setFavoriteIds(new Set(ids));
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    }

    loadFavorites();
  }, [user]);

  // Load unread message count when user changes
  useEffect(() => {
    async function loadUnreadCount() {
      if (!user) {
        setUnreadCount(0);
        return;
      }

      try {
        const count = await getUnreadCount(user.id);
        setUnreadCount(count);
      } catch (error) {
        console.error('Error loading unread count:', error);
      }
    }

    loadUnreadCount();
  }, [user]);

  // Load category counts on mount
  useEffect(() => {
    async function loadCategoryCounts() {
      try {
        const { createClient } = await import("@/lib/supabase");
        const supabase = createClient();

        // Get counts for each category
        const counts: Record<string, number> = {};
        for (const cat of categoriesConfig) {
          const { count } = await supabase
            .from('listings')
            .select('*', { count: 'exact', head: true })
            .eq('category', cat.name)
            .eq('status', 'active');

          counts[cat.slug] = count || 0;
        }

        setCategoryCounts(counts);
      } catch (error) {
        console.error('Error loading category counts:', error);
      }
    }

    loadCategoryCounts();
  }, []);

  // Load listings on mount and when filters or search query change
  useEffect(() => {
    async function loadListings() {
      setProductsLoading(true);
      try {
        // Build filter object for query
        const queryFilters: any = {};

        // Add search query if present
        if (searchQuery.trim()) {
          queryFilters.search = searchQuery.trim();
        }

        if (filters.conditions.length > 0) {
          queryFilters.condition = filters.conditions;
        }

        if (filters.priceMin > 0) {
          queryFilters.priceMin = filters.priceMin;
        }

        if (filters.priceMax < 50000) {
          queryFilters.priceMax = filters.priceMax;
        }

        if (filters.types.length > 0) {
          // If both types selected, don't filter. If only one, filter
          if (filters.types.length === 1) {
            queryFilters.type = filters.types[0];
          }
        }

        if (filters.locations.length > 0) {
          // For multiple locations, we'll need to filter in memory since Supabase doesn't support OR on same column easily
          // For now, just use first location
          queryFilters.location = filters.locations[0];
        }

        if (filters.shippingFree) {
          queryFilters.shipping_free = true;
        }

        if (filters.shippingPaid) {
          queryFilters.shipping_paid = true;
        }

        if (filters.localPickup) {
          queryFilters.local_pickup = true;
        }

        const { data: listings } = await getListings(queryFilters, { sortBy: 'newest', limit: 50 });

        // If multiple locations selected, filter in memory
        let filteredListings = listings;
        if (filters.locations.length > 1) {
          filteredListings = listings.filter(listing =>
            filters.locations.includes(listing.location || '')
          );
        }

        const convertedProducts = filteredListings.map(listing =>
          convertListingToProduct(listing, favoriteIds.has(listing.id))
        );
        setProducts(convertedProducts);
      } catch (error) {
        console.error('Error loading listings:', error);
      } finally {
        setProductsLoading(false);
      }
    }

    loadListings();
  }, [filters, searchQuery, favoriteIds]);

  // Logout handler
  const handleLogout = async () => {
    await signOut();
    setUser(null);
    setUserProfile(null);
    router.refresh();
  };

  // Watchlist management with database persistence
  const addToWatchlist = async (product: Product) => {
    // Check if user is logged in
    if (!user) {
      toast.error("Please log in to save items", {
        description: "You need to be logged in to use the watchlist"
      });
      router.push('/auth/login');
      return;
    }

    // Prevent duplicate clicks
    if (favoritesLoading) return;

    // Optimistic update
    const wasAlreadyFavorited = favoriteIds.has(product.id);
    const newFavoriteIds = new Set(favoriteIds);

    if (wasAlreadyFavorited) {
      newFavoriteIds.delete(product.id);
    } else {
      newFavoriteIds.add(product.id);
    }

    setFavoriteIds(newFavoriteIds);
    setFavoritesLoading(true);

    try {
      const result = await toggleFavorite(product.id);

      if (!result.success) {
        // Rollback on error
        setFavoriteIds(favoriteIds);
        toast.error(result.error || "Failed to update watchlist");
        return;
      }

      // Update local watchlist items for backward compatibility
      if (result.isFavorited) {
        setWatchlistItems((prev) => {
          const existing = prev.find((item) => item.product.id === product.id);
          if (existing) return prev;
          return [...prev, { product, savedAt: new Date() }];
        });
        toast.success("Added to watchlist", {
          description: `${product.title} has been saved`,
        });
      } else {
        setWatchlistItems((prev) => prev.filter((item) => item.product.id !== product.id));
        toast.success("Removed from watchlist");
      }
    } catch (error) {
      // Rollback on error
      setFavoriteIds(favoriteIds);
      console.error('Error toggling favorite:', error);
      toast.error("An unexpected error occurred");
    } finally {
      setFavoritesLoading(false);
    }
  };

  const removeFromWatchlist = async (productId: string) => {
    // This is called from the watchlist page
    if (!user) return;

    // Optimistic update
    const newFavoriteIds = new Set(favoriteIds);
    newFavoriteIds.delete(productId);
    setFavoriteIds(newFavoriteIds);
    setWatchlistItems((prev) => prev.filter((item) => item.product.id !== productId));

    try {
      const result = await toggleFavorite(productId);

      if (!result.success) {
        // Rollback on error
        setFavoriteIds(favoriteIds);
        toast.error(result.error || "Failed to remove from watchlist");
        return;
      }

      toast.success("Removed from watchlist");
    } catch (error) {
      // Rollback on error
      setFavoriteIds(favoriteIds);
      console.error('Error removing favorite:', error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleProductClick = (product: Product) => {
    router.push(`/listings/${product.id}`);
  };

  const handleBackToHome = () => {
    setCurrentView("home");
  };

  const handleContactSeller = (product: Product, initialMessage?: string, startInOfferMode?: boolean) => {
    setProductToContact(product);
    setContactInitialMessage(initialMessage || "");
    setContactStartInOfferMode(startInOfferMode || false);
    setContactDialogOpen(true);
  };

  const handleSendMessage = (message: string, offer?: number) => {
    toast.success("Message sent!", {
      description: offer 
        ? `Your offer of ${offer.toFixed(2)} has been sent to the seller`
        : "The seller will respond soon",
    });
    // In real app, send to backend
    setCurrentView("messages");
  };

  const handleCategoryClick = (categoryName: string) => {
    router.push(`/category/${encodeURIComponent(categoryName)}`);
  };

  // Search is now handled by filters effect
  const handleSearch = () => {
    // Search is applied via useEffect when searchQuery changes
    // Just ensure we're on home view
    if (currentView !== "home") {
      setCurrentView("home");
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleCreateListing = () => {
    router.push('/listings/new');
  };

  const handlePublishListing = (listing: any) => {
    // In real app, save to backend
    router.push('/my-listings');
  };

  const handleEditListing = (listing: any) => {
    // Navigate to edit page with listing ID
    router.push(`/listings/${listing.id}/edit`);
  };

  const handleViewListing = (listing: any) => {
    // Convert Listing to Product type by adding missing properties
    const product: Product = {
      ...listing,
      condition: "Used" as const,
      shipping: "Free shipping",
      location: "Phnom Penh",
      auction: listing.type === "auction",
    };
    handleProductClick(product);
  };

  // Render different views
  // ProductDetail now handled by /listings/[id] route

  if (currentView === "watchlist") {
    return (
      <>
        <Watchlist
          items={watchlistItems}
          onRemoveItem={removeFromWatchlist}
          onViewProduct={handleProductClick}
          onContactSeller={handleContactSeller}
          onContinueBrowsing={handleBackToHome}
        />
        {productToContact && (
          <ContactSellerDialog
            open={contactDialogOpen}
            onOpenChange={setContactDialogOpen}
            product={productToContact}
            onSendMessage={handleSendMessage}
            initialMessage={contactInitialMessage}
            startInOfferMode={contactStartInOfferMode}
          />
        )}
      </>
    );
  }

  // MVP: Hide messages inbox
  if (ENABLE_MESSAGING && currentView === "messages") {
    return <MessagesInbox onBack={handleBackToHome} />;
  }

  if (currentView === "create-listing") {
    return (
      <CreateListing
        onBack={handleBackToHome}
        onPublish={handlePublishListing}
        editingListing={editingListing}
      />
    );
  }

  if (currentView === "my-listings") {
    return (
      <MyListings
        onBack={handleBackToHome}
        onCreateNew={handleCreateListing}
        onEditListing={handleEditListing}
        onViewListing={handleViewListing}
      />
    );
  }

  if (currentView === "profile") {
    return (
      <UserProfile
        onBack={handleBackToHome}
        onSettings={() => setCurrentView("settings")}
        onEditProfile={() => setCurrentView("settings")}
        onProductClick={handleProductClick}
        isOwnProfile={true}
      />
    );
  }

  if (currentView === "settings") {
    return <UserSettings onBack={handleBackToHome} />;
  }

  if (currentView === "category-browse") {
    return (
      <CategoryBrowse
        category={selectedCategory}
        onBack={handleBackToHome}
        onProductClick={handleProductClick}
        products={products}
        onSaveToWatchlist={addToWatchlist}
        onBuyNow={handleProductClick}
        onMakeOffer={handleProductClick}
      />
    );
  }

  if (currentView === "search-results") {
    return (
      <SearchResults
        searchQuery={searchQuery}
        onBack={handleBackToHome}
        onProductClick={handleProductClick}
        onSearchChange={setSearchQuery}
        products={products}
        onSaveToWatchlist={addToWatchlist}
        onBuyNow={handleProductClick}
        onMakeOffer={handleProductClick}
      />
    );
  }

  if (currentView === "start-selling") {
    return <StartSellingPage onNavigate={(view) => setCurrentView(view as View)} onCreateListing={handleCreateListing} />;
  }

  if (currentView === "contact") {
    return <ContactUsPage onNavigate={(view) => setCurrentView(view as View)} />;
  }

  if (currentView === "company-info") {
    return <CompanyInfoPage onNavigate={(view) => setCurrentView(view as View)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 sm:pb-0">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div
              className="flex items-center cursor-pointer"
              onClick={handleBackToHome}
            >
              <Logo width={120} height={35} />
            </div>

            {/* Search Bar */}
            <div className="flex-1 flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder={t('header.search_placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  className="pl-10"
                  suppressHydrationWarning
                />
              </div>
              <Button
                className="hidden sm:flex bg-[#fa6723] hover:bg-[#e55a1f]"
                onClick={handleSearch}
                suppressHydrationWarning
              >
                {t('header.search_button')}
              </Button>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleCreateListing}
                title="Sell"
                className="hidden sm:flex"
              >
                <DollarSign className="w-5 h-5" />
              </Button>

              {/* MVP: Hide notifications - not implemented yet */}
              {/* <NotificationsDropdown /> */}

              {/* MVP: Hide message icon and unread badge */}
              {ENABLE_MESSAGING && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => router.push("/messages")}
                  title="Messages"
                >
                  <MessageCircle className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <BadgeComponent className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#fa6723]">
                      {unreadCount}
                    </BadgeComponent>
                  )}
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setCurrentView("watchlist")}
                title="Watchlist"
              >
                <Heart className="w-5 h-5" />
                {watchlistItems.length > 0 && (
                  <BadgeComponent className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                    {watchlistItems.length}
                  </BadgeComponent>
                )}
              </Button>

              {/* Language Switcher */}
              <LanguageSwitcher />
              <LanguageSwitcherMobile />

              {/* User Menu Dropdown - Auth-aware */}
              {loading ? (
                <Button variant="ghost" size="icon" className="hidden sm:flex" disabled>
                  <User className="w-5 h-5" />
                </Button>
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="hidden sm:flex">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={userProfile?.avatar_url} alt={userProfile?.display_name || user.email} />
                        <AvatarFallback>
                          {userProfile?.display_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{userProfile?.display_name || 'User'}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push(`/users/${userProfile?.username || user.email?.split('@')[0] || 'profile'}`)}>
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>{t('header.profile')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/my-listings')}>
                      <Package className="mr-2 h-4 w-4" />
                      <span>{t('header.my_listings')}</span>
                    </DropdownMenuItem>
                    {/* MVP: Hide messages menu item */}
                    {ENABLE_MESSAGING && (
                      <DropdownMenuItem onClick={() => router.push('/messages')}>
                        <MessageCircle className="mr-2 h-4 w-4" />
                        <span>{t('header.messages')}</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleCreateListing}>
                      <Plus className="mr-2 h-4 w-4" />
                      <span>{t('header.create_listing')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push('/settings')}>
                      <span>{t('header.settings')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{t('header.logout')}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden sm:flex"
                  onClick={() => router.push('/auth/login')}
                >
                  <User className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>

          {/* Categories Navigation - Mobile */}
          <div className="mt-3 flex gap-2 overflow-x-auto pb-2 sm:hidden scrollbar-hide">
            {categoriesConfig.map((category) => (
              <Button
                key={category.nameKey}
                variant="outline"
                size="sm"
                className="whitespace-nowrap"
                onClick={() => handleCategoryClick(t(category.nameKey))}
              >
                {t(category.nameKey)}
              </Button>
            ))}
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              <Grid3x3 className="w-4 h-4 mr-1" />
              {t('categories.more')}
            </Button>
          </div>
        </div>
      </header>

      {/* Categories Section - Desktop */}
      <section className="hidden sm:block bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="mb-4">{t('categories.title')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categoriesConfig.map((category) => {
              const count = categoryCounts[category.slug];
              const countText = count !== undefined ? `${count.toLocaleString()} items` : 'Loading...';

              return (
                <div key={category.nameKey} onClick={() => handleCategoryClick(t(category.nameKey))}>
                  <CategoryCard
                    nameKey={category.nameKey}
                    icon={category.icon}
                    count={countText}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

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
                  {t('filters.title')}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <FiltersSidebar
                  onClose={() => setIsFilterOpen(false)}
                  isMobile
                  onFiltersChange={setFilters}
                  initialFilters={filters}
                />
              </SheetContent>
            </Sheet>

            <span className="text-sm text-gray-600">
              <span className="hidden sm:inline">{t('products.showing')} </span>
              {products.length} {t('products.results')}
            </span>
          </div>

          <Select defaultValue="best-match">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('products.sort_by')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="best-match">{t('products.best_match')}</SelectItem>
              <SelectItem value="price-low">{t('products.price_low_high')}</SelectItem>
              <SelectItem value="price-high">{t('products.price_high_low')}</SelectItem>
              <SelectItem value="newest">{t('products.newest')}</SelectItem>
              <SelectItem value="ending">{t('products.ending_soon')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <FiltersSidebar onFiltersChange={setFilters} initialFilters={filters} />
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product.id} onClick={() => handleProductClick(product)}>
                  <ProductCard
                    product={product}
                    onSaveToWatchlist={addToWatchlist}
                    onBuyNow={handleProductClick}
                    onMakeOffer={handleProductClick}
                    isLoading={favoritesLoading}
                  />
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="mt-8 text-center">
              <Button variant="outline" size="lg">
                {t('actions.load_more')}
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="mb-3">{t('footer.sell.title')}</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li
                  className="hover:text-[#fa6723] cursor-pointer"
                  onClick={() => setCurrentView("start-selling")}
                >
                  {t('footer.sell.start')}
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3">{t('footer.about.title')}</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li
                  className="hover:text-[#fa6723] cursor-pointer"
                  onClick={() => setCurrentView("company-info")}
                >
                  {t('footer.about.company')}
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3">{t('footer.help.title')}</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li
                  className="hover:text-[#fa6723] cursor-pointer"
                  onClick={() => setCurrentView("contact")}
                >
                  {t('footer.help.contact')}
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
            © 2025 SabaySell. All rights reserved.
          </div>
        </div>
      </footer>
      
      {/* Mobile Navigation */}
      <MobileNav
        currentView={currentView}
        watchlistCount={watchlistItems.length}
        onNavigate={(view) => {
          if (view === "search") {
            setCurrentView("search-results");
          } else {
            setCurrentView(view as View);
          }
        }}
      />
      
      <Toaster />
      {productToContact && (
        <ContactSellerDialog
          open={contactDialogOpen}
          onOpenChange={setContactDialogOpen}
          product={productToContact}
          onSendMessage={handleSendMessage}
        />
      )}
    </div>
  );
}
