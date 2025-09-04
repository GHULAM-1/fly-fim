"use client";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import CarouselCard from "../cards/CarouselCard";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";

const Recommendations = () => {
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

  const recommendations = [
    {
      id: "skydive-dubai",
      description: "Skydive Dubai: Tandem Skydiving at the Palm Drop Zone",
      badge: "Selling out fast",
      place: "Dubai",
      image: "/images/r4.jpg.avif",
      price: 100,
      rating: 4.5,
      reviews: 100,
      city: "dubai",
      category: "adventure",
      subcategory: "skydiving",
      itemId: "skydive-dubai-palm",
    },
    {
      id: "acropolis-tickets",
      description: "Acropolis Parthenon Tickets with Optional Audio Guide",
      place: "Athens",
      image: "/images/r3.jpg.avif",
      price: 100,
      rating: 4.5,
      reviews: 100,
      city: "athens",
      category: "tickets",
      subcategory: "landmarks",
      itemId: "acropolis-parthenon-tickets",
    },
    {
      id: "pompeii-amalfi-tour",
      badge: "Free cancellation",
      description:
        "From Rome: Pompeii, Amalfi Coast and Sorrento or Positano Day Trip",
      place: "Italy",
      image: "/images/r2.jpg.avif",
      price: 100,
      rating: 4.5,
      reviews: 100,
      city: "rome",
      category: "tours",
      subcategory: "day-trips",
      itemId: "pompeii-amalfi-day-trip",
    },
    {
      id: "harry-potter-studio",
      description:
        "From London: Harry Potter™ Warner Bros. Studio Tickets with Coach Transfers",
      place: "London",
      image: "/images/r1.jpg.avif",
      price: 100,
      rating: 4.5,
      reviews: 100,
      city: "london",
      category: "entertainment",
      subcategory: "studio-tours",
      itemId: "harry-potter-studio-tour",
    },
    {
      id: "harry-potter-studio-2",
      description:
        "From London: Harry Potter™ Warner Bros. Studio Tickets with Coach Transfers",
      place: "London",
      image: "/images/r1.jpg.avif",
      price: 100,
      rating: 4.5,
      reviews: 100,
      city: "london",
      category: "entertainment",
      subcategory: "studio-tours",
      itemId: "harry-potter-studio-tour-2",
    },
    {
      id: "harry-potter-studio-3",
      description:
        "From London: Harry Potter™ Warner Bros. Studio Tickets with Coach Transfers",
      place: "London",
      image: "/images/r1.jpg.avif",
      price: 100,
      rating: 4.5,
      reviews: 100,
      city: "london",
      category: "entertainment",
      subcategory: "studio-tours",
      itemId: "harry-potter-studio-tour-3",
    },
    {
      id: "harry-potter-studio-4",
      description:
        "From London: Harry Potter™ Warner Bros. Studio Tickets with Coach Transfers",
      place: "London",
      image: "/images/r1.jpg.avif",
      price: 100,
      rating: 4.5,
      reviews: 100,
      city: "london",
      category: "entertainment",
      subcategory: "studio-tours",
      itemId: "harry-potter-studio-tour-4",
    },
    {
      id: "harry-potter-studio-5",
      description:
        "From London: Harry Potter™ Warner Bros. Studio Tickets with Coach Transfers",
      place: "London",
      image: "/images/r1.jpg.avif",
      price: 100,
      rating: 4.5,
      reviews: 100,
      city: "london",
      category: "entertainment",
      subcategory: "studio-tours",
      itemId: "harry-potter-studio-tour-5",
    },
  ];

  return (
    <div className="py-4 sm:py-10 max-w-[1200px] mx-auto 2xl:px-0">
      <div className="flex justify-between items-center px-[24px] xl:px-0">
        <h2 className="text-lg sm:text-2xl font-heading text-[#444444]">
          Travelers' favorite choices
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
        {recommendations.map((recommendation) => (
          <div
            key={recommendation.id}
            className="snap-start flex-shrink-0 w-[282px]"
          >
            <CarouselCard
              variant="full"
              image={recommendation.image}
              place={recommendation.place}
              rating={recommendation.rating}
              reviews={recommendation.reviews}
              description={recommendation.description}
              price={recommendation.price}
              badge={recommendation.badge}
              city={recommendation.city}
              category={recommendation.category}
              subcategory={recommendation.subcategory}
              itemId={recommendation.itemId}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
