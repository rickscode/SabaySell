"use client";

import { FooterPageTemplate, ContentSection } from "./footer-page-template";
import { Button } from "./ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { HelpCircle, Book, Video, Users } from "lucide-react";

interface SellerHelpPageProps {
  onNavigate: (view: string) => void;
}

export function SellerHelpPage({ onNavigate }: SellerHelpPageProps) {
  return (
    <FooterPageTemplate
      title="Seller Help Center"
      breadcrumbs={["Home", "Help & Contact", "Seller Help"]}
      onNavigate={onNavigate}
      sidebar={{
        title: "Help Topics",
        links: [
          { label: "Seller Help", onClick: () => {} },
          { label: "Start Selling", onClick: () => onNavigate("start-selling") },
          { label: "Learn to Sell", onClick: () => onNavigate("learn-to-sell") },
          { label: "Business Sellers", onClick: () => onNavigate("business-sellers") },
          { label: "Contact Support", onClick: () => onNavigate("contact") },
        ],
      }}
      relatedTopics={[
        {
          title: "Resolution Center",
          description: "Resolve issues with buyers",
          onClick: () => onNavigate("resolution"),
        },
        {
          title: "Contact Support",
          description: "Get direct help from our team",
          onClick: () => onNavigate("contact"),
        },
      ]}
    >
      <ContentSection title="Seller Support Resources">
        <p>
          Find answers to common questions, learn best practices, and get help
          with your selling journey. Our comprehensive guides will help you
          succeed on our platform.
        </p>
      </ContentSection>

      <ContentSection title="Quick Help">
        <div className="grid sm:grid-cols-3 gap-4">
          <div 
            className="border rounded-lg p-4 hover:border-[#fa6723] cursor-pointer transition-colors"
            onClick={() => onNavigate("start-selling")}
          >
            <Book className="w-8 h-8 text-[#fa6723] mb-3" />
            <h3 className="mb-2">Seller Guides</h3>
            <p className="text-sm text-gray-600">
              Step-by-step instructions for creating and managing listings
            </p>
          </div>
          <div className="border rounded-lg p-4 hover:border-[#fa6723] cursor-pointer transition-colors">
            <Video className="w-8 h-8 text-[#fa6723] mb-3" />
            <h3 className="mb-2">Video Tutorials</h3>
            <p className="text-sm text-gray-600">
              Watch video guides on selling best practices
            </p>
          </div>
          <div 
            className="border rounded-lg p-4 hover:border-[#fa6723] cursor-pointer transition-colors"
            onClick={() => onNavigate("contact")}
          >
            <Users className="w-8 h-8 text-[#fa6723] mb-3" />
            <h3 className="mb-2">Contact Support</h3>
            <p className="text-sm text-gray-600">
              Get personalized help from our support team
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Frequently Asked Questions">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How do I create my first listing?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 text-sm">
                <p>Creating a listing is easy:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Click "Sell" in the top navigation</li>
                  <li>Select "Create Listing"</li>
                  <li>Choose a category for your item</li>
                  <li>Upload clear photos (at least 3 recommended)</li>
                  <li>Write a detailed title and description</li>
                  <li>Set your price and listing type (auction or buy-it-now)</li>
                  <li>Add your contact information</li>
                  <li>Review and publish</li>
                </ol>
                <Button 
                  size="sm" 
                  className="mt-3"
                  onClick={() => onNavigate("create-listing")}
                >
                  Create Listing Now
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>How much does it cost to sell?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 text-sm">
                <p>Basic listings are completely free! You only pay for optional features:</p>
                <ul className="space-y-1 ml-2">
                  <li>• <strong>Standard Listing:</strong> FREE</li>
                  <li>• <strong>Category Featured:</strong> $5 for 7 days of top placement in category</li>
                  <li>• <strong>Homepage Featured:</strong> $15 for 7 days of homepage visibility</li>
                </ul>
                <p className="mt-2">There are no transaction fees or commissions. You keep 100% of your sale price!</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>How do buyers contact me?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 text-sm">
                <p>Buyers can reach you through multiple channels:</p>
                <ul className="space-y-1 ml-2">
                  <li>• <strong>In-app messaging:</strong> Direct messages through our platform</li>
                  <li>• <strong>Phone:</strong> If you include your phone number</li>
                  <li>• <strong>Messaging apps:</strong> WhatsApp, Telegram if you provide links</li>
                </ul>
                <p className="mt-2">
                  You'll receive notifications when someone messages you. Always respond
                  within 24 hours to maintain a good seller rating!
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>How do I handle payments and delivery?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 text-sm">
                <p>All transactions happen directly between you and the buyer:</p>
                <ul className="space-y-2 ml-2 mt-2">
                  <li>
                    <strong>Payment:</strong> Agree on payment method with buyer (cash, bank transfer, etc.)
                    We recommend cash for in-person meetings.
                  </li>
                  <li>
                    <strong>Delivery:</strong> You arrange pickup/delivery directly. Common options:
                    <ul className="list-disc list-inside ml-4 mt-1">
                      <li>Meet in a public place</li>
                      <li>Buyer picks up from your location</li>
                      <li>You deliver for an agreed fee</li>
                    </ul>
                  </li>
                </ul>
                <p className="mt-2 text-amber-700">
                  Safety tip: Always meet in public places and verify payment before
                  handing over items!
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>How do I edit or delete a listing?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 text-sm">
                <p>Managing your listings is simple:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2 mt-2">
                  <li>Go to your profile and select "My Listings"</li>
                  <li>Find the listing you want to edit or delete</li>
                  <li>Click the three-dot menu on the listing card</li>
                  <li>Choose "Edit" to update details or "Delete" to remove</li>
                </ol>
                <p className="mt-2">
                  <strong>Note:</strong> If your item has active bids, you cannot delete it.
                  You can only edit non-critical details like description or photos.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6">
            <AccordionTrigger>What should I do if a buyer doesn't show up?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 text-sm">
                <p>If a buyer fails to complete the transaction:</p>
                <ul className="space-y-1 ml-2 mt-2">
                  <li>1. Try contacting them again to reschedule</li>
                  <li>2. Wait 24-48 hours for a response</li>
                  <li>3. If no response, move on to other interested buyers</li>
                  <li>4. Your listing remains active for other buyers</li>
                </ul>
                <p className="mt-2">
                  For auction winners who don't complete the purchase, you can offer
                  the item to the second-highest bidder or relist it.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7">
            <AccordionTrigger>How do I get more views on my listings?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 text-sm">
                <p>Increase your listing visibility:</p>
                <ul className="space-y-1 ml-2 mt-2">
                  <li>✓ Use clear, high-quality photos</li>
                  <li>✓ Write detailed, keyword-rich descriptions</li>
                  <li>✓ Price competitively based on market research</li>
                  <li>✓ List during peak browsing times (evenings/weekends)</li>
                  <li>✓ Consider featured placement options ($5-$15)</li>
                  <li>✓ Share your listing on social media</li>
                  <li>✓ Respond quickly to messages to boost your ranking</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-8">
            <AccordionTrigger>How do I become a verified seller?</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 text-sm">
                <p>To earn verified seller status:</p>
                <ul className="space-y-1 ml-2 mt-2">
                  <li>• Maintain a 4.5+ star rating</li>
                  <li>• Complete at least 100 successful transactions</li>
                  <li>• Respond to messages within 24 hours</li>
                  <li>• Keep at least 20 active listings</li>
                  <li>• Upgrade to Business Seller plan</li>
                </ul>
                <Button 
                  size="sm" 
                  className="mt-3"
                  onClick={() => onNavigate("business-sellers")}
                >
                  Learn About Business Plans
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ContentSection>

      <ContentSection title="Need More Help?">
        <div className="bg-gray-50 border rounded-lg p-6">
          <div className="flex items-start gap-4">
            <HelpCircle className="w-10 h-10 text-[#fa6723] flex-shrink-0" />
            <div>
              <h3 className="mb-2">Can't Find What You're Looking For?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Our support team is here to help with any questions or issues you
                have. We typically respond within 24 hours.
              </p>
              <div className="flex gap-3">
                <Button onClick={() => onNavigate("contact")}>
                  Contact Support
                </Button>
                <Button variant="outline" onClick={() => onNavigate("resolution")}>
                  Resolution Center
                </Button>
              </div>
            </div>
          </div>
        </div>
      </ContentSection>
    </FooterPageTemplate>
  );
}
