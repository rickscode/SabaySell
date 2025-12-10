"use client";

import { FooterPageTemplate, ContentSection } from "./footer-page-template";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Star, MapPin, Package, Shield, TrendingUp } from "lucide-react";

interface StoresPageProps {
  onNavigate: (view: string) => void;
}

const featuredStores = [
  {
    id: "1",
    name: "Tech Haven Cambodia",
    avatar: "TH",
    rating: 4.9,
    reviews: 1243,
    location: "Phnom Penh",
    itemCount: 450,
    category: "Electronics",
    verified: true,
    description: "Premium electronics and gadgets with warranty",
  },
  {
    id: "2",
    name: "Fashion Forward KH",
    avatar: "FF",
    rating: 4.8,
    reviews: 892,
    location: "Siem Reap",
    itemCount: 320,
    category: "Fashion",
    verified: true,
    description: "Latest fashion trends and accessories",
  },
  {
    id: "3",
    name: "Home & Living Store",
    avatar: "HL",
    rating: 4.7,
    reviews: 654,
    location: "Phnom Penh",
    itemCount: 280,
    category: "Home & Garden",
    verified: true,
    description: "Quality home decor and furniture",
  },
  {
    id: "4",
    name: "Auto Parts Cambodia",
    avatar: "AP",
    rating: 4.9,
    reviews: 567,
    location: "Battambang",
    itemCount: 510,
    category: "Automobiles",
    verified: true,
    description: "Genuine auto parts and accessories",
  },
  {
    id: "5",
    name: "Sports & Fitness Pro",
    avatar: "SF",
    rating: 4.6,
    reviews: 423,
    location: "Phnom Penh",
    itemCount: 195,
    category: "Sports Equipment",
    verified: true,
    description: "Professional sports gear and equipment",
  },
  {
    id: "6",
    name: "Book Corner",
    avatar: "BC",
    rating: 4.8,
    reviews: 389,
    location: "Siem Reap",
    itemCount: 680,
    category: "Books",
    verified: true,
    description: "New and used books, textbooks, novels",
  },
];

export function StoresPage({ onNavigate }: StoresPageProps) {
  return (
    <FooterPageTemplate
      title="Featured Stores"
      breadcrumbs={["Home", "Buy", "Stores"]}
      onNavigate={onNavigate}
      sidebar={{
        title: "Categories",
        links: [
          { label: "All Stores", onClick: () => {} },
          { label: "Electronics", onClick: () => {} },
          { label: "Fashion", onClick: () => {} },
          { label: "Home & Garden", onClick: () => {} },
          { label: "Automobiles", onClick: () => {} },
          { label: "Books", onClick: () => {} },
          { label: "Sports", onClick: () => {} },
        ],
      }}
      relatedTopics={[
        {
          title: "Become a Verified Seller",
          description: "Learn how to get verified and grow your store",
          onClick: () => onNavigate("business-sellers"),
        },
        {
          title: "Start Selling",
          description: "Create your store and reach thousands of buyers",
          onClick: () => onNavigate("start-selling"),
        },
      ]}
    >
      <ContentSection title="Shop from Verified Stores">
        <p>
          Browse our curated collection of verified stores. These sellers have
          established excellent reputations through consistent quality, fast
          responses, and positive customer feedback.
        </p>
      </ContentSection>

      <ContentSection title="Why Shop from Stores?">
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <Shield className="w-6 h-6 text-[#fa6723] flex-shrink-0 mt-1" />
            <div>
              <h3 className="mb-1">Verified Sellers</h3>
              <p className="text-sm text-gray-600">
                All stores are verified and monitored for quality
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <Package className="w-6 h-6 text-[#fa6723] flex-shrink-0 mt-1" />
            <div>
              <h3 className="mb-1">Large Selection</h3>
              <p className="text-sm text-gray-600">
                Stores offer hundreds of items in their specialty
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <TrendingUp className="w-6 h-6 text-[#fa6723] flex-shrink-0 mt-1" />
            <div>
              <h3 className="mb-1">Proven Track Record</h3>
              <p className="text-sm text-gray-600">
                High ratings and hundreds of positive reviews
              </p>
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Featured Stores">
        <div className="grid gap-4">
          {featuredStores.map((store) => (
            <Card
              key={store.id}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <Avatar className="w-16 h-16 flex-shrink-0">
                  <AvatarFallback className="bg-[#fa6723] text-white text-xl">
                    {store.avatar}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3>{store.name}</h3>
                        {store.verified && (
                          <Badge variant="secondary" className="bg-[#fa6723] text-white">
                            <Shield className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{store.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{store.rating}</span>
                      <span>({store.reviews.toLocaleString()} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{store.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      <span>{store.itemCount} items</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{store.category}</Badge>
                    <Button size="sm" variant="outline">
                      Visit Store
                    </Button>
                    <Button size="sm">
                      Contact Seller
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ContentSection>

      <ContentSection title="Want to Become a Featured Store?">
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <h3 className="mb-3">Join Our Verified Stores Program</h3>
          <p className="text-gray-700 mb-4">
            Build your business with our verified stores program. Get increased
            visibility, build customer trust, and access exclusive seller tools.
          </p>
          <div className="space-y-2 mb-4 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#fa6723] rounded-full"></div>
              <span>Maintain a 4.5+ star rating</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#fa6723] rounded-full"></div>
              <span>Complete at least 100 successful transactions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#fa6723] rounded-full"></div>
              <span>Respond to messages within 24 hours</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#fa6723] rounded-full"></div>
              <span>Provide excellent customer service</span>
            </div>
          </div>
          <Button onClick={() => onNavigate("start-selling")}>
            Learn More
          </Button>
        </div>
      </ContentSection>

      <ContentSection title="">
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => onNavigate("home")}>
            Back to Home
          </Button>
          <Button variant="outline" onClick={() => onNavigate("registration")}>
            Create Account
          </Button>
        </div>
      </ContentSection>
    </FooterPageTemplate>
  );
}
