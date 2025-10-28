'use client';

import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useState } from 'react';
import { createPayPalOrder, capturePayPalPayment } from '@/lib/actions/paypal';
import type {
  CreateOrderActions,
  CreateOrderData,
  OnApproveActions,
  OnApproveData,
} from '@paypal/paypal-js';

interface PayPalCheckoutProps {
  amount: string;
  currency?: string;
  description?: string;
  referenceId?: string;
  onSuccess?: (details: any) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
}

export default function PayPalCheckout({
  amount,
  currency = 'USD',
  description,
  referenceId,
  onSuccess,
  onError,
  onCancel,
}: PayPalCheckoutProps) {
  const [{ isPending }] = usePayPalScriptReducer();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Create order when PayPal button is clicked
  const createOrder = async (
    data: CreateOrderData,
    actions: CreateOrderActions
  ): Promise<string> => {
    try {
      console.log('🔄 Creating PayPal order with:', { amount, currency, description, referenceId });
      setErrorMessage('');
      const response = await createPayPalOrder({
        amount,
        currency,
        description,
        referenceId,
      });

      console.log('📦 PayPal order response:', response);

      if (!response.success || !response.orderId) {
        console.error('❌ Order creation failed:', response.error);
        throw new Error(response.error || 'Failed to create order');
      }

      console.log('✅ Order created successfully:', response.orderId);
      return response.orderId;
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to create order';
      console.error('❌ Create order error:', errorMsg, error);
      setErrorMessage(errorMsg);
      onError?.(errorMsg);
      throw error;
    }
  };

  // Capture payment when order is approved
  const onApprove = async (
    data: OnApproveData,
    actions: OnApproveActions
  ): Promise<void> => {
    try {
      setIsProcessing(true);
      setErrorMessage('');

      const response = await capturePayPalPayment({
        orderId: data.orderID,
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to capture payment');
      }

      console.log('Payment captured successfully:', response);
      onSuccess?.(response.details);
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to capture payment';
      console.error('Capture payment error:', errorMsg);
      setErrorMessage(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle errors
  const onErrorHandler = (error: Record<string, unknown>): void => {
    const errorMsg = 'An error occurred during the payment process';
    console.error('PayPal error:', error);
    setErrorMessage(errorMsg);
    onError?.(errorMsg);
  };

  // Handle cancellation
  const onCancelHandler = (): void => {
    console.log('Payment cancelled by user');
    setErrorMessage('Payment was cancelled');
    onCancel?.();
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        <span className="ml-2">Loading PayPal...</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{errorMessage}</p>
        </div>
      )}

      {isProcessing && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2" />
            <p className="text-sm text-blue-600">Processing payment...</p>
          </div>
        </div>
      )}

      <PayPalButtons
        style={{
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal',
        }}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onErrorHandler}
        onCancel={onCancelHandler}
        disabled={isProcessing}
      />
    </div>
  );
}
