"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Phone, MessageCircle, Send } from "lucide-react";
import { Product } from "./product-card";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ContactSellerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  onSendMessage: (message: string, offer?: number) => void;
  initialMessage?: string;
  startInOfferMode?: boolean;
}

export function ContactSellerDialog({
  open,
  onOpenChange,
  product,
  onSendMessage,
  initialMessage = "",
  startInOfferMode = false,
}: ContactSellerDialogProps) {
  const [message, setMessage] = useState(initialMessage);
  const [offerAmount, setOfferAmount] = useState("");
  const [isOfferMode, setIsOfferMode] = useState(startInOfferMode);

  // Update message and offer mode when dialog opens
  useEffect(() => {
    if (open) {
      setMessage(initialMessage);
      setIsOfferMode(startInOfferMode);
    }
  }, [open, initialMessage, startInOfferMode]);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message, isOfferMode ? parseFloat(offerAmount) : undefined);
      setMessage("");
      setOfferAmount("");
      setIsOfferMode(false);
      onOpenChange(false);
    }
  };

  // Mock seller contact info
  const sellerPhone = "+855 12 345 678";
  const sellerTelegram = "@seller_username";
  const sellerWhatsApp = "+85512345678";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Contact Seller</DialogTitle>
          <DialogDescription>
            Send a message or make an offer to the seller
          </DialogDescription>
        </DialogHeader>

        {/* Product Info */}
        <div className="flex gap-3 p-3 bg-gray-50 rounded-md">
          <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden shrink-0">
            <ImageWithFallback
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="line-clamp-2 mb-1">{product.title}</h3>
            <p className="text-gray-900">${product.price.toFixed(2)}</p>
          </div>
        </div>

        {/* Quick Contact Options */}
        <div className="space-y-2">
          <p className="text-sm">Quick Contact via:</p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => window.open(`tel:${sellerPhone}`)}
            >
              <Phone className="w-4 h-4 mr-2" />
              Call
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => window.open(`https://t.me/${sellerTelegram.slice(1)}`)}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Telegram
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => window.open(`https://wa.me/${sellerWhatsApp.replace(/\s/g, "")}`)}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            <p>📞 Phone: {sellerPhone}</p>
            <p>💬 Telegram: {sellerTelegram}</p>
            <p>📱 WhatsApp: {sellerWhatsApp}</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm mb-3">Or send a message through the platform:</p>

          {/* Make Offer Toggle */}
          <div className="flex items-center gap-2 mb-3">
            <Button
              variant={isOfferMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsOfferMode(!isOfferMode)}
            >
              {isOfferMode ? "Making an Offer" : "Make an Offer"}
            </Button>
          </div>

          {/* Offer Amount */}
          {isOfferMode && (
            <div className="mb-3">
              <Label htmlFor="offer">Your Offer Amount ($)</Label>
              <Input
                id="offer"
                type="number"
                placeholder={`Current price: $${product.price.toFixed(2)}`}
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                min="0"
                step="0.01"
              />
              <p className="text-xs text-gray-600 mt-1">
                Seller will be notified of your offer
              </p>
            </div>
          )}

          {/* Message */}
          <div className="mb-4">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder={
                isOfferMode
                  ? "Add details about your offer or ask questions..."
                  : "Ask about the item, arrange viewing, or negotiate price..."
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSend}
              disabled={!message.trim()}
              className="flex-1 bg-[#fa6723] hover:bg-[#e55a1f]"
            >
              <Send className="w-4 h-4 mr-2" />
              {isOfferMode ? "Send Offer" : "Send Message"}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
