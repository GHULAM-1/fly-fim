import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token = searchParams.get("token");
  const error = searchParams.get("error");
  const next = searchParams.get("next") ?? "/";

  // Handle OAuth error
  if (error) {
    console.error("OAuth error:", error);
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  // Handle magic link token verification
  if (token) {
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
        // Backend handles verification and sets cookie
        // Redirect to success page
        const redirectResponse = NextResponse.redirect(`${origin}?auth=success`);

        // Copy the authToken cookie from the backend response
        const setCookieHeader = response.headers.get("set-cookie");
        if (setCookieHeader) {
          redirectResponse.headers.set("Set-Cookie", setCookieHeader);
        }

        return redirectResponse;
      } else {
        console.error("Magic link verification failed");
        return NextResponse.redirect(`${origin}/auth/auth-code-error`);
      }
    } catch (error) {
      console.error("Network error during magic link verification:", error);
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }
  }

  // Handle Google OAuth code
  if (code) {
    try {
      // Call your Express server auth endpoint
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          provider: "google",
          code,
          redirectUri: `${process.env.NEXT_PUBLIC_SITE_URL || origin}/auth/callback`,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Create a response that will redirect to the desired page
        const forwardedHost = request.headers.get("x-forwarded-host");
        const isLocalEnv = process.env.NODE_ENV === "development";

        let redirectUrl: string;
        if (isLocalEnv) {
          redirectUrl = `${origin}${next}`;
        } else if (forwardedHost) {
          redirectUrl = `https://${forwardedHost}${next}`;
        } else {
          redirectUrl = `${origin}${next}`;
        }

        // Create response with redirect
        const redirectResponse = NextResponse.redirect(redirectUrl);

        // Copy the authToken cookie from the backend response
        const setCookieHeader = response.headers.get("set-cookie");
        if (setCookieHeader) {
          redirectResponse.headers.set("Set-Cookie", setCookieHeader);
        }

        return redirectResponse;
      } else {
        console.error("Authentication failed:", data.error || data.message);

        // Pass error message to auth error page via URL params
        const errorMessage = encodeURIComponent(data.message || data.error || "Authentication failed");
        return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${errorMessage}`);
      }
    } catch (error) {
      console.error("Network error during authentication:", error);
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }
  }

  // No code parameter, redirect to error
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
