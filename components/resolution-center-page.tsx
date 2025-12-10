"use client";

import { FooterPageTemplate, ContentSection } from "./footer-page-template";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { AlertTriangle, Shield, FileText, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ResolutionCenterPageProps {
  onNavigate: (view: string) => void;
}

export function ResolutionCenterPage({ onNavigate }: ResolutionCenterPageProps) {
  const [formData, setFormData] = useState({
    issueType: "",
    listingId: "",
    description: "",
    preferredResolution: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Case submitted", {
      description: "We'll review your case and respond within 48 hours",
    });
    setFormData({ issueType: "", listingId: "", description: "", preferredResolution: "" });
  };

  return (
    <FooterPageTemplate
      title="Resolution Center"
      breadcrumbs={["Home", "Help & Contact", "Resolution Center"]}
      onNavigate={onNavigate}
      sidebar={{
        title: "Help Center",
        links: [
          { label: "Resolution Center", onClick: () => {} },
          { label: "Contact Support", onClick: () => onNavigate("contact") },
          { label: "Seller Help", onClick: () => onNavigate("seller-help") },
          { label: "Bidding & Buying", onClick: () => onNavigate("bidding-help") },
        ],
      }}
      relatedTopics={[
        {
          title: "Contact Support",
          description: "Get direct help from our team",
          onClick: () => onNavigate("contact"),
        },
        {
          title: "Safety Tips",
          description: "Learn how to stay safe",
          onClick: () => onNavigate("bidding-help"),
        },
      ]}
    >
      <ContentSection title="Resolve Transaction Issues">
        <p>
          We're here to help resolve any issues you experience with transactions
          on our platform. While all sales happen directly between buyers and
          sellers, we can help mediate disputes and enforce our policies.
        </p>
      </ContentSection>

      <ContentSection title="Common Issues We Can Help With">
        <div className="grid sm:grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="mb-1">Item Not as Described</h3>
                <p className="text-sm text-gray-600">
                  The item you received doesn't match the listing description or photos
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="mb-1">Item Not Received</h3>
                <p className="text-sm text-gray-600">
                  Seller hasn't delivered the item after payment was made
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="mb-1">Payment Not Received</h3>
                <p className="text-sm text-gray-600">
                  Buyer hasn't paid after agreeing to purchase
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="mb-1">Suspicious Activity</h3>
                <p className="text-sm text-gray-600">
                  Report scams, fraudulent listings, or policy violations
                </p>
              </div>
            </div>
          </Card>
        </div>
      </ContentSection>

      <ContentSection title="Before Opening a Case">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <Shield className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="mb-3">Try to Resolve Directly First</h3>
          <p className="text-sm text-gray-700 mb-3">
            Most issues can be resolved by communicating with the other party.
            We recommend trying these steps first:
          </p>
          <ol className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2">
              <span>1.</span>
              <span>Contact the other party through our messaging system</span>
            </li>
            <li className="flex gap-2">
              <span>2.</span>
              <span>Clearly explain the issue and what you'd like to happen</span>
            </li>
            <li className="flex gap-2">
              <span>3.</span>
              <span>Give them 48 hours to respond</span>
            </li>
            <li className="flex gap-2">
              <span>4.</span>
              <span>Document all communication and take photos if relevant</span>
            </li>
          </ol>
        </div>
      </ContentSection>

      <ContentSection title="Open a Resolution Case">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="issue-type">Issue Type</Label>
              <Select
                value={formData.issueType}
                onValueChange={(value) => setFormData({ ...formData, issueType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select the type of issue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not-as-described">Item Not as Described</SelectItem>
                  <SelectItem value="not-received">Item Not Received</SelectItem>
                  <SelectItem value="payment-issue">Payment Issue</SelectItem>
                  <SelectItem value="buyer-no-show">Buyer Didn't Show Up</SelectItem>
                  <SelectItem value="seller-no-show">Seller Didn't Show Up</SelectItem>
                  <SelectItem value="scam">Suspected Scam or Fraud</SelectItem>
                  <SelectItem value="policy-violation">Policy Violation</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="listing-id">Listing ID or Title</Label>
              <Input
                id="listing-id"
                value={formData.listingId}
                onChange={(e) => setFormData({ ...formData, listingId: e.target.value })}
                placeholder="e.g., #12345 or 'iPhone 13 Pro Max'"
                required
              />
              <p className="text-xs text-gray-500">
                Enter the listing ID or title of the item in question
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Describe the Issue</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Please provide as much detail as possible including dates, amounts, and what communication you've had with the other party..."
                rows={6}
                required
              />
              <p className="text-xs text-gray-500">
                Include screenshots, photos, or other evidence if you have them
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="resolution">What Would You Like to Happen?</Label>
              <Select
                value={formData.preferredResolution}
                onValueChange={(value) => setFormData({ ...formData, preferredResolution: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your preferred resolution" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="refund">Full Refund</SelectItem>
                  <SelectItem value="partial-refund">Partial Refund</SelectItem>
                  <SelectItem value="replacement">Replacement Item</SelectItem>
                  <SelectItem value="remove-listing">Remove Listing</SelectItem>
                  <SelectItem value="ban-user">Ban User</SelectItem>
                  <SelectItem value="mediation">Help Mediate Discussion</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit">Submit Case</Button>
              <Button type="button" variant="outline" onClick={() => onNavigate("home")}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </ContentSection>

      <ContentSection title="What Happens Next?">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#fa6723] text-white rounded-full flex items-center justify-center flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="mb-1">Case Review</h3>
              <p className="text-sm text-gray-600">
                Our team will review your case within 48 hours and may ask for additional information
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#fa6723] text-white rounded-full flex items-center justify-center flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="mb-1">Investigation</h3>
              <p className="text-sm text-gray-600">
                We'll contact both parties and review all evidence provided
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#fa6723] text-white rounded-full flex items-center justify-center flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="mb-1">Resolution</h3>
              <p className="text-sm text-gray-600">
                We'll work toward a fair resolution and take action if policies were violated
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#fa6723] text-white rounded-full flex items-center justify-center flex-shrink-0">
              4
            </div>
            <div>
              <h3 className="mb-1">Follow-up</h3>
              <p className="text-sm text-gray-600">
                You'll receive updates via email and can check case status in your account
              </p>
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Our Commitment">
        <div className="bg-gray-50 border rounded-lg p-6">
          <div className="flex items-start gap-4">
            <CheckCircle2 className="w-10 h-10 text-[#fa6723] flex-shrink-0" />
            <div>
              <h3 className="mb-2">Fair and Transparent Process</h3>
              <p className="text-sm text-gray-600">
                We're committed to fair treatment of all users. Our resolution process
                is impartial and based on our community guidelines and policies. We'll
                take appropriate action against users who violate our terms, including
                warnings, suspensions, or permanent bans.
              </p>
            </div>
          </div>
        </div>
      </ContentSection>
    </FooterPageTemplate>
  );
}
