import { NextRequest, NextResponse } from 'next/server';
import { createBooking, CreateBookingPayload } from '@/api/bookings/bookings-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      buildID,
      buildName,
      bill,
      guestDetails,
      paypalOrderId,
      paypalCaptureId,
    } = body;

    // Debug log to see what we're receiving
    console.log('📦 Received guestDetails:', JSON.stringify(guestDetails, null, 2));

    // Validate required fields
    if (!guestDetails.fullName || !guestDetails.email || !guestDetails.phone) {
      console.error('❌ Missing required guest details:', {
        fullName: guestDetails.fullName,
        email: guestDetails.email,
        phone: guestDetails.phone,
      });
      return NextResponse.json(
        { error: 'Missing required guest details' },
        { status: 400 }
      );
    }

    // Create booking payload matching Stripe format
    const bookingPayload: CreateBookingPayload = {
      userId: guestDetails.userId || 'guest',
      experienceId: buildID,
      bookingDate: new Date().toISOString(),
      experienceDate: guestDetails.date,
      adultCount: guestDetails.adultCount,
      childCount: guestDetails.childCount,
      infantCount: guestDetails.infantCount,
      totalAmount: bill,
      status: 'confirmed', // PayPal payment already completed
      primaryGuest: {
        fullName: guestDetails.fullName,
        email: guestDetails.email,
        confirmEmail: guestDetails.email,
        phoneNumber: guestDetails.phone,
      },
      additionalAdults: guestDetails.additionalAdults || [],
      children: guestDetails.children || [],
      paymentDetails: {
        paymentMethod: 'paypal',
        paymentTime: guestDetails.paymentTime || 'payNow',
        paypalOrderId: paypalOrderId,
        paypalCaptureId: paypalCaptureId,
      },
      experienceDetails: {
        title: buildName,
        time: guestDetails.time,
        optionTitle: guestDetails.optionTitle,
      },
    };

    const bookingResponse = await createBooking(bookingPayload);

    // Handle different response formats
    let bookingId;

    if (bookingResponse?.success && bookingResponse?.data) {
      if (Array.isArray(bookingResponse.data)) {
        const bookingData = bookingResponse.data[0];
        bookingId = bookingData?._id || bookingData?.id;
      } else if ((bookingResponse.data as any)?.bookingId) {
        bookingId = (bookingResponse.data as any).bookingId;
      } else {
        bookingId = bookingResponse.data._id || (bookingResponse.data as any).id;
      }
    } else if ((bookingResponse as any)?._id) {
      bookingId = (bookingResponse as any)._id;
    } else if ((bookingResponse as any)?.id) {
      bookingId = (bookingResponse as any).id;
    } else {
      throw new Error('Failed to create booking - no ID returned');
    }

    if (!bookingId) {
      throw new Error('Failed to extract booking ID from response');
    }

    return NextResponse.json({
      success: true,
      bookingId: bookingId,
      booking: bookingResponse,
    });
  } catch (error: any) {
    console.error('Error creating PayPal booking:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
