"use client";
import React from "react";
import Link from "next/link";
import { ChevronRight, Star } from "lucide-react";

const ProductHeader = () => {
  return (
    <div className="pt-20 md:pt-28 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-28 max-w-screen-2xl mx-auto">
      <div className="hidden sm:flex items-center gap-2">
        <Link href="/" className="underline text-gray-600 text-sm">
          Home
        </Link>
        <ChevronRight size={16} strokeWidth={1} className="text-gray-600" />
        <Link href="/things-to-do" className="underline text-gray-600 text-sm">
          Things to do in London
        </Link>
        <ChevronRight size={16} strokeWidth={1} className="text-gray-600" />
        <Link
          href="/things-to-do/london"
          className="underline text-gray-600 text-sm"
        >
          Tickets
        </Link>
        <ChevronRight size={16} strokeWidth={1} className="text-gray-600" />
        <Link
          href="/things-to-do/london/tickets/london-eye"
          className="text-gray-600 text-sm"
        >
          Museums
        </Link>
      </div>
      <h1 className="text-xs sm:hidden">TICKETS</h1>
      <div className="flex flex-col-reverse sm:flex-col mt-4 sm:gap-2">
        <div className="flex items-center gap-2">
          <span>COMBOS</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Star size={16} fill="currentColor" className="text-pink-600" />
            <span className="text-pink-500 font-semibold ml-1">
              4.4 (47,554)
            </span>
          </div>
        </div>
        <h2 className="text-lg sm:text-2xl font-semibold md:font-bold text-gray-700">
          Combo (Save 15%): London Eye Tickets + Thames River Cruise
        </h2>
      </div>
    </div>
  );
};

export default ProductHeader;
