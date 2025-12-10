"use client";

import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Home, Search, DollarSign, Heart, User } from "lucide-react";

interface MobileNavProps {
  currentView: string;
  watchlistCount: number;
  onNavigate: (view: string) => void;
}

export function MobileNav({ currentView, watchlistCount, onNavigate }: MobileNavProps) {
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "search", label: "Search", icon: Search },
    { id: "create-listing", label: "Sell", icon: DollarSign },
    { id: "watchlist", label: "Watchlist", icon: Heart, badge: watchlistCount },
    { id: "profile", label: "Account", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-50 sm:hidden">
      <div className="grid grid-cols-5 gap-1 p-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`flex flex-col items-center gap-1 h-auto py-2 relative ${
                isActive ? "text-blue-600" : "text-gray-600"
              }`}
              onClick={() => onNavigate(item.id)}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge && item.badge > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 bg-red-500 text-xs">
                    {item.badge > 9 ? "9+" : item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
