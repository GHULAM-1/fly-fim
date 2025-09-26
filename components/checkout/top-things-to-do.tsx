"use client";
import React, { useRef, useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { fetchHomePage } from "@/api/worldwide/worlwide-home-api";
import { WorldwideResponse } from "@/types/worldwide/worldwide-home-types";

interface ActivitiesProps {
  title: string;
  className?: string;
}

interface Activity {
  _id: string;
  title: string;
  mainImage: string; 
  cityName: string;
  categoryName: string;
  subcategoryName: string;
}
export default function Activities({ title, className }: ActivitiesProps) {
  const { t } = useTranslation();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<WorldwideResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const apiData = await fetchHomePage();
        setData(apiData);
        if (apiData?.data?.experiences) {
          // Map experiences to activities
          const mappedActivities: Activity[] = apiData.data.experiences.slice(0, 20).map((exp) => ({
            _id: exp._id,
            title: exp.title,
            mainImage: exp.imageUrls[0] || "",
            cityName: exp.cityName,
            categoryName: exp.categoryName,
            subcategoryName: exp.subcategoryName,
          }));
          
          setActivities(mappedActivities);
        } else {
          // No experiences available
          setActivities([]);
        }
      } catch (err) {
        console.error('Error loading activities:', err);
        setError('Failed to load activities.');
        // Set empty array on error
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);
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
    <div className="py-8 sm:py-10 bg-transparent">
      <div className="max-w-[1200px] mx-auto 2xl:px-0">
        <div className={cn("flex justify-between xl:px-0 px-[24px] items-center", className)}>
          <h2 className="text-lg sm:text-2xl  font-heading text-[#444444]">
            {title || t("activities.title")}
          </h2>
          <div className="flex items-center gap-4">
            <button className="text-[14px] md:text-[15px] text-[#444444] font-lightText hover:cursor-pointer hover:text-[#7f00fe] md:underline underline-offset-4 whitespace-nowrap flex items-center gap-1">
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
          className={cn("mt-4 sm:mt-2 pl-[24px] xl:px-0 flex overflow-x-scroll -ml-4 scrollbar-hide", className)}
          ref={scrollContainerRef}
        >
          {activities.map((activity) => (
            <Link
              href="#"
              key={activity._id}
              className="pl-4 hover:-translate-y-2 transition-all duration-300 pt-2 flex-shrink-0 w-[170px]  md:w-[200px]"
            >
              <img
                src={activity.mainImage}
                alt={activity.title}
                className="rounded w-[156px] h-[208px] md:w-[220px] md:h-[240px]"
              />
              <p className="text-[17px] font-heading text-[#444444] leading-tight mt-2">
                {activity.title}
              </p>
              <p className="text-sm font-lightText text-[#666666] mt-1">{activity.cityName}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
    );
}

