'use client';

import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { ReactNode, useEffect } from 'react';

interface PayPalProviderProps {
  children: ReactNode;
}

export default function PayPalProvider({ children }: PayPalProviderProps) {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  useEffect(() => {
    console.log('🔍 PayPal Debug Info:');
    console.log('Client ID:', clientId);
    console.log('Client ID length:', clientId?.length);
    console.log('Client ID first 20 chars:', clientId?.substring(0, 20));
    console.log('All NEXT_PUBLIC env vars:', Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC')));
  }, [clientId]);

  if (!clientId) {
    console.error('❌ PayPal Client ID is not configured');
    return <>{children}</>;
  }

  console.log('✅ PayPal Provider initialized with Client ID');

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: 'USD',
        intent: 'capture',
      }}
    >
      {children}
    </PayPalScriptProvider>
  );
}
