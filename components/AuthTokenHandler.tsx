"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function AuthTokenHandlerInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get("token");
    const authSuccess = searchParams.get("auth");

    if (token && authSuccess === "success") {
      // Store token in localStorage
      localStorage.setItem("authToken", token);

      console.log("[Auth] Token stored successfully");

      // Clean up URL by removing token parameter
      const url = new URL(window.location.href);
      url.searchParams.delete("token");
      url.searchParams.delete("auth");
      router.replace(url.pathname + url.search);
    }
  }, [searchParams, router]);

  return null; // This component doesn't render anything
}

export function AuthTokenHandler() {
  return (
    <Suspense fallback={null}>
      <AuthTokenHandlerInner />
    </Suspense>
  );
}
