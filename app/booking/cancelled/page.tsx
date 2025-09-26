"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle, RefreshCw, Home, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchBookingById, updateBookingStatus } from "@/api/bookings/bookings-api";
import { BookingData } from "@/types/booking/booking-types";
import PriceDisplay from "@/components/PriceDisplay";

const BookingCancelledPage = () => {
  const searchParams = useSearchParams();
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bookingId = searchParams.get("booking_id");

  useEffect(() => {
    const fetchAndUpdateBooking = async () => {
      if (!bookingId) {
        setError("No booking ID provided");
        setLoading(false);
        return;
      }

      try {
        // Fetch booking details
        const response = await fetchBookingById(bookingId);
        if (response.success && response.data) {
          setBooking(response.data);

          // Update booking status to cancelled if it's still pending
          if (response.data.status === "pending") {
            await updateBookingStatus(bookingId, "cancelled");
          }
        } else {
          setError("Failed to fetch booking details");
        }
      } catch (err) {
        console.error("Error fetching booking:", err);
        setError("Failed to fetch booking details");
      } finally {
        setLoading(false);
      }
    };

    fetchAndUpdateBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error || "Booking not found"}</p>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const bookingDate = new Date(booking.experienceDate);
  const formattedDate = bookingDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Construct the retry URL with the same parameters
  const retryBookingUrl = `/booking?itemName=${booking.experienceId}&date=${booking.experienceDate}&time=${encodeURIComponent(booking.experienceDetails.time)}&optionTitle=${encodeURIComponent(booking.experienceDetails.optionTitle)}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Cancelled Header */}
        <div className="text-center mb-8">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Cancelled
          </h1>
          <p className="text-gray-600">
            Your payment was cancelled and no charges were made to your account.
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="px-6 py-4 bg-red-600 text-white">
            <h2 className="text-xl font-semibold">Cancelled Booking Details</h2>
            <p className="opacity-90">Booking ID: {booking._id}</p>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Experience Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Experience Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-gray-900">
                      {booking.experienceDetails.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      {booking.experienceDetails.optionTitle}
                    </p>
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Date:</strong> {formattedDate}
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Time:</strong> {booking.experienceDetails.time}
                  </div>
                </div>
              </div>

              {/* Guest Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Guest Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-gray-900">
                      {booking.primaryGuest.fullName}
                    </p>
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Email:</strong> {booking.primaryGuest.email}
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Phone:</strong> {booking.primaryGuest.phoneNumber}
                  </div>
                </div>
              </div>
            </div>

            {/* Guest Count & Pricing */}
            <div className="border-t mt-6 pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Guests</h3>
                  <div className="space-y-2">
                    {booking.adultCount > 0 && (
                      <div className="flex justify-between">
                        <span>{booking.adultCount} Adult(s)</span>
                      </div>
                    )}
                    {booking.childCount > 0 && (
                      <div className="flex justify-between">
                        <span>{booking.childCount} Child(ren) (6-12 years)</span>
                      </div>
                    )}
                    {booking.infantCount > 0 && (
                      <div className="flex justify-between">
                        <span>{booking.infantCount} Infant(s) (Under 5)</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Amount (Not Charged)</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total Amount</span>
                      <span>
                        <PriceDisplay amount={booking.totalAmount} />
                      </span>
                    </div>
                    <p className="text-sm text-red-600">
                      ✗ Payment cancelled - No charges made
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Box */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-amber-900 mb-3">
            What happened?
          </h3>
          <ul className="space-y-2 text-amber-800">
            <li>• Your payment was cancelled before completion</li>
            <li>• No charges have been made to your payment method</li>
            <li>• Your booking was not confirmed</li>
            <li>• You can try booking again if you'd like to proceed</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">
              <Home className="h-4 w-4 mr-2" />
              Return Home
            </Button>
          </Link>
          <Link href={retryBookingUrl}>
            <Button className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Booking Again
            </Button>
          </Link>
          <Link href="/search">
            <Button variant="outline" className="w-full sm:w-auto">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Browse Experiences
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const BookingCancelledPageWrapper = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingCancelledPage />
    </Suspense>
  );
};

export default BookingCancelledPageWrapper;