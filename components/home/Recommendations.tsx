"use client";
import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import CarouselCard from "../cards/CarouselCard";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";

interface Experience {
  _id: string;
  title: string;
  description: string;
  price: number;
  oldPrice?: number;
  sale?: number;
  mainImage: string;
  tagOnCards?: string;
  rating: number;
  reviews: number;
  cityName: string;
  countryName: string;
}

const originalImages = [
  "/images/r4.jpg.avif",
  "/images/r3.jpg.avif",
  "/images/r2.jpg.avif",
  "/images/r1.jpg.avif",
  "/images/r4.jpg.avif",
  "/images/r3.jpg.avif",
  "/images/r2.jpg.avif",
  "/images/r1.jpg.avif",
];

const Recommendations = () => {
  const { t } = useTranslation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [recommendations, setRecommendations] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/experiences/with-details?limit=8`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch experiences");
        }
        const result = await response.json();
        setRecommendations(result.data || []);
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
    return (
      <div className="py-4 sm:py-10 max-w-[1200px] mx-auto 2xl:px-0">
        <div className="px-[24px] xl:px-0">
          <h2 className="text-lg sm:text-2xl font-heading text-[#444444]">
            Travelers' favorite choices
          </h2>{" "}
        </div>
        <div className="mt-4 ml-[24px] xl:ml-0 sm:mt-4 flex gap-5 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="snap-start flex-shrink-0 w-[282px] p-2">
              <div className="w-full h-40 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 sm:py-10 max-w-[1200px] mx-auto 2xl:px-0">
      <div className="flex justify-between items-center px-[24px] xl:px-0">
        <h2 className="text-lg sm:text-2xl font-heading text-[#444444]">
          Travelers' favorite choices
        </h2>
        <div className="hidden md:flex items-center gap-2  ">
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
      <div
        className="mt-4 ml-[24px] xl:ml-0 sm:mt-4 flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        ref={scrollContainerRef}
      >
        {recommendations.map((rec, index) => (
          <div key={rec._id} className="snap-start flex-shrink-0 w-[282px]">
            <CarouselCard
              variant="full"
              image={
                originalImages[index % originalImages.length] || rec.mainImage
              }
              place={rec.cityName || "Top Destination"}
              rating={rec.rating}
              reviews={rec.reviews}
              description={rec.title}
              price={rec.price}
              oldPrice={rec.oldPrice}
              off={rec.sale}
              badge={rec.tagOnCards}
              city={rec.cityName}
              category="tours"
              subcategory="generic"
              itemId={rec._id}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
