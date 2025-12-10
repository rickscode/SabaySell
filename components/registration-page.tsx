"use client";

import { FooterPageTemplate, ContentSection } from "./footer-page-template";
import { Button } from "./ui/button";
import { CheckCircle2 } from "lucide-react";

interface RegistrationPageProps {
  onNavigate: (view: string) => void;
}

export function RegistrationPage({ onNavigate }: RegistrationPageProps) {
  return (
    <FooterPageTemplate
      title="Registration"
      breadcrumbs={["Home", "Help Center", "Registration"]}
      onNavigate={onNavigate}
      sidebar={{
        title: "Help Topics",
        links: [
          { label: "Registration", onClick: () => {} },
          { label: "Bidding & Buying", onClick: () => onNavigate("bidding-help") },
          { label: "Selling Guide", onClick: () => onNavigate("selling-guide") },
          { label: "Account Security", onClick: () => onNavigate("security") },
          { label: "Contact Support", onClick: () => onNavigate("contact") },
        ],
      }}
      relatedTopics={[
        {
          title: "Bidding & Buying Help",
          description: "Learn how to bid on items and make purchases safely",
          onClick: () => onNavigate("bidding-help"),
        },
        {
          title: "Start Selling",
          description: "Create your first listing and reach thousands of buyers",
          onClick: () => onNavigate("start-selling"),
        },
      ]}
    >
      <ContentSection title="Getting Started">
        <p>
          Welcome to our marketplace! Registration is quick, free, and gives you
          access to thousands of listings across Cambodia. Whether you're looking
          to buy or sell, creating an account is the first step.
        </p>
      </ContentSection>

      <ContentSection title="Why Register?">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#fa6723] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Save Your Favorite Items</p>
              <p className="text-sm text-gray-600">
                Add items to your watchlist and get notified of price changes
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#fa6723] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Contact Sellers Directly</p>
              <p className="text-sm text-gray-600">
                Message sellers, ask questions, and negotiate prices
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#fa6723] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">List Your Items for Free</p>
              <p className="text-sm text-gray-600">
                Create unlimited listings and reach thousands of potential buyers
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#fa6723] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Track Your Activity</p>
              <p className="text-sm text-gray-600">
                Monitor your bids, messages, and listings all in one place
              </p>
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="How to Register">
        <ol className="list-decimal list-inside space-y-3 ml-2">
          <li>
            <span className="font-medium">Click "Sign Up"</span> - Look for the
            user icon in the top right corner of any page
          </li>
          <li>
            <span className="font-medium">Enter Your Information</span> - Provide
            your name, email, and create a secure password
          </li>
          <li>
            <span className="font-medium">Verify Your Email</span> - Check your
            inbox for a verification link and click it
          </li>
          <li>
            <span className="font-medium">Complete Your Profile</span> - Add a
            phone number and profile photo (optional but recommended)
          </li>
        </ol>
      </ContentSection>

      <ContentSection title="Account Requirements">
        <p>To create an account, you must:</p>
        <ul className="list-disc list-inside space-y-2 ml-2 mt-3">
          <li>Be at least 18 years old</li>
          <li>Provide a valid email address</li>
          <li>Create a unique username</li>
          <li>Accept our Terms of Service and Privacy Policy</li>
        </ul>
      </ContentSection>

      <ContentSection title="Account Security Tips">
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="font-medium text-gray-900 mb-2">
            Keep Your Account Safe
          </p>
          <ul className="space-y-2 text-sm">
            <li>• Use a strong, unique password</li>
            <li>• Never share your password with anyone</li>
            <li>• Enable two-factor authentication if available</li>
            <li>• Log out when using shared devices</li>
            <li>• Report any suspicious activity immediately</li>
          </ul>
        </div>
      </ContentSection>

      <ContentSection title="Need Help?">
        <p>
          If you're having trouble registering or have questions about your
          account, our support team is here to help.
        </p>
        <div className="flex gap-3 mt-4">
          <Button onClick={() => onNavigate("contact")}>
            Contact Support
          </Button>
          <Button
            variant="outline"
            onClick={() => onNavigate("home")}
          >
            Back to Home
          </Button>
        </div>
      </ContentSection>
    </FooterPageTemplate>
  );
}
