"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { toast } from "@/components/toast";

// Global flag to prevent duplicate toasts
let hasShownSignInToast = false;
let hasShownSignOutToast = false;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      setUser(session?.user ?? null);
      setLoading(false);

      // Show success toast on successful sign in (only once)
      if (event === "SIGNED_IN" && session?.user && !hasShownSignInToast) {
        hasShownSignInToast = true;
        toast.success("You have successfully signed in!");
        // Reset flag after a delay to allow for future sign-ins
        setTimeout(() => {
          hasShownSignInToast = false;
        }, 2000);
      }

      // If user signed out, ensure we clear the state immediately
      if (event === "SIGNED_OUT" && !hasShownSignOutToast) {
        setUser(null);
        hasShownSignOutToast = true;
        toast.success("Signed out successfully");
        // Reset flag after a delay
        setTimeout(() => {
          hasShownSignOutToast = false;
        }, 2000);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Sign out error:", error);
      }

      // Ensure immediate state update
      setUser(null);
      setLoading(false);

      // Force page reload as backup
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error("Sign out error:", error);
      setUser(null);
      setLoading(false);
      window.location.reload();
    }
  };

  return {
    user,
    loading,
    signOut: handleSignOut,
  };
}
