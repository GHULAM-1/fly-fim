"use client";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";

const Activities = () => {
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

  const activities = [
    {
      id: 1,
      description: "London Theatre Tickets",
      place: "London",
      image: "/images/a6.jpg.avif",
    },
    {
      id: 2,
      description: "Dubai Desert Safari Tours",
      place: "Dubai",
      image: "/images/a5.jpg.avif",
    },
    {
      id: 3,
      description: "Vatican Museums",
      place: "Rome",
      image: "/images/a4.jpg.avif",
    },
    {
      id: 4,
      description: "Disneyland® Paris Tickets",
      place: "Paris",
      image: "/images/a3.png.avif",
    },
    {
      id: 5,
      description: "Sydney Opera House Tours",
      place: "Sydney",
      image: "/images/a2.jpg.avif",
    },
    {
      id: 6,
      description: "Eiffel Tower Tickets",
      place: "Paris",
      image: "/images/a1.jpg.avif",
    },
    {
      id: 7,
      description: "Eiffel Tower Tickets",
      place: "Paris",
      image: "/images/a1.jpg.avif",
    },
    {
      id: 8,
      description: "Eiffel Tower Tickets",
      place: "Paris",
      image: "/images/a1.jpg.avif",
    },
    {
      id: 9,
      description: "Eiffel Tower Tickets",
      place: "Paris",
      image: "/images/a1.jpg.avif",
    },
    {
      id: 10,
      description: "Eiffel Tower Tickets",
      place: "Paris",
      image: "/images/a1.jpg.avif",
    },
    {
      id: 11,
      description: "Eiffel Tower Tickets",
      place: "Paris",
      image: "/images/a1.jpg.avif",
    },
    {
      id: 12,
      description: "Eiffel Tower Tickets",
      place: "Paris",
      image: "/images/a1.jpg.avif",
    },
  ];

  return (
    <div className="py-8 sm:py-10 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-28 bg-zinc-100">
      <div className="2xl:max-w-screen-xl mx-auto 2xl:px-0">
        <div className="flex justify-between items-center">
          <h2 className="text-lg sm:text-2xl font-semibold md:font-bold text-gray-700">
            {t("activities.title")}
          </h2>
          <div className="flex items-center gap-4">
            <button className="text-sm text-gray-500 md:underline underline-offset-4 whitespace-nowrap flex items-center gap-1">
              {t("activities.seeAll")}{" "}
              <ChevronRightIcon className="md:hidden w-4 h-4" />
            </button>
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
          {activities.map((activity) => (
            <Link
              href="#"
              key={activity.id}
              className="basis-[45%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/6 shrink-0 pl-4 hover:-translate-y-2 transition-all duration-300 pt-2"
            >
              <img
                src={activity.image}
                alt={activity.description}
                className="rounded"
              />
              <p className="text-sm md:text-base font-semibold text-gray-700 leading-tight mt-2">
                {activity.description}
              </p>
              <p className="text-gray-500 text-xs md:text-sm mt-1">
                {activity.place}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Activities;
