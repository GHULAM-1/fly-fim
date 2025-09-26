"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Calendar, Clock, Ticket, Mail, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchBookingById } from "@/api/bookings/bookings-api";
import { BookingData } from "@/types/booking/booking-types";
import PriceDisplay from "@/components/PriceDisplay";

const BookingSuccessPage = () => {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const sessionId = searchParams.get("session_id");

  // Update booking status on successful payment
  useEffect(() => {
    const updateBookingStatus = async () => {
      if (sessionId) {
        try {

          const response = await fetch('/api/update-booking-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId: sessionId
            })
          });

          const result = await response.json();

          if (response.ok) {
          } else {
            console.error("❌ Failed to update booking status:", result);
          }
        } catch (error) {
          console.error("❌ Error updating booking status:", error);
        }
      }
    };

    updateBookingStatus();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600">
            Your payment has been processed successfully. You'll receive a confirmation email shortly.
          </p>
          {sessionId && (
            <p className="text-sm text-gray-500 mt-2">
              Session ID: {sessionId}
            </p>
          )}
        </div>

        {/* Success Details Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="px-6 py-4 bg-purple-600 text-white">
            <h2 className="text-xl font-semibold">Payment Confirmed</h2>
            <p className="opacity-90">Thank you for your booking!</p>
          </div>

          <div className="p-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center text-green-600">
                <CheckCircle className="h-8 w-8 mr-3" />
                <span className="text-xl font-semibold">Payment Processed Successfully</span>
              </div>
              <p className="text-gray-600">
                Your booking has been confirmed and you should receive a confirmation email shortly.
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            What happens next?
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li>• You'll receive a confirmation email with your e-tickets</li>
            <li>• Keep your booking confirmation handy for the day of your visit</li>
            <li>• Arrive at the venue at your scheduled time</li>
            <li>• Show your e-ticket or booking confirmation at entry</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">
              Continue Browsing
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button className="w-full sm:w-auto">
              View My Bookings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const BookingSuccessPageWrapper = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingSuccessPage />
    </Suspense>
  );
};

export default BookingSuccessPageWrapper;