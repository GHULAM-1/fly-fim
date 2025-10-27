import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export async function GET(request: NextRequest) {
  const { searchParams, origin: urlOrigin } = new URL(request.url);
  const code = searchParams.get("code");
  const token = searchParams.get("token");
  const error = searchParams.get("error");
  const next = searchParams.get("next") ?? "/";

  // Get the actual origin from environment variable or construct from headers
  const origin = process.env.NEXT_PUBLIC_SITE_URL ||
                 (request.headers.get('x-forwarded-proto') && request.headers.get('x-forwarded-host')
                   ? `${request.headers.get('x-forwarded-proto')}://${request.headers.get('x-forwarded-host')}`
                   : urlOrigin);

  console.log('[Callback Debug] request.url:', request.url);
  console.log('[Callback Debug] urlOrigin:', urlOrigin);
  console.log('[Callback Debug] computed origin:', origin);
  console.log('[Callback Debug] code:', code);

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
      console.log('[OAuth Debug] API_BASE_URL:', API_BASE_URL);
      console.log('[OAuth Debug] redirectUri:', `${origin}/auth/callback`);
      console.log('[OAuth Debug] origin:', origin);

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
          redirectUri: `${origin}/auth/callback`,
        }),
      });

      const data = await response.json();
      console.log('[OAuth Debug] Backend response:', data);

      if (response.ok && data.success) {
        // Create a response that will redirect to the desired page
        const forwardedHost = request.headers.get("x-forwarded-host");
        const isLocalEnv = process.env.NODE_ENV === "development";

        let baseRedirectUrl: string;
        if (isLocalEnv) {
          baseRedirectUrl = `${origin}${next}`;
        } else if (forwardedHost) {
          baseRedirectUrl = `https://${forwardedHost}${next}`;
        } else {
          baseRedirectUrl = `${origin}${next}`;
        }

        // Pass token via URL for client-side storage (cross-domain workaround)
        const separator = baseRedirectUrl.includes('?') ? '&' : '?';
        const redirectUrl = `${baseRedirectUrl}${separator}token=${data.token}&auth=success`;

        // Create response with redirect
        const redirectResponse = NextResponse.redirect(redirectUrl);

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
