import { NextResponse } from 'next/server';
import { createPayPalOrder } from '@/lib/actions/paypal';

export async function GET() {
  try {
    console.log('🧪 Testing PayPal API...');

    // Test creating an order with a small amount
    const result = await createPayPalOrder({
      amount: '10.00',
      currency: 'USD',
      description: 'Test Order',
      referenceId: `TEST-${Date.now()}`,
    });

    console.log('✅ PayPal API test result:', result);

    return NextResponse.json({
      success: true,
      message: 'PayPal API test completed',
      result,
    });
  } catch (error: any) {
    console.error('❌ PayPal API test failed:', error);
    return NextResponse.json({
      success: false,
      message: 'PayPal API test failed',
      error: error.message,
      details: error,
    }, { status: 500 });
  }
}
