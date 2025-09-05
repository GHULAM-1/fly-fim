"use client";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const destinations = [
  {
    id: "1",
    description: "Things to do in New York",
    place: "United States",
    image: "/images/d6.jpeg.avif",
    city: "New York",
    slug: "new-york",
  },
  {
    id: "2",
    description: "Things to do in London",
    place: "United Kingdom",
    image: "/images/d5.jpg.avif",
    city: "London",
    slug: "london",
  },
  {
    id: "3",
    description: "Things to do in Dubai",
    place: "United Arab Emirates",
    image: "/images/d4.jpg.avif",
    city: "Dubai",
    slug: "dubai",
  },
  {
    id: "4",
    description: "Things to do in Rome",
    place: "Italy",
    image: "/images/d3.jpg.avif",
    city: "Rome",
    slug: "rome",
  },
  {
    id: "5",
    description: "Things to do in Paris",
    place: "France",
    image: "/images/d2.jpg.avif",
    city: "Paris",
    slug: "paris",
  },
  {
    id: "6",
    description: "Things to do in Singapore",
    place: "Singapore",
    image: "/images/d1.jpg.avif",
    city: "Singapore",
    slug: "singapore",
  },
  {
    id: "7",
    description: "Things to do in Las Vegas",
    place: "United States",
    image: "/images/d6.jpeg.avif",
    city: "Las Vegas",
    slug: "las-vegas",
  },
];

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

  return (
    <div className="py-4 max-w-[1200px] mx-auto ">
      <div className="flex justify-between items-start">
        <h2 className="text-lg sm:text-2xl font-heading text-[#444444] max-w-2/3">
          {t("destinations.title")}
        </h2>
        <div className="flex items-center mt-[6px] md:mt-[0px] gap-4">
          <Link
            href="/cities"
            className="text-[14px] md:text-[15px] hover:cursor-pointer hover:text-[#7f00fe] text-[#444444] font-lightText md:underline underline-offset-4 whitespace-nowrap flex items-center gap-1"
          >
            {t("destinations.seeAll")}{" "}
            <ChevronRightIcon className="md:hidden w-4 h-4" />
          </Link>
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
      </div>
      <div
        className="mt-4 sm:mt-4 flex overflow-x-scroll -ml-4 scrollbar-hide"
        ref={scrollContainerRef}
      >
        {destinations.map((destination) => (
          <Link
            href={`/things-to-do/${destination.slug}`}
            key={destination.id}
            className="basis-2/5 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 shrink-0 pl-4 hover:-translate-y-2 transition-all duration-300 pt-2"
          >
            <img
              src={destination.image}
              alt={destination.description}
              className="rounded"
            />
            <p className="text-[17px] font-heading text-[#444444] mt-2 leading-tight max-w-32">
              {destination.description}
            </p>
            <p className="text-sm font-lightText text-[#666666] mt-1">
              {destination.place}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Destinations;
