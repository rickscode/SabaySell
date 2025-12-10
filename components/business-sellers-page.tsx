"use client";

import { FooterPageTemplate, ContentSection } from "./footer-page-template";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { TrendingUp, Users, Shield, BarChart, Zap, Headphones } from "lucide-react";

interface BusinessSellersPageProps {
  onNavigate: (view: string) => void;
}

export function BusinessSellersPage({ onNavigate }: BusinessSellersPageProps) {
  return (
    <FooterPageTemplate
      title="Business Sellers Program"
      breadcrumbs={["Home", "Sell", "Business Sellers"]}
      onNavigate={onNavigate}
      sidebar={{
        title: "Business Tools",
        links: [
          { label: "Business Sellers", onClick: () => {} },
          { label: "Start Selling", onClick: () => onNavigate("start-selling") },
          { label: "Learn to Sell", onClick: () => onNavigate("learn-to-sell") },
          { label: "Seller Help", onClick: () => onNavigate("seller-help") },
        ],
      }}
      relatedTopics={[
        {
          title: "Featured Stores",
          description: "Browse successful business sellers",
          onClick: () => onNavigate("stores"),
        },
        {
          title: "Learn to Sell",
          description: "Advanced selling strategies",
          onClick: () => onNavigate("learn-to-sell"),
        },
      ]}
    >
      <ContentSection title="Grow Your Business on Our Platform">
        <p>
          Take your selling to the next level with our Business Sellers Program.
          Get access to advanced tools, increased visibility, and dedicated support
          to help you scale your operations and reach more customers across Cambodia.
        </p>
      </ContentSection>

      <ContentSection title="Business Seller Benefits">
        <div className="grid sm:grid-cols-2 gap-4">
          <Card className="p-6">
            <TrendingUp className="w-10 h-10 text-[#fa6723] mb-3" />
            <h3 className="mb-2">Bulk Listing Tools</h3>
            <p className="text-sm text-gray-600">
              Upload multiple items at once with CSV import. Save time with
              templates and quick-edit features.
            </p>
          </Card>
          <Card className="p-6">
            <BarChart className="w-10 h-10 text-[#fa6723] mb-3" />
            <h3 className="mb-2">Analytics Dashboard</h3>
            <p className="text-sm text-gray-600">
              Track views, engagement, and sales performance. Understand your
              audience and optimize your listings.
            </p>
          </Card>
          <Card className="p-6">
            <Shield className="w-10 h-10 text-[#fa6723] mb-3" />
            <h3 className="mb-2">Verified Badge</h3>
            <p className="text-sm text-gray-600">
              Build trust with the verified seller badge. Show customers you're
              a reliable, professional seller.
            </p>
          </Card>
          <Card className="p-6">
            <Users className="w-10 h-10 text-[#fa6723] mb-3" />
            <h3 className="mb-2">Featured Store Page</h3>
            <p className="text-sm text-gray-600">
              Get your own branded store page showcasing all your items in one
              place with custom branding.
            </p>
          </Card>
          <Card className="p-6">
            <Zap className="w-10 h-10 text-[#fa6723] mb-3" />
            <h3 className="mb-2">Priority Placement</h3>
            <p className="text-sm text-gray-600">
              Your listings get boosted in search results. Reach more potential
              buyers without extra effort.
            </p>
          </Card>
          <Card className="p-6">
            <Headphones className="w-10 h-10 text-[#fa6723] mb-3" />
            <h3 className="mb-2">Dedicated Support</h3>
            <p className="text-sm text-gray-600">
              Get priority customer support with a dedicated account manager to
              help grow your business.
            </p>
          </Card>
        </div>
      </ContentSection>

      <ContentSection title="Qualification Requirements">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="mb-4">Become a Business Seller</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#fa6723] text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <p className="font-medium">Maintain High Standards</p>
                <p className="text-gray-600">4.5+ star rating with at least 50 reviews</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#fa6723] text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <p className="font-medium">Proven Track Record</p>
                <p className="text-gray-600">Minimum 100 successful transactions in the last 6 months</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#fa6723] text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                3
              </div>
              <div>
                <p className="font-medium">Active Listings</p>
                <p className="text-gray-600">Maintain at least 20 active listings at all times</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#fa6723] text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                4
              </div>
              <div>
                <p className="font-medium">Quick Response Time</p>
                <p className="text-gray-600">Respond to buyer messages within 24 hours</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#fa6723] text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                5
              </div>
              <div>
                <p className="font-medium">Business Documentation</p>
                <p className="text-gray-600">Valid business registration or tax ID</p>
              </div>
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Pricing Plans">
        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="p-6 border-2">
            <Badge variant="outline" className="mb-3">Current</Badge>
            <h3 className="mb-2">Individual Seller</h3>
            <div className="text-3xl mb-4">
              <span className="text-[#fa6723]">FREE</span>
            </div>
            <ul className="space-y-2 text-sm mb-6">
              <li>✓ Unlimited listings</li>
              <li>✓ Basic support</li>
              <li>✓ Standard search placement</li>
              <li className="text-gray-400">✗ Verified badge</li>
              <li className="text-gray-400">✗ Analytics</li>
            </ul>
            <Button variant="outline" className="w-full">
              Current Plan
            </Button>
          </Card>

          <Card className="p-6 border-2 border-[#fa6723] shadow-lg relative">
            <Badge className="mb-3 bg-[#fa6723] text-white">Recommended</Badge>
            <h3 className="mb-2">Business</h3>
            <div className="text-3xl mb-1">
              <span className="text-[#fa6723]">$49</span>
              <span className="text-base text-gray-600">/month</span>
            </div>
            <p className="text-xs text-gray-500 mb-4">or $490/year (save $98)</p>
            <ul className="space-y-2 text-sm mb-6">
              <li>✓ All Individual features</li>
              <li>✓ Verified seller badge</li>
              <li>✓ Analytics dashboard</li>
              <li>✓ Bulk listing tools</li>
              <li>✓ Priority support</li>
              <li>✓ Featured store page</li>
            </ul>
            <Button className="w-full">
              Upgrade Now
            </Button>
          </Card>

          <Card className="p-6 border-2">
            <Badge variant="outline" className="mb-3">Enterprise</Badge>
            <h3 className="mb-2">Enterprise</h3>
            <div className="text-3xl mb-4">
              <span className="text-[#fa6723]">Custom</span>
            </div>
            <ul className="space-y-2 text-sm mb-6">
              <li>✓ All Business features</li>
              <li>✓ Dedicated account manager</li>
              <li>✓ Custom integrations</li>
              <li>✓ API access</li>
              <li>✓ White-label options</li>
              <li>✓ Premium placement</li>
            </ul>
            <Button variant="outline" className="w-full" onClick={() => onNavigate("contact")}>
              Contact Sales
            </Button>
          </Card>
        </div>
      </ContentSection>

      <ContentSection title="Success Stories">
        <Card className="p-6 bg-orange-50 border-orange-200">
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-[#fa6723] text-white rounded-full flex items-center justify-center">
                TH
              </div>
              <div>
                <p className="font-medium">Tech Haven Cambodia</p>
                <p className="text-sm text-gray-600">Electronics Seller</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-700 italic mb-3">
            "Upgrading to the Business Seller plan was the best decision for our
            store. The analytics helped us understand what customers want, and the
            verified badge increased our sales by 150% in just 3 months!"
          </p>
          <div className="flex gap-4 text-sm">
            <div>
              <p className="text-[#fa6723]">1,200+</p>
              <p className="text-gray-600">Sales</p>
            </div>
            <div>
              <p className="text-[#fa6723]">4.9★</p>
              <p className="text-gray-600">Rating</p>
            </div>
            <div>
              <p className="text-[#fa6723]">450</p>
              <p className="text-gray-600">Active Listings</p>
            </div>
          </div>
        </Card>
      </ContentSection>

      <ContentSection title="Ready to Grow Your Business?">
        <p className="mb-4">
          Join hundreds of successful business sellers already using our platform
          to reach customers across Cambodia.
        </p>
        <div className="flex gap-3">
          <Button onClick={() => onNavigate("registration")}>
            Apply Now
          </Button>
          <Button variant="outline" onClick={() => onNavigate("contact")}>
            Contact Sales
          </Button>
        </div>
      </ContentSection>
    </FooterPageTemplate>
  );
}
