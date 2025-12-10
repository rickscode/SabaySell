"use client";

import { FooterPageTemplate, ContentSection } from "./footer-page-template";
import { Button } from "./ui/button";
import { DollarSign, Camera, FileText, Users } from "lucide-react";

interface StartSellingPageProps {
  onNavigate: (view: string) => void;
  onCreateListing?: () => void;
}

export function StartSellingPage({ onNavigate, onCreateListing }: StartSellingPageProps) {
  return (
    <FooterPageTemplate
      title="Start Selling"
      breadcrumbs={["Home", "Sell", "Start Selling"]}
      onNavigate={onNavigate}
      sidebar={{
        title: "Selling Resources",
        links: [
          { label: "Start Selling", onClick: () => {} },
          { label: "Learn to Sell", onClick: () => onNavigate("learn-to-sell") },
          { label: "Business Sellers", onClick: () => onNavigate("business-sellers") },
          { label: "Pricing Guide", onClick: () => onNavigate("pricing") },
          { label: "Featured Listings", onClick: () => onNavigate("featured") },
        ],
      }}
      relatedTopics={[
        {
          title: "Learn to Sell",
          description: "Advanced tips for successful selling",
          onClick: () => onNavigate("learn-to-sell"),
        },
        {
          title: "Business Sellers",
          description: "Sell at scale with business tools",
          onClick: () => onNavigate("business-sellers"),
        },
      ]}
    >
      <ContentSection title="Why Sell on Our Marketplace?">
        <p>
          Reach thousands of buyers across Cambodia. Our platform makes it easy to
          list your items and connect directly with interested buyers.
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <DollarSign className="w-8 h-8 text-[#fa6723] mb-2" />
            <h3 className="mb-2">Free Listings</h3>
            <p className="text-sm text-gray-600">
              Create unlimited listings at no cost. Only pay for optional featured placements.
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <Users className="w-8 h-8 text-[#fa6723] mb-2" />
            <h3 className="mb-2">Large Audience</h3>
            <p className="text-sm text-gray-600">
              Connect with thousands of active buyers looking for items like yours.
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="How to Create Your First Listing">
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-[#fa6723] text-white rounded-full flex items-center justify-center">
              1
            </div>
            <div>
              <h3 className="mb-1">Take Great Photos</h3>
              <p className="text-sm text-gray-600">
                Use clear, well-lit photos from multiple angles. Show any defects honestly.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-[#fa6723] text-white rounded-full flex items-center justify-center">
              2
            </div>
            <div>
              <h3 className="mb-1">Write a Detailed Description</h3>
              <p className="text-sm text-gray-600">
                Include brand, model, condition, size, and any relevant details buyers need.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-[#fa6723] text-white rounded-full flex items-center justify-center">
              3
            </div>
            <div>
              <h3 className="mb-1">Set Your Price</h3>
              <p className="text-sm text-gray-600">
                Research similar items to price competitively. Choose auction or buy-it-now format.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-[#fa6723] text-white rounded-full flex items-center justify-center">
              4
            </div>
            <div>
              <h3 className="mb-1">Add Contact Information</h3>
              <p className="text-sm text-gray-600">
                Provide your phone number or preferred messaging app for buyers to reach you.
              </p>
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Listing Options">
        <div className="space-y-3">
          <div className="border rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <h3>Standard Listing</h3>
              <span className="text-[#fa6723]">FREE</span>
            </div>
            <p className="text-sm text-gray-600">
              Your listing appears in search results and category pages based on relevance and date.
            </p>
          </div>
          <div className="border rounded-lg p-4 border-[#fa6723]">
            <div className="flex items-start justify-between mb-2">
              <h3>Category Featured</h3>
              <span className="text-[#fa6723]">$5</span>
            </div>
            <p className="text-sm text-gray-600">
              Your listing appears at the top of its category page for 7 days.
            </p>
          </div>
          <div className="border rounded-lg p-4 border-[#fa6723]">
            <div className="flex items-start justify-between mb-2">
              <h3>Homepage Featured</h3>
              <span className="text-[#fa6723]">$15</span>
            </div>
            <p className="text-sm text-gray-600">
              Maximum visibility! Your listing appears on the homepage for 7 days.
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Seller Tips for Success">
        <ul className="space-y-2">
          <li className="flex gap-2">
            <span className="text-[#fa6723]">•</span>
            <span>Respond to buyer messages quickly</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#fa6723]">•</span>
            <span>Be honest about item condition</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#fa6723]">•</span>
            <span>Arrange safe meeting places for exchanges</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#fa6723]">•</span>
            <span>Update listings if items are sold</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#fa6723]">•</span>
            <span>Build a good reputation with quality service</span>
          </li>
        </ul>
      </ContentSection>

      <ContentSection title="Ready to Start?">
        <p className="mb-4">
          Create your first listing now and start connecting with buyers today!
        </p>
        <div className="flex gap-3">
          <Button 
            onClick={() => {
              if (onCreateListing) {
                onCreateListing();
              } else {
                onNavigate("create-listing");
              }
            }}
          >
            Create Your First Listing
          </Button>
          <Button variant="outline" onClick={() => onNavigate("home")}>
            Back to Home
          </Button>
        </div>
      </ContentSection>
    </FooterPageTemplate>
  );
}
