"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  ArrowLeft,
  User,
  Bell,
  Shield,
  CreditCard,
  Upload,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import { getCurrentUser, getUserProfile, updateUserProfile } from "@/lib/auth";

interface UserSettingsProps {
  onBack: () => void;
}

export function UserSettings({ onBack }: UserSettingsProps) {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const [profileData, setProfileData] = useState({
    name: "",
    username: "",
    email: "",
    location: "",
    bio: "",
    avatar: "",
  });

  const [contactData, setContactData] = useState({
    telegram: "",
    whatsapp: "",
  });

  const [notifications, setNotifications] = useState({
    emailNewMessages: true,
    emailOffers: true,
    emailBids: true,
    emailWatchers: false,
    emailMarketing: false,
    pushNewMessages: true,
    pushOffers: true,
    pushBids: true,
    pushPriceDrops: true,
  });

  const [privacy, setPrivacy] = useState({
    showEmail: false,
    showPhone: false,
    showLastSeen: true,
    allowFollowers: true,
  });

  // Load user data on mount
  useEffect(() => {
    async function loadUserData() {
      try {
        setLoading(true);
        const { user } = await getCurrentUser();

        if (!user) {
          console.error('No user found');
          setLoading(false);
          return;
        }

        setUserId(user.id);

        // Fetch user profile from database
        const { data: profile, error } = await getUserProfile(user.id);

        if (error) {
          console.error('Error fetching user profile:', error);
        } else if (profile) {
          const prof = profile as any;
          setProfileData({
            name: prof.display_name || '',
            username: prof.username || '',
            email: user.email || '',
            location: prof.location || '',
            bio: prof.bio || '',
            avatar: prof.avatar_url || '',
          });
          setContactData({
            telegram: prof.telegram || '',
            whatsapp: prof.whatsapp || '',
          });
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading user data:', error);
        setLoading(false);
      }
    }

    loadUserData();
  }, []);

  const handleSaveProfile = async () => {
    if (!userId) return;

    try {
      const { error } = await updateUserProfile(userId, {
        display_name: profileData.name || null,
        username: profileData.username || null,
        location: profileData.location || null,
        bio: profileData.bio || null,
      });

      if (error) {
        toast.error(error.message || "Failed to update profile");
      } else {
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleSaveContactPreferences = async () => {
    if (!userId) return;

    // Validate required fields
    if (!contactData.telegram || contactData.telegram.trim().length < 3) {
      toast.error("Telegram username or phone number is required");
      return;
    }

    if (!contactData.whatsapp || contactData.whatsapp.trim().length < 8) {
      toast.error("WhatsApp number is required (minimum 8 digits)");
      return;
    }

    try {
      const { error } = await updateUserProfile(userId, {
        telegram: contactData.telegram.trim(),
        whatsapp: contactData.whatsapp.trim(),
      });

      if (error) {
        toast.error(error.message || "Failed to update contact preferences");
      } else {
        toast.success("Contact preferences updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update contact preferences");
    }
  };

  const handleSaveNotifications = () => {
    // TODO: Implement notifications save to database
    toast.success("Notification settings saved");
  };

  const handleSavePrivacy = () => {
    // TODO: Implement privacy settings save to database
    toast.success("Privacy settings updated");
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Upload to Supabase Storage
      const url = URL.createObjectURL(file);
      setProfileData({ ...profileData, avatar: url });
      toast.success("Profile photo updated (upload not yet implemented)");
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fa6723] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (profileData.name) {
      const nameParts = profileData.name.trim().split(' ');
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
      }
      return profileData.name[0]?.toUpperCase() || 'U';
    }
    if (profileData.username) {
      return profileData.username[0]?.toUpperCase() || 'U';
    }
    if (profileData.email) {
      return profileData.email[0]?.toUpperCase() || 'U';
    }
    return 'U';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1>Settings</h1>
              <p className="text-sm text-gray-600">Manage your account settings and preferences</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy">
              <Shield className="w-4 h-4 mr-2" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="billing">
              <CreditCard className="w-4 h-4 mr-2" />
              Billing
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information and profile photo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <Avatar className="w-24 h-24">
                    {profileData.avatar && <AvatarImage src={profileData.avatar} />}
                    <AvatarFallback className="text-xl">{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <label htmlFor="avatar-upload">
                      <Button variant="outline" size="sm" asChild>
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          Change Photo
                        </span>
                      </Button>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                    </label>
                    <p className="text-sm text-gray-500 mt-2">JPG, PNG or GIF. Max size 2MB</p>
                  </div>
                </div>

                <Separator />

                {/* Form Fields */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={profileData.username}
                      onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-10"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                  </div>
                </div>


                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      id="location"
                      className="pl-10"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    placeholder="Tell buyers about yourself..."
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    maxLength={500}
                  />
                  <p className="text-sm text-gray-500">{profileData.bio.length}/500 characters</p>
                </div>

                <Button onClick={handleSaveProfile} className="bg-[#fa6723] hover:bg-[#e55a1f]">
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Preferences</CardTitle>
                <CardDescription>
                  Required contact information for communication and marketing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="telegram">
                    Telegram <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      id="telegram"
                      className="pl-10"
                      placeholder="@username or phone number"
                      required
                      value={contactData.telegram}
                      onChange={(e) =>
                        setContactData({ ...contactData, telegram: e.target.value })
                      }
                    />
                  </div>
                  <p className="text-sm text-gray-500">Enter your Telegram username or phone number</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp">
                    WhatsApp Number <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      id="whatsapp"
                      type="tel"
                      className="pl-10"
                      placeholder="+855 12 345 678"
                      required
                      value={contactData.whatsapp}
                      onChange={(e) =>
                        setContactData({ ...contactData, whatsapp: e.target.value })
                      }
                    />
                  </div>
                  <p className="text-sm text-gray-500">Required for communication and updates</p>
                </div>

                <Button
                  onClick={handleSaveContactPreferences}
                  className="bg-[#fa6723] hover:bg-[#e55a1f]"
                  disabled={!contactData.telegram || !contactData.whatsapp}
                >
                  Save Contact Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Manage what you receive in your email</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New Messages</Label>
                    <p className="text-sm text-gray-500">Get notified when someone sends you a message</p>
                  </div>
                  <Switch
                    checked={notifications.emailNewMessages}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, emailNewMessages: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Offers on Your Listings</Label>
                    <p className="text-sm text-gray-500">When someone makes an offer on your item</p>
                  </div>
                  <Switch
                    checked={notifications.emailOffers}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, emailOffers: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Bids on Your Auctions</Label>
                    <p className="text-sm text-gray-500">When someone bids on your auction items</p>
                  </div>
                  <Switch
                    checked={notifications.emailBids}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, emailBids: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New Watchers</Label>
                    <p className="text-sm text-gray-500">When someone watches your listing</p>
                  </div>
                  <Switch
                    checked={notifications.emailWatchers}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, emailWatchers: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Promotions & Tips</Label>
                    <p className="text-sm text-gray-500">Selling tips and marketplace updates</p>
                  </div>
                  <Switch
                    checked={notifications.emailMarketing}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, emailMarketing: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Push Notifications</CardTitle>
                <CardDescription>Manage notifications on your device</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New Messages</Label>
                    <p className="text-sm text-gray-500">Instant alerts for new messages</p>
                  </div>
                  <Switch
                    checked={notifications.pushNewMessages}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, pushNewMessages: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Offers & Bids</Label>
                    <p className="text-sm text-gray-500">When you receive offers or bids</p>
                  </div>
                  <Switch
                    checked={notifications.pushOffers}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, pushOffers: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Price Drops</Label>
                    <p className="text-sm text-gray-500">
                      When items in your watchlist drop in price
                    </p>
                  </div>
                  <Switch
                    checked={notifications.pushPriceDrops}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, pushPriceDrops: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleSaveNotifications} className="bg-[#fa6723] hover:bg-[#e55a1f]">
              Save Notification Settings
            </Button>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control who can see your information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Email Address</Label>
                    <p className="text-sm text-gray-500">
                      Display your email on your public profile
                    </p>
                  </div>
                  <Switch
                    checked={privacy.showEmail}
                    onCheckedChange={(checked) => setPrivacy({ ...privacy, showEmail: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Phone Number</Label>
                    <p className="text-sm text-gray-500">Display your phone on your public profile</p>
                  </div>
                  <Switch
                    checked={privacy.showPhone}
                    onCheckedChange={(checked) => setPrivacy({ ...privacy, showPhone: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Last Seen</Label>
                    <p className="text-sm text-gray-500">Let others see when you were last active</p>
                  </div>
                  <Switch
                    checked={privacy.showLastSeen}
                    onCheckedChange={(checked) =>
                      setPrivacy({ ...privacy, showLastSeen: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Followers</Label>
                    <p className="text-sm text-gray-500">
                      Let other users follow your listings and updates
                    </p>
                  </div>
                  <Switch
                    checked={privacy.allowFollowers}
                    onCheckedChange={(checked) =>
                      setPrivacy({ ...privacy, allowFollowers: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>Manage your password and security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full sm:w-auto">
                  Change Password
                </Button>
                <Separator />
                <Button variant="outline" className="w-full sm:w-auto">
                  Enable Two-Factor Authentication
                </Button>
              </CardContent>
            </Card>

            <Button onClick={handleSavePrivacy} className="bg-[#fa6723] hover:bg-[#e55a1f]">
              Save Privacy Settings
            </Button>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Selling Fees</CardTitle>
                <CardDescription>Understand our marketplace fees</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between py-2">
                    <span>Listing Fee</span>
                    <span className="text-[#fa6723]">FREE</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between py-2">
                    <span>Final Value Fee (Buy Now)</span>
                    <span>3.5% of sale price</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between py-2">
                    <span>Final Value Fee (Auction)</span>
                    <span>5% of final bid</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>View your transaction history</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">No payment history yet</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payout Settings</CardTitle>
                <CardDescription>Set up how you receive payments from buyers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Since transactions happen off-platform, you'll arrange payment methods directly with
                  buyers.
                </p>
                <Button variant="outline">View Recommended Payment Methods</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
