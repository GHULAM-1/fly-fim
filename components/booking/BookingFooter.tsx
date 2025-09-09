"use client";
import React from "react";
import { Button } from "@/components/ui/button";

interface BookingFooterProps {
  selectedOptionTitle: string | null;
  selectedDate: string;
  selectedTime: string | null;
}

const BookingFooter: React.FC<BookingFooterProps> = ({
  selectedOptionTitle,
  selectedDate,
  selectedTime,
}) => {
  if (!selectedOptionTitle) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white z-50 border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="text-sm overflow-hidden">
            <h3 className="font-bold font-halyard-text text-[#444444] truncate max-w-[200px] sm:max-w-xs md:max-w-md lg:max-w-lg">
              {selectedOptionTitle}
            </h3>
            <p className="text-gray-500 font-halyard-text-light">
              {selectedDate}
              {selectedTime && `, ${selectedTime}`}
            </p>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-base py-6 px-10 rounded-xl">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingFooter;
