"use client";
import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

// Define the structure for a city object from the backend API
interface CityFromAPI {
  _id: string;
  cityName: string;
  countryName: string;
}

// Define the structure needed by our local component
interface Destination {
  id: string;
  description: string;
  place: string;
  image: string;
  city: string; // This will be the formatted city name for display
  slug: string; // This will be the URL-friendly city name
}

// A map to associate cities with specific images to maintain visual consistency
// We use lowercase keys to match the data from the database
const cityImageMap: { [key: string]: string } = {
  paris: "/images/d2.jpg.avif",
  london: "/images/d5.jpg.avif",
  "new york": "/images/d6.jpeg.avif",
  rome: "/images/d3.jpg.avif",
  dubai: "/images/d4.jpg.avif",
  singapore: "/images/d1.jpg.avif",
};

const Destinations = () => {
  const { t } = useTranslation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/cities`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch destinations");
        }
        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          // Process and deduplicate cities from the backend
          const uniqueCities = new Map<string, Destination>();
          result.data.forEach((city: CityFromAPI) => {
            const cityNameLower = city.cityName.toLowerCase();
            if (!uniqueCities.has(cityNameLower)) {
              uniqueCities.set(cityNameLower, {
                id: city._id,
                description: `Things to do in ${city.cityName.charAt(0).toUpperCase() + city.cityName.slice(1)}`,
                place: city.countryName,
                // Use a mapped image or a default fallback
                image: cityImageMap[cityNameLower] || "/images/d1.jpg.avif",
                city:
                  city.cityName.charAt(0).toUpperCase() +
                  city.cityName.slice(1),
                slug: city.cityName.replace(/\s+/g, "-").toLowerCase(),
              });
            }
          });
          setDestinations(Array.from(uniqueCities.values()));
        } else {
          throw new Error("Invalid data format from API");
        }
      } catch (error) {
        console.error("Error fetching destinations:", error);
        // You could set an error state here to display a message to the user
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
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

  // Don't render anything if loading or no destinations
  if (loading || destinations.length === 0) {
    return (
      <div className="py-4 max-w-[1200px] mx-auto">
        <h2 className="text-lg sm:text-2xl font-heading text-[#444444] max-w-2/3">
          {t("destinations.title")}
        </h2>
        <div className="mt-4 text-center text-gray-500">
          {loading ? "Loading destinations..." : "No destinations to show."}
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
        className="mt-4 sm:mt-4 flex overflow-x-scroll -ml-4 scrollbar-hide"
        ref={scrollContainerRef}
      >
        {destinations.map((destination) => (
          <Link
            href={`/things-to-do/${destination.slug}`}
            key={destination.id}
            className="basis-2/5 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 shrink-0 pl-4 hover:-translate-y-2 transition-all duration-300 pt-2"
          >
            <img
              src={destination.image}
              alt={destination.description}
              className="rounded"
            />
            <p className="text-[17px] font-heading text-[#444444] mt-2 leading-tight max-w-32">
              {destination.description}
            </p>
            <p className="text-sm font-lightText text-[#666666] mt-1">
              {destination.place}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Destinations;
