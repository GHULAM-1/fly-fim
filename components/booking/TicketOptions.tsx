"use client";
import React, { useState, useRef } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";

const TicketOptions = () => {
  const [selectedOption, setSelectedOption] = useState("champagne");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const options = [
    {
      id: "timed",
      title: "General Admission: Timed Entry",
      price: "$39.20",
      features: [
        "Entry to Edge Observatory Deck at the time slot selected",
        "Access to:",
      ],
      subFeatures: [
        "Indoor observation deck on Level 100",
        "Outdoor sky deck with angled walls",
        "Glass Floor, Skyline Steps, and Eastern Point",
      ],
    },
    {
      id: "champagne",
      title: "General Admission: Timed Entry + Champagne Experience",
      price: "$61.88",
      features: [
        "A glass of bubbly",
        "Entry to Edge Observatory Deck at the time slot selected",
        "Access to:",
      ],
      subFeatures: [
        "Indoor observation deck on Level 100",
        "Outdoor sky deck with angled walls",
        "Glass Floor, Skyline Steps, and Eastern Point",
      ],
    },
    {
      id: "flex",
      title: "Flex Pass: Enter Anytime",
      price: "$78.39",
      features: [
        "Entry to Edge Observatory Deck anytime within operating hours",
        "Access to:",
      ],
      subFeatures: [
        "Indoor observation deck on Level 100",
        "Outdoor sky deck with angled walls",
        "Glass Floor, Skyline Steps, and Eastern Point",
      ],
    },
    // Add more options if needed
  ];

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section>
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-2xl text-gray-800">What do you prefer?</h2>
        <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-md flex items-center gap-1">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.5 13.91H13.5V0.91H0.5V13.91Z"
              fill="url(#pattern0)"
            ></path>
            <defs>
              <pattern
                id="pattern0"
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
              >
                <use xlinkHref="#pointFinger" transform="scale(0.015625)"></use>
              </pattern>
            </defs>
          </svg>
          👇 Here
        </div>
      </div>
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -ml-4 pl-4"
        >
          {options.map((option) => (
            <div
              key={option.id}
              className={`border rounded-lg p-4 flex-shrink-0 w-[300px] transition-all duration-300 ${
                selectedOption === option.id
                  ? "border-purple-600 shadow-lg"
                  : "border-gray-300 bg-white"
              }`}
            >
              <h3 className=" text-gray-800 text-lg mb-2 h-14">
                {option.title}
              </h3>
              <div className="text-xs text-gray-500 mb-4 flex items-center gap-1 bg-gray-50 p-2 rounded-md">
                {/* Book Now Pay Later Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M12.7207 1.60059C13.3494 1.60084 13.7707 2.10363 13.6615 2.72292L13.556 3.32111C14.7608 3.37057 15.5556 4.3537 15.3427 5.56098L14.0573 12.8509C13.8388 14.0897 12.6423 15.0945 11.3843 15.0946H2.27299C1.01502 15.0945 0.172827 14.0897 0.391273 12.8509L1.67668 5.56098C1.89512 4.32211 3.09167 3.3173 4.34965 3.31727H4.44437L4.54917 2.72292C4.65839 2.10351 5.25678 1.60064 5.88574 1.60059C6.51474 1.60059 6.93574 2.10348 6.82652 2.72292L6.72172 3.31727H11.2784L11.3832 2.72292C11.4924 2.10348 12.0917 1.60059 12.7207 1.60059Z"
                    fill="url(#paint0_linear_1965_14329)"
                  ></path>
                  <path
                    d="M7.86844 6.65965C7.70903 6.31084 7.96395 5.91406 8.34745 5.91406L10.4426 5.91407C11.0607 5.91407 11.622 6.27442 11.8792 6.83636L12.8184 8.8877C12.9026 9.07155 12.874 9.28737 12.745 9.44305L10.7157 11.8911C10.4155 12.2532 9.96959 12.4628 9.49925 12.4628L7.43247 12.4628C6.9867 12.4628 6.74252 11.9435 7.02684 11.6002L8.81343 9.44282C8.94227 9.28725 8.97078 9.0717 8.88682 8.88798L7.86844 6.65965Z"
                    fill="#F5F5F5"
                  ></path>
                  <path
                    d="M3.92313 6.65965C3.76372 6.31084 4.01864 5.91406 4.40214 5.91406L4.91731 5.91407C5.53534 5.91407 6.09664 6.27442 6.35391 6.83636L7.29306 8.8877C7.37723 9.07155 7.34871 9.28737 7.21966 9.44305L5.19034 11.8911C4.89017 12.2532 4.44428 12.4628 3.97393 12.4628L3.48716 12.4628C3.04139 12.4628 2.79721 11.9435 3.08153 11.6002L4.86812 9.44282C4.99695 9.28725 5.02546 9.0717 4.9415 8.88798L3.92313 6.65965Z"
                    fill="#F5F5F5"
                  ></path>
                  <defs>
                    <linearGradient
                      id="paint0_linear_1965_14329"
                      x1="12.6753"
                      y1="1.60059"
                      x2="0.235666"
                      y2="14.3612"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#1DC2E2"></stop>
                      <stop offset="1" stopColor="#014959"></stop>
                    </linearGradient>
                  </defs>
                </svg>
                Book now, pay later
              </div>
              <div className="mt-4 mb-4">
                <span className="text-xs text-gray-500">from</span>
                <p className="text-lg text-gray-800">{option.price}</p>
              </div>
              <button
                onClick={() => setSelectedOption(option.id)}
                className={`cursor-pointer w-full py-2 rounded-lg text-sm  transition-all duration-200  ${
                  selectedOption === option.id
                    ? "bg-purple-100 text-purple-700 border border-purple-200"
                    : "border border-purple-600 text-purple-600 hover:bg-purple-50"
                }`}
              >
                {selectedOption === option.id ? (
                  <span className="flex items-center justify-center gap-1 ">
                    <Check size={16} /> Selected
                  </span>
                ) : (
                  "Select"
                )}
              </button>
              <div className="mt-4 border-t pt-4">
                <ul className="space-y-2 text-sm text-gray-600">
                  {option.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">&#8226;</span>
                      {feature}
                    </li>
                  ))}
                  {option.subFeatures && (
                    <ul className="ml-6 space-y-1 text-xs">
                      {option.subFeatures.map((sub, i) => (
                        <li key={i}>{sub}</li>
                      ))}
                    </ul>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10 hidden sm:block"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10 hidden sm:block"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
};

export default TicketOptions;
