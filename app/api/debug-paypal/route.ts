import { NextResponse } from 'next/server';

export async function GET() {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    env: {
      PAYPAL_MODE: process.env.PAYPAL_MODE || 'NOT SET',
      PAYPAL_CLIENT_ID_exists: !!process.env.PAYPAL_CLIENT_ID,
      PAYPAL_CLIENT_ID_length: process.env.PAYPAL_CLIENT_ID?.length || 0,
      PAYPAL_CLIENT_ID_first20: process.env.PAYPAL_CLIENT_ID?.substring(0, 20) || 'NOT SET',
      PAYPAL_CLIENT_SECRET_exists: !!process.env.PAYPAL_CLIENT_SECRET,
      PAYPAL_CLIENT_SECRET_length: process.env.PAYPAL_CLIENT_SECRET?.length || 0,
      NEXT_PUBLIC_PAYPAL_CLIENT_ID_exists: !!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
      NEXT_PUBLIC_PAYPAL_CLIENT_ID_length: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.length || 0,
      NEXT_PUBLIC_PAYPAL_CLIENT_ID_first20: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.substring(0, 20) || 'NOT SET',
    },
    allEnvKeys: Object.keys(process.env).filter(key =>
      key.includes('PAYPAL') || key.includes('paypal')
    ),
  };

  console.log('🔍 PayPal Debug API called:', debugInfo);

  return NextResponse.json(debugInfo);
}
