import React, { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useNavigationStore } from "@/lib/store/navigationStore";

const getMonthName = (monthIndex: number) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[monthIndex];
};

interface CalendarGridProps {
  month: Date;
  selectedDate: Date | null;
  today: Date;
  onDateSelect: (date: Date) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  month,
  selectedDate,
  today,
  onDateSelect,
}) => {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startingDayOfWeek = new Date(year, month, 1).getDay();
    const days: (Date | null)[] = Array(startingDayOfWeek).fill(null);
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };

  const days = getDaysInMonth(month);

  return (
    <div className="px-2">
      <h3 className="text-center text-lg font-heading text-gray-800 mb-4">
        {getMonthName(month.getMonth())} {month.getFullYear()}
      </h3>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-halyard-text-light text-gray-500 py-1"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          if (!date) return <div key={`empty-${index}`} className="h-14"></div>;

          const isPastDate = date < today;
          const isSelected =
            selectedDate?.toDateString() === date.toDateString();
          const price =
            date.getDay() === 5 || date.getDay() === 0 ? 51.17 : 39.2;

          return (
            <button
              key={index}
              disabled={isPastDate}
              onClick={() => onDateSelect(date)}
              className={`h-14 rounded-lg text-sm font-medium relative transition-colors duration-150 font-halyard-text flex flex-col items-center justify-center
                ${
                  isPastDate
                    ? "text-gray-300 cursor-not-allowed"
                    : "hover:bg-purple-50 text-gray-800"
                }
                ${
                  isSelected
                    ? "bg-purple-100 text-purple-700 border border-purple-300"
                    : ""
                }
              `}
            >
              <span>{date.getDate()}</span>
              {!isPastDate && (
                <span
                  className={`text-xs mt-1 ${
                    isSelected ? "text-purple-700" : "text-green-600"
                  }`}
                >
                  ${price.toFixed(2)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  itemName?: string;
  city?: string;
  position?: "center" | "top";
}

const CalendarModal: React.FC<CalendarModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  onDateSelect,
  itemName,
  city,
  position = "center",
}) => {
  const router = useRouter();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleDateSelectionAndNavigate = (date: Date) => {
    onDateSelect(date);
    onClose();

    if (itemName && city) {
      const bookingUrl = `/booking?itemName=${encodeURIComponent(
        itemName
      )}&city=${encodeURIComponent(city)}&date=${date.toISOString()}`;
      router.push(bookingUrl);
    }
  };

  const nextMonth = () =>
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  const prevMonth = () => {
    if (currentMonth <= new Date(today.getFullYear(), today.getMonth(), 1))
      return;
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 h-full bg-black/70 z-[9999] animate-fade-in"
      onClick={onClose}
    >
      <div
        className={cn(
          "w-full h-screen flex justify-center p-4",
          position === "center" && "items-center",
          position === "top" && "items-start pt-28"
        )}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl animate-fade-in duration-300 max-h-[90vh] flex flex-col"
        >
          <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
            <h2 className="text-xl font-heading text-gray-800">
              Select a date
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          <div className="overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4 px-2">
              <button
                onClick={prevMonth}
                disabled={
                  currentMonth <=
                  new Date(today.getFullYear(), today.getMonth(), 1)
                }
                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-x-8">
              <CalendarGrid
                month={currentMonth}
                selectedDate={selectedDate}
                today={today}
                onDateSelect={handleDateSelectionAndNavigate}
              />
              <CalendarGrid
                month={
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() + 1,
                    1
                  )
                }
                selectedDate={selectedDate}
                today={today}
                onDateSelect={handleDateSelectionAndNavigate}
              />
            </div>
          </div>

          <div className="mt-auto p-4 border-t sticky bottom-0 bg-white z-10">
            <p className="text-xs text-gray-500 text-center">
              All prices are in USD ($)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CalendarModal;
