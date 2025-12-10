import QRCode from 'qrcode';

/**
 * KHQR (Khmer QR) Generation Utility
 *
 * This is a mock implementation that generates QR codes for Bakong payments.
 * When Bakong API credentials are available, replace this with real API calls.
 */

export interface KHQRData {
  merchantId: string;
  merchantName: string;
  amount: number;
  currency: string;
  paymentReference: string;
}

/**
 * Convert USD to KHR (Cambodian Riel)
 */
export function usdToKhr(usdAmount: number): number {
  const USD_TO_KHR_RATE = parseInt(process.env.USD_TO_KHR_RATE || '4100');
  return Math.round(usdAmount * USD_TO_KHR_RATE);
}

/**
 * Generate KHQR data string
 * This is a simplified mock format. Real Bakong KHQR uses EMVCo specification.
 */
function generateKHQRDataString(data: KHQRData): string {
  // Mock KHQR format (will be replaced with real Bakong API)
  const khrAmount = usdToKhr(data.amount);

  // For now, encode payment info as JSON
  const paymentInfo = {
    merchant: data.merchantId,
    merchant_name: data.merchantName,
    amount: khrAmount,
    currency: 'KHR',
    amount_usd: data.amount,
    reference: data.paymentReference,
    timestamp: Date.now(),
  };

  return JSON.stringify(paymentInfo);
}

/**
 * Generate QR code image as data URL
 */
export async function generateKHQR(data: KHQRData): Promise<string> {
  try {
    const qrData = generateKHQRDataString(data);

    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating KHQR:', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Generate KHQR with Bakong API (future implementation)
 *
 * When you have Bakong API credentials, implement this function to:
 * 1. Call Bakong API to create a payment request
 * 2. Receive the KHQR string from the API
 * 3. Generate QR code from the KHQR string
 */
export async function generateKHQRWithBakongAPI(data: KHQRData): Promise<string> {
  // TODO: Implement when Bakong API is available
  //
  // Example implementation:
  // const response = await fetch('https://api-bakong.nbc.gov.kh/v1/payment', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${process.env.BAKONG_API_KEY}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     merchant_id: data.merchantId,
  //     amount: usdToKhr(data.amount),
  //     currency: 'KHR',
  //     reference: data.paymentReference,
  //   }),
  // });
  //
  // const { khqr_string } = await response.json();
  // return await QRCode.toDataURL(khqr_string);

  throw new Error('Bakong API not yet implemented');
}

/**
 * Get merchant info from environment variables
 */
export function getMerchantInfo() {
  return {
    merchantId: process.env.BAKONG_MERCHANT_ID || 'sabaysell_merchant',
    merchantName: process.env.BAKONG_MERCHANT_NAME || 'SabaySell',
  };
}
