"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

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
    <div className="py-10 px-8 md:px-16 lg:px-24 xl:px-28 bg-zinc-100">
      <div className="flex justify-between items-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-700">
          {t("activities.title")}
        </h2>
        <div className="flex items-center gap-2">
          <button className="text-sm text-gray-500 underline underline-offset-4 whitespace-nowrap">
            {t("activities.seeAll")}
          </button>
        </div>
      </div>
      <Carousel className="mt-10">
        <CarouselContent>
          {activities.map((activity) => (
            <CarouselItem
              key={activity.id}
              className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/6"
            >
              <img
                src={activity.image}
                alt={activity.description}
                className="rounded"
              />
              <p className="font-semibold text-gray-700 mt-2">
                {activity.description}
              </p>
              <p className="text-gray-500 text-sm mt-1">{activity.place}</p>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default Activities;
