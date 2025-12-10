import { NextResponse } from 'next/server';
import { verifyBoostPayment } from '@/app/actions/boosts';
import { headers } from 'next/headers';

/**
 * Bakong Webhook Handler
 *
 * This endpoint receives payment notifications from Bakong API
 * and automatically activates boosts when payments are confirmed.
 *
 * For MVP: This is a placeholder for future Bakong API integration.
 * Currently, payment verification is done via the "I've Completed Payment" button.
 */

interface BakongWebhookPayload {
  event_type: string; // e.g., "payment.success"
  payment_reference: string;
  amount: number;
  currency: string;
  status: string;
  timestamp: string;
  signature?: string; // For webhook verification
}

/**
 * Verify webhook signature (security measure)
 */
function verifyWebhookSignature(payload: string, signature: string): boolean {
  // TODO: Implement when Bakong API is available
  // This should verify the HMAC signature using your webhook secret
  //
  // Example implementation:
  // const crypto = require('crypto');
  // const secret = process.env.BAKONG_WEBHOOK_SECRET;
  // const expectedSignature = crypto
  //   .createHmac('sha256', secret)
  //   .update(payload)
  //   .digest('hex');
  // return expectedSignature === signature;

  // For MVP, skip signature verification (development mode only)
  if (process.env.NODE_ENV === 'development') {
    return true;
  }

  return !!signature; // Placeholder - always verify in production
}

/**
 * POST handler for Bakong webhook
 */
export async function POST(request: Request) {
  try {
    // Get webhook signature from headers
    const headersList = await headers();
    const signature = headersList.get('x-bakong-signature') || '';

    // Parse webhook payload
    const body = await request.text();
    const payload: BakongWebhookPayload = JSON.parse(body);

    console.log('Bakong webhook received:', payload);

    // Verify signature
    if (!verifyWebhookSignature(body, signature)) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Check event type
    if (payload.event_type !== 'payment.success') {
      console.log('Ignoring non-success event:', payload.event_type);
      return NextResponse.json({
        status: 'ignored',
        message: 'Only payment.success events are processed',
      });
    }

    // Verify payment status
    if (payload.status !== 'completed') {
      console.log('Payment not completed:', payload.status);
      return NextResponse.json({
        status: 'pending',
        message: 'Payment not yet completed',
      });
    }

    // Get payment reference
    const { payment_reference } = payload;
    if (!payment_reference) {
      return NextResponse.json(
        { error: 'Missing payment reference' },
        { status: 400 }
      );
    }

    // Verify and activate boost
    const result = await verifyBoostPayment(payment_reference);

    if (!result.success) {
      console.error('Failed to verify boost payment:', result.error);
      return NextResponse.json(
        { error: result.error || 'Payment verification failed' },
        { status: 400 }
      );
    }

    // Success!
    console.log('Boost activated successfully:', payment_reference);
    return NextResponse.json({
      status: 'success',
      message: 'Boost activated',
      payment_reference,
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET handler - for webhook verification/health check
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Bakong webhook endpoint is active',
    timestamp: new Date().toISOString(),
  });
}
