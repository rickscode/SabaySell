"use client";

import { FooterPageTemplate, ContentSection } from "./footer-page-template";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ContactUsPageProps {
  onNavigate: (view: string) => void;
}

export function ContactUsPage({ onNavigate }: ContactUsPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent!", {
      description: "Our support team will respond within 24 hours",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <FooterPageTemplate
      title="Contact Us"
      breadcrumbs={["Home", "Help & Contact", "Contact Us"]}
      onNavigate={onNavigate}
      sidebar={{
        title: "Quick Links",
        links: [
          { label: "Contact Us", onClick: () => {} },
          { label: "Resolution Center", onClick: () => onNavigate("resolution") },
          { label: "Seller Help", onClick: () => onNavigate("seller-help") },
          { label: "Bidding & Buying", onClick: () => onNavigate("bidding-help") },
          { label: "FAQ", onClick: () => onNavigate("faq") },
        ],
      }}
      relatedTopics={[
        {
          title: "Resolution Center",
          description: "Get help resolving transaction issues",
          onClick: () => onNavigate("resolution"),
        },
        {
          title: "Seller Help",
          description: "Resources and support for sellers",
          onClick: () => onNavigate("seller-help"),
        },
      ]}
    >
      <ContentSection title="Get in Touch">
        <p>
          Have questions or need assistance? Our support team is here to help.
          Fill out the form below and we'll get back to you as soon as possible.
        </p>
      </ContentSection>

      <ContentSection title="Contact Form">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select
              value={formData.subject}
              onValueChange={(value) => setFormData({ ...formData, subject: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="account">Account Issues</SelectItem>
                <SelectItem value="buying">Buying Help</SelectItem>
                <SelectItem value="selling">Selling Help</SelectItem>
                <SelectItem value="payment">Payment Questions</SelectItem>
                <SelectItem value="technical">Technical Support</SelectItem>
                <SelectItem value="report">Report a Problem</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Please describe your question or issue..."
              rows={6}
              required
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit">Send Message</Button>
            <Button type="button" variant="outline" onClick={() => onNavigate("home")}>
              Cancel
            </Button>
          </div>
        </form>
      </ContentSection>

      <ContentSection title="Other Ways to Reach Us">
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 text-center">
            <Mail className="w-8 h-8 text-[#fa6723] mx-auto mb-2" />
            <h3 className="mb-2">Email</h3>
            <p className="text-sm text-gray-600">support@marketplace.com</p>
            <p className="text-xs text-gray-500 mt-1">Response within 24 hours</p>
          </div>
          <div className="border rounded-lg p-4 text-center">
            <Phone className="w-8 h-8 text-[#fa6723] mx-auto mb-2" />
            <h3 className="mb-2">Phone</h3>
            <p className="text-sm text-gray-600">+855 23 xxx xxx</p>
            <p className="text-xs text-gray-500 mt-1">Mon-Fri 9AM-6PM</p>
          </div>
          <div className="border rounded-lg p-4 text-center">
            <MessageCircle className="w-8 h-8 text-[#fa6723] mx-auto mb-2" />
            <h3 className="mb-2">Live Chat</h3>
            <p className="text-sm text-gray-600">Coming Soon</p>
            <p className="text-xs text-gray-500 mt-1">Instant support</p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Frequently Asked Questions">
        <p className="mb-3">
          Before contacting us, check if your question is answered in our FAQ:
        </p>
        <ul className="space-y-2 text-sm">
          <li>
            <button className="text-[#fa6723] hover:underline">
              How do I create an account?
            </button>
          </li>
          <li>
            <button className="text-[#fa6723] hover:underline">
              How do I contact a seller?
            </button>
          </li>
          <li>
            <button className="text-[#fa6723] hover:underline">
              How do I create a listing?
            </button>
          </li>
          <li>
            <button className="text-[#fa6723] hover:underline">
              What are featured listings?
            </button>
          </li>
        </ul>
      </ContentSection>
    </FooterPageTemplate>
  );
}
