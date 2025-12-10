"use client";

import { useRouter } from "next/navigation";
import { CreateListing } from "@/components/create-listing";

export default function NewListingPage() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handlePublish = (listing: any) => {
    // Redirect to the listing detail page or my listings
    router.push('/my-listings');
  };

  return (
    <CreateListing
      onBack={handleBack}
      onPublish={handlePublish}
    />
  );
}
