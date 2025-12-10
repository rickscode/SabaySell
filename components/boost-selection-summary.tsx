"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Star, TrendingUp, CheckCircle2 } from "lucide-react";

interface BoostSelectionSummaryProps {
  selectedBoosts: {
    featuredInCategory: boolean;
    featuredOnHomepage: boolean;
  };
  durationDays: number;
  totalAmount: number;
}

export function BoostSelectionSummary({
  selectedBoosts,
  durationDays,
  totalAmount,
}: BoostSelectionSummaryProps) {
  const { featuredInCategory, featuredOnHomepage } = selectedBoosts;

  const boostItems = [
    {
      enabled: featuredOnHomepage,
      name: "Featured on Homepage",
      description: "Your listing will appear at the top of the homepage",
      icon: Star,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      basePrice: 10,
    },
    {
      enabled: featuredInCategory,
      name: "Featured in Category",
      description: "Your listing will appear at the top of its category",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      basePrice: 5,
    },
  ];

  const activeBoosts = boostItems.filter((item) => item.enabled);
  const hasBundle = featuredInCategory && featuredOnHomepage;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Boost Summary</CardTitle>
        <CardDescription>
          Your listing will be promoted for {durationDays} day{durationDays > 1 ? "s" : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selected Boosts */}
        <div className="space-y-3">
          {activeBoosts.map((boost, index) => {
            const Icon = boost.icon;
            return (
              <div
                key={index}
                className={`flex items-start space-x-3 p-3 rounded-lg ${boost.bgColor} border`}
              >
                <Icon className={`h-5 w-5 mt-0.5 ${boost.color}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">{boost.name}</h4>
                    <Badge variant="secondary" className="text-xs">
                      ${boost.basePrice}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {boost.description}
                  </p>
                </div>
                <CheckCircle2 className={`h-5 w-5 ${boost.color}`} />
              </div>
            );
          })}
        </div>

        {/* Bundle Discount */}
        {hasBundle && (
          <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Bundle Discount Applied!
              </span>
            </div>
            <p className="text-xs text-green-700 mt-1">
              Save $3 when you combine homepage and category boosts
            </p>
          </div>
        )}

        {/* Pricing Breakdown */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Base price ({durationDays === 7 ? "1 week" : `${durationDays} days`})</span>
            <span className="font-medium">
              ${hasBundle ? "12.00" : activeBoosts.reduce((sum, b) => sum + b.basePrice, 0).toFixed(2)}
            </span>
          </div>

          {durationDays !== 7 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Duration multiplier</span>
              <span className="font-medium">×{(durationDays / 7).toFixed(1)}</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-2 border-t">
            <span className="font-semibold text-lg">Total</span>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                ${totalAmount.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500">
                ≈ {Math.round(totalAmount * 4100).toLocaleString()} KHR
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-gray-50 p-3 rounded-lg space-y-2">
          <h5 className="font-semibold text-sm text-gray-900">What you'll get:</h5>
          <ul className="text-xs text-gray-700 space-y-1">
            <li className="flex items-start">
              <span className="text-orange-600 mr-2">•</span>
              <span>Higher visibility and more views</span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-600 mr-2">•</span>
              <span>Priority placement above regular listings</span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-600 mr-2">•</span>
              <span>Increased chance of quick sale</span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-600 mr-2">•</span>
              <span>Active for {durationDays} full day{durationDays > 1 ? "s" : ""}</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
