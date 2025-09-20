import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    console.error("No token provided in magic link");
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  try {

    // Call backend to verify magic link token
    const response = await fetch(`${API_BASE_URL}/auth/verify?token=${token}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });


    if (response.ok) {
      // Get all cookies from the response
      const setCookieHeaders = response.headers.getSetCookie?.() || [];
      const singleSetCookieHeader = response.headers.get("set-cookie");

    
      // Backend handles verification and sets cookie
      // Redirect to success page
      const redirectResponse = NextResponse.redirect(`${origin}?auth=success`);

      // Copy all cookies from the backend response
      if (setCookieHeaders.length > 0) {
        setCookieHeaders.forEach((cookie) => {
          redirectResponse.headers.append("Set-Cookie", cookie);
        });
      } else if (singleSetCookieHeader) {
        redirectResponse.headers.set("Set-Cookie", singleSetCookieHeader);
      }

      return redirectResponse;
    } else {
      const errorData = await response.text();
      console.error("Magic link verification failed:", response.status, errorData);
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }
  } catch (error) {
    console.error("Network error during magic link verification:", error);
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }
}