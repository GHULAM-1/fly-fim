import React, { useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CarouselCard from "../cards/CarouselCard";
import { useTranslation } from "react-i18next";
import { ChevronDown, ArrowUpDown, Check } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { StarIcon } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import PriceDisplay from "../PriceDisplay";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface CarouselGridProps {
  title: string;
  recommendations: any[];
  variant?: "default" | "full";
}

const CarouselGrid = ({
  title,
  recommendations,
  variant = "default",
}: CarouselGridProps) => {
  const { t } = useTranslation();
  const [sortBy, setSortBy] = useState("Picked for you");
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

  const sortOptions = [
    "Picked for you",
    "Most popular",
    "Price (low to high)",
    "Price (high to low)",
  ];

  const handleSortChange = (option: string) => {
    setSortBy(option);
    // Add sorting logic here if needed
  };

  if (variant === "full") {
    return (
      <div className="py-4 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-28 max-w-screen-2xl mx-auto 2xl:px-0">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
        <div className="flex justify-between items-start mb-6">
          <p className="text-gray-600 text-sm">
            {recommendations.length} experiences
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center font-light gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowUpDown size={16} />
              <span className="text-sm">Sort by: {sortBy}</span>
              <ChevronDown size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={() => handleSortChange(option)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <span>{option}</span>
                  {sortBy === option && <Check size={16} />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {recommendations.map((recommendation) => (
            <div key={recommendation.id} className="w-full group">
              <Swiper
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                modules={[Autoplay, Navigation, Pagination]}
                navigation={{
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                }}
                pagination={{
                  clickable: true,
                }}
                className="mySwiper w-full rounded overflow-hidden mb-4"
              >
                <SwiperSlide>
                  <img
                    src={recommendation.image}
                    className="w-full object-cover"
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src={recommendation.image}
                    className="w-full object-cover"
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src={recommendation.image}
                    className="w-full object-cover"
                  />
                </SwiperSlide>
                <div className="hidden group-hover:block">
                  <div className="swiper-button-next after:text-black after:!text-xs after:w-6 after:h-6 after:absolute after:bg-white after:flex after:items-center after:justify-center after:rounded-full after:shadow-lg" />
                  <div className="swiper-button-prev after:text-black after:!text-xs after:w-6 after:h-6 after:absolute after:bg-white after:flex after:items-center after:justify-center after:rounded-full after:shadow-lg" />
                </div>
              </Swiper>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-500 text-xs">
                  {recommendation.place}
                </span>
                <span className="flex items-center gap-1">
                  <StarIcon
                    className="text-pink-600"
                    fill="currentColor"
                    size={12}
                  />
                  <span className="text-pink-600 text-xs font-semibold">
                    {recommendation.rating}
                  </span>
                  <span className="text-pink-600 text-xs">
                    ({recommendation.reviews})
                  </span>
                </span>
              </div>
              <p className="font-semibold text-gray-700 mt-2">
                {recommendation.description}
              </p>
              <p className="font-semibold text-gray-700 mt-2 max-w-32">
                <span className="text-gray-500 text-xs">
                  {t("recommendations.from")}
                </span>{" "}
                <br /> <PriceDisplay amount={recommendation.price} />
              </p>
            </div>
          ))}
        </div>
        <button className="w-full sm:w-auto py-3 px-12 rounded-lg border border-gray-700 text-gray-700 font-semibold mt-4 sm:mt-10 mx-auto block">
          Show more
        </button>
      </div>
    );
  }

  // Default variant (existing layout)
  return (
    <div className="py-4 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-28 max-w-screen-2xl mx-auto 2xl:px-0">
      <div className="flex justify-between items-center">
        <h2 className="text-lg sm:text-2xl font-semibold md:font-bold text-gray-700">
          {title}
        </h2>
        <div className="flex items-center gap-4">
          <Link
            href="/cities"
            className="text-sm text-gray-500 underline underline-offset-4 whitespace-nowrap"
          >
            {t("recommendations.seeAll")}
          </Link>
          <div className="hidden md:flex items-center gap-2">
            <button
              className="text-sm text-gray-500 underline underline-offset-4 whitespace-nowrap border p-2 rounded-full"
              onClick={scrollLeft}
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button
              className="text-sm text-gray-500 underline underline-offset-4 whitespace-nowrap border p-2 rounded-full"
              onClick={scrollRight}
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <div
        className="mt-4 sm:mt-8 flex overflow-x-scroll -ml-4 scrollbar-hide"
        ref={scrollContainerRef}
      >
        {recommendations.map((recommendation) => (
          <CarouselCard
            key={recommendation.id}
            image={recommendation.image}
            place={recommendation.place}
            rating={recommendation.rating}
            reviews={recommendation.reviews}
            description={recommendation.description}
            price={recommendation.price}
          />
        ))}
      </div>
    </div>
  );
};

export default CarouselGrid;
