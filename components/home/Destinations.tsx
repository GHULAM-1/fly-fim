"use client";
import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { fetchCities } from "@/api/cities/cities-api";
import { City } from "@/types/cities/cities-types";

const cityImageMap: { [key: string]: string } = {
  "New York": "/images/d6.jpeg.avif",
  London: "/images/d5.jpg.avif",
  Dubai: "/images/d4.jpg.avif",
  Rome: "/images/d3.jpg.avif",
  Paris: "/images/d2.jpg.avif",
  Singapore: "/images/d1.jpg.avif",
  "Las Vegas": "/images/d6.jpeg.avif",
};

interface Destination {
  id: string;
  description: string;
  place: string;
  image: string;
  city: string;
  slug: string;
}

// Function to transform API response to match component structure - same as cities route
const transformCityData = (response: any): Destination[] => {
  const cities = response.data || response;
  // Check if cities is an array
  if (!Array.isArray(cities)) {
    console.error('Cities is not an array:', cities);
    return [];
  }

  return cities.map((city) => {
    return {
      id: city._id,
      description: "Things to do in ", // Default description
      place: city.countryName,
      city: city.cityName,
      slug: city.cityName.toLowerCase().replace(/\s+/g, '-'),
      image: city.imageUrl || city.image
    };
  });
};

const Destinations = () => {
  const { t } = useTranslation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch cities from API - same pattern as cities route
  useEffect(() => {
    const loadCities = async () => {
      try {
        setLoading(true);
        const cities = await fetchCities();
        const transformedDestinations = transformCityData(cities);
        setDestinations(transformedDestinations);
      } catch (err) {
        console.error('Error loading cities:', err);
        setError('Failed to load cities.');
        // Keep empty array instead of fallback data
        setDestinations([]);
      } finally {
        setLoading(false);
      }
    };

    loadCities();
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = window.innerWidth >= 768 ? 180 : 140;
      const gap = 16; // gap-4 = 16px
      const scrollAmount = (cardWidth + gap) * 6; // Scroll 6 cards at a time
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = window.innerWidth >= 768 ? 180 : 140;
      const gap = 16; // gap-4 = 16px
      const scrollAmount = (cardWidth + gap) * 6; // Scroll 6 cards at a time
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="py-4 sm:py-10 max-w-[1200px] mx-auto 2xl:px-0">
        <div className="px-[24px] xl:px-0">
          <h2 className="text-lg sm:text-2xl font-heading text-[#444444] max-w-2/3">
            {t("destinations.title")}
          </h2>{" "}
        </div>
        <div className="mt-4 pl-[24px] xl:pl-0 sm:mt-4 flex gap-5 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="snap-start flex-shrink-0 p-2 w-[140px] h-[140px] md:w-[180px] md:h-[180px]"
            >
              <div className="w-full h-[140px] md:h-[180px] bg-gray-200 rounded-lg animate-pulse mb-2"></div>
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
    <div className="py-4 max-w-[1200px] mx-auto ">
      <div className="flex justify-between items-start">
        <h2 className="text-lg sm:text-2xl font-heading text-[#444444] max-w-2/3">
          {t("destinations.title")}
        </h2>
        <div className="flex items-center mt-[6px] md:mt-[0px] gap-4">
          <Link
            href="/cities"
            className="text-[14px] md:text-[15px] hover:cursor-pointer hover:text-[#7f00fe] text-[#444444] font-lightText md:underline underline-offset-4 whitespace-nowrap flex items-center gap-1"
          >
            {t("destinations.seeAll")}{" "}
            <ChevronRightIcon className="md:hidden w-4 h-4" />
          </Link>
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
        className="mt-4 sm:mt-4 flex md:gap-6 gap-4 overflow-x-scroll sm:ml-0 -ml-4 scrollbar-hide"
        ref={scrollContainerRef}
      >
        {destinations.map((destination, index) => (
          <Link
            href={`/things-to-do/${destination.slug}`}
            key={destination.id}
            className={`shrink-0 flex hover:-translate-y-2 transition-all duration-300 pt-2 w-[140px] md:w-[180px] ${index === 0 ? "ml-4 md:ml-0" : "ml-0"}`}
          >
            <div className="w-[140px] md:w-[180px] ">
              <img
                src={destination.image}
                alt={destination.description}
                className="rounded w-full object-cover h-[140px] md:h-[180px]"
              />
              <p className="text-[17px] font-heading text-[#444444] mt-2 leading-tight">
                {destination.description}
              </p>
              <p className="text-[17px] font-heading text-[#444444] leading-tight">
                {destination.city}
              </p>
              <p className="text-sm font-lightText text-[#666666] mt-1">
                {destination.place}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Destinations;
