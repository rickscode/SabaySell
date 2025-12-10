"use client";

import { FooterPageTemplate, ContentSection } from "./footer-page-template";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, TrendingUp, Users, Megaphone } from "lucide-react";

interface NewsPageProps {
  onNavigate: (view: string) => void;
}

const newsItems = [
  {
    id: "1",
    title: "Introducing Business Seller Plans - Scale Your Sales Today",
    date: "October 20, 2025",
    category: "Product Update",
    excerpt: "We're excited to announce our new Business Seller program with advanced analytics, bulk listing tools, and priority support to help you grow your business.",
    image: "business",
  },
  {
    id: "2",
    title: "50,000 Active Users Milestone Reached!",
    date: "October 15, 2025",
    category: "Company News",
    excerpt: "Thanks to our amazing community, we've reached 50,000 active users across Cambodia. Your trust and support continue to drive our growth.",
    image: "milestone",
  },
  {
    id: "3",
    title: "New Category: Books & Textbooks Now Available",
    date: "October 10, 2025",
    category: "Product Update",
    excerpt: "Students and book lovers rejoice! We've added a dedicated Books & Textbooks category to make finding and selling books easier than ever.",
    image: "books",
  },
  {
    id: "4",
    title: "Enhanced Mobile Experience Rolling Out",
    date: "October 5, 2025",
    category: "Product Update",
    excerpt: "We've improved our mobile experience with faster loading times, better search filters, and an enhanced messaging system for on-the-go buying and selling.",
    image: "mobile",
  },
  {
    id: "5",
    title: "Seller Safety Tips: Best Practices for Safe Transactions",
    date: "September 28, 2025",
    category: "Safety",
    excerpt: "Learn essential safety tips for sellers including how to spot scams, where to meet buyers safely, and payment best practices.",
    image: "safety",
  },
  {
    id: "6",
    title: "Featured Stores Program Launches",
    date: "September 20, 2025",
    category: "Product Update",
    excerpt: "Discover our new Featured Stores directory showcasing verified sellers with excellent reputations and large inventories.",
    image: "stores",
  },
];

export function NewsPage({ onNavigate }: NewsPageProps) {
  return (
    <FooterPageTemplate
      title="News & Updates"
      breadcrumbs={["Home", "About", "News"]}
      onNavigate={onNavigate}
      sidebar={{
        title: "Categories",
        links: [
          { label: "All News", onClick: () => {} },
          { label: "Product Updates", onClick: () => {} },
          { label: "Company News", onClick: () => {} },
          { label: "Safety Tips", onClick: () => {} },
          { label: "Community", onClick: () => {} },
        ],
      }}
      relatedTopics={[
        {
          title: "Company Info",
          description: "Learn more about our mission",
          onClick: () => onNavigate("company-info"),
        },
        {
          title: "Careers",
          description: "Join our growing team",
          onClick: () => onNavigate("careers"),
        },
      ]}
    >
      <ContentSection title="Latest News & Announcements">
        <p>
          Stay up to date with the latest features, improvements, and news from
          our marketplace. We're constantly working to make buying and selling
          easier and safer for everyone.
        </p>
      </ContentSection>

      <ContentSection title="Recent Updates">
        <div className="space-y-6">
          {newsItems.map((item) => (
            <Card key={item.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <Badge variant="outline" className="text-xs">
                  {item.category}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{item.date}</span>
                </div>
              </div>
              
              <h3 className="mb-3 text-xl">{item.title}</h3>
              
              <p className="text-gray-600 mb-4">{item.excerpt}</p>
              
              <Button variant="outline" size="sm">
                Read More
              </Button>
            </Card>
          ))}
        </div>
      </ContentSection>

      <ContentSection title="Subscribe to Updates">
        <Card className="p-6 bg-orange-50 border-orange-200">
          <div className="flex items-start gap-4">
            <Megaphone className="w-10 h-10 text-[#fa6723] flex-shrink-0" />
            <div className="flex-1">
              <h3 className="mb-2">Never Miss an Update</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get the latest news, feature announcements, and tips delivered to
                your inbox. We'll never spam you or share your email.
              </p>
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fa6723]"
                />
                <Button>Subscribe</Button>
              </div>
            </div>
          </div>
        </Card>
      </ContentSection>

      <ContentSection title="Platform Statistics">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <Users className="w-8 h-8 text-[#fa6723] mx-auto mb-2" />
            <div className="text-2xl mb-1">50K+</div>
            <div className="text-sm text-gray-600">Active Users</div>
          </Card>
          <Card className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-[#fa6723] mx-auto mb-2" />
            <div className="text-2xl mb-1">100K+</div>
            <div className="text-sm text-gray-600">Listings</div>
          </Card>
          <Card className="p-4 text-center">
            <Calendar className="w-8 h-8 text-[#fa6723] mx-auto mb-2" />
            <div className="text-2xl mb-1">500+</div>
            <div className="text-sm text-gray-600">Daily Listings</div>
          </Card>
          <Card className="p-4 text-center">
            <Megaphone className="w-8 h-8 text-[#fa6723] mx-auto mb-2" />
            <div className="text-2xl mb-1">12</div>
            <div className="text-sm text-gray-600">Categories</div>
          </Card>
        </div>
      </ContentSection>

      <ContentSection title="Join Our Community">
        <p className="mb-4">
          Be part of Cambodia's fastest-growing online marketplace. Start buying
          and selling today!
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
