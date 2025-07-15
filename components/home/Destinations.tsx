"use client";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const Destinations = () => {
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

  const destinations = [
    {
      id: 1,
      description: "Things to do in New York",
      place: "United States",
      image: "/images/d6.jpeg.avif",
    },
    {
      id: 2,
      description: "Things to do in London",
      place: "United Kingdom",
      image: "/images/d5.jpg.avif",
    },
    {
      id: 3,
      description: "Things to do in Dubai",
      place: "United Arab Emirates",
      image: "/images/d4.jpg.avif",
    },
    {
      id: 4,
      description: "Things to do in Rome",
      place: "Italy",
      image: "/images/d3.jpg.avif",
    },
    {
      id: 5,
      description: "Things to do in Paris",
      place: "France",
      image: "/images/d2.jpg.avif",
    },
    {
      id: 6,
      description: "Things to do in Singapore",
      place: "Singapore",
      image: "/images/d1.jpg.avif",
    },
    {
      id: 7,
      description: "Things to do in Singapore",
      place: "Singapore",
      image: "/images/d1.jpg.avif",
    },
    {
      id: 8,
      description: "Things to do in Singapore",
      place: "Singapore",
      image: "/images/d1.jpg.avif",
    },
    {
      id: 9,
      description: "Things to do in Singapore",
      place: "Singapore",
      image: "/images/d1.jpg.avif",
    },
    {
      id: 10,
      description: "Things to do in Singapore",
      place: "Singapore",
      image: "/images/d1.jpg.avif",
    },
    {
      id: 11,
      description: "Things to do in Singapore",
      place: "Singapore",
      image: "/images/d1.jpg.avif",
    },
    {
      id: 12,
      description: "Things to do in Singapore",
      place: "Singapore",
      image: "/images/d1.jpg.avif",
    },
  ];

  return (
    <div className="py-4 sm:py-10 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-28 2xl:max-w-screen-xl mx-auto 2xl:px-0">
      <div className="flex justify-between items-center">
        <h2 className="text-lg sm:text-2xl font-heading text-gray-700 max-w-2/3">
          {t("destinations.title")}
        </h2>
        <div className="flex items-center gap-4">
          <Link
            href="/cities"
            className="text-sm text-gray-500 md:underline underline-offset-4 whitespace-nowrap flex items-center gap-1"
          >
            {t("destinations.seeAll")}{" "}
            <ChevronRightIcon className="md:hidden w-4 h-4" />
          </Link>
          <div className="hidden md:flex items-center gap-2">
            <button
              className="cursor-pointer hover:border-gray-400 text-sm text-gray-500 underline underline-offset-4 whitespace-nowrap border p-2 rounded-full"
              onClick={scrollLeft}
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button
              className="cursor-pointer hover:border-gray-400 text-sm text-gray-500 underline underline-offset-4 whitespace-nowrap border p-2 rounded-full"
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
        {destinations.map((destination) => (
          <Link
            href="#"
            key={destination.id}
            className="basis-2/5 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 shrink-0 pl-4 hover:-translate-y-2 transition-all duration-300 pt-2"
          >
            <img
              src={destination.image}
              alt={destination.description}
              className="rounded"
            />
            <p className="text-base font-heading text-gray-700 mt-2 leading-tight md:max-w-32">
              {destination.description}
            </p>
            <p className="text-sm mt-1">{destination.place}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Destinations;
