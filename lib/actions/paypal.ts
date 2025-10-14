'use server';

import paypal from '@paypal/checkout-server-sdk';

// PayPal environment configuration
function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID!;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;
  const mode = process.env.PAYPAL_MODE || 'sandbox';

  if (mode === 'production') {
    return new paypal.core.LiveEnvironment(clientId, clientSecret);
  }
  return new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

// PayPal client
function client() {
  return new paypal.core.PayPalHttpClient(environment());
}

// Types for PayPal operations
export interface CreateOrderData {
  amount: string;
  currency?: string;
  description?: string;
  referenceId?: string;
}

export interface OrderResponse {
  success: boolean;
  orderId?: string;
  error?: string;
  details?: any;
}

export interface CapturePaymentData {
  orderId: string;
}

export interface CapturePaymentResponse {
  success: boolean;
  captureId?: string;
  status?: string;
  error?: string;
  details?: any;
}

/**
 * Create a PayPal order
 * @param data - Order creation data
 * @returns Order response with order ID
 */
export async function createPayPalOrder(
  data: CreateOrderData
): Promise<OrderResponse> {
  try {
    const { amount, currency = 'USD', description = 'Purchase', referenceId } = data;

    // Validate amount
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return {
        success: false,
        error: 'Invalid amount provided',
      };
    }

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: referenceId || `REF-${Date.now()}`,
          description: description || 'Online Purchase',
          soft_descriptor: 'FLY FIM',
          amount: {
            currency_code: currency,
            value: parsedAmount.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: currency,
                value: parsedAmount.toFixed(2),
              },
            },
          },
          items: [
            {
              name: description || 'Experience Booking',
              description: 'Travel and Tourism Experience',
              quantity: '1',
              unit_amount: {
                currency_code: currency,
                value: parsedAmount.toFixed(2),
              },
              category: 'DIGITAL_GOODS',
            },
          ],
        },
      ],
      application_context: {
        brand_name: 'Fly FIM',
        landing_page: 'NO_PREFERENCE',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW',
      },
    } as any);

    const response = await client().execute(request);

    console.log('PayPal Order Created:', {
      orderId: response.result.id,
      status: response.result.status,
    });

    return {
      success: true,
      orderId: response.result.id,
      details: response.result,
    };
  } catch (error: any) {
    console.error('Error creating PayPal order:', error);
    return {
      success: false,
      error: error.message || 'Failed to create PayPal order',
      details: error,
    };
  }
}

/**
 * Capture payment for an approved PayPal order
 * @param data - Capture payment data with order ID
 * @returns Capture payment response
 */
export async function capturePayPalPayment(
  data: CapturePaymentData
): Promise<CapturePaymentResponse> {
  try {
    const { orderId } = data;

    if (!orderId) {
      return {
        success: false,
        error: 'Order ID is required',
      };
    }

    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({} as any);

    const response = await client().execute(request);

    const captureId =
      response.result.purchase_units?.[0]?.payments?.captures?.[0]?.id;
    const status = response.result.status;

    console.log('PayPal Payment Captured:', {
      orderId: response.result.id,
      captureId,
      status,
    });

    return {
      success: true,
      captureId,
      status,
      details: response.result,
    };
  } catch (error: any) {
    console.error('Error capturing PayPal payment:', error);
    return {
      success: false,
      error: error.message || 'Failed to capture PayPal payment',
      details: error,
    };
  }
}

/**
 * Get order details
 * @param orderId - PayPal order ID
 * @returns Order details
 */
export async function getPayPalOrderDetails(orderId: string) {
  try {
    const request = new paypal.orders.OrdersGetRequest(orderId);
    const response = await client().execute(request);

    return {
      success: true,
      details: response.result,
    };
  } catch (error: any) {
    console.error('Error fetching PayPal order details:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch order details',
    };
  }
}
