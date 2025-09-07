"use client";
import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

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
          throw new Error("Failed to fetch cities");
        }
        const result = await response.json();

        const uniqueCities = new Map<string, Destination>();

        result.data.forEach((city: any) => {
          if (!uniqueCities.has(city.cityName)) {
            const slug = city.cityName.toLowerCase().replace(/\s+/g, "-");
            uniqueCities.set(city.cityName, {
              id: city._id,
              description: `Things to do in ${city.cityName}`,
              place: city.countryName,
              city: city.cityName,
              slug: slug,
              image: cityImageMap[city.cityName] || "/images/d1.jpg.avif",
            });
          }
        });

        setDestinations(Array.from(uniqueCities.values()));
      } catch (error) {
        console.error("Error fetching destinations:", error);
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

  if (loading) {
    return (
      <div className="py-4 sm:py-10 max-w-[1200px] mx-auto 2xl:px-0">
        <div className="px-[24px] xl:px-0">
          <h2 className="text-lg sm:text-2xl font-heading text-[#444444] max-w-2/3">
            {t("destinations.title")}
          </h2>{" "}
        </div>
        <div className="mt-4 pl-[24px] xl:pl-0 sm:mt-4 flex gap-5 overflow-hidden">
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
