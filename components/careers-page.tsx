"use client";

import { FooterPageTemplate, ContentSection } from "./footer-page-template";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { MapPin, Briefcase, Clock, Users, Heart, TrendingUp, Code, Megaphone } from "lucide-react";

interface CareersPageProps {
  onNavigate: (view: string) => void;
}

const jobOpenings = [
  {
    id: "1",
    title: "Senior Full Stack Developer",
    department: "Engineering",
    location: "Phnom Penh",
    type: "Full-time",
    experience: "5+ years",
    icon: Code,
  },
  {
    id: "2",
    title: "Product Manager",
    department: "Product",
    location: "Phnom Penh",
    type: "Full-time",
    experience: "3-5 years",
    icon: Briefcase,
  },
  {
    id: "3",
    title: "Marketing Manager",
    department: "Marketing",
    location: "Phnom Penh",
    type: "Full-time",
    experience: "3+ years",
    icon: Megaphone,
  },
  {
    id: "4",
    title: "Customer Support Specialist",
    department: "Support",
    location: "Phnom Penh / Remote",
    type: "Full-time",
    experience: "1-2 years",
    icon: Users,
  },
];

export function CareersPage({ onNavigate }: CareersPageProps) {
  return (
    <FooterPageTemplate
      title="Careers"
      breadcrumbs={["Home", "About", "Careers"]}
      onNavigate={onNavigate}
      sidebar={{
        title: "Quick Links",
        links: [
          { label: "Open Positions", onClick: () => {} },
          { label: "Company Culture", onClick: () => {} },
          { label: "Benefits", onClick: () => {} },
          { label: "Company Info", onClick: () => onNavigate("company-info") },
        ],
      }}
      relatedTopics={[
        {
          title: "Company Info",
          description: "Learn about our mission and values",
          onClick: () => onNavigate("company-info"),
        },
        {
          title: "News",
          description: "Latest updates and announcements",
          onClick: () => onNavigate("news"),
        },
      ]}
    >
      <ContentSection title="Join Our Team">
        <p>
          We're building Cambodia's premier online marketplace and we're looking
          for talented, passionate people to join our growing team. If you want
          to make an impact and help shape the future of e-commerce in Cambodia,
          we'd love to hear from you.
        </p>
      </ContentSection>

      <ContentSection title="Why Work With Us?">
        <div className="grid sm:grid-cols-2 gap-4">
          <Card className="p-6">
            <TrendingUp className="w-10 h-10 text-[#fa6723] mb-3" />
            <h3 className="mb-2">Fast Growing Company</h3>
            <p className="text-sm text-gray-600">
              Join a rapidly expanding startup with real growth opportunities.
              We've grown from 0 to 50,000+ users in less than a year.
            </p>
          </Card>
          <Card className="p-6">
            <Users className="w-10 h-10 text-[#fa6723] mb-3" />
            <h3 className="mb-2">Collaborative Culture</h3>
            <p className="text-sm text-gray-600">
              Work with a talented, passionate team in a supportive environment
              where your ideas matter and innovation is encouraged.
            </p>
          </Card>
          <Card className="p-6">
            <Heart className="w-10 h-10 text-[#fa6723] mb-3" />
            <h3 className="mb-2">Make an Impact</h3>
            <p className="text-sm text-gray-600">
              Your work directly affects thousands of users across Cambodia.
              See the real-world impact of what you build every day.
            </p>
          </Card>
          <Card className="p-6">
            <Briefcase className="w-10 h-10 text-[#fa6723] mb-3" />
            <h3 className="mb-2">Competitive Benefits</h3>
            <p className="text-sm text-gray-600">
              Competitive salary, health insurance, flexible working hours,
              remote work options, and professional development budget.
            </p>
          </Card>
        </div>
      </ContentSection>

      <ContentSection title="Our Benefits">
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="mb-3">Compensation & Perks</h3>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <span className="text-[#fa6723]">•</span>
                  <span>Competitive salary packages</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#fa6723]">•</span>
                  <span>Performance bonuses</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#fa6723]">•</span>
                  <span>Equity options for early team members</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#fa6723]">•</span>
                  <span>Annual salary reviews</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3">Health & Wellness</h3>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <span className="text-[#fa6723]">•</span>
                  <span>Comprehensive health insurance</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#fa6723]">•</span>
                  <span>Annual health checkups</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#fa6723]">•</span>
                  <span>Mental health support</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#fa6723]">•</span>
                  <span>Gym membership subsidy</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3">Work-Life Balance</h3>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <span className="text-[#fa6723]">•</span>
                  <span>Flexible working hours</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#fa6723]">•</span>
                  <span>Hybrid/remote work options</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#fa6723]">•</span>
                  <span>20 days annual leave</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#fa6723]">•</span>
                  <span>Public holidays</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3">Growth & Development</h3>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <span className="text-[#fa6723]">•</span>
                  <span>Learning & development budget</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#fa6723]">•</span>
                  <span>Conference attendance</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#fa6723]">•</span>
                  <span>Online course subscriptions</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#fa6723]">•</span>
                  <span>Career progression opportunities</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Open Positions">
        <div className="space-y-4">
          {jobOpenings.map((job) => {
            const Icon = job.icon;
            return (
              <Card key={job.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-[#fa6723]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="mb-1">{job.title}</h3>
                        <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            <span>{job.department}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{job.type}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">{job.experience}</Badge>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm">Apply Now</Button>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </ContentSection>

      <ContentSection title="Don't See a Perfect Fit?">
        <Card className="p-6 bg-gray-50">
          <h3 className="mb-3">We're Always Looking for Great People</h3>
          <p className="text-sm text-gray-600 mb-4">
            Even if we don't have an opening that matches your skills right now,
            we'd still love to hear from you. Send us your resume and tell us
            about yourself. We're growing fast and new positions open regularly.
          </p>
          <div className="flex gap-3">
            <Button onClick={() => onNavigate("contact")}>
              Send Your Resume
            </Button>
            <Button variant="outline" onClick={() => onNavigate("company-info")}>
              Learn About Us
            </Button>
          </div>
        </Card>
      </ContentSection>

      <ContentSection title="Our Hiring Process">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#fa6723] text-white rounded-full flex items-center justify-center flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="mb-1">Application Review</h3>
              <p className="text-sm text-gray-600">
                We review all applications within 5 business days
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#fa6723] text-white rounded-full flex items-center justify-center flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="mb-1">Initial Interview</h3>
              <p className="text-sm text-gray-600">
                30-minute call to discuss your background and the role
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#fa6723] text-white rounded-full flex items-center justify-center flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="mb-1">Technical/Skills Assessment</h3>
              <p className="text-sm text-gray-600">
                Relevant assessment or case study based on the role
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#fa6723] text-white rounded-full flex items-center justify-center flex-shrink-0">
              4
            </div>
            <div>
              <h3 className="mb-1">Team Interview</h3>
              <p className="text-sm text-gray-600">
                Meet the team and learn more about our culture
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#fa6723] text-white rounded-full flex items-center justify-center flex-shrink-0">
              5
            </div>
            <div>
              <h3 className="mb-1">Offer</h3>
              <p className="text-sm text-gray-600">
                If it's a match, we'll extend an offer within 2 days
              </p>
            </div>
          </div>
        </div>
      </ContentSection>
    </FooterPageTemplate>
  );
}
