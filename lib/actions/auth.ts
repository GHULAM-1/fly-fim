"use server";

import { redirect } from "next/navigation";
import {
  signUpSchema,
  signInSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  otpSchema,
  type SignUpInput,
  type SignInInput,
  type ForgotPasswordInput,
  type ResetPasswordInput,
  type OtpInput,
} from "@/lib/validations/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export async function signUp(data: SignUpInput) {
  const validatedFields = signUpSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        error: result.error || "Failed to create account",
      };
    }

    return {
      success: result.message || "Account created successfully",
    };
  } catch (error) {
    return {
      error: "Network error occurred",
    };
  }
}

export async function signIn(data: SignInInput) {
  const validatedFields = signInSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        error: result.error || "Invalid email or password",
      };
    }

    redirect("/");
  } catch (error) {
    return {
      error: "Network error occurred",
    };
  }
}

export async function signInWithMagicLink(email: string) {
  if (!email || !email.includes("@")) {
    return {
      error: "Please enter a valid email address",
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/send-magic-link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email,
        redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/verify`,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        error: result.error || "Failed to send magic link",
      };
    }

    return {
      success: result.message || "Check your email for the sign-in link",
    };
  } catch (error) {
    return {
      error: "Network error occurred",
    };
  }
}



export async function handleGoogleCallback(code: string, redirectUri?: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        provider: 'google',
        code,
        redirectUri: redirectUri || `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.error || 'Authentication failed'
      };
    }

    return {
      success: 'Signed in successfully',
      user: data.user
    };

  } catch (error) {
    return {
      error: 'Network error during authentication'
    };
  }
}

export async function signOut() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        error: result.error || "Failed to sign out",
      };
    }

    redirect("/");
  } catch (error) {
    return {
      error: "Network error occurred",
    };
  }
}

export async function forgotPassword(data: ForgotPasswordInput) {
  const validatedFields = forgotPasswordSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: "Invalid email",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email } = validatedFields.data;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email,
        redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/reset-password`,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        error: result.error || "Failed to send reset email",
      };
    }

    return {
      success: result.message || "Check your email for password reset instructions",
    };
  } catch (error) {
    return {
      error: "Network error occurred",
    };
  }
}
