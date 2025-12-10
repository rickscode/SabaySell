"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BoostSelectionSummary } from "@/components/boost-selection-summary";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Loader2, CheckCircle2, QrCode, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { createBoost, type BoostType } from "@/app/actions/boosts";
import QRCode from 'qrcode';

export default function BoostPaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [paymentHash, setPaymentHash] = useState<string>("");
  const [qrString, setQrString] = useState<string>("");
  const [qrImageUrl, setQrImageUrl] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [boostId, setBoostId] = useState<string>("");
  const [boostType, setBoostType] = useState<'top_category' | 'featured' | null>(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [pollingCount, setPollingCount] = useState(0);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get params from URL
  const listingId = searchParams.get("listingId");
  const featuredOnHomepage = searchParams.get("featuredOnHomepage") === "true";
  const featuredInCategory = searchParams.get("featuredInCategory") === "true";
  const durationDays = parseInt(searchParams.get("duration") || "7");

  const selectedBoosts = {
    featuredOnHomepage,
    featuredInCategory,
  };

  // Initialize boost and generate QR
  useEffect(() => {
    if (!listingId || (!featuredOnHomepage && !featuredInCategory)) {
      toast.error("Invalid boost selection");
      router.push("/");
      return;
    }

    async function initializePayment() {
      const boostTypes: BoostType[] = [];
      if (featuredOnHomepage) boostTypes.push("featured");
      if (featuredInCategory) boostTypes.push("top_category");

      const primaryBoostType = boostTypes[0];
      setBoostType(primaryBoostType);

      // Create boost record
      const result = await createBoost({
        listingId: listingId!,
        boostTypes,
        durationDays,
      });

      if (!result.success || !result.boostId) {
        const errorMsg = result.error || "Failed to create boost";

        if (errorMsg.includes("authenticated") || errorMsg.includes("auth")) {
          toast.error("Please log in to boost your listing");
          router.push("/auth/login?redirectTo=/boost-payment");
        } else {
          toast.error(errorMsg);
          router.push("/");
        }
        return;
      }

      setBoostId(result.boostId);
      setAmount(result.amount || 0);

      // Generate KHQR via API
      try {
        const qrResponse = await fetch("/api/bakong/create-qr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ boostId: result.boostId }),
        });

        const qrData = await qrResponse.json();

        if (!qrData.success || !qrData.data) {
          throw new Error(qrData.error || "Failed to generate QR code");
        }

        setPaymentHash(qrData.data.md5Hash);
        setQrString(qrData.data.qrString);

        // Generate QR code image
        const qrImage = await QRCode.toDataURL(qrData.data.qrString, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });

        setQrImageUrl(qrImage);
        setLoading(false);

        // Start polling for payment
        startPaymentPolling(qrData.data.md5Hash);
      } catch (error) {
        console.error("QR generation error:", error);
        toast.error("Failed to generate payment QR code");
        router.push("/");
      }
    }

    initializePayment();

    // Cleanup on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [listingId, featuredOnHomepage, featuredInCategory, durationDays, router]);

  // Poll Bakong API to check payment status
  function startPaymentPolling(hash: string) {
    let count = 0;

    pollingIntervalRef.current = setInterval(async () => {
      count++;
      setPollingCount(count);

      try {
        const response = await fetch(`/api/bakong/verify-payment?hash=${hash}`);
        const data = await response.json();

        if (data.paid && data.activated) {
          // Payment confirmed!
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
          }
          setPaymentConfirmed(true);

          toast.success("Payment confirmed! Boost activated!", {
            description: "Your listing is now featured",
          });

          // Redirect after 2 seconds
          setTimeout(() => {
            router.push("/my-listings?payment=success");
          }, 2000);
        }
      } catch (error) {
        console.error("Polling error:", error);
      }

      // Stop polling after 60 seconds (20 attempts)
      if (count >= 20) {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
        toast.info("Still waiting for payment", {
          description: "Check My Listings in a few minutes",
        });
      }
    }, 3000); // Poll every 3 seconds
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-orange-600 mx-auto" />
          <p className="text-gray-600">Generating payment QR code...</p>
        </div>
      </div>
    );
  }

  if (paymentConfirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">Payment Confirmed!</h2>
            <p className="text-gray-600">Your boost is now active</p>
            <p className="text-sm text-gray-500">Redirecting...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Scan to Pay with Bakong</h1>
          <p className="text-gray-600 mt-2">
            ស្កេន QR កូដដើម្បីបង់ប្រាក់តាមរយៈកម្មវិធីធនាគាររបស់អ្នក
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Boost Summary */}
          <div>
            <BoostSelectionSummary
              selectedBoosts={selectedBoosts}
              durationDays={durationDays}
              totalAmount={amount}
            />
          </div>

          {/* Right Column - QR Code */}
          <div>
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Payment QR Code
              </h2>

              {/* QR Code Display */}
              <div className="bg-white rounded-lg p-6 mb-6 border-2 border-gray-200">
                {qrImageUrl && (
                  <img
                    src={qrImageUrl}
                    alt="Bakong Payment QR Code"
                    className="w-full max-w-[300px] mx-auto"
                  />
                )}
              </div>

              {/* Payment Amount */}
              <div className="bg-[#fa6723] text-white rounded-lg p-4 mb-6 text-center">
                <p className="text-sm opacity-90 mb-1">Amount / ចំនួនទឹកប្រាក់</p>
                <p className="text-4xl font-bold">${amount.toFixed(2)}</p>
                <p className="text-sm opacity-90 mt-1">
                  {boostType === 'featured' ? 'Homepage Boost' : 'Category Boost'}
                </p>
              </div>

              {/* Instructions */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Smartphone className="h-5 w-5 text-[#fa6723] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      1. Open your banking app (ABA, Acleda, etc.)
                    </p>
                    <p className="text-xs text-gray-600">
                      បើកកម្មវិធីធនាគាររបស់អ្នក
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <QrCode className="h-5 w-5 text-[#fa6723] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      2. Scan this QR code
                    </p>
                    <p className="text-xs text-gray-600">
                      ស្កេន QR កូដនេះ
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#fa6723] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      3. Confirm payment in your app
                    </p>
                    <p className="text-xs text-gray-600">
                      បញ្ជាក់ការទូទាត់ក្នុងកម្មវិធី
                    </p>
                  </div>
                </div>
              </div>

              {/* Polling Status */}
              {pollingCount > 0 && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    <p className="text-sm text-blue-800">
                      Checking for payment... ({pollingCount}/20)
                    </p>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    រង់ចាំការបញ្ជាក់ការទូទាត់
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Information Footer */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            ℹ️ How it works / របៀបប្រើប្រាស់
          </h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>✓ Scan QR code with any Cambodian banking app (Bakong enabled)</li>
            <li>✓ Payment is verified automatically within seconds</li>
            <li>✓ Your boost will activate immediately after payment</li>
            <li>✓ The boost will run for {durationDays} days</li>
          </ul>

          <div className="mt-4 pt-4 border-t border-blue-200">
            <p className="text-sm text-blue-800 font-semibold">Note:</p>
            <p className="text-sm text-blue-700 mt-1">
              Make sure to complete the payment within 10 minutes. After that, you'll need to create a new boost request.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
