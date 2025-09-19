"use client";
import React, { useState, useEffect, useRef } from "react";
import { Clock, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { ExperienceResponse } from "@/types/experience/experience-types";
import PriceDisplay from "../PriceDisplay";

interface PickATimeProps {
  type: "timed" | "flex";
  selectedOptionTitle: string | null;
  selectedDate: Date | null;
  formattedDate: string;
  experience?: ExperienceResponse;
}

// Generate time slots from experience data
const generateTimeSlots = (experience?: ExperienceResponse) => {
  if (!experience?.data?.packageType?.timePriceSlots) {
    // Fallback to default time slots
    return [
    ];
  }

  return experience.data.packageType.timePriceSlots.map((slot, index) => ({
    time: formatTime(slot.openTime),
    closes: formatTime(slot.closeTime),
    price: slot.price,
  }));
};

// Format time from 24h to 12h format
const formatTime = (time24: string) => {
  const [hours, minutes] = time24.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'pm' : 'am';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes}${ampm}`;
};

const PickATime = React.forwardRef<HTMLDivElement, PickATimeProps>(
  ({ type, selectedOptionTitle, selectedDate, formattedDate, experience }, ref) => {
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(true);
    const [showError, setShowError] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Generate time slots from experience data
    const timeSlots = generateTimeSlots(experience);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    useEffect(() => {
      if (selectedOptionTitle) {
        setIsOpen(true);
        setSelectedTime(null);
        setSelectedPrice(null);
        setShowError(false);
      }
    }, [selectedOptionTitle]);

    const handleNextClick = () => {
      if (
        (type === "timed" && !selectedTime) ||
        (type === "flex" && !selectedOptionTitle)
      ) {
        setShowError(true);
      } else {
        setShowError(false);

        const itemName = searchParams.get("itemName") || "Your Experience";
        const city = searchParams.get("city") || "Your City";

        const query = new URLSearchParams({
          itemName,
          city,
          date: selectedDate ? selectedDate.toISOString() : new Date().toISOString(),
          optionTitle: selectedOptionTitle || "",
          time: selectedTime || "Anytime",
          price: (selectedPrice || 0).toString(),
        });

        router.push(`/booking/confirm?${query.toString()}`);
      }
    };

    if (type === "flex") {
      return (
        <div ref={ref} className="pt-10 max-w-[855px] ">
          <div className="bg-orange-50 text-orange-900 p-4 font-halyard-text-light rounded-lg flex flex-row text-sm mb-6">
            <Clock size={16} className="mr-2" />
            Enter anytime within operating hours: {timeSlots.length > 0 ? `${timeSlots[0].time} - ${timeSlots[0].closes}` : "9:00am - 9:00pm"}
          </div>
          <div className="bg-gray-200 h-[1px] w-full"></div>
          <div className="flex items-center justify-between p-4 rounded-lg">
            <div>
              <p className="font-halyard-text text-[#444444]">
                {selectedOptionTitle}
              </p>
              <p className="font-halyard-text-light text-gray-600">
                {formattedDate}
              </p>
            </div>
            <Button
              onClick={handleNextClick}
              className="cursor-pointer bg-[#8000FF] hover:bg-[#5A00B5] px-12 py-3 h-auto text-base rounded-lg"
            >
              Next
            </Button>
          </div>
          <div className="bg-gray-200 h-[1px] w-full"></div>
        </div>
      );
    }

    return (
      <div ref={ref} className="pt-10 max-w-[855px] ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 items-center">
          <h2 className="text-2xl font-heading text-[#444444] mb-4 md:mb-0">
            Pick a time
          </h2>
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`w-full border rounded-lg px-4 py-3 text-left flex justify-between items-center transition-colors duration-200 ${
                showError ? "border-red-500" : "border-gray-300"
              }`}
            >
              <span className="font-halyard-text text-gray-700">
                {selectedTime || "Select a time slot"}
              </span>
              <ChevronDown
                size={20}
                className={`text-gray-600 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-[21.5rem] overflow-y-auto custom-scrollbar">
                {timeSlots.map((slot, index) => (
                  <div
                    key={slot.time}
                    onClick={() => {
                      setSelectedTime(slot.time);
                      setSelectedPrice(slot.price); 
                      setShowError(false);
                      setIsOpen(false);
                    }}
                    className={`flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                      index !== 0 ? "border-t border-gray-200" : ""
                    }`}
                  >
                    <div>
                      <p className="font-heading text-gray-700">{slot.time}</p>
                      {slot.closes && (
                        <p className="text-xs text-gray-500">
                          Closes at: {slot.closes}
                        </p>
                      )}
                    </div>
                    <span className="text-[#444444] font-halyard-light">
                      <PriceDisplay amount={slot.price} />
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-6 flex justify-between items-center">
          <div>
            <p className="font-halyard-text text-[#444444] ">
              {selectedOptionTitle}
            </p>
            <p className="font-halyard-text-light text-gray-500">
              {formattedDate}
              {selectedTime && `, ${selectedTime}`}
            </p>
          </div>
          <Button
            onClick={handleNextClick}
            className="cursor-pointer bg-[#6A00D5] hover:bg-[#5A00B5] px-12 py-3 h-auto text-base rounded-lg"
          >
            Next
          </Button>
        </div>
        <div className="mt-6 w-full h-[1px] bg-gray-200"></div>
      </div>
    );
  }
);

PickATime.displayName = "PickATime";

export default PickATime;