"use client";

import { FooterPageTemplate, ContentSection } from "./footer-page-template";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Camera, DollarSign, MessageSquare, TrendingUp, Award, Clock } from "lucide-react";

interface LearnToSellPageProps {
  onNavigate: (view: string) => void;
}

export function LearnToSellPage({ onNavigate }: LearnToSellPageProps) {
  return (
    <FooterPageTemplate
      title="Learn to Sell"
      breadcrumbs={["Home", "Sell", "Learn to Sell"]}
      onNavigate={onNavigate}
      sidebar={{
        title: "Seller Resources",
        links: [
          { label: "Start Selling", onClick: () => onNavigate("start-selling") },
          { label: "Learn to Sell", onClick: () => {} },
          { label: "Business Sellers", onClick: () => onNavigate("business-sellers") },
          { label: "Seller Help", onClick: () => onNavigate("seller-help") },
        ],
      }}
      relatedTopics={[
        {
          title: "Start Selling",
          description: "Create your first listing today",
          onClick: () => onNavigate("start-selling"),
        },
        {
          title: "Business Sellers",
          description: "Scale your business with advanced tools",
          onClick: () => onNavigate("business-sellers"),
        },
      ]}
    >
      <ContentSection title="Advanced Selling Strategies">
        <p>
          Take your selling to the next level with proven strategies and best
          practices from our most successful sellers. Whether you're selling
          occasionally or building a business, these tips will help you succeed.
        </p>
      </ContentSection>

      <ContentSection title="Mastering Product Photography">
        <Card className="p-6 mb-4">
          <div className="flex items-start gap-4">
            <Camera className="w-10 h-10 text-[#fa6723] flex-shrink-0" />
            <div>
              <h3 className="mb-3">Photography Best Practices</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <span className="text-[#fa6723]">•</span>
                  <span><strong>Use natural light:</strong> Photograph near windows during daylight</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#fa6723]">•</span>
                  <span><strong>Plain backgrounds:</strong> White or neutral colors make items stand out</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#fa6723]">•</span>
                  <span><strong>Multiple angles:</strong> Show front, back, sides, and details</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#fa6723]">•</span>
                  <span><strong>Show defects:</strong> Be honest about wear and damage</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#fa6723]">•</span>
                  <span><strong>Include scale:</strong> Use common objects to show size</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </ContentSection>

      <ContentSection title="Writing Effective Descriptions">
        <Card className="p-6 mb-4">
          <div className="flex items-start gap-4">
            <MessageSquare className="w-10 h-10 text-[#fa6723] flex-shrink-0" />
            <div>
              <h3 className="mb-3">Description Checklist</h3>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="font-medium mb-2">Include:</p>
                  <ul className="space-y-1">
                    <li>✓ Brand and model</li>
                    <li>✓ Size/dimensions</li>
                    <li>✓ Color and material</li>
                    <li>✓ Age and condition</li>
                    <li>✓ Original price (if new)</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-2">Be Clear About:</p>
                  <ul className="space-y-1">
                    <li>✓ Defects or damage</li>
                    <li>✓ Missing parts</li>
                    <li>✓ Reason for selling</li>
                    <li>✓ Pickup/delivery options</li>
                    <li>✓ Payment preferences</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </ContentSection>

      <ContentSection title="Pricing Strategies">
        <Card className="p-6 mb-4">
          <div className="flex items-start gap-4">
            <DollarSign className="w-10 h-10 text-[#fa6723] flex-shrink-0" />
            <div>
              <h3 className="mb-3">How to Price Competitively</h3>
              <div className="space-y-3 text-sm">
                <div className="border-l-4 border-[#fa6723] pl-3">
                  <p className="font-medium">Research Similar Items</p>
                  <p className="text-gray-600">Search for similar items to see current market prices</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-3">
                  <p className="font-medium">Consider Condition</p>
                  <p className="text-gray-600">New items: 70-90% of retail. Used: 30-70% depending on condition</p>
                </div>
                <div className="border-l-4 border-green-500 pl-3">
                  <p className="font-medium">Leave Room to Negotiate</p>
                  <p className="text-gray-600">Price slightly higher if you're open to offers</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-3">
                  <p className="font-medium">Use Auctions Strategically</p>
                  <p className="text-gray-600">Start low to attract bidders, but set a reserve if needed</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </ContentSection>

      <ContentSection title="Building Trust & Reputation">
        <Card className="p-6 mb-4">
          <div className="flex items-start gap-4">
            <Award className="w-10 h-10 text-[#fa6723] flex-shrink-0" />
            <div>
              <h3 className="mb-3">Reputation Building Tips</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Clock className="w-5 h-5 text-[#fa6723] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Respond Quickly</p>
                    <p className="text-gray-600">Reply to messages within 24 hours to show you're reliable</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-5 h-5 text-[#fa6723] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Communicate Clearly</p>
                    <p className="text-gray-600">Be friendly, professional, and transparent</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-5 h-5 text-[#fa6723] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Follow Through</p>
                    <p className="text-gray-600">Show up on time, package items well, and honor your commitments</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </ContentSection>

      <ContentSection title="Maximizing Your Visibility">
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <h3 className="mb-3">Featured Listing Options</h3>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">Category Featured - $5</p>
                <p className="text-sm text-gray-600">Top placement in category for 7 days</p>
              </div>
              <span className="text-[#fa6723]">+50% views</span>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">Homepage Featured - $15</p>
                <p className="text-sm text-gray-600">Featured on homepage for 7 days</p>
              </div>
              <span className="text-[#fa6723]">+200% views</span>
            </div>
          </div>
          <p className="text-sm text-gray-700">
            Featured listings get significantly more views and sell faster. Consider
            featuring high-value items or during peak selling seasons.
          </p>
        </div>
      </ContentSection>

      <ContentSection title="Safety & Best Practices">
        <ul className="space-y-2 text-sm">
          <li className="flex gap-2">
            <span className="text-[#fa6723]">•</span>
            <span>Meet buyers in public, well-lit locations</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#fa6723]">•</span>
            <span>Bring a friend for high-value transactions</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#fa6723]">•</span>
            <span>Accept payment before handing over items</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#fa6723]">•</span>
            <span>Trust your instincts - if something feels wrong, cancel the meeting</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#fa6723]">•</span>
            <span>Never share sensitive personal information</span>
          </li>
        </ul>
      </ContentSection>

      <ContentSection title="Ready to Start?">
        <div className="flex gap-3">
          <Button onClick={() => onNavigate("create-listing")}>
            Create Your Listing
          </Button>
          <Button variant="outline" onClick={() => onNavigate("start-selling")}>
            Selling Guide
          </Button>
        </div>
      </ContentSection>
    </FooterPageTemplate>
  );
}
