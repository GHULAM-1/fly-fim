"use client";
import React from "react";
import DateSelection from "@/components/booking/DateSelection";
import TicketOptions from "@/components/booking/TicketOptions";
import Stats from "@/components/home/Stats";
import Footer from "@/components/Footer"; 

const BookingPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <main className="py-24">
          <DateSelection />
          <TicketOptions />
        </main>
      </div>
      <div className="px-4 sm:px-6 lg:px-8">
        <Stats />
        <Footer />
      </div>
    </div>
  );
};

export default BookingPage;
