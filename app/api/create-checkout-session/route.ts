import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import stripe from "@/config/stripe";

export async function POST(req: NextRequest) {
  const headersList = await headers();
  const origin = headersList.get("origin") || "";
  const { buildID, buildName, bill } = await req.json();
  
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: buildName,
            },
            unit_amount: bill * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/?payment_success=true`,
      cancel_url: `${origin}/purchase-failed`,
    });
    
    return NextResponse.json({ sessionId: session.id });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Error creating checkout session" });
  }
}