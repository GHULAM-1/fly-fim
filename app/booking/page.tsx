"use client";
import React from 'react';
import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";
import DateSelection from "@/components/booking/DateSelection";
import TicketOptions from "@/components/booking/TicketOptions";
import PickATime from "@/components/booking/PickATime";
import Stats from "@/components/home/Stats";
import Footer from "@/components/Footer";

const BookingPage = () => {
  const searchParams = useSearchParams();

  const initialDate = searchParams.get("date")
    ? new Date(searchParams.get("date")!)
    : new Date();
  const itemName =
    searchParams.get("itemName") || "Edge Observation Deck Ticket";
  const city = searchParams.get("city") || "london";
  const category = searchParams.get("category") || "entertainment";
  const subcategory = searchParams.get("subcategory") || "studio-tours";
  const item = searchParams.get("itemId") || "default-item";

  const itemLink = `/things-to-do/${city}/${category}/${subcategory}/${item}`;

  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate);
  const [selectedOption, setSelectedOption] = useState<{
    id: string;
    title: string;
    type: "timed" | "flex";
  } | null>(null);
  const [showTimeSelection, setShowTimeSelection] = useState(false);
  const timeSelectionRef = useRef<HTMLDivElement>(null);

  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : "No date selected";

  const handleOptionSelect = (
    id: string,
    title: string,
    type: "timed" | "flex"
  ) => {
    if (selectedOption && selectedOption.id === id) {
      setSelectedOption(null);
      setShowTimeSelection(false);
    } else {
      setSelectedOption({ id, title, type });
      setShowTimeSelection(true);
    }
  };

  useEffect(() => {
    if (showTimeSelection && timeSelectionRef.current) {
      setTimeout(() => {
        const elementTop =
          timeSelectionRef.current?.getBoundingClientRect().top ?? 0;
        // Adjust header offset for mobile vs desktop
        const headerOffset = window.innerWidth < 768 ? 80 : 120;
        const scrollPosition = window.scrollY + elementTop - headerOffset;

        window.scrollTo({
          top: scrollPosition,
          behavior: "smooth",
        });
      }, 100);
    }
  }, [selectedOption?.id, showTimeSelection]);

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 w-full bg-white z-50 border-b border-gray-200">
        <div className="w-full px-4 sm:px-6">
          <div className="flex justify-between items-center max-w-[1200px] mx-auto h-16 md:h-20">
            <div className="flex flex-row gap-4 md:gap-10 items-center overflow-hidden">
              <Link href="/">
                <img
                  src="/images/new-purple-logo.png"
                  alt="logo"
                  className="w-24 shrink-0"
                />
              </Link>
              <div className="text-xs text-gray-500 font-halyard-text-light items-center gap-2 hidden sm:flex">
                <Link
                  href={itemLink}
                  className="text-gray-800 hover:text-purple-600 hover:underline cursor-pointer truncate"
                  title={itemName}
                >
                  1. {itemName.substring(0, 25)}
                  {itemName.length > 25 ? "..." : ""}
                </Link>
                <ChevronRight size={16} />
                <span className="font-medium text-gray-900 cursor-default">
                  2. Tickets
                </span>
                <ChevronRight size={16} />
                <span className="text-gray-400 cursor-default">
                  3. Confirm & pay
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 md:gap-6 font-halyard-text-light">
              <Link
                href="/help"
                className="text-sm flex items-center gap-1 hover:text-purple-600"
              >
                <CircleHelp strokeWidth={1.5} size={18} />
                <span className="hidden md:inline">Help</span>
              </Link>
              <Button
                variant="outline"
                className="border-gray-300 text-xs px-3 py-1.5 h-auto"
              >
                Sign in
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 md:pt-28 pb-32 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <DateSelection
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          itemName={itemName}
          city={city}
        />
        <TicketOptions
          selectedOptionId={selectedOption?.id || null}
          onOptionSelect={handleOptionSelect}
        />
        {showTimeSelection && selectedOption && (
          <PickATime
            ref={timeSelectionRef}
            type={selectedOption.type}
            selectedOptionTitle={selectedOption.title}
            selectedDate={selectedDate}
            formattedDate={formattedDate}
          />
        )}
      </main>
      <div className="px-4 sm:px-6 lg:px-8">
        <Stats />
        <Footer />
      </div>
    </div>
  );
};

export default BookingPage 