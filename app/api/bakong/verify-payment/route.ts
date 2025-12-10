import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { verifyPayment } from '@/lib/bakong';

/**
 * Bakong Payment Verification Endpoint
 *
 * Checks if a KHQR payment has been completed and auto-activates the boost
 *
 * Flow:
 * 1. Receive MD5 hash from client (polling request)
 * 2. Find boost record by payment_hash
 * 3. Check if already activated (avoid duplicate activation)
 * 4. Call Bakong API to verify payment status
 * 5. If paid: activate boost immediately
 * 6. Return payment status to client
 *
 * GET /api/bakong/verify-payment?hash=XXXXX
 * Response: { paid: boolean, boost_id?: string, activated?: boolean }
 */
export async function GET(request: NextRequest) {
  try {
    // Get payment hash from query parameters
    const searchParams = request.nextUrl.searchParams;
    const paymentHash = searchParams.get('hash');

    if (!paymentHash) {
      return NextResponse.json({
        success: false,
        error: 'Payment hash is required'
      }, { status: 400 });
    }

    console.log('[Bakong Verify] Checking payment:', paymentHash);

    // Find boost by payment_hash
    const supabase = await createServerClient();

    const { data: boost, error: fetchError } = await supabase
      .from('boosts')
      .select('id, listing_id, type, status, duration_hours, payment_hash')
      .eq('payment_hash', paymentHash)
      .single();

    if (fetchError || !boost) {
      console.error('[Bakong Verify] Boost not found:', fetchError);
      return NextResponse.json({
        success: false,
        error: 'Boost not found for this payment hash'
      }, { status: 404 });
    }

    // Check if already activated
    if (boost.status === 'active') {
      console.log('[Bakong Verify] Boost already activated:', boost.id);
      return NextResponse.json({
        success: true,
        paid: true,
        activated: true,
        boost_id: boost.id,
        message: 'Boost already activated'
      }, { status: 200 });
    }

    // Verify payment with Bakong API
    console.log('[Bakong Verify] Calling Bakong API...');
    const verification = await verifyPayment(paymentHash);

    console.log('[Bakong Verify] Bakong response:', {
      paid: verification.paid,
      responseCode: verification.responseCode,
      message: verification.responseMessage
    });

    // If not paid yet, return unpaid status
    if (!verification.paid) {
      return NextResponse.json({
        success: true,
        paid: false,
        message: 'Payment not completed yet'
      }, { status: 200 });
    }

    // Payment confirmed! Activate boost
    console.log('[Bakong Verify] Payment confirmed! Activating boost:', boost.id);

    const now = new Date().toISOString();
    const endsAt = new Date(Date.now() + boost.duration_hours * 60 * 60 * 1000).toISOString();

    const { error: updateError } = await supabase
      .from('boosts')
      .update({
        status: 'active',
        starts_at: now,
        ends_at: endsAt,
        updated_at: now
      })
      .eq('id', boost.id);

    if (updateError) {
      console.error('[Bakong Verify] Failed to activate boost:', updateError);
      return NextResponse.json({
        success: false,
        error: 'Failed to activate boost',
        paid: true // Payment was confirmed, but activation failed
      }, { status: 500 });
    }

    console.log('[Bakong Verify] Boost activated successfully:', {
      boost_id: boost.id,
      listing_id: boost.listing_id,
      type: boost.type,
      starts_at: now,
      ends_at: endsAt
    });

    // Return success response
    return NextResponse.json({
      success: true,
      paid: true,
      activated: true,
      boost_id: boost.id,
      listing_id: boost.listing_id,
      type: boost.type,
      starts_at: now,
      ends_at: endsAt,
      message: 'Payment confirmed and boost activated!'
    }, { status: 200 });

  } catch (error) {
    console.error('[Bakong Verify] Unexpected error:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to verify payment',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Reject other HTTP methods
export async function POST() {
  return NextResponse.json({
    error: 'Method not allowed. Use GET to verify payment.'
  }, { status: 405 });
}
