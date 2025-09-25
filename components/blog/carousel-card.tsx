"use client"
import { ArrowRight, ChevronRight, ChevronLeft } from "lucide-react";
import React, { useRef } from "react";
import Link from "next/link";

interface CarouselCardProps {
  title: string;
  blogCards:any[];
}
export default function CarouselCard({ blogCards, title }: CarouselCardProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = window.innerWidth < 640 ? 300 : 320;
      scrollContainerRef.current.scrollBy({
        left: -(cardWidth + 16), // Width of one card + gap
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = window.innerWidth < 640 ? 300 : 320;
      scrollContainerRef.current.scrollBy({
        left: cardWidth + 16, // Width of one card + gap
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="mb-10">
      <div className="font-halyard-text font-semibold mt-[20px] mb-[40px] text-center ">
        <h1 className="text-[24px] text-[#080808]">{title}</h1>
        <div className="border-b-[3px] border-[#8000FF] m-[20px] max-w-[100px] mx-auto"></div>
      </div>
      
      <div className="relative">
        {/* Navigation Buttons - Only show on lg and above when more than 3 cards */}
        {blogCards.length > 3 && (
          <>
            <button
              onClick={scrollLeft}
              className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            <button
              onClick={scrollRight}
              className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </>
        )}

        {/* Carousel Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 pl-4 lg:pl-0 pb-5 lg:pb-0 overflow-x-auto scrollbar-hide lg:scrollbar-hide scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 snap-x snap-mandatory"
        >
          {blogCards.map((card, index) => (
            <div
              key={index}
              className="flex-shrink-0 pb-2 snap-center w-[280px] sm:w-[320px]"
            >
              <Link href={`/blog/${card.slug?.current || card.slug || '#'}`} className="block">
                <div className="shadow-sm group hover:cursor-pointer bg-white max-w-[320px] rounded-[4px] lg:h-[400px] h-[500px] flex flex-col hover:shadow-md transition-shadow duration-300">
                <div className="lg:h-[210px] h-[300px] transition-all duration-300 relative overflow-hidden rounded-t-[4px]">
                  <img
                    src={card.cardImage?.asset?.url || card.image || '/placeholder.jpg'}
                    alt=""
                    className="object-center w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between pb-[5px] font-halyard-text">
                  <div>
                    <h3 className="text-[20px] text-[#4a4a4a] line-clamp-2 px-[25px] pt-[15px]">
                      {card.title}
                    </h3>
                    <p className="text-[15px] text-[#4a4a4a] line-clamp-3 mt-[10px] px-[25px]">
                      {card.cardDescription}
                    </p>
                  </div>
                  <div className="flex items-center mx-[25px] mb-[15px] mt-auto">
                    <p className="text-[16px] hover:cursor-pointer text-[#8000FF]">
                      Read more
                    </p>
                    <ChevronRight className="text-[#b6aead] group-hover:text-[#8000FF] transition-all ease-in-out duration-300 ml-1" />
                  </div>
                </div>
              </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
