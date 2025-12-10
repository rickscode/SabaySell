"use client";

import { useRouter } from "next/navigation";
import { MyListings } from "@/components/my-listings";

export default function MyListingsPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  const handleCreateNew = () => {
    router.push('/listings/new');
  };

  const handleEditListing = (listing: any) => {
    // Navigate to edit page (we'll implement this later)
    router.push(`/listings/${listing.id}/edit`);
  };

  const handleViewListing = (listing: any) => {
    // Navigate to listing detail page
    router.push(`/listings/${listing.id}`);
  };

  return (
    <MyListings
      onBack={handleBack}
      onCreateNew={handleCreateNew}
      onEditListing={handleEditListing}
      onViewListing={handleViewListing}
    />
  );
}
