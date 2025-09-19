"use client";
import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import { ExperienceResponse } from "@/types/experience/experience-types";
import PriceDisplay from "../PriceDisplay";

interface TicketOptionsProps {
  selectedOptionId: string | null;
  onOptionSelect: (id: string, title: string, type: "timed" | "flex") => void;
  experience?: ExperienceResponse;
}

const TicketOptions: React.FC<TicketOptionsProps> = ({
  selectedOptionId,
  onOptionSelect,
  experience,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [shake, setShake] = useState(true);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  // Generate options from experience data
  const generateFeaturesFromPoints = (points: any[]) => {
    if (!points) return { features: ["All access pass"], subFeatures: [] };
    
    const features: string[] = [];
    const subFeatures: string[] = [];
    
    points.forEach(point => {
      if (point.subpoints && point.subpoints.length > 0) {
        // Add colon to title if it has subpoints
        features.push(point.title + ":");
        // Add subpoints without bullets
        subFeatures.push(...point.subpoints);
      } else {
        features.push(point.title);
      }
    });
    
    return { features, subFeatures };
  };

  const options = experience?.data?.packageType ? [
    {
      id: "base",
      title: experience.data.packageType.name || "Standard Admission",
      price: experience.data.packageType.price || 0,
      type: "timed" as "timed" | "flex",
      ...generateFeaturesFromPoints(experience.data.packageType.points),
    }
  ] : [];
   const checkScrollPosition = () => {
     if (scrollContainerRef.current) {
       const { scrollLeft, scrollWidth, clientWidth } =
         scrollContainerRef.current;
       setIsAtStart(scrollLeft <= 0);
       setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 1);
     }
   };
    useEffect(() => {
       const timer = setTimeout(() => setShake(false), 800);
       const container = scrollContainerRef.current;
   
       checkScrollPosition();
   
       container?.addEventListener("scroll", checkScrollPosition);
       window.addEventListener("resize", checkScrollPosition);
   
       return () => {
         clearTimeout(timer);
         container?.removeEventListener("scroll", checkScrollPosition);
         window.removeEventListener("resize", checkScrollPosition);
       };
     }, []);
   

const handleSelectOption = (option: (typeof options)[0]) => {
  onOptionSelect(option.id, option.title, option.type);
};

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -316 : 316;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModalOpen]);

  useEffect(() => {
    const timer = setTimeout(() => setShake(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <section>
        <div className="flex flex-row items-center gap-2 md:gap-4 mb-6">
          <h2 className="text-2xl font-heading text-gray-700">
            What do you prefer?
          </h2>
          <div
            className={`bg-yellow-100 text-xs px-2 py-1 rounded-lg font-medium ${
              shake ? "animate-shake" : ""
            }`}
          >
            {"👇 Here"}
          </div>
        </div>
        <div className="relative max-w-[790px]">
           {options.length > 3 && !isAtStart && (
                      <button
                        onClick={() => scroll("left")}
                        className="absolute -left-12 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10 hidden sm:flex items-center justify-center hover:bg-gray-50 transition-colors"
                        aria-label="Scroll left"
                      >
                        <ChevronLeft size={20} className="text-gray-700" />
                      </button>
                    )}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -ml-4 pl-4"
          >
            {options.map((option) => (
              <div
                key={option.id}
                className={
                  "border rounded-lg p-4 flex-shrink-0 w-[250px] transition-all duration- 250 flex flex-col shadow-lg"
                }
              >
                <h3 className="font-heading text-[#444444] text-lg mb-2 h-25">
                  {option.title}
                </h3>
                <div className="-mx-4 mb-4">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="relative flex items-center gap-1 w-full text-xs font-medium text-cyan-900 underline px-2 py-1"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-50 to-white"></div>
                    <div className="relative flex items-center gap-1">
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
                        />
                        <path
                          d="M7.86844 6.65965C7.70903 6.31084 7.96395 5.91406 8.34745 5.91406L10.4426 5.91407C11.0607 5.91407 11.622 6.27442 11.8792 6.83636L12.8184 8.8877C12.9026 9.07155 12.874 9.28737 12.745 9.44305L10.7157 11.8911C10.4155 12.2532 9.96959 12.4628 9.49925 12.4628L7.43247 12.4628C6.9867 12.4628 6.74252 11.9435 7.02684 11.6002L8.81343 9.44282C8.94227 9.28725 8.97078 9.0717 8.88682 8.88798L7.86844 6.65965Z"
                          fill="#F5F5F5"
                        />
                        <path
                          d="M3.92313 6.65965C3.76372 6.31084 4.01864 5.91406 4.40214 5.91406L4.91731 5.91407C5.53534 5.91407 6.09664 6.27442 6.35391 6.83636L7.29306 8.8877C7.37723 9.07155 7.34871 9.28737 7.21966 9.44305L5.19034 11.8911C4.89017 12.2532 4.44428 12.4628 3.97393 12.4628L3.48716 12.4628C3.04139 12.4628 2.79721 11.9435 3.08153 11.6002L4.86812 9.44282C4.99695 9.28725 5.02546 9.0717 4.9415 8.88798L3.92313 6.65965Z"
                          fill="#F5F5F5"
                        />
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
                  </button>
                </div>

                <div className="mt-auto">
                  <div className="mb-4">
                    <span className="text-xs text-gray-500 font-halyard-text-light">
                      from
                    </span>
                    <div className="text-lg text-[#444444] font-halyard-text">
                      {typeof option.price === 'number' ? (
                        <PriceDisplay amount={option.price} />
                      ) : (
                        option.price
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleSelectOption(option)}
                    className={`font-halyard-text font-medium w-full py-2 rounded-lg text-sm transition-all duration-200 ${
                      selectedOptionId === option.id
                        ? "bg-purple-100 text-purple-700 border border-purple-200"
                        : "border border-purple-600 text-purple-600 hover:bg-purple-50"
                    }`}
                  >
                    {selectedOptionId === option.id ? (
                      <span className="flex hover:cursor-pointer items-center justify-center gap-1">
                        <Check size={16} /> Selected
                      </span>
                    ) : (
                      "Select"
                    )}
                  </button>
                </div>
                <div className="mt-4 border-t border-gray-200 pt-4 flex-grow">
                  <ul className="space-y-2 text-sm text-gray-600 font-halyard-text-light">
                    {option.features.map((feature: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-gray-500 mt-1">&#8226;</span>
                        {feature}
                      </li>
                    ))}
                    {option.subFeatures && (
                      <ul className="ml-6 space-y-1 text-xs">
                        {option.subFeatures.map((sub: string, i: number) => (
                          <li key={i}>{sub}</li>
                        ))}
                      </ul>
                    )}
                  </ul>
                </div>
              </div>
            ))}
          </div>

           {options.length > 3 && !isAtEnd && (
                     <button
                       onClick={() => scroll("right")}
                       className="absolute -right-12 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-10 hidden sm:flex items-center justify-center hover:bg-gray-50 transition-colors"
                       aria-label="Scroll right"
                     >
                       <ChevronRight size={20} className="text-gray-700" />
                     </button>
                   )}
                 </div>
               </section>
         

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 relative"
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold font-halyard-text text-sky-900">
              Book now, pay later
            </h3>
            <p className="text-xs font-halyard-text-light font-bold text-sky-900 mb-2">
              You can select this option at checkout.
            </p>
            <div className="h-[1px] bg-gray-200 mb-2"></div>
            <p className="text-sm font-halyard-text-light text-gray-600">
              Book your experience at $0 today. Cancel for free up to 24 hours
              before the experience starts.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default TicketOptions;
