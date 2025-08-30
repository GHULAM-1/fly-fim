"use client";
import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const BookingHeader = () => {
  return (
    <header className="pt-24 pb-4">
      <div className="flex justify-between items-center">
        {/* Breadcrumb Navigation */}
        <div className="text-sm text-gray-500 items-center gap-2 hidden sm:flex">
          <span className=" text-gray-800">
            1. Edge Observation Deck Ticke...
          </span>
          <ChevronRight size={16} />
          <span>2. Tickets</span>
          <ChevronRight size={16} />
          <span>3. Confirm & pay</span>
        </div>
        <div className="sm:hidden">
          <Link href="/">
            <img
              src="/images/new-purple-logo.png"
              alt="logo"
              className="w-24 sm:w-32 py-2"
            />
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-sm ">
            Help
          </Button>
          <Button
            variant="outline"
            className="border-gray-300 text-gray-800 text-sm  px-4 py-2"
          >
            Sign in
          </Button>
        </div>
      </div>
    </header>
  );
};

export default BookingHeader;
