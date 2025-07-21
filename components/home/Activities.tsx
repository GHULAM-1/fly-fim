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
  ];

  return (
    <div className="py-8 sm:py-10  bg-zinc-100">
      <div className="max-w-[1200px] mx-auto 2xl:px-0">
        <div className="flex justify-between xl:px-0 px-[24px] items-center">
          <h2 className="text-lg sm:text-2xl  font-heading text-[#444444]">
            {t("activities.title")}
          </h2>
          <div className="flex items-center gap-4">
            <button className="text-sm text-[#444444] md:underline underline-offset-4 whitespace-nowrap flex items-center gap-1">
              {t("activities.seeAll")}{" "}
              <ChevronRightIcon className="md:hidden w-4 h-4" />
            </button>
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
          className="mt-4 sm:mt-2 pl-[24px] xl:px-0 flex overflow-x-scroll -ml-4 scrollbar-hide"
          ref={scrollContainerRef}
        >
          {activities.map((activity) => (
            <Link
              href="#"
              key={activity.id}
              className="pl-4 hover:-translate-y-2 transition-all duration-300 pt-2 flex-shrink-0 w-[170px]  md:w-[180px]"
            >
              <img
                src={activity.image}
                alt={activity.description}
                className="rounded w-[156px] h-[208px] md:w-[180px] md:h-[240px]"
              />
              <p className="text-[17px] font-heading text-[#444444] leading-tight mt-2">
                {activity.description}
              </p>
              <p className="text-sm font-lightText text-[#666666] mt-1">{activity.place}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Activities;
