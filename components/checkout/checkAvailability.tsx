"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import CalendarModal from "@/components/booking/CalendarModal";
import { useNavigationStore } from "@/lib/store/navigationStore";
import { ExperienceResponse } from "@/types/experience/experience-types";
import PriceDisplay from "../PriceDisplay";

interface AvailabilityCheckerProps {
  itemName: string;
  city: string;
  experience?: ExperienceResponse;
}

const AvailabilityChecker: React.FC<AvailabilityCheckerProps> = ({
  itemName,
  city,
  experience,
}) => {
  const router = useRouter();
  const params = useParams();
  const { isModalOpen: isCalendarOpen, setIsModalOpen: setIsCalendarOpen } =
    useNavigationStore();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Calculate discount percentage automatically
  console.log(experience);
  const price = experience?.data?.price || 0;
  const oldPrice = experience?.data?.oldPrice || 0;
  const calculatedOff =
    oldPrice && price && oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : experience?.data?.sale || 0;

  useEffect(() => {
    setSelectedDate(null);
  }, []);

  // Handle modal open/close for scroll adjustment
  useEffect(() => {
    if (isCalendarOpen) {
      // Only scroll up if carousel is visible in viewport
      const carouselElement =
        document.querySelector("[data-carousel-grid]") ||
        document.querySelector(".mb-6.md\\:mb-10.z-0") ||
        document.getElementById("checkout-section");

      if (carouselElement) {
        const carouselRect = carouselElement.getBoundingClientRect();

        // Only scroll up if carousel is currently visible in viewport
        if (carouselRect.top < window.innerHeight && carouselRect.bottom > 0) {
          const currentScrollY = window.scrollY;
          const scrollUpAmount = 150; // Scroll up by 150px
          const scrollTarget = Math.max(0, currentScrollY - scrollUpAmount);

          window.scrollTo({
            top: scrollTarget,
            behavior: "smooth",
          });
        }
      }
    }
  }, [isCalendarOpen]);

  const formatDate = (date: Date | null) => {
    if (!date) return "Select a date";
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setIsCalendarOpen(false);

    // Redirect to booking page with selected date
    const dateString = date.toISOString();
    const categoryName = params.category as string;
    const subcategory = params.subcategory as string;
    const itemId = params.itemId as string;

    const bookingUrl = `/booking?itemName=${encodeURIComponent(
      itemName
    )}&city=${encodeURIComponent(city)}&category=${encodeURIComponent(
      categoryName
    )}&subcategory=${encodeURIComponent(
      subcategory
    )}&itemId=${encodeURIComponent(itemId)}&date=${dateString}`;

    router.push(bookingUrl);
  };

  return (
    <>
      <div className="relative">
        <div className="w-full max-w-sm bg-white rounded-lg p-4 border border-gray-200">
          <div className="mb-4">
            <div className="text-gray-500 text-sm font-halyard-text">
              from{" "}
              {oldPrice > 0 && (
                <span className="line-through">
                  <PriceDisplay amount={oldPrice} />
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
                <span className="text-3xl font-halyard-text font-bold text-[#444444]">
                  <PriceDisplay amount={price} />
                </span>
              {calculatedOff > 0 && (
                <span className="bg-green-600 text-white text-xs font-semibold font-halyard-text rounded px-2 py-1">
                  {calculatedOff}% off
                </span>
              )}
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
        onDateSelect={handleDateSelect}
        itemName={itemName}
        city={city}
        position="top"
        experience={experience}
      />
    </>
  );
};

export default AvailabilityChecker;
