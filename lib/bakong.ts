/**
 * Bakong Open API Client
 *
 * TypeScript client for National Bank of Cambodia's Bakong Open API
 * Handles KHQR (Khmer QR) generation and payment verification
 *
 * @see https://api-bakong.nbc.org.kh/docs
 */

import crypto from 'crypto';

// Bakong API configuration from environment variables
const BAKONG_API_TOKEN = process.env.BAKONG_API_TOKEN;
const BAKONG_ACCOUNT_ID = process.env.BAKONG_ACCOUNT_ID;
const BAKONG_MERCHANT_NAME = process.env.BAKONG_MERCHANT_NAME || 'SabaySell';
const BAKONG_MERCHANT_CITY = process.env.BAKONG_MERCHANT_CITY || 'Phnom Penh';
const BAKONG_API_BASE_URL = process.env.BAKONG_API_BASE_URL || 'https://api-bakong.nbc.gov.kh';

/**
 * KHQR Data structure returned by Bakong API
 */
export interface KHQRData {
  qrString: string;      // The QR code string (to be encoded as QR image)
  md5Hash: string;       // MD5 hash for tracking this specific payment
  amount: number;        // Payment amount
  currency: string;      // Currency code (USD or KHR)
  merchantName: string;  // Merchant display name
  billNumber: string;    // Unique bill/reference number
}

/**
 * Payment verification response from Bakong API
 */
export interface PaymentVerification {
  paid: boolean;              // Whether payment was completed
  responseCode?: number;      // Bakong response code (0 = success)
  responseMessage?: string;   // Human-readable message
  transactionId?: string;     // Bakong transaction ID (if paid)
  amount?: number;            // Actual amount paid
  timestamp?: string;         // Payment timestamp
}

/**
 * Generate a unique MD5 hash from a string
 * Used to create unique payment identifiers for Bakong tracking
 */
export function generateMD5(data: string): string {
  return crypto.createHash('md5').update(data).digest('hex');
}

/**
 * Generate a dynamic KHQR code for payment
 *
 * Creates a unique QR code string that can be scanned by Cambodian banking apps
 * The QR code is trackable via MD5 hash for payment verification
 *
 * @param amount - Payment amount (in USD or KHR)
 * @param currency - Currency code ('USD' or 'KHR')
 * @param billNumber - Unique reference number (e.g., "BOOST-123")
 * @param storeLabel - Optional store/product label
 * @returns Promise<KHQRData> - QR string and tracking hash
 */
export async function generateKHQR(
  amount: number,
  currency: 'USD' | 'KHR' = 'USD',
  billNumber: string,
  storeLabel: string = 'SabaySell Boost'
): Promise<KHQRData> {
  if (!BAKONG_API_TOKEN || !BAKONG_ACCOUNT_ID) {
    throw new Error('Bakong API credentials not configured. Check environment variables.');
  }

  // Construct KHQR request payload
  const payload = {
    accountId: BAKONG_ACCOUNT_ID,
    merchantName: BAKONG_MERCHANT_NAME,
    merchantCity: BAKONG_MERCHANT_CITY,
    amount: amount.toFixed(2),
    currency: currency,
    storeLabel: storeLabel,
    billNumber: billNumber,
    terminalLabel: 'WEB-01',
    static: false, // Dynamic QR (required for payment tracking)
  };

  try {
    // Call Bakong API to generate KHQR
    const response = await fetch(`${BAKONG_API_BASE_URL}/v1/khqr/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BAKONG_API_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Bakong API error: ${response.status} - ${errorData.message || response.statusText}`
      );
    }

    const data = await response.json();

    // Extract QR string from response
    // The actual response structure may vary - adjust based on Bakong API docs
    const qrString = data.qr || data.qrString || data.data?.qr || '';

    if (!qrString) {
      throw new Error('Bakong API did not return a QR string');
    }

    // Generate MD5 hash for payment tracking
    const md5Hash = generateMD5(qrString);

    return {
      qrString,
      md5Hash,
      amount,
      currency,
      merchantName: BAKONG_MERCHANT_NAME,
      billNumber,
    };
  } catch (error) {
    console.error('[Bakong] Failed to generate KHQR:', error);
    throw error;
  }
}

/**
 * Verify if a payment has been completed
 *
 * Polls the Bakong API to check if a specific KHQR code has been paid
 * Use the MD5 hash returned from generateKHQR()
 *
 * @param md5Hash - MD5 hash of the KHQR string (payment identifier)
 * @returns Promise<PaymentVerification> - Payment status and details
 */
export async function verifyPayment(md5Hash: string): Promise<PaymentVerification> {
  if (!BAKONG_API_TOKEN) {
    throw new Error('Bakong API token not configured');
  }

  try {
    // Call Bakong API to check payment status
    const response = await fetch(`${BAKONG_API_BASE_URL}/v1/khqr/verify/${md5Hash}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${BAKONG_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      // If not found or not paid, return unpaid status (not an error)
      if (response.status === 404) {
        return { paid: false };
      }

      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Bakong API error: ${response.status} - ${errorData.message || response.statusText}`
      );
    }

    const data = await response.json();

    // Parse Bakong response
    // Response structure based on typical NBC Bakong API format:
    // { responseCode: 0, responseMessage: 'Success', data: {...} }
    const responseCode = data.responseCode || data.code;
    const isPaid = responseCode === 0 || responseCode === '0' || data.status === 'PAID';

    return {
      paid: isPaid,
      responseCode: responseCode,
      responseMessage: data.responseMessage || data.message,
      transactionId: data.transactionId || data.data?.transactionId,
      amount: data.amount ? parseFloat(data.amount) : undefined,
      timestamp: data.timestamp || data.data?.timestamp,
    };
  } catch (error) {
    console.error('[Bakong] Failed to verify payment:', error);

    // Don't throw on verification errors - return unpaid status
    // This allows polling to continue even if there are temporary API issues
    return {
      paid: false,
      responseMessage: error instanceof Error ? error.message : 'Verification failed',
    };
  }
}

/**
 * Check if Bakong API is configured correctly
 * Useful for debugging and setup validation
 */
export function isBakongConfigured(): boolean {
  return !!(BAKONG_API_TOKEN && BAKONG_ACCOUNT_ID);
}

/**
 * Get Bakong configuration status (for debugging)
 */
export function getBakongConfig() {
  return {
    configured: isBakongConfigured(),
    hasToken: !!BAKONG_API_TOKEN,
    hasAccountId: !!BAKONG_ACCOUNT_ID,
    accountId: BAKONG_ACCOUNT_ID?.slice(0, 6) + '***', // Partial ID for security
    merchantName: BAKONG_MERCHANT_NAME,
    merchantCity: BAKONG_MERCHANT_CITY,
    baseUrl: BAKONG_API_BASE_URL,
  };
}
