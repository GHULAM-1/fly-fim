"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { StarIcon } from "lucide-react";

const Recommendations = () => {
  const { t } = useTranslation();

  const recommendations = [
    {
      id: 1,
      description: "Skydive Dubai: Tandem Skydiving at the Palm Drop Zone",
      place: "Dubai",
      image: "/images/r4.jpg.avif",
      price: 100,
      rating: 4.5,
      reviews: 100,
    },
    {
      id: 2,
      description: "Acropolis Parthenon Tickets with Optional Audio Guide",
      place: "Athens",
      image: "/images/r3.jpg.avif",
      price: 100,
      rating: 4.5,
      reviews: 100,
    },
    {
      id: 3,
      description:
        "From Rome: Pompeii, Amalfi Coast and Sorrento or Positano Day Trip",
      place: "Italy",
      image: "/images/r2.jpg.avif",
      price: 100,
      rating: 4.5,
      reviews: 100,
    },
    {
      id: 4,
      description:
        "From London: Harry Potter™ Warner Bros. Studio Tickets with Coach Transfers",
      place: "London",
      image: "/images/r1.jpg.avif",
      price: 100,
      rating: 4.5,
      reviews: 100,
    },
  ];

  return (
    <div className="py-10 px-8 md:px-16 lg:px-24 xl:px-28">
      <div className="flex justify-between items-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-700">
          Headout’s top recommendations
        </h2>
        <div className="flex items-center gap-2">
          <button className="text-sm text-gray-500 underline underline-offset-4 whitespace-nowrap">
            {t("recommendations.seeAll")}
          </button>
        </div>
      </div>
      <Carousel className="mt-10">
        <CarouselContent>
          {recommendations.map((recommendation) => (
            <CarouselItem
              key={recommendation.id}
              className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <img
                src={recommendation.image}
                alt={recommendation.description}
                className="rounded"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-500 text-xs">
                  {recommendation.place}
                </span>
                <span className="flex items-center gap-1">
                  <StarIcon
                    className="text-pink-600"
                    fill="currentColor"
                    size={12}
                  />
                  <span className="text-pink-600 text-xs font-semibold">
                    {recommendation.rating}
                  </span>
                  <span className="text-pink-600 text-xs">
                    ({recommendation.reviews})
                  </span>
                </span>
              </div>
              <p className="font-semibold text-gray-700 mt-2">
                {recommendation.description}
              </p>
              <p className="font-semibold text-gray-700 mt-2 max-w-32">
                <span className="text-gray-500 text-xs">
                  {t("recommendations.from")}
                </span>{" "}
                <br />€ {recommendation.price}
              </p>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default Recommendations;
