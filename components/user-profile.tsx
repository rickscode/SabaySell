"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Progress } from "./ui/progress";
import {
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  Package,
  ThumbsUp,
  MessageCircle,
  Settings,
  Edit,
  TrendingUp,
  Award,
  Shield,
} from "lucide-react";
import { Product } from "./product-card";
import { getCurrentUser, getUserProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase";

interface Review {
  id: string;
  rating: number;
  comment: string;
  reviewerName: string;
  reviewerAvatar?: string;
  date: Date;
  productTitle: string;
}

interface UserProfileData {
  id: string;
  email: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  location: string | null;
  bio: string | null;
  verified: boolean | null;
  response_rate: number | null;
  response_time: string | null;
  followers_count: number | null;
  following_count: number | null;
  created_at: string;
}

interface UserProfileProps {
  onBack: () => void;
  onSettings: () => void;
  onEditProfile: () => void;
  onProductClick: (product: Product) => void;
  isOwnProfile?: boolean;
  userId?: string; // Optional userId to view another user's profile
}


// Mock data removed - component should fetch real user data from database
const mockUser = null;
const mockReviews: Review[] = [];
const mockActiveListings: Product[] = [];


export function UserProfile({
  onBack,
  onSettings,
  onEditProfile,
  onProductClick,
  isOwnProfile = true,
  userId,
}: UserProfileProps) {
  const [activeTab, setActiveTab] = useState("about");
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [activeListings, setActiveListings] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      try {
        setLoading(true);

        // Get the user ID (either provided or current user)
        let targetUserId = userId;
        if (!targetUserId) {
          const { user } = await getCurrentUser();
          targetUserId = user?.id;
        }

        if (!targetUserId) {
          console.error('No user ID available');
          setLoading(false);
          return;
        }

        // Fetch user profile from database
        const { data: profile, error } = await getUserProfile(targetUserId);

        if (error) {
          console.error('Error fetching user profile:', error);
        } else if (profile) {
          setUserData(profile);
        }

        // Fetch user's active listings
        const supabase = createClient();
        const { data: listings } = await supabase
          .from('listings')
          .select(`
            id,
            title_en,
            price,
            condition,
            listing_type,
            status,
            images (
              image_url,
              display_order
            )
          `)
          .eq('seller_id', targetUserId)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(10);

        if (listings) {
          // Convert listings to Product format
          const convertedListings: Product[] = listings.map((listing: any) => ({
            id: listing.id,
            title: listing.title_en || 'No title',
            price: listing.price,
            image: listing.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400',
            condition: listing.condition || 'New',
            shipping: 'Contact seller',
            location: profile?.location || 'Phnom Penh',
            buyNow: listing.listing_type === 'fixed',
            auction: listing.listing_type === 'auction',
          }));
          setActiveListings(convertedListings);
        }

      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [userId]);

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0];
    mockReviews.forEach((review) => {
      distribution[review.rating - 1]++;
    });
    return distribution.reverse();
  };

  const ratingDistribution = getRatingDistribution();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fa6723] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error state if no user data
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">User profile not found</p>
          <Button onClick={onBack} className="mt-4">Go Back</Button>
        </div>
      </div>
    );
  }

  // Use real data with fallbacks
  const user = {
    id: userData.id,
    name: userData.display_name || userData.email.split('@')[0],
    username: userData.username || userData.email.split('@')[0],
    avatar: userData.avatar_url || undefined,
    location: userData.location || 'Phnom Penh, Cambodia',
    memberSince: new Date(userData.created_at),
    bio: userData.bio || 'No bio available yet.',
    verified: userData.verified || false,
    rating: 0, // TODO: Calculate from reviews when implemented
    totalReviews: 0, // TODO: Count from reviews table when implemented
    totalSales: 0, // TODO: Count from transactions table when implemented
    responseRate: userData.response_rate || 0,
    responseTime: userData.response_time || 'N/A',
    stats: {
      followers: userData.followers_count || 0,
      following: userData.following_count || 0,
      activeListings: activeListings.length,
    },
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
                <h1>{user.username} Profile</h1>
                <p className="text-sm text-gray-600">View user information and reviews</p>
              </div>
            </div>
            {isOwnProfile && (
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={onEditProfile}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Button variant="ghost" size="icon" onClick={onSettings}>
                  <Settings className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  <h2 className="mb-1">{user.name}</h2>
                  <p className="text-sm text-gray-600 mb-2">@{user.username}</p>
                  {user.verified && (
                    <Badge className="bg-[#fa6723] mb-3">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified Seller
                    </Badge>
                  )}
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg">{user.rating > 0 ? user.rating.toFixed(1) : 'New'}</span>
                    {user.totalReviews > 0 && (
                      <span className="text-gray-600 ml-1">({user.totalReviews} reviews)</span>
                    )}
                  </div>
                  <div className="flex items-center justify-center gap-1 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{user.location}</span>
                  </div>
                </div>

                {!isOwnProfile && (
                  <div className="space-y-2 mb-6">
                    <Button className="w-full bg-[#fa6723] hover:bg-[#e55a1f]">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact Seller
                    </Button>
                    <Button variant="outline" className="w-full">
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      Follow
                    </Button>
                  </div>
                )}

                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Member since</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {user.memberSince.toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total sales</span>
                    <span className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      {user.totalSales}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Response rate</span>
                    <span className="text-[#fa6723]">{user.responseRate}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Response time</span>
                    <span>{user.responseTime}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xl mb-1">{user.stats.activeListings}</div>
                    <div className="text-xs text-gray-600">Active Listings</div>
                  </div>
                  <div>
                    <div className="text-xl mb-1">{user.stats.followers}</div>
                    <div className="text-xs text-gray-600">Followers</div>
                  </div>
                  <div>
                    <div className="text-xl mb-1">{user.stats.following}</div>
                    <div className="text-xs text-gray-600">Following</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {user.rating >= 4.5 && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Star className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <div className="text-sm">Top Rated Seller</div>
                      <div className="text-xs text-gray-600">4.5+ rating</div>
                    </div>
                  </div>
                )}
                {user.responseRate >= 90 && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#ffe5d9] flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-[#fa6723]" />
                    </div>
                    <div>
                      <div className="text-sm">Fast Responder</div>
                      <div className="text-xs text-gray-600">{user.responseRate}% response rate</div>
                    </div>
                  </div>
                )}
                {user.totalSales >= 100 && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#ffe5d9] flex items-center justify-center">
                      <Package className="w-5 h-5 text-[#fa6723]" />
                    </div>
                    <div>
                      <div className="text-sm">100+ Sales</div>
                      <div className="text-xs text-gray-600">Experienced seller</div>
                    </div>
                  </div>
                )}
                {user.rating < 4.5 && user.responseRate < 90 && user.totalSales < 100 && (
                  <div className="text-sm text-gray-500">
                    No achievements yet. Keep selling to earn badges!
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Content - Tabs */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="listings">
                  Listings ({activeListings.length})
                </TabsTrigger>
                <TabsTrigger value="reviews">
                  Reviews ({user.totalReviews})
                </TabsTrigger>
              </TabsList>

              {/* About Tab */}
              <TabsContent value="about" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About {user.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{user.bio}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Listings Tab */}
              <TabsContent value="listings" className="mt-6 space-y-4">
                {activeListings.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center text-gray-500">
                      No active listings yet
                    </CardContent>
                  </Card>
                ) :
                  activeListings.map((product) => (
                    <Card
                      key={product.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => onProductClick(product)}
                    >
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="mb-2 line-clamp-2">{product.title}</h3>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{product.condition}</Badge>
                              {product.auction ? (
                                <Badge variant="secondary">Auction</Badge>
                              ) : (
                                <Badge className="bg-[#fa6723]">Buy Now</Badge>
                              )}
                            </div>
                            <div className="text-lg mb-1">${product.price.toFixed(2)}</div>
                            {product.originalPrice && (
                              <div className="text-sm text-gray-500 line-through">
                                ${product.originalPrice.toFixed(2)}
                              </div>
                            )}
                            {product.timeLeft && (
                              <div className="text-sm text-gray-600 mt-1">{product.timeLeft}</div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                }
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="mt-6">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Seller Ratings</CardTitle>
                    <CardDescription>
                      {user.totalReviews > 0
                        ? `Based on ${user.totalReviews} reviews`
                        : 'No reviews yet'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-8 mb-6">
                      <div className="text-center">
                        <div className="text-4xl mb-2">
                          {user.rating > 0 ? user.rating.toFixed(1) : 'N/A'}
                        </div>
                        <div className="flex items-center justify-center gap-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(user.rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-gray-600">
                          {user.totalReviews > 0 ? `${user.totalReviews} reviews` : 'No reviews'}
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        {user.totalReviews > 0 ? (
                          [5, 4, 3, 2, 1].map((stars, index) => (
                            <div key={stars} className="flex items-center gap-2">
                              <span className="text-sm w-8">{stars} ★</span>
                              <Progress
                                value={(ratingDistribution[index] / user.totalReviews) * 100}
                                className="flex-1"
                              />
                              <span className="text-sm text-gray-600 w-8">
                                {ratingDistribution[index]}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-gray-500 text-center py-4">
                            No ratings yet
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Reviews List */}
                <div className="space-y-4">
                  {mockReviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="pt-6">
                        <div className="flex gap-4">
                          <Avatar>
                            <AvatarImage src={review.reviewerAvatar} />
                            <AvatarFallback>{review.reviewerName[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <div>{review.reviewerName}</div>
                                <div className="text-sm text-gray-600">
                                  {review.date.toLocaleDateString()}
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-700 mb-2">{review.comment}</p>
                            <div className="text-sm text-gray-600">
                              Product: {review.productTitle}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
