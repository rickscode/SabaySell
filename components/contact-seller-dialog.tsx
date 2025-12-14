"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { createThreadAndSendMessage } from "@/app/actions/messages";
import { toast } from "sonner";

interface ContactSellerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  initialMessage?: string;
  startInOfferMode?: boolean;
}

export function ContactSellerDialog({
  open,
  onOpenChange,
  product,
  initialMessage = "",
  startInOfferMode = false,
}: ContactSellerDialogProps) {
  const router = useRouter();
  const [message, setMessage] = useState(initialMessage);
  const [offerAmount, setOfferAmount] = useState("");
  const [isOfferMode, setIsOfferMode] = useState(startInOfferMode);
  const [isLoading, setIsLoading] = useState(false);

  // Update message and offer mode when dialog opens
  useEffect(() => {
    if (open) {
      setMessage(initialMessage);
      setIsOfferMode(startInOfferMode);
    }
  }, [open, initialMessage, startInOfferMode]);

  const handleSend = async () => {
    if (!message.trim()) return;

    setIsLoading(true);

    try {
      const offer = isOfferMode && offerAmount ? parseFloat(offerAmount) : undefined;
      const result = await createThreadAndSendMessage(product.id, message, offer);

      if (result.success) {
        toast.success("Message sent!");
        setMessage("");
        setOfferAmount("");
        setIsOfferMode(false);
        onOpenChange(false);
        router.push(`/messages?thread=${result.threadId}`);
      } else {
        toast.error(result.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Contact Seller</DialogTitle>
          <DialogDescription>
            Send a message to the seller through the platform
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

        <div>

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
              disabled={!message.trim() || isLoading}
              className="flex-1 bg-[#fa6723] hover:bg-[#e55a1f]"
            >
              <Send className="w-4 h-4 mr-2" />
              {isLoading
                ? "Sending..."
                : isOfferMode
                ? "Send Offer"
                : "Send Message"}
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
