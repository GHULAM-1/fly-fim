"use client";
import React, { useRef, useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  ArrowLeft,
  CircleHelp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useCalendarState } from "@/lib/hooks/useCalendarState";
import { ExperienceResponse } from "@/types/experience/experience-types";
import PriceDisplay from "../PriceDisplay";

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
  experience?: ExperienceResponse;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  month,
  selectedDate,
  today,
  onDateSelect,
  experience,
}) => {
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const monthIndex = date.getMonth();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const startingDayOfWeek = new Date(year, monthIndex, 1).getDay();
    const days: (Date | null)[] = Array(startingDayOfWeek).fill(null);
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, monthIndex, day));
    }
    return days;
  };

  const days = getDaysInMonth(month);

  return (
    <div className="grid grid-cols-7 gap-1 z-50">
      {days.map((date, index) => {
        if (!date) return <div key={`empty-${index}`} className="h-14"></div>;
        const isPastDate = date < today;
        const isSelected = selectedDate?.toDateString() === date.toDateString();
        // Get price from datePriceRange based on selected date
        const getPriceForDate = (date: Date) => {
          if (!experience?.data?.datePriceRange || experience.data.datePriceRange.length === 0) {
            return experience?.data?.price || 0;
          }

          // Create date at start of day for comparison
          const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
          const dateTime = dateOnly.getTime();

          const priceRange = experience.data.datePriceRange.find(range => {
            // Convert timestamps to date-only for comparison
            const startDate = new Date(range.startDate);
            const endDate = new Date(range.endDate);
            const startTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime();
            const endTime = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()).getTime();

            return dateTime >= startTime && dateTime <= endTime;
          });

          return priceRange ? priceRange.price : null;
        };

        const price = getPriceForDate(date);

        return (
          <button
            key={index}
            disabled={isPastDate}
            onClick={() => onDateSelect(date)}
            className={cn(
              "h-14 rounded-lg hover:cursor-pointer text-sm font-medium relative transition-colors duration-150 flex flex-col items-center justify-center",
              isPastDate
                ? "text-gray-300 cursor-not-allowed"
                : "hover:bg-purple-50 text-[#444444]",
              isSelected &&
                "bg-purple-100 text-purple-700 border border-purple-600"
            )}
          >
            <span>{date.getDate()}</span>
            {!isPastDate && price !== null && (
              <span
                className={cn(
                  "text-xs mt-1",
                  isSelected ? "text-purple-700" : "text-green-600"
                )}
              >
                <PriceDisplay amount={price} />
              </span>
            )}
          </button>
        );
      })}
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
  experience?: ExperienceResponse;
}

const CalendarModal: React.FC<CalendarModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  onDateSelect,
  itemName,
  city,
  position = "center",
  experience,
}) => {
  const router = useRouter();
  const { setCalendarOpen } = useCalendarState();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setCalendarOpen(true);
    } else {
      setCalendarOpen(false);
    }
    return () => {
      document.body.style.overflow = "unset";
      setCalendarOpen(false);
    };
  }, [isOpen, setCalendarOpen]);

  const handleDateSelect = (date: Date) => {
    onDateSelect(date);
    onClose();
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

  const monthsToRender = Array.from(
    { length: 12 },
    (_, i) => new Date(today.getFullYear(), today.getMonth() + i, 1)
  );
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (!isOpen) return null;

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent
          bgClass="bg-white"
          className="h-[65vh] mt-0 rounded-4xl flex flex-col"
        >
          <div className="sticky top-0 bg-gray-1100 z-20 p-2 border-b">
            <div className="grid grid-cols-7 gap-1">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="text-center text-lg font-heading text-gray-400 py-1"
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-y-auto flex-1 p-4">
            {monthsToRender.map((month) => (
              <div key={month.toString()} className="mb-6">
                <h3 className="text-center text-lg font-bold text-gray-700 mb-4">
                  {getMonthName(month.getMonth())} {month.getFullYear()}
                </h3>
                <CalendarGrid
                  month={month}
                  selectedDate={selectedDate}
                  today={today}
                  onDateSelect={handleDateSelect}
                  experience={experience}
                />
              </div>
            ))}
          </div>

          <div className="p-4 border-t text-center text-xs text-gray-700">
            All prices are in {localStorage?.getItem("preferred-currency")}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <div
      className="fixed inset-0 h-full bg-black/70 animate-fade-in"
      onClick={onClose}
      style={{ zIndex: 999999 }}
    >
      <div
        className={cn(
          "w-full h-screen flex justify-center p-4",
          "items-start pt-20 lg:items-end 3xl:items-center lg:pt-0"
        )}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl animate-fade-in duration-300 max-h-[75vh] flex flex-col relative"
          style={{ zIndex: 1000000 }}
        >
          <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
            <h2 className="text-xl font-heading text-[#444444]">
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
              <div className="px-2">
                <h3 className="text-center text-lg font-bold text-[#444444] mb-4">
                  {getMonthName(currentMonth.getMonth())}{" "}
                  {currentMonth.getFullYear()}
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
                <CalendarGrid
                  month={currentMonth}
                  selectedDate={selectedDate}
                  today={today}
                  onDateSelect={handleDateSelect}
                  experience={experience}
                />
              </div>
              <div className="px-2">
                <h3 className="text-center text-lg font-bold text-[#444444] mb-4">
                  {getMonthName((currentMonth.getMonth() + 1) % 12)}{" "}
                  {currentMonth.getMonth() === 11
                    ? currentMonth.getFullYear() + 1
                    : currentMonth.getFullYear()}
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
                  onDateSelect={handleDateSelect}
                  experience={experience}
                />
              </div>
            </div>
          </div>

          <div className="mt-auto p-4 border-t sticky bottom-0 bg-white z-10">
            <p className="text-xs text-gray-500 text-center">
              All prices are in {localStorage?.getItem("preferred-currency")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;
