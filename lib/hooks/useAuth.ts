"use client";

import { useEffect, useState } from "react";
import { toast } from "@/components/toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

// Global flag to prevent duplicate toasts
let hasShownSignInToast = false;
let hasShownSignOutToast = false;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status
  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user || userData);

        // Show sign in toast if user was previously null
        if (!user && userData.user && !hasShownSignInToast) {
          hasShownSignInToast = true;
          toast.success("You have successfully signed in!");
          setTimeout(() => {
            hasShownSignInToast = false;
          }, 2000);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();

    // Check for auth success in URL parameters (magic link return)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auth') === 'success') {
      // User returned from magic link verification
      // Remove the query parameter from URL without page reload
      const url = new URL(window.location.href);
      url.searchParams.delete('auth');
      window.history.replaceState({}, document.title, url.toString());

      // Refresh auth state to get the updated user
      setTimeout(() => {
        checkAuth();
      }, 100);
    }

    // Set up periodic auth check (optional)
    const interval = setInterval(checkAuth, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, []);

  const handleSignOut = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/auth/signout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok && !hasShownSignOutToast) {
        hasShownSignOutToast = true;
        toast.success("Signed out successfully");
        setTimeout(() => {
          hasShownSignOutToast = false;
        }, 2000);
      }

      // Clear user state regardless of response
      setUser(null);
      setLoading(false);

      // Redirect to home page
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out error:", error);
      setUser(null);
      setLoading(false);

      // Force redirect even on error
      window.location.href = "/";
    }
  };

  // Function to refresh user data after login
  const refreshUser = () => {
    checkAuth();
  };

  return {
    user,
    loading,
    signOut: handleSignOut,
    refreshUser,
  };
}
