"use client";
import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import CarouselCard from "../cards/CarouselCard";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";

const Recommendations = () => {
  const { t } = useTranslation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/experiences`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch recommendations");
        }
        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          const formattedRecs = result.data.map((exp: any) => ({
            id: exp._id,
            image: exp.mainImage
              ? `https://sincere-roadrunner-227.convex.cloud/api/storage/${exp.mainImage}`
              : "/images/r1.jpg.avif",
            place: "Multiple Locations",
            rating: 4.5,
            reviews: 100,
            description: exp.title,
            price: parseFloat(exp.price) || 0,
            badge: exp.tagOnCards || "Top Seller",
            city: "london",
            category: "entertainment",
            subcategory: "studio-tours",
            itemId: exp._id,
          }));
          setRecommendations(formattedRecs);
        } else {
          throw new Error("Invalid data format from API");
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
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

  if (loading) {
    return <div>Loading recommendations...</div>;
  }

  return (
    <div className="py-4 sm:py-10 max-w-[1200px] mx-auto 2xl:px-0">
      <div className="flex justify-between items-center px-[24px] xl:px-0">
        <h2 className="text-lg sm:text-2xl font-heading text-[#444444]">
          Travelers' favorite choices
        </h2>
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
      <div
        className="mt-4 pl-[24px] xl:pl-0 sm:mt-4 flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        ref={scrollContainerRef}
      >
        {recommendations.map((recommendation) => (
          <div
            key={recommendation.id}
            className="snap-start flex-shrink-0 w-[282px]"
          >
            <CarouselCard
              variant="full"
              image={recommendation.image}
              place={recommendation.place}
              rating={recommendation.rating}
              reviews={recommendation.reviews}
              description={recommendation.description}
              price={recommendation.price}
              badge={recommendation.badge}
              city={recommendation.city}
              category={recommendation.category}
              subcategory={recommendation.subcategory}
              itemId={recommendation.itemId}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
