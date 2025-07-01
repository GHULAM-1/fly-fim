import React from "react";
import { Carousel, CarouselContent } from "@/components/ui/carousel";
import CarouselCard from "../cards/CarouselCard";
import { useTranslation } from "react-i18next";

interface CarouselGridProps {
  title: string;
  recommendations: any[];
}

const CarouselGrid = ({ title, recommendations }: CarouselGridProps) => {
  const { t } = useTranslation();

  return (
    <div className="py-4 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-28 max-w-screen-2xl mx-auto 2xl:px-0">
      <div className="flex justify-between items-center">
        <h2 className="text-lg sm:text-2xl font-semibold md:font-bold text-gray-700">
          {title}
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

export default CarouselGrid;
