import { NextRequest, NextResponse } from "next/server";
import stripe from "@/config/stripe";
import { updateBookingStatus } from "@/api/bookings/bookings-api";

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    // Retrieve the session from Stripe to get the booking metadata
    const session = await stripe.checkout.sessions.retrieve(sessionId);


    if (session.payment_status !== 'paid') {
      return NextResponse.json({
        error: "Payment not completed",
        payment_status: session.payment_status
      }, { status: 400 });
    }

    const bookingId = session.metadata?.bookingId;

    if (!bookingId) {
      console.error("❌ No booking ID found in session metadata");
      console.error("📋 Available metadata:", session.metadata);
      return NextResponse.json({ error: "No booking ID found in session" }, { status: 400 });
    }


    // Update booking status to confirmed
    const updateResult = await updateBookingStatus(bookingId, "confirmed", session.id);

    return NextResponse.json({
      success: true,
      bookingId,
      sessionId: session.id,
      updateResult
    });

  } catch (error) {
    console.error("❌ Error updating booking status:", error);
    return NextResponse.json(
      {
        error: "Failed to update booking status",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}