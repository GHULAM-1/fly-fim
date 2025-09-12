"use client";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { Experience } from "@/types/home"; 

interface ActivitiesProps {
  activities: Experience[];
  loading: boolean;
}

const Activities: React.FC<ActivitiesProps> = ({ activities, loading }) => {
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

  if (loading) {
    return (
      <div className="py-8 sm:py-10 bg-zinc-100">
        <div className="py-4 sm:py-10 max-w-[1200px] mx-auto 2xl:px-0 ">
          <div className="px-[24px] xl:px-0">
            <h2 className="text-lg sm:text-2xl font-heading text-[#444444]">
              {t("activities.title")}
            </h2>
          </div>
          <div className="mt-4 pl-[24px] xl:pl-0 sm:mt-4 flex gap-5 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[170px] md:w-[200px]">
                <div className="w-[156px] h-[208px] md:w-[220px] md:h-[240px] bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-10 bg-zinc-100">
      <div className="max-w-[1200px] mx-auto 2xl:px-0">
        <div className="flex justify-between xl:px-0 px-[24px] items-center">
          <h2 className="text-lg sm:text-2xl font-heading text-[#444444]">
            {t("activities.title")}
          </h2>
          <div className="flex items-center gap-4">
            <button className="text-[14px] md:text-[15px] text-[#444444] font-halyard-text hover:cursor-pointer hover:text-[#7f00fe] md:underline underline-offset-4 whitespace-nowrap flex items-center gap-1">
              {t("activities.seeAll")}{" "}
              <ChevronRightIcon className="md:hidden w-4 h-4" />
            </button>
            <div className="hidden md:flex items-center gap-2">
              <button
                className="cursor-pointer hover:border-gray-400 text-sm text-[#666666] border p-2 rounded-full"
                onClick={scrollLeft}
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <button
                className="cursor-pointer hover:border-gray-400 text-sm text-[#666666] border p-2 rounded-full"
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
              key={activity._id}
              className="pl-4 hover:-translate-y-2 transition-all duration-300 pt-2 flex-shrink-0 w-[170px] md:w-[200px]"
            >
              <img
                src={activity.mainImage}
                alt={activity.title}
                className="rounded w-[156px] h-[208px] md:w-[220px] md:h-[240px] object-cover"
              />
              <p className="text-[17px] font-heading text-[#444444] leading-tight mt-2">
                {activity.title}
              </p>
              <p className="text-sm font-lightText text-[#666666] mt-1">
                {activity.cityName}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Activities;
