"use client";
import React from "react";
import { useTranslation } from "react-i18next";

const Activities = () => {
  const { t } = useTranslation();

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
    <div className="py-4 sm:py-10 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-28 bg-zinc-100">
      <div className="max-w-screen-2xl mx-auto 2xl:px-0">
        <div className="flex justify-between items-center">
          <h2 className="text-lg sm:text-2xl font-semibold md:font-bold text-gray-700">
            {t("activities.title")}
          </h2>
          <div className="flex items-center gap-2">
            <button className="text-sm text-gray-500 underline underline-offset-4 whitespace-nowrap">
              {t("activities.seeAll")}
            </button>
          </div>
        </div>
        <div className="mt-4 sm:mt-10 flex overflow-x-scroll -ml-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="basis-[45%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/6 shrink-0 pl-4"
            >
              <img
                src={activity.image}
                alt={activity.description}
                className="rounded"
              />
              <p className="font-semibold text-gray-700 leading-tight mt-2">
                {activity.description}
              </p>
              <p className="text-gray-500 text-sm mt-1">{activity.place}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Activities;
