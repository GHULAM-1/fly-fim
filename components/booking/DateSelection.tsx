"use client";
import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import CalendarModal from "@/components/booking/CalendarModal";
import { ExperienceResponse } from "@/types/experience/experience-types";
import PriceDisplay from "../PriceDisplay";

interface DateSelectionProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  itemName: string;
  city: string;
  experience?: ExperienceResponse;
}

const DateSelection: React.FC<DateSelectionProps> = ({
  selectedDate,
  onDateSelect,
  itemName,
  city,
  experience,
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [weekDisplay, setWeekDisplay] = useState<any[]>([]);

  const formatDateKey = (date: Date) => date.toISOString().split("T")[0];

  const getPriceForDate = (date: Date) => {
    if (!experience?.data) {
      return experience?.data?.price || 0;
    }

    const dateTimestamp = date.getTime();
    const datePriceRange = experience.data.datePriceRange || [];
    
    // Find specific price for this date
    const specificPrice = datePriceRange.find(range => 
      dateTimestamp >= range.startDate && dateTimestamp <= range.endDate
    );
    
    return specificPrice?.price || experience.data.price || 0;
  };

  const getOldPriceForDate = (date: Date) => {
    if (!experience?.data) return 0;
    return experience.data.oldPrice || 0;
  };

  const generateWeekDays = (centerDate: Date) => {
    const week = [];
    const startDate = new Date(centerDate);
    startDate.setDate(centerDate.getDate() - 2);

    // Show 7 days on desktop, 5 days on mobile (but 7 on very small screens for scroll)
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const isVerySmallScreen = typeof window !== 'undefined' && window.innerWidth < 375;
    const daysToShow = isMobile && !isVerySmallScreen ? 5 : 7;

    for (let i = 0; i < daysToShow; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const price = getPriceForDate(currentDate);
      const oldPrice = getOldPriceForDate(currentDate);
      const hasDiscount = oldPrice > 0 && oldPrice > price;
      
      week.push({
        day: currentDate
          .toLocaleDateString("en-US", { weekday: "short" })
          .toUpperCase(),
        date: currentDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        fullDate: currentDate,
        price: price,
      });
    }
    return week;
  };

  useEffect(() => {
    const center = selectedDate || new Date();
    setWeekDisplay(generateWeekDays(center));
  }, [experience, selectedDate]);

  // Handle window resize to update date display
  useEffect(() => {
    const handleResize = () => {
      const center = selectedDate || new Date();
      setWeekDisplay(generateWeekDays(center));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedDate, experience]);

  const handleDateSelectFromCalendar = (date: Date) => {
    onDateSelect(date);
    setWeekDisplay(generateWeekDays(date));
    setIsCalendarOpen(false);
  };

  return (
    <>
      <section className="mb-10">
        <div>
          <h2 className="text-xl font-heading text-gray-700 mb-1">
            Select a date
          </h2>
          <p className="text-[12px] text-gray-500 font-halyard-text">
            All prices are in {localStorage?.getItem("preferred-currency")}
          </p>
        </div>

        <div className="mt-6">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {weekDisplay.map((d) => {
              const isSelected = selectedDate
                ? formatDateKey(d.fullDate) === formatDateKey(selectedDate)
                : false;

              return (
                <button
                  key={d.date}
                  onClick={() => onDateSelect(d.fullDate)}
                  className={`flex flex-col items-center justify-center md:p-3 px-[2px] py-[16px] md:w-22 w-[calc(100%/6.7)] h-17 md:h-22 flex-shrink-0 transition-colors duration-200 cursor-pointer ${
                    isSelected
                      ? "border-purple-600 bg-purple-100 md:rounded-lg rounded-[4px] border text-purple-800"
                      : "border border-transparent hover:border-gray-400 hover:bg-gray-50 md:rounded-lg rounded-[4px]"
                  }`}
                >
                  <span
                    className={`md:text-sm text-xs uppercase font-halyard-text ${
                      isSelected ? "text-purple-800" : "text-gray-500"
                    }`}
                  >
                    {d.day}
                  </span>
                  <span
                    className={`  font-halyard-text md:text-sm text-xs md:mt-1 mt-0.5 ${
                      isSelected ? "text-purple-800" : "text-[#444444]"
                    }`}
                  >
                    {d.date}
                  </span>
                  <div className="flex flex-col items-center">
                    <span
                      className={`md:text-xs text-[10px] md:mt-1 mt-0.5 font-halyard-text-light ${
                        isSelected ? "text-purple-800" : "text-gray-500"
                      }`}
                    >
                      <PriceDisplay amount={d.price} />
                    </span>
                  </div>
                </button>
              );
            })}

            <button
              onClick={() => setIsCalendarOpen(true)}
              className="flex flex-col items-center justify-center p-1 md:w-22 w-[calc(100%/6)] h-20 flex-shrink-0 transition-colors duration-200 cursor-pointer hover:border-gray-400 hover:bg-gray-50 hover:border hover:rounded-lg"
            >
              <Calendar size={20} className="text-gray-700" />
              <span className="underline font-halyard-text text-[#444444] mt-2 md:text-sm text-xs">
                More 
              </span>
              <span className="underline font-halyard-text text-[#444444]  md:text-sm text-xs">
                 dates
              </span>
            </button>
          </div>
        </div>
      </section>

      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        selectedDate={selectedDate}
        onDateSelect={handleDateSelectFromCalendar}
        itemName={itemName}
        city={city}
        experience={experience || undefined}
      />
    </>
  );
};

export default DateSelection;
