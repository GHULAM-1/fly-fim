"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AuthCodeErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams?.get('error');

  const defaultMessage = "Sorry, we couldn't sign you in. The link may have expired or already been used.";
  const errorMessage = error ? decodeURIComponent(error) : defaultMessage;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
        <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Authentication Error
        </h1>

        <p className="text-gray-600 mb-6">
          {errorMessage}
        </p>

        <div className="space-y-3">
          <Link
            href="/"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 inline-block"
          >
            Go back to homepage
          </Link>

          <p className="text-sm text-gray-500">
            Try requesting a new sign-in link from the homepage.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthCodeError() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AuthCodeErrorContent />
    </Suspense>
  );
}
