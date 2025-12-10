"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Loader2, Copy, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface KHQRDisplayProps {
  paymentReference: string;
  amount: number;
  currency: string;
  merchantName: string;
  onPaymentVerified?: () => void;
}

export function KHQRDisplay({
  paymentReference,
  amount,
  currency,
  merchantName,
  onPaymentVerified,
}: KHQRDisplayProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Convert to KHR
  const USD_TO_KHR_RATE = 4100;
  const amountInKHR = Math.round(amount * USD_TO_KHR_RATE);

  useEffect(() => {
    // Generate QR code on client side
    async function generateQR() {
      try {
        const response = await fetch("/api/generate-khqr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            merchantId: "sabaysell_merchant",
            merchantName,
            amount,
            currency,
            paymentReference,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate QR code");
        }

        const { qrCode } = await response.json();
        setQrCodeUrl(qrCode);
      } catch (error) {
        console.error("Error generating QR code:", error);
        toast.error("Failed to generate QR code");
      } finally {
        setLoading(false);
      }
    }

    generateQR();
  }, [paymentReference, amount, currency, merchantName]);

  const copyReference = () => {
    navigator.clipboard.writeText(paymentReference);
    setCopied(true);
    toast.success("Payment reference copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Scan to Pay with Bakong</CardTitle>
        <CardDescription>
          Use your Bakong app to scan the QR code below
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* QR Code */}
        <div className="flex justify-center p-6 bg-white rounded-lg border-2 border-gray-200">
          {loading ? (
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
              <p className="text-sm text-gray-500">Generating QR code...</p>
            </div>
          ) : qrCodeUrl ? (
            <img
              src={qrCodeUrl}
              alt="Bakong QR Code"
              className="w-64 h-64"
            />
          ) : (
            <div className="text-center text-red-500">
              Failed to generate QR code
            </div>
          )}
        </div>

        {/* Payment Amount */}
        <div className="text-center space-y-1">
          <div className="text-3xl font-bold text-gray-900">
            ${amount.toFixed(2)}
          </div>
          <div className="text-sm text-gray-500">
            ≈ {amountInKHR.toLocaleString()} KHR
          </div>
          <Badge variant="outline" className="mt-2">
            {merchantName}
          </Badge>
        </div>

        {/* Payment Reference */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Payment Reference
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyReference}
              className="h-8"
            >
              {copied ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <code className="block text-xs bg-white p-2 rounded border font-mono break-all">
            {paymentReference}
          </code>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 p-4 rounded-lg space-y-2 border border-blue-200">
          <h4 className="font-semibold text-sm text-blue-900">
            Payment Instructions:
          </h4>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Open your Bakong app</li>
            <li>Scan the QR code above</li>
            <li>Verify the amount and merchant</li>
            <li>Complete the payment</li>
            <li>Your listing will activate automatically</li>
          </ol>
        </div>

        {/* Test Payment Button (for development) */}
        {process.env.NODE_ENV === "development" && (
          <div className="pt-4 border-t">
            <Button
              onClick={onPaymentVerified}
              className="w-full"
              variant="outline"
            >
              🧪 Simulate Payment Success (Dev Only)
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
