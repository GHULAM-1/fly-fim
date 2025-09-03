"use client";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import CarouselCard from "../cards/CarouselCard";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";

interface Experience {
  _id: string;
  title: string;
  price: string;
  images: string[];
  mainImage: string;
  tagOnCards?: string;
  // ... other fields if needed
}

interface RecommendationsProps {
  recommendations: Experience[];
}

const Recommendations: React.FC<RecommendationsProps> = ({
  recommendations,
}) => {
  const { t } = useTranslation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -scrollContainerRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollContainerRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  };

  if (!recommendations || recommendations.length === 0) {
    return null; // Don't render the section if there are no recommendations
  }

  return (
    <div className="py-4 sm:py-10 max-w-[1200px] mx-auto 2xl:px-0">
      <div className="flex justify-between items-center px-[24px] xl:px-0">
        <h2 className="text-lg sm:text-2xl font-heading text-[#444444]">
          Similar experiences you'd love
        </h2>
        <div className="hidden md:flex items-center gap-2">
          <button
            className="cursor-pointer hover:border-gray-400 text-sm text-[#666666] underline underline-offset-4 whitespace-nowrap border p-2 rounded-full"
            onClick={scrollLeft}
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          <button
            className="cursor-pointer hover:border-gray-400 text-sm text-[#666666] underline underline-offset-4 whitespace-nowrap border p-2 rounded-full"
            onClick={scrollRight}
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div
        className="mt-4 pl-[24px] xl:pl-0 sm:mt-4 flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        ref={scrollContainerRef}
      >
        {recommendations.map((rec) => (
          <div key={rec._id} className="snap-start flex-shrink-0 w-[282px]">
            <CarouselCard
              variant="full"
              image={
                rec.mainImage
                  ? `https://sincere-roadrunner-227.convex.cloud/api/storage/${rec.mainImage}`
                  : "/images/r1.jpg.avif"
              }
              place={"Recommendation"} // Placeholder
              rating={4.5} // Placeholder
              reviews={100} // Placeholder
              description={rec.title}
              price={parseFloat(rec.price) || 0}
              badge={rec.tagOnCards}
              // These need a strategy, as a recommendation might be in a different city/category
              city="london"
              category="tours"
              subcategory="general"
              itemId={rec._id}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
