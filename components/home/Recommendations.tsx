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

  // Mock data array
  const mockRecommendations: Experience[] = [
    {
      _id: "1",
      title: "Skip-the-Line Eiffel Tower Summit Access",
      description: "Experience the iconic Eiffel Tower with priority access to the summit",
      price: 45,
      oldPrice: 60,
      sale: 25,
      mainImage: "/images/r1.jpg.avif",
      tagOnCards: "Bestseller",
      rating: 4.8,
      reviews: 2847,
      cityName: "Paris",
      countryName: "France",
    },
    {
      _id: "2",
      title: "London Eye Fast Track Entry",
      description: "Skip the queues and enjoy panoramic views of London",
      price: 32,
      oldPrice: 40,
      sale: 20,
      mainImage: "/images/r2.jpg.avif",
      tagOnCards: "Popular",
      rating: 4.6,
      reviews: 1923,
      cityName: "London",
      countryName: "United Kingdom",
    },
    {
      _id: "3",
      title: "Dubai Desert Safari with BBQ Dinner",
      description: "Experience the magic of the Arabian desert with traditional entertainment",
      price: 85,
      oldPrice: 120,
      sale: 29,
      mainImage: "/images/r3.jpg.avif",
      tagOnCards: "Limited Time",
      rating: 4.9,
      reviews: 3421,
      cityName: "Dubai",
      countryName: "United Arab Emirates",
    },
    {
      _id: "4",
      title: "Colosseum Underground & Arena Floor Tour",
      description: "Explore the hidden areas of Rome's most famous amphitheater",
      price: 55,
      oldPrice: 70,
      sale: 21,
      mainImage: "/images/r4.jpg.avif",
      tagOnCards: "Exclusive",
      rating: 4.7,
      reviews: 2156,
      cityName: "Rome",
      countryName: "Italy",
    },
    {
      _id: "5",
      title: "Times Square Food Tour",
      description: "Taste the best of New York's diverse culinary scene",
      price: 75,
      oldPrice: 95,
      sale: 21,
      mainImage: "/images/r1.jpg.avif",
      tagOnCards: "Foodie Favorite",
      rating: 4.5,
      reviews: 1834,
      cityName: "New York",
      countryName: "United States",
    },
    {
      _id: "6",
      title: "Singapore Night Safari",
      description: "Discover nocturnal wildlife in the world's first night zoo",
      price: 48,
      oldPrice: 60,
      sale: 20,
      mainImage: "/images/r2.jpg.avif",
      tagOnCards: "Family Friendly",
      rating: 4.4,
      reviews: 1657,
      cityName: "Singapore",
      countryName: "Singapore",
    },
    {
      _id: "7",
      title: "Las Vegas Strip Helicopter Tour",
      description: "Soar above the dazzling lights of the Las Vegas Strip",
      price: 125,
      oldPrice: 150,
      sale: 17,
      mainImage: "/images/r3.jpg.avif",
      tagOnCards: "Thrilling",
      rating: 4.8,
      reviews: 987,
      cityName: "Las Vegas",
      countryName: "United States",
    },
    {
      _id: "8",
      title: "Tokyo Robot Restaurant Show",
      description: "Experience the futuristic entertainment of Tokyo's robot show",
      price: 65,
      oldPrice: 80,
      sale: 19,
      mainImage: "/images/r4.jpg.avif",
      tagOnCards: "Unique Experience",
      rating: 4.3,
      reviews: 1234,
      cityName: "Tokyo",
      countryName: "Japan",
    },
  ];

  useEffect(() => {
    // Simulate loading delay for better UX
    const timer = setTimeout(() => {
      setRecommendations(mockRecommendations);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
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
