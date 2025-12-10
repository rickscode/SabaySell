"use client";

import { FooterPageTemplate, ContentSection } from "./footer-page-template";
import { Button } from "./ui/button";
import { Target, Users, Globe, Heart } from "lucide-react";

interface CompanyInfoPageProps {
  onNavigate: (view: string) => void;
}

export function CompanyInfoPage({ onNavigate }: CompanyInfoPageProps) {
  return (
    <FooterPageTemplate
      title="Company Info"
      breadcrumbs={["Home", "About", "Company Info"]}
      onNavigate={onNavigate}
      sidebar={{
        title: "About Us",
        links: [
          { label: "Company Info", onClick: () => {} },
          { label: "News", onClick: () => onNavigate("news") },
          { label: "Careers", onClick: () => onNavigate("careers") },
          { label: "Contact", onClick: () => onNavigate("contact") },
        ],
      }}
    >
      <ContentSection title="About Our Marketplace">
        <p>
          Welcome to Cambodia's premier online marketplace where buyers and sellers
          connect directly. We're building a trusted platform that makes it easy for
          people across Cambodia to buy and sell items safely and efficiently.
        </p>
      </ContentSection>

      <ContentSection title="Our Mission">
        <div className="bg-orange-50 border-l-4 border-[#fa6723] p-4 rounded">
          <p className="text-gray-800">
            To empower the people of Cambodia with a reliable, easy-to-use platform
            for buying and selling goods, fostering local commerce and building
            community connections.
          </p>
        </div>
      </ContentSection>

      <ContentSection title="Our Values">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <Target className="w-8 h-8 text-[#fa6723] mb-3" />
            <h3 className="mb-2">Trust</h3>
            <p className="text-sm text-gray-600">
              We build trust through transparency, honest reviews, and secure
              communication channels.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <Users className="w-8 h-8 text-[#fa6723] mb-3" />
            <h3 className="mb-2">Community</h3>
            <p className="text-sm text-gray-600">
              We bring people together, creating opportunities for local buyers
              and sellers to connect.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <Globe className="w-8 h-8 text-[#fa6723] mb-3" />
            <h3 className="mb-2">Accessibility</h3>
            <p className="text-sm text-gray-600">
              We make online commerce accessible to everyone across Cambodia,
              regardless of technical expertise.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <Heart className="w-8 h-8 text-[#fa6723] mb-3" />
            <h3 className="mb-2">Customer First</h3>
            <p className="text-sm text-gray-600">
              We prioritize user experience and continuously improve based on
              community feedback.
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Our Story">
        <p>
          Founded in 2024, our marketplace was created to address the growing need
          for a reliable online platform where Cambodians could buy and sell items
          directly with each other. We recognized that many people wanted a simpler,
          more local alternative for their buying and selling needs.
        </p>
        <p className="mt-4">
          Today, we serve thousands of users across Cambodia, facilitating
          connections between buyers and sellers in categories ranging from
          electronics to automobiles, fashion to home goods.
        </p>
      </ContentSection>

      <ContentSection title="By the Numbers">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-3xl text-[#fa6723] mb-1">50K+</div>
            <div className="text-sm text-gray-600">Active Users</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-3xl text-[#fa6723] mb-1">100K+</div>
            <div className="text-sm text-gray-600">Listings</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-3xl text-[#fa6723] mb-1">12</div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-3xl text-[#fa6723] mb-1">24/7</div>
            <div className="text-sm text-gray-600">Platform Access</div>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Join Our Community">
        <p className="mb-4">
          Whether you're looking to buy, sell, or just browse, we invite you to
          join our growing community of users across Cambodia.
        </p>
        <div className="flex gap-3">
          <Button onClick={() => onNavigate("registration")}>
            Create Account
          </Button>
          <Button variant="outline" onClick={() => onNavigate("start-selling")}>
            Start Selling
          </Button>
        </div>
      </ContentSection>
    </FooterPageTemplate>
  );
}
