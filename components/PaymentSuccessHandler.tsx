"use client";
import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

function PaymentSuccessHandlerInner() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if user returned from successful payment
    const paymentSuccess = searchParams.get('payment_success');
    const sessionId = searchParams.get('session_id');

    if (paymentSuccess === 'true' || sessionId) {
      toast.success("Payment Successful!", {
        description: "Your booking has been confirmed. You will receive an email confirmation shortly.",
      });

      // Clean up URL parameters
      const url = new URL(window.location.href);
      url.searchParams.delete('payment_success');
      url.searchParams.delete('session_id');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);

  // This component doesn't render anything visible
  return null;
}

export default function PaymentSuccessHandler() {
  return (
    <Suspense fallback={null}>
      <PaymentSuccessHandlerInner />
    </Suspense>
  );
}
