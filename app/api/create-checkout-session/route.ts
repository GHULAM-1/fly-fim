import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import stripe from "@/config/stripe";
import { createBooking, CreateBookingPayload } from "@/api/bookings/bookings-api";

export async function POST(req: NextRequest) {
  const headersList = await headers();
  const origin = headersList.get("origin") || "";
  const {
    buildID,
    buildName,
    bill,
    guestDetails
  } = await req.json();
  
  try {
    // Create pending booking first
    const bookingPayload: CreateBookingPayload = {
      userId: guestDetails.userId || "guest",
      experienceId: buildID,
      bookingDate: new Date().toISOString(),
      experienceDate: guestDetails.date,
      adultCount: guestDetails.adultCount,
      childCount: guestDetails.childCount,
      infantCount: guestDetails.infantCount,
      totalAmount: bill,
      status: "pending",
      primaryGuest: {
        fullName: guestDetails.fullName,
        email: guestDetails.email,
        confirmEmail: guestDetails.email,
        phoneNumber: guestDetails.phone,
      },
      additionalAdults: guestDetails.additionalAdults || [],
      children: guestDetails.children || [],
      paymentDetails: {
        paymentMethod: "stripe",
        paymentTime: guestDetails.paymentTime || "payNow",
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

      // Handle different response formats:
      // - For CREATE (POST): { data: { bookingId: "..." } }
      // - For FETCH (GET): { data: [{ _id: "..." }] }
      if (Array.isArray(bookingResponse.data)) {
        // GET response format - array of booking objects
        const bookingData = bookingResponse.data[0];
        bookingId = bookingData?._id || bookingData?.id;
      } 
      else if ((bookingResponse.data as any)?.bookingId) {
        // POST response format - object with bookingId field
        bookingId = (bookingResponse.data as any).bookingId;
      }
       else {
        // Fallback - direct object with _id or id
        bookingId = bookingResponse.data._id || (bookingResponse.data as any).id;
      }

    } 
    else if ((bookingResponse as any)?._id) {
      bookingId = (bookingResponse as any)._id;

    } 
    else if ((bookingResponse as any)?.id) {
      bookingId = (bookingResponse as any).id;

    } 
    else {
      throw new Error("Failed to create booking - no ID returned");
    }


    if (!bookingId) {
      throw new Error("Failed to extract booking ID from response");
    }


    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: buildName,
              description: `Booking for ${guestDetails.adultCount} adult(s), ${guestDetails.childCount} child(ren), ${guestDetails.infantCount} infant(s)`,
            },
            unit_amount: bill * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/booking/cancelled`,
      metadata: {
        bookingId: bookingId,
        experienceId: buildID,
        guestEmail: guestDetails.email,
      },
      customer_email: guestDetails.email,
    });


    return NextResponse.json({
      sessionId: session.id,
      bookingId: bookingId
    });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    return NextResponse.json({
      error: "Error creating checkout session",
      details: err instanceof Error ? err.message : "Unknown error"
    });
  }
}