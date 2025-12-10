import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { generateKHQR } from '@/lib/bakong';

/**
 * Bakong QR Code Generation Endpoint
 *
 * Creates a dynamic KHQR code for boost payments and stores tracking info in database
 *
 * Flow:
 * 1. Validate request (boostId required)
 * 2. Fetch boost record from database
 * 3. Determine amount based on boost type
 * 4. Generate KHQR via Bakong API
 * 5. Store payment_hash and qr_string in database
 * 6. Return QR data to client
 *
 * POST /api/bakong/create-qr
 * Body: { boostId: string }
 * Response: { qrString: string, md5Hash: string, amount: number, currency: string }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { boostId } = body;

    if (!boostId) {
      return NextResponse.json({
        success: false,
        error: 'Boost ID is required'
      }, { status: 400 });
    }

    console.log('[Bakong Create QR] Request for boost:', boostId);

    // Get boost record from database
    const supabase = await createServerClient();

    const { data: boost, error: fetchError } = await supabase
      .from('boosts')
      .select('id, listing_id, type, amount, status, user_id')
      .eq('id', boostId)
      .single();

    if (fetchError || !boost) {
      console.error('[Bakong Create QR] Boost not found:', fetchError);
      return NextResponse.json({
        success: false,
        error: 'Boost not found'
      }, { status: 404 });
    }

    // Verify boost is in pending_payment status
    if (boost.status !== 'pending_payment') {
      return NextResponse.json({
        success: false,
        error: `Boost is not pending payment (status: ${boost.status})`
      }, { status: 400 });
    }

    // Use amount from boost record (already calculated with test/production pricing)
    const amount = boost.amount;

    // Generate unique bill number for tracking
    const billNumber = `BOOST-${boost.id.slice(0, 8)}`;

    // Generate KHQR via Bakong API
    console.log('[Bakong Create QR] Generating KHQR:', {
      amount,
      currency: 'USD',
      billNumber,
      boostType: boost.type
    });

    const khqrData = await generateKHQR(
      amount,
      'USD',
      billNumber,
      `SabaySell ${boost.type === 'featured' ? 'Homepage' : 'Category'} Boost`
    );

    console.log('[Bakong Create QR] KHQR generated successfully:', {
      md5Hash: khqrData.md5Hash,
      qrLength: khqrData.qrString.length
    });

    // Store payment_hash and qr_string in database
    const { error: updateError } = await supabase
      .from('boosts')
      .update({
        payment_hash: khqrData.md5Hash,
        bakong_qr_string: khqrData.qrString,
        amount: amount, // Store actual amount
        updated_at: new Date().toISOString()
      })
      .eq('id', boost.id);

    if (updateError) {
      console.error('[Bakong Create QR] Failed to update boost:', updateError);
      return NextResponse.json({
        success: false,
        error: 'Failed to save payment information'
      }, { status: 500 });
    }

    console.log('[Bakong Create QR] Boost updated with payment hash');

    // Return QR data to client
    return NextResponse.json({
      success: true,
      data: {
        qrString: khqrData.qrString,
        md5Hash: khqrData.md5Hash,
        amount: khqrData.amount,
        currency: khqrData.currency,
        billNumber: billNumber,
        merchantName: khqrData.merchantName,
        boostType: boost.type
      }
    }, { status: 200 });

  } catch (error) {
    console.error('[Bakong Create QR] Unexpected error:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to generate QR code',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Reject other HTTP methods
export async function GET() {
  return NextResponse.json({
    error: 'Method not allowed. Use POST to generate QR code.'
  }, { status: 405 });
}
