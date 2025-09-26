import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export async function POST(request: NextRequest) {
  try {
    const { email, intendedProvider } = await request.json();

    if (!email || !intendedProvider) {
      return NextResponse.json(
        { error: "Email and intendedProvider are required" },
        { status: 400 }
      );
    }

    // Call backend to check for provider conflicts
    const response = await fetch(`${API_BASE_URL}/auth/check-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        intendedProvider,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to check email" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error checking email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}