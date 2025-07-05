"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import { Carousel, CarouselContent } from "@/components/ui/carousel";
import CarouselCard from "../cards/CarouselCard";

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
    <div className="py-4 sm:py-10 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-28 max-w-screen-2xl mx-auto 2xl:px-0">
      <div className="flex justify-between items-center">
        <h2 className="text-lg sm:text-2xl font-semibold md:font-bold text-gray-700">
          Headout’s top recommendations
        </h2>
        <div className="hidden md:flex items-center gap-2">
          <button className="text-sm text-gray-500 underline underline-offset-4 whitespace-nowrap">
            {t("recommendations.seeAll")}
          </button>
        </div>
      </div>
      <Carousel className="mt-4 sm:mt-10">
        <CarouselContent>
          {recommendations.map((recommendation) => (
            <CarouselCard
              key={recommendation.id}
              image={recommendation.image}
              place={recommendation.place}
              rating={recommendation.rating}
              reviews={recommendation.reviews}
              description={recommendation.description}
              price={recommendation.price}
            />
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default Recommendations;
