"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Switch } from "./ui/switch";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import {
  ArrowLeft,
  Upload,
  X,
  DollarSign,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  Image as ImageIcon,
  Star,
  Home as HomeIcon,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { createListing, uploadImagesForListing, updateListing, type CreateListingData } from "@/app/actions/listings";

interface CreateListingProps {
  onBack: () => void;
  onPublish: (listing: any) => void;
  editingListing?: any;
}

const categories = [
  "Electronics",
  "Mobile Phones",
  "Cameras",
  "Audio",
  "Watches",
  "Home & Garden",
  "Fashion",
  "Books",
  "Sports",
  "Toys",
  "Automotive",
  "Collectibles",
];

const conditions = [
  { label: "New", value: "new" },
  { label: "Like New", value: "like_new" },
  { label: "Used", value: "used" },
];

const locations = [
  "Phnom Penh",
  "Siem Reap",
  "Sihanoukville",
  "Kampot",
  "Other Location",
];

export function CreateListing({ onBack, onPublish, editingListing }: CreateListingProps) {
  const router = useRouter();
  const [listingType, setListingType] = useState<"buy-now" | "auction">(
    editingListing?.type || "buy-now"
  );
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(editingListing?.images || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: editingListing?.title || "",
    category: editingListing?.category || "",
    condition: editingListing?.condition || "",
    description: editingListing?.description || "",
    price: editingListing?.price || "",
    startingBid: editingListing?.startingBid || "",
    reservePrice: editingListing?.reservePrice || "",
    buyItNowPrice: editingListing?.buyItNowPrice || "",
    duration: editingListing?.duration || "7",
    location: editingListing?.location || "",
    shipping: editingListing?.shipping || "",
    freeShipping: editingListing?.freeShipping || false,
    localPickup: editingListing?.localPickup || false,
    acceptOffers: editingListing?.acceptOffers || false,
    phoneNumber: editingListing?.phoneNumber || "",
    telegram: editingListing?.telegram || "",
    whatsapp: editingListing?.whatsapp || "",
    quantity: editingListing?.quantity || "1",
    featuredInCategory: editingListing?.featuredInCategory || false,
    featuredOnHomepage: editingListing?.featuredOnHomepage || false,
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const totalImages = imageFiles.length + newFiles.length;

      if (totalImages > 6) {
        toast.error(`Maximum 6 images allowed. You can add ${6 - imageFiles.length} more.`);
        return;
      }

      // Store File objects
      setImageFiles([...imageFiles, ...newFiles]);

      // Create preview URLs
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews([...imagePreviews, ...newPreviews]);

      toast.success(`${newFiles.length} image(s) added`);
    }
  };

  const removeImage = (index: number) => {
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index]);

    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }
    if (imageFiles.length === 0 && !editingListing) {
      toast.error("Please upload at least one image");
      return;
    }
    if (listingType === "buy-now" && !formData.price) {
      toast.error("Please enter a price");
      return;
    }
    if (listingType === "auction" && !formData.startingBid) {
      toast.error("Please enter a starting bid");
      return;
    }

    setIsSubmitting(true);

    try {
      // Boosts temporarily disabled - all listings go live immediately
      const hasBoosts = false; // formData.featuredInCategory || formData.featuredOnHomepage;

      // Map form data to CreateListingData
      const listingData: CreateListingData = {
        type: listingType === "buy-now" ? "fixed" : "auction",
        title_en: formData.title, // For now, use same title for both languages
        title_km: formData.title,
        description_en: formData.description,
        description_km: formData.description,
        category: formData.category,
        condition: formData.condition as any,
        location: formData.location,
        price: listingType === "buy-now" ? parseFloat(formData.price) : undefined,
        is_negotiable: formData.acceptOffers,
        quantity: parseInt(formData.quantity) || 1,
        shipping_free: formData.freeShipping,
        shipping_paid: !formData.freeShipping && !formData.localPickup,
        local_pickup: formData.localPickup,
        shipping_cost: formData.shipping ? parseFloat(formData.shipping) : 0,
        start_price: listingType === "auction" ? parseFloat(formData.startingBid) : undefined,
        min_increment: listingType === "auction" ? 1.0 : undefined,
        reserve_price: listingType === "auction" && formData.reservePrice ? parseFloat(formData.reservePrice) : undefined,
        auction_duration_hours: listingType === "auction" ? parseInt(formData.duration) * 24 : undefined,
        status: hasBoosts ? "draft" : "active", // Draft if boosts enabled, otherwise publish immediately
      };

      // Create or update listing
      let result;
      if (editingListing) {
        result = await updateListing(editingListing.id, listingData);
      } else {
        result = await createListing(listingData);
      }

      if (!result.success || !result.listingId) {
        toast.error(result.error || "Failed to save listing");
        setIsSubmitting(false);
        return;
      }

      // Upload images if any
      if (imageFiles.length > 0) {
        const formData = new FormData();
        imageFiles.forEach((file) => {
          formData.append("images", file);
        });

        const uploadResult = await uploadImagesForListing(result.listingId, formData);

        if (!uploadResult.success) {
          toast.error(uploadResult.error || "Failed to upload images");
          setIsSubmitting(false);
          return;
        }
      }

      // Success!
      if (hasBoosts && !editingListing) {
        // Redirect to boost payment page
        toast.success("Listing created! Complete payment to activate boost", {
          description: "You'll be redirected to the payment page",
        });

        // Build payment page URL with boost info
        const params = new URLSearchParams({
          listingId: result.listingId,
          featuredOnHomepage: formData.featuredOnHomepage.toString(),
          featuredInCategory: formData.featuredInCategory.toString(),
          duration: "7", // Default 7 days
        });

        router.push(`/boost-payment?${params.toString()}`);
      } else {
        // Normal publish flow
        toast.success(editingListing ? "Listing updated!" : "Listing published!", {
          description: "Your item is now live on the marketplace",
        });

        // Call onPublish callback
        onPublish({
          id: result.listingId,
          ...formData,
          type: listingType,
        });
      }
    } catch (error) {
      console.error("Error saving listing:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1>{editingListing ? "Edit Listing" : "Create a Listing"}</h1>
                <p className="text-sm text-gray-600">
                  {editingListing ? "Update your listing details" : "List your item for sale"}
                </p>
              </div>
            </div>
            <Button
              onClick={handleSubmit}
              className="bg-[#fa6723] hover:bg-[#e55a1f]"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingListing ? "Update Listing" : "Publish Listing"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Listing Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Listing Format</CardTitle>
              <CardDescription>Choose how you want to sell your item</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={listingType} onValueChange={(v) => setListingType(v as "buy-now" | "auction")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="buy-now"
                    disabled={isSubmitting}
                    type="button"
                    className="data-[state=active]:bg-[#fa6723] data-[state=active]:text-white"
                  >
                    Fixed Price
                  </TabsTrigger>
                  <TabsTrigger
                    value="auction"
                    disabled={isSubmitting}
                    type="button"
                    className="data-[state=active]:bg-[#fa6723] data-[state=active]:text-white"
                  >
                    Auction
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Photos</CardTitle>
              <CardDescription>Add up to 12 photos (first photo will be the cover)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-square group">
                    <img
                      src={preview}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg border"
                    />
                    {index === 0 && (
                      <Badge className="absolute top-2 left-2">Cover</Badge>
                    )}
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                      disabled={isSubmitting}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {imagePreviews.length < 6 && (
                  <label className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Upload</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={isSubmitting}
                    />
                  </label>
                )}
              </div>
              <p className="text-sm text-gray-600">
                <ImageIcon className="w-4 h-4 inline mr-1" />
                {imagePreviews.length}/6 photos uploaded
              </p>
            </CardContent>
          </Card>

          {/* Basic Details */}
          <Card>
            <CardHeader>
              <CardTitle>Item Details</CardTitle>
              <CardDescription>Provide information about your item</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., iPhone 15 Pro Max 256GB - Natural Titanium"
                  value={formData.title}
                  onChange={(e) => updateFormData("title", e.target.value)}
                  maxLength={80}
                />
                <p className="text-sm text-gray-500">{formData.title.length}/80 characters</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(v) => updateFormData("category", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">Condition *</Label>
                  <Select value={formData.condition} onValueChange={(v) => updateFormData("condition", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((cond) => (
                        <SelectItem key={cond.value} value={cond.value}>
                          {cond.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your item, include details about condition, features, etc."
                  rows={6}
                  value={formData.description}
                  onChange={(e) => updateFormData("description", e.target.value)}
                  maxLength={1000}
                />
                <p className="text-sm text-gray-500">{formData.description.length}/1000 characters</p>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
              <CardDescription>
                {listingType === "buy-now" 
                  ? "Set your fixed price" 
                  : "Set your auction parameters"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {listingType === "buy-now" ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (USD) *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-10"
                        value={formData.price}
                        onChange={(e) => updateFormData("price", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Accept Offers</Label>
                      <p className="text-sm text-gray-500">
                        Allow buyers to make offers on your item
                      </p>
                    </div>
                    <Checkbox
                      checked={formData.acceptOffers}
                      onCheckedChange={(checked) => updateFormData("acceptOffers", checked)}
                      className="data-[state=checked]:bg-[#fa6723] data-[state=checked]:border-[#fa6723]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => updateFormData("quantity", e.target.value)}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startingBid">Starting Bid (USD) *</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                          id="startingBid"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="pl-10"
                          value={formData.startingBid}
                          onChange={(e) => updateFormData("startingBid", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reservePrice">Reserve Price (Optional)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                          id="reservePrice"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="pl-10"
                          value={formData.reservePrice}
                          onChange={(e) => updateFormData("reservePrice", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="buyItNowPrice">Buy It Now Price (Optional)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        id="buyItNowPrice"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-10"
                        value={formData.buyItNowPrice}
                        onChange={(e) => updateFormData("buyItNowPrice", e.target.value)}
                      />
                    </div>
                    <p className="text-sm text-gray-500">
                      Buyers can purchase immediately at this price
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Auction Duration</Label>
                    <Select value={formData.duration} onValueChange={(v) => updateFormData("duration", v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 day</SelectItem>
                        <SelectItem value="3">3 days</SelectItem>
                        <SelectItem value="5">5 days</SelectItem>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="10">10 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Shipping & Location */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping & Location</CardTitle>
              <CardDescription>Where you'll meet buyers or ship from</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Select value={formData.location} onValueChange={(v) => updateFormData("location", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Free Shipping/Delivery</Label>
                  <p className="text-sm text-gray-500">
                    You'll cover shipping costs
                  </p>
                </div>
                <Checkbox
                  checked={formData.freeShipping}
                  onCheckedChange={(checked) => updateFormData("freeShipping", checked)}
                  className="data-[state=checked]:bg-[#fa6723] data-[state=checked]:border-[#fa6723]"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Local Pickup Available</Label>
                  <p className="text-sm text-gray-500">
                    Buyer can pick up in person
                  </p>
                </div>
                <Checkbox
                  checked={formData.localPickup}
                  onCheckedChange={(checked) => updateFormData("localPickup", checked)}
                  className="data-[state=checked]:bg-[#fa6723] data-[state=checked]:border-[#fa6723]"
                />
              </div>

              {!formData.freeShipping && !formData.localPickup && (
                <div className="space-y-2">
                  <Label htmlFor="shipping">Shipping Cost (USD)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      id="shipping"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-10"
                      value={formData.shipping}
                      onChange={(e) => updateFormData("shipping", e.target.value)}
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Or buyer pays actual shipping cost
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>How buyers can reach you (at least one required)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+855 12 345 678"
                    className="pl-10"
                    value={formData.phoneNumber}
                    onChange={(e) => updateFormData("phoneNumber", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telegram">Telegram Username</Label>
                <div className="relative">
                  <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="telegram"
                    placeholder="@username"
                    className="pl-10"
                    value={formData.telegram}
                    onChange={(e) => updateFormData("telegram", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="whatsapp"
                    type="tel"
                    placeholder="+855 12 345 678"
                    className="pl-10"
                    value={formData.whatsapp}
                    onChange={(e) => updateFormData("whatsapp", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Promotion Options */}
          {/* BOOST/PAYMENT UI - Temporarily hidden until payment gateway is set up
          <Card>
            <CardHeader>
              <CardTitle>Promote Your Listing</CardTitle>
              <CardDescription>Boost visibility and get more buyers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-[#ffe5d9] rounded-lg">
                      <Star className="w-5 h-5 text-[#fa6723]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="featuredInCategory" className="cursor-pointer">
                          Featured in Category
                        </Label>
                        <Badge className="bg-[#fa6723]">$5.00</Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Your product will appear at the top of your category for 1 week
                      </p>
                    </div>
                  </div>
                  <Checkbox
                    id="featuredInCategory"
                    checked={formData.featuredInCategory}
                    onCheckedChange={(checked) => updateFormData("featuredInCategory", checked)}
                    className="data-[state=checked]:bg-[#fa6723] data-[state=checked]:border-[#fa6723]"
                  />
                </div>
                {formData.featuredInCategory && (
                  <div className="ml-11 p-3 bg-[#fff5f0] rounded-md">
                    <p className="text-sm text-[#7a3410]">
                      ✓ Featured placement in {formData.category || "your category"} for 7 days
                    </p>
                    <p className="text-sm text-[#7a3410]">✓ Attract more potential buyers</p>
                    <p className="text-sm text-[#7a3410]">✓ Stand out from the competition</p>
                  </div>
                )}
              </div>

              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-[#ffe5d9] rounded-lg">
                      <TrendingUp className="w-5 h-5 text-[#fa6723]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="featuredOnHomepage" className="cursor-pointer">
                          Featured on Homepage
                        </Label>
                        <Badge className="bg-[#fa6723]">$15.00</Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Your product will appear on the homepage for 1 week
                      </p>
                    </div>
                  </div>
                  <Checkbox
                    id="featuredOnHomepage"
                    checked={formData.featuredOnHomepage}
                    onCheckedChange={(checked) => updateFormData("featuredOnHomepage", checked)}
                    className="data-[state=checked]:bg-[#fa6723] data-[state=checked]:border-[#fa6723]"
                  />
                </div>
                {formData.featuredOnHomepage && (
                  <div className="ml-11 p-3 bg-[#fff5f0] rounded-md">
                    <p className="text-sm text-[#7a3410]">
                      ✓ Premium placement on the homepage for 7 days
                    </p>
                    <p className="text-sm text-[#7a3410]">✓ Maximum visibility to all visitors</p>
                    <p className="text-sm text-[#7a3410]">✓ Significantly increase your views</p>
                  </div>
                )}
              </div>

              {(formData.featuredInCategory || formData.featuredOnHomepage) && (
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <p>Total Promotion Cost:</p>
                    <p className="text-[#fa6723]">
                      ${(
                        (formData.featuredInCategory ? 5 : 0) +
                        (formData.featuredOnHomepage ? 15 : 0)
                      ).toFixed(2)}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Payment will be processed after listing is published
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          */}

          {/* Submit Buttons */}
          <div className="flex gap-4 justify-end">
            <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#fa6723] hover:bg-[#e55a1f]" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingListing ? "Update Listing" : "Publish Listing"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
