"use client";

import React, { useState } from "react";
import CalendarModal from "@/components/booking/CalendarModal";

interface AvailabilityCheckerProps {
  itemName: string;
  city: string;
}

const AvailabilityChecker: React.FC<AvailabilityCheckerProps> = ({
  itemName,
  city,
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateSelectForDisplay = (date: Date) => {
    setSelectedDate(date);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Select a date";
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <>
      <div className="relative">
        <div className="w-full max-w-sm bg-white rounded-lg p-4 border border-gray-200">
          <div className="mb-4">
            <div className="text-gray-500 text-sm font-halyard-text">
              from <span className="line-through">€55</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-3xl font-halyard-text font-bold text-gray-900">
                €49.50
              </span>
              <span className="bg-green-600 text-white text-xs font-semibold font-halyard-text rounded px-2 py-1">
                10% off
              </span>
            </div>
          </div>

          <div className="mb-4">
            <button
              onClick={() => setIsCalendarOpen(true)}
              className="w-full rounded-lg border border-gray-300 text-left flex items-center overflow-hidden hover:border-gray-400 transition-colors duration-150 cursor-pointer hover:shadow-2xl"
            >
              <span className="text-sm text-gray-600 font-halyard-text py-3 px-4 flex-1">
                {formatDate(selectedDate)}
              </span>
              <div className="bg-gray-100 h-12 flex items-center justify-center px-3">
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </button>
          </div>

          <button
            onClick={() => setIsCalendarOpen(true)}
            className="w-full py-3 bg-purple-600 text-white font-semibold font-halyard-text rounded-xl text-base hover:bg-purple-700 transition-colors duration-200 cursor-pointer"
          >
            Check availability
          </button>
        </div>
      </div>

      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        selectedDate={selectedDate}
        onDateSelect={handleDateSelectForDisplay}
        itemName={itemName}
        city={city}
      />
    </>
  );
};

export default AvailabilityChecker;
