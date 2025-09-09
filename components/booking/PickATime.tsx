"use client";
import React, { useState, useEffect, useRef } from "react";
import { Clock, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

interface PickATimeProps {
  type: "timed" | "flex";
  selectedOptionTitle: string | null;
  selectedDate: Date | null;
  formattedDate: string;
}

const timeSlots = [
  { time: "9:00am", closes: "11:00pm", price: 71.68 },
  { time: "9:20am", closes: "11:00pm", price: 71.68 },
  { time: "9:30am", closes: "11:00pm", price: 71.68 },
  { time: "9:50am", closes: "11:00pm", price: 71.68 },
  { time: "10:00am", closes: "11:00pm", price: 71.68 },
  { time: "10:20am", closes: "11:00pm", price: 71.68 },
  { time: "10:30am", closes: "11:00pm", price: 71.68 },
  { time: "7:50pm", price: 57.71 },
  { time: "8:00pm", price: 57.71 },
  { time: "8:20pm", price: 39.2 },
];

const PickATime = React.forwardRef<HTMLDivElement, PickATimeProps>(
  ({ type, selectedOptionTitle, selectedDate, formattedDate }, ref) => {
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(true);
    const [showError, setShowError] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

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
          price: `$${(selectedPrice || 0).toFixed(2)}`,
        });

        router.push(`/booking/confirm?${query.toString()}`);
      }
    };

    if (type === "flex") {
      return (
        <div ref={ref} className="pt-10 max-w-[855px] ">
          <div className="bg-orange-50 text-orange-900 p-4 font-halyard-text-light rounded-lg flex flex-row text-sm mb-6">
            <Clock size={16} className="mr-2" />
            Enter anytime within operating hours: 9:00am - 9:00pm
          </div>
          <div className="bg-gray-200 h-[1px] w-full"></div>
          <div className="flex items-center justify-between p-4 rounded-lg">
            <div>
              <p className="font-halyard-text text-gray-800">
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
          <h2 className="text-2xl font-heading text-gray-800 mb-4 md:mb-0">
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
                    <span className="text-gray-800 font-halyard-light">
                      ${slot.price}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-6 flex justify-between items-center">
          <div>
            <p className="font-halyard-text text-gray-800 ">
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