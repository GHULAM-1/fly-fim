"use client";
import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";

const Activities = () => {
  const { t } = useTranslation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/experiences`
        );
        if (!response.ok) throw new Error("Failed to fetch activities");
        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          const formattedActivities = result.data.map((exp: any) => ({
            id: exp._id,
            description: exp.title,
            place: "Worldwide",
            image: exp.mainImage
              ? `https://sincere-roadrunner-227.convex.cloud/api/storage/${exp.mainImage}`
              : "/images/a1.jpg.avif",
            city: "london",
            category: "tours",
            subcategory: "general",
          }));
          setActivities(formattedActivities);
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

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
    <div className="py-8 sm:py-10  bg-zinc-100">
      <div className="max-w-[1200px] mx-auto 2xl:px-0">
        <div className="flex justify-between xl:px-0 px-[24px] items-center">
          <h2 className="text-lg sm:text-2xl  font-heading text-[#444444]">
            {t("activities.title")}
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
          className="mt-4 sm:mt-2 pl-[24px] xl:px-0 flex overflow-x-scroll -ml-4 scrollbar-hide"
          ref={scrollContainerRef}
        >
          {loading ? (
            <p>Loading activities...</p>
          ) : (
            activities.map((activity) => (
              <Link
                href={`/things-to-do/${activity.city}/${activity.category}/${activity.subcategory}/${activity.id}`}
                key={activity.id}
                className="pl-4 hover:-translate-y-2 transition-all duration-300 pt-2 flex-shrink-0 w-[170px]  md:w-[200px]"
              >
                <img
                  src={activity.image}
                  alt={activity.description}
                  className="rounded w-[156px] h-[208px] md:w-[220px] md:h-[240px] object-cover"
                />
                <p className="text-[17px] font-heading text-[#444444] leading-tight mt-2 line-clamp-2">
                  {activity.description}
                </p>
                <p className="text-sm font-lightText text-[#666666] mt-1">
                  {activity.place}
                </p>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Activities;
