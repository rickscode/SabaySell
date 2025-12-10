import { NextResponse } from 'next/server';
import { generateKHQR } from '@/lib/khqr';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { merchantId, merchantName, amount, currency, paymentReference } = body;

    if (!merchantId || !merchantName || !amount || !paymentReference) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Generate QR code
    const qrCode = await generateKHQR({
      merchantId,
      merchantName,
      amount,
      currency: currency || 'USD',
      paymentReference,
    });

    return NextResponse.json({ qrCode });
  } catch (error) {
    console.error('Error generating KHQR:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}
