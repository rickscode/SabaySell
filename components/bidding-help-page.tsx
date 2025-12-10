"use client";

import { FooterPageTemplate, ContentSection } from "./footer-page-template";
import { Button } from "./ui/button";
import { AlertCircle, CheckCircle2, Shield } from "lucide-react";

interface BiddingHelpPageProps {
  onNavigate: (view: string) => void;
}

export function BiddingHelpPage({ onNavigate }: BiddingHelpPageProps) {
  return (
    <FooterPageTemplate
      title="Bidding & Buying Help"
      breadcrumbs={["Home", "Help Center", "Bidding & Buying Help"]}
      onNavigate={onNavigate}
      sidebar={{
        title: "Help Topics",
        links: [
          { label: "Registration", onClick: () => onNavigate("registration") },
          { label: "Bidding & Buying", onClick: () => {} },
          { label: "Selling Guide", onClick: () => onNavigate("start-selling") },
          { label: "Account Security", onClick: () => onNavigate("security") },
          { label: "Contact Support", onClick: () => onNavigate("contact") },
        ],
      }}
      relatedTopics={[
        {
          title: "Contact Seller",
          description: "Learn how to communicate with sellers effectively",
          onClick: () => onNavigate("contact-sellers"),
        },
        {
          title: "Resolution Center",
          description: "Get help resolving issues with transactions",
          onClick: () => onNavigate("resolution"),
        },
      ]}
    >
      <ContentSection title="How Bidding Works">
        <p>
          Our marketplace offers both auction-style bidding and buy-it-now options.
          Understanding how to bid effectively will help you secure the items you want
          at the best prices.
        </p>
      </ContentSection>

      <ContentSection title="Types of Listings">
        <div className="space-y-4">
          <div className="border-l-4 border-[#fa6723] pl-4">
            <h3 className="mb-2">Auction Listings</h3>
            <p className="text-sm text-gray-600">
              Bid against other buyers. The highest bid when the auction ends wins.
              Watch the countdown timer and place your bids strategically.
            </p>
          </div>
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="mb-2">Buy It Now</h3>
            <p className="text-sm text-gray-600">
              Purchase items immediately at a fixed price. No bidding required.
              Contact the seller directly to arrange payment and pickup.
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Bidding Tips">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#fa6723] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Research Before You Bid</p>
              <p className="text-sm text-gray-600">
                Check the seller's reviews and the item condition carefully
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#fa6723] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Set Your Maximum Price</p>
              <p className="text-sm text-gray-600">
                Decide the most you're willing to pay before bidding
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#fa6723] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Watch the Time</p>
              <p className="text-sm text-gray-600">
                Many bidders wait until the last minutes to place their bids
              </p>
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Contacting Sellers">
        <p>
          All transactions happen directly between buyers and sellers. Use the
          "Contact Seller" button to:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-2 mt-3">
          <li>Ask questions about the item</li>
          <li>Make an offer on Buy It Now items</li>
          <li>Arrange payment and pickup details</li>
          <li>Request additional photos or information</li>
        </ul>
      </ContentSection>

      <ContentSection title="Safety Tips">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex gap-3">
            <Shield className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <div className="space-y-2 text-sm">
              <p className="font-medium text-gray-900">Stay Safe While Buying</p>
              <ul className="space-y-1">
                <li>• Meet in public places for item exchange</li>
                <li>• Inspect items before paying</li>
                <li>• Be cautious of deals that seem too good to be true</li>
                <li>• Never send money before seeing the item</li>
                <li>• Report suspicious listings or sellers</li>
              </ul>
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Need More Help?">
        <div className="flex gap-3 mt-4">
          <Button onClick={() => onNavigate("contact")}>
            Contact Support
          </Button>
          <Button variant="outline" onClick={() => onNavigate("home")}>
            Back to Home
          </Button>
        </div>
      </ContentSection>
    </FooterPageTemplate>
  );
}
