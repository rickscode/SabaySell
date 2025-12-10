"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Bell,
  MessageCircle,
  DollarSign,
  Heart,
  Eye,
  TrendingDown,
  Package,
  Clock,
} from "lucide-react";

interface Notification {
  id: string;
  type: "message" | "offer" | "bid" | "watcher" | "price-drop" | "sold" | "expiring";
  title: string;
  description: string;
  time: string;
  read: boolean;
  productImage?: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "message",
    title: "New message from Chanthy",
    description: "I'm interested in your MacBook Pro. Is it still available?",
    time: "5 min ago",
    read: false,
    productImage: "https://images.unsplash.com/photo-1511385348-a52b4a160dc2?w=100",
  },
  {
    id: "2",
    type: "offer",
    title: "New offer on iPhone 15 Pro",
    description: "Vanna offered $850.00 (asking $899.99)",
    time: "1 hour ago",
    read: false,
    productImage: "https://images.unsplash.com/photo-1732998369893-af4c9a4695fe?w=100",
  },
  {
    id: "3",
    type: "bid",
    title: "You've been outbid!",
    description: "Someone bid $425.00 on Apple Watch Series 9",
    time: "2 hours ago",
    read: false,
    productImage: "https://images.unsplash.com/photo-1637719752114-42a31081896c?w=100",
  },
  {
    id: "4",
    type: "watcher",
    title: "3 new watchers",
    description: "3 people are watching your MacBook Pro listing",
    time: "4 hours ago",
    read: true,
    productImage: "https://images.unsplash.com/photo-1511385348-a52b4a160dc2?w=100",
  },
  {
    id: "5",
    type: "price-drop",
    title: "Price drop alert!",
    description: "Canon EOS R5 dropped to $2,999 (was $3,299)",
    time: "6 hours ago",
    read: true,
    productImage: "https://images.unsplash.com/photo-1579535984712-92fffbbaa266?w=100",
  },
  {
    id: "6",
    type: "sold",
    title: "Item sold!",
    description: "Your Canon EOS R5 has been marked as sold",
    time: "1 day ago",
    read: true,
    productImage: "https://images.unsplash.com/photo-1579535984712-92fffbbaa266?w=100",
  },
  {
    id: "7",
    type: "expiring",
    title: "Listing ending soon",
    description: "Your Apple Watch auction ends in 2 hours",
    time: "1 day ago",
    read: true,
    productImage: "https://images.unsplash.com/photo-1637719752114-42a31081896c?w=100",
  },
];

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeTab, setActiveTab] = useState("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "message":
        return <MessageCircle className="w-4 h-4 text-[#fa6723]" />;
      case "offer":
        return <DollarSign className="w-4 h-4 text-[#fa6723]" />;
      case "bid":
        return <TrendingDown className="w-4 h-4 text-orange-500" />;
      case "watcher":
        return <Heart className="w-4 h-4 text-pink-500" />;
      case "price-drop":
        return <TrendingDown className="w-4 h-4 text-[#fa6723]" />;
      case "sold":
        return <Package className="w-4 h-4 text-[#fa6723]" />;
      case "expiring":
        return <Clock className="w-4 h-4 text-orange-500" />;
    }
  };

  const filterNotifications = () => {
    if (activeTab === "all") return notifications;
    if (activeTab === "unread") return notifications.filter((n) => !n.read);
    return notifications.filter((n) => n.type === activeTab);
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const filteredNotifications = filterNotifications();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px] p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <h3>Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b px-4">
            <TabsList className="w-full grid grid-cols-3 bg-transparent">
              <TabsTrigger value="all" className="data-[state=active]:bg-transparent">
                All
              </TabsTrigger>
              <TabsTrigger value="unread" className="data-[state=active]:bg-transparent">
                Unread ({unreadCount})
              </TabsTrigger>
              <TabsTrigger value="message" className="data-[state=active]:bg-transparent">
                Messages
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[400px]">
            <div className="p-2">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredNotifications.map((notification, index) => (
                    <div key={notification.id}>
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className={`w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors ${
                          !notification.read ? "bg-[#fff5f0]" : ""
                        }`}
                      >
                        <div className="flex gap-3">
                          {notification.productImage && (
                            <img
                              src={notification.productImage}
                              alt=""
                              className="w-12 h-12 rounded object-cover shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-2 mb-1">
                              {getIcon(notification.type)}
                              <div className="flex-1 min-w-0">
                                <div className="text-sm flex items-center gap-2">
                                  <span className={!notification.read ? "" : "text-gray-700"}>
                                    {notification.title}
                                  </span>
                                  {!notification.read && (
                                    <div className="w-2 h-2 rounded-full bg-[#fa6723] shrink-0" />
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {notification.description}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                      {index < filteredNotifications.length - 1 && <Separator className="my-1" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </Tabs>

        <div className="border-t p-3">
          <Button variant="ghost" className="w-full" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            View All Notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
