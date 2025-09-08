"use client";
import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import CalendarModal from "@/components/booking/CalendarModal";

interface DateSelectionProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  itemName: string;
  city: string;
}

const DateSelection: React.FC<DateSelectionProps> = ({
  selectedDate,
  onDateSelect,
  itemName,
  city,
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [weekDisplay, setWeekDisplay] = useState<any[]>([]);

  const formatDateKey = (date: Date) => date.toISOString().split("T")[0];

  const generateWeekDays = (centerDate: Date) => {
    const week = [];
    const startDate = new Date(centerDate);
    startDate.setDate(centerDate.getDate() - 2);

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      week.push({
        day: currentDate
          .toLocaleDateString("en-US", { weekday: "short" })
          .toUpperCase(),
        date: currentDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        fullDate: currentDate,
        price: "$39.2",
      });
    }
    return week;
  };

  useEffect(() => {
    const center = selectedDate || new Date();
    setWeekDisplay(generateWeekDays(center));
  }, []);

  const handleDateSelectFromCalendar = (date: Date) => {
    onDateSelect(date);
    setWeekDisplay(generateWeekDays(date));
    setIsCalendarOpen(false);
  };

  return (
    <>
      <section className="mb-10">
        <div>
          <h2 className="text-xl font-heading   text-gray-800 mb-1">
            Select a date
          </h2>
          <p className="text-[12px] text-gray-500 font-halyard-text">
            All prices are in USD ($)
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
                  className={`flex flex-col items-center justify-center p-3 w-22 h-22 flex-shrink-0 transition-colors duration-200 cursor-pointer ${
                    isSelected
                      ? "border-purple-600 bg-purple-100 rounded-lg border text-purple-800"
                      : "border border-transparent hover:border-gray-400 hover:bg-gray-50 rounded-lg"
                  }`}
                >
                  <span
                    className={`text-sm uppercase font-halyard-text ${
                      isSelected ? "text-purple-800" : "text-gray-500"
                    }`}
                  >
                    {d.day}
                  </span>
                  <span
                    className={`  font-halyard-text mt-1 ${
                      isSelected ? "text-purple-800" : "text-gray-800"
                    }`}
                  >
                    {d.date}
                  </span>
                  <span
                    className={`text-xs mt-1 font-halyard-text-light ${
                      isSelected ? "text-purple-800" : "text-gray-500"
                    }`}
                  >
                    {d.price}
                  </span>
                </button>
              );
            })}

            <button
              onClick={() => setIsCalendarOpen(true)}
              className="flex flex-col items-center justify-center p-1 w-22 h-20 flex-shrink-0 transition-colors duration-200 cursor-pointer hover:border-gray-400 hover:bg-gray-50 hover:border hover:rounded-lg"
            >
              <Calendar size={20} className="text-gray-700" />
              <span className="underline font-halyard-text text-gray-800 mt-2 text-sm">
                More 
              </span>
              <span className="underline font-halyard-text text-gray-800  text-sm">
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
      />
    </>
  );
};

export default DateSelection;
