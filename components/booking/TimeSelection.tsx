"use client";
import React from "react";
import { Calendar } from "lucide-react";

interface DateSelectionProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onMoreDatesClick: () => void;
}

const DateSelection: React.FC<DateSelectionProps> = ({
  selectedDate,
  onDateSelect,
  onMoreDatesClick,
}) => {
  const formatDateKey = (d: Date) => d.toISOString().split("T")[0];
  const selectedDateKey = selectedDate ? formatDateKey(selectedDate) : null;

  const dates = [
    { day: "Fri", date: new Date(2025, 8, 19), price: "$39.2" },
    { day: "Sat", date: new Date(2025, 8, 20), price: "$39.2" },
    { day: "Sun", date: new Date(2025, 8, 21), price: "$39.2" },
    { day: "Mon", date: new Date(2025, 8, 22), price: "$39.2" },
    { day: "Tue", date: new Date(2025, 8, 23), price: "$39.2" },
    { day: "Wed", date: new Date(2025, 8, 24), price: "$39.2" },
    { day: "Thu", date: new Date(2025, 8, 25), price: "$39.2" },
  ];

  const getMonthAndDay = (d: Date) => {
    const month = d.toLocaleDateString("en-US", { month: "short" });
    const day = d.getDate();
    return `${month} ${day}`;
  };

  return (
    <section className="mb-10">
      <div>
        <h2 className="text-2xl font-bold text-[#444444] mb-1">Select a date</h2>
        <p className="text-sm text-gray-500">All prices are in USD ($)</p>
      </div>
      <div className="mt-4">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {dates.map((d) => {
            const isSelected = selectedDateKey === formatDateKey(d.date);
            return (
              <button
                key={d.date.toString()}
                onClick={() => onDateSelect(d.date)}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border w-24 flex-shrink-0 transition-colors duration-200 h-[88px] ${
                  isSelected
                    ? "border-[#7f00fe] bg-[#f2e6ff] text-[#7f00fe]"
                    : "border-gray-300 bg-white text-gray-700 hover:border-purple-300"
                }`}
              >
                <span
                  className={`text-xs font-medium ${
                    isSelected ? "text-[#7f00fe]" : "text-gray-500"
                  }`}
                >
                  {d.day}
                </span>
                <span
                  className={`font-semibold mt-1 text-sm ${
                    isSelected ? "text-[#7f00fe]" : "text-gray-900"
                  }`}
                >
                  {getMonthAndDay(d.date)}
                </span>
                <span
                  className={`text-xs mt-1 ${
                    isSelected ? "text-[#7f00fe]" : "text-gray-600"
                  }`}
                >
                  {d.price}
                </span>
              </button>
            );
          })}
          <button
            onClick={onMoreDatesClick}
            className="flex flex-col items-center justify-center p-3 rounded-lg border border-gray-300 bg-white w-24 flex-shrink-0 hover:border-purple-300 transition-colors duration-200 h-[88px]"
          >
            <Calendar size={20} className="text-[#23a1b2]" />
            <span className="text-xs font-medium mt-2 text-[#23a1b2]">
              More dates
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default DateSelection;
