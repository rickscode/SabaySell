"use client";

import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

interface FooterPageTemplateProps {
  title: string;
  breadcrumbs?: string[];
  children: ReactNode;
  onNavigate?: (view: string) => void;
  sidebar?: {
    title: string;
    links: Array<{
      label: string;
      onClick: () => void;
    }>;
  };
  relatedTopics?: Array<{
    title: string;
    description: string;
    onClick: () => void;
  }>;
}

export function FooterPageTemplate({
  title,
  breadcrumbs = [],
  children,
  onNavigate,
  sidebar,
  relatedTopics,
}: FooterPageTemplateProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center gap-2">
                  {index > 0 && <ChevronRight className="w-4 h-4" />}
                  <span
                    className={
                      index === breadcrumbs.length - 1
                        ? "text-gray-900"
                        : "hover:text-[#fa6723] cursor-pointer"
                    }
                    onClick={() => {
                      if (index < breadcrumbs.length - 1 && onNavigate) {
                        if (crumb === "Home") {
                          onNavigate("home");
                        }
                      }
                    }}
                  >
                    {crumb}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Content Area */}
          <div className="flex-1">
            <h1 className="mb-6">{title}</h1>
            <Card className="p-6 lg:p-8">
              <div className="prose prose-sm max-w-none">
                {children}
              </div>
            </Card>

            {/* Related Topics */}
            {relatedTopics && relatedTopics.length > 0 && (
              <div className="mt-8">
                <h2 className="mb-4">Related Topics</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {relatedTopics.map((topic, index) => (
                    <Card
                      key={index}
                      className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={topic.onClick}
                    >
                      <h3 className="mb-2">{topic.title}</h3>
                      <p className="text-sm text-gray-600">
                        {topic.description}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          {sidebar && (
            <div className="lg:w-64 flex-shrink-0">
              <Card className="p-6 sticky top-4">
                <h3 className="mb-4">{sidebar.title}</h3>
                <nav className="space-y-2">
                  {sidebar.links.map((link, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start text-sm"
                      onClick={link.onClick}
                    >
                      {link.label}
                    </Button>
                  ))}
                </nav>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ContentSectionProps {
  title: string;
  children: ReactNode;
}

export function ContentSection({ title, children }: ContentSectionProps) {
  return (
    <div className="mb-8">
      <h2 className="mb-4">{title}</h2>
      <div className="text-gray-700 space-y-4">{children}</div>
    </div>
  );
}
