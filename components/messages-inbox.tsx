"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import {
  MessageCircle,
  Send,
  Search,
  Phone,
  MoreVertical,
  ArrowLeft,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
  isOffer?: boolean;
  offerAmount?: number;
}

interface Conversation {
  id: string;
  productTitle: string;
  productImage: string;
  productPrice: number;
  sellerName: string;
  sellerAvatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isActive: boolean;
}

interface MessagesInboxProps {
  onBack: () => void;
}

// Mock data
const mockConversations: Conversation[] = [
  {
    id: "1",
    productTitle: "Vintage Canon AE-1 Film Camera with 50mm Lens",
    productImage: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400",
    productPrice: 299.99,
    sellerName: "Sokha Photography",
    lastMessage: "Yes, the camera is still available. Would you like to see it?",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
    unreadCount: 2,
    isActive: true,
  },
  {
    id: "2",
    productTitle: "iPhone 13 Pro Max 256GB - Like New",
    productImage: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400",
    productPrice: 899.0,
    sellerName: "Tech Deals KH",
    lastMessage: "I can do $850 final price",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unreadCount: 0,
    isActive: false,
  },
  {
    id: "3",
    productTitle: "Honda Wave 110cc 2020",
    productImage: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400",
    productPrice: 1200.0,
    sellerName: "Phnom Penh Motors",
    lastMessage: "You made an offer of $1000",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 5),
    unreadCount: 1,
    isActive: false,
  },
];

const mockMessages: Message[] = [
  {
    id: "1",
    conversationId: "1",
    senderId: "buyer",
    senderName: "You",
    text: "Hello, is this camera still available?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
  },
  {
    id: "2",
    conversationId: "1",
    senderId: "seller",
    senderName: "Sokha Photography",
    text: "Yes, the camera is still available. Would you like to see it?",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "3",
    conversationId: "1",
    senderId: "buyer",
    senderName: "You",
    text: "Can you do $250?",
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
    isOffer: true,
    offerAmount: 250,
  },
];

export function MessagesInbox({ onBack }: MessagesInboxProps) {
  const [conversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
    mockConversations[0]
  );
  const [messages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.productTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.sellerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentMessages = messages.filter(
    (msg) => msg.conversationId === selectedConversation?.id
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In real app, send message to backend
      setNewMessage("");
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <h1 className="mb-6">Messages</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <Card className="lg:col-span-1 p-0 overflow-hidden h-[600px] flex flex-col">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="divide-y">
                {filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedConversation?.id === conv.id ? "bg-[#fff5f0]" : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden shrink-0">
                        <ImageWithFallback
                          src={conv.productImage}
                          alt={conv.productTitle}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <p className="text-sm line-clamp-1">{conv.sellerName}</p>
                          <span className="text-xs text-gray-500 shrink-0 ml-2">
                            {formatTime(conv.lastMessageTime)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-1 mb-1">
                          {conv.productTitle}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500 line-clamp-1">
                            {conv.lastMessage}
                          </p>
                          {conv.unreadCount > 0 && (
                            <Badge className="ml-2 bg-red-500 h-5 w-5 flex items-center justify-center p-0">
                              {conv.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2 p-0 overflow-hidden h-[600px] flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden">
                      <ImageWithFallback
                        src={selectedConversation.productImage}
                        alt={selectedConversation.productTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3>{selectedConversation.sellerName}</h3>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {selectedConversation.productTitle}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Product Info Banner */}
                <div className="p-3 bg-gray-50 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                      <ImageWithFallback
                        src={selectedConversation.productImage}
                        alt={selectedConversation.productTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm line-clamp-1">
                        {selectedConversation.productTitle}
                      </p>
                      <p className="text-gray-900">
                        ${selectedConversation.productPrice.toFixed(2)}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {currentMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.senderId === "buyer" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            msg.senderId === "buyer"
                              ? "bg-[#fa6723] text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          {msg.isOffer && msg.offerAmount && (
                            <div className="mb-2 pb-2 border-b border-current/20">
                              <p className="text-xs opacity-80">Made an offer</p>
                              <p className="font-semibold">${msg.offerAmount.toFixed(2)}</p>
                            </div>
                          )}
                          <p className="text-sm">{msg.text}</p>
                          <p
                            className={`text-xs mt-1 ${
                              msg.senderId === "buyer"
                                ? "text-[#ffe5d9]"
                                : "text-gray-500"
                            }`}
                          >
                            {formatTime(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      rows={1}
                      className="resize-none"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-[#fa6723] hover:bg-[#e55a1f]"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
