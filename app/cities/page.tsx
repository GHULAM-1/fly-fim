"use client";
import React, { useState } from "react";
import Stats from "@/components/home/Stats";
import CityCard from "@/components/cards/CityCard";

const allCitiesData = [
  {
    id: "1",
    description: "Things to do in",
    place: "United States",
    displayName: "New York",
    slug: "new-york",
    image: "/images/d6.jpeg.avif",
  },
  {
    id: "2",
    description: "Things to do in",
    place: "United Kingdom",
    displayName: "London",
    slug: "london",
    image: "/images/d5.jpg.avif",
  },
  {
    id: "3",
    description: "Things to do in",
    place: "United Arab Emirates",
    displayName: "Dubai",
    slug: "dubai",
    image: "/images/d4.jpg.avif",
  },
  {
    id: "4",
    description: "Things to do in",
    place: "Italy",
    displayName: "Rome",
    slug: "rome",
    image: "/images/d3.jpg.avif",
  },
  {
    id: "5",
    description: "Things to do in",
    place: "France",
    displayName: "Paris",
    slug: "paris",
    image: "/images/d2.jpg.avif",
  },
  {
    id: "6",
    description: "Things to do in",
    place: "Singapore",
    displayName: "Singapore",
    slug: "singapore",
    image: "/images/d1.jpg.avif",
  },
];

const Cities = () => {
  const [selectedFilter, setSelectedFilter] = useState("All Cities");

  const allCities = allCitiesData;

  const cityFilters = [
    "All Cities",
    ...Array.from(new Set(allCities.map((city) => city.displayName))),
  ];

  const filteredDestinations =
    selectedFilter === "All Cities"
      ? allCities
      : allCities.filter((dest) => dest.displayName === selectedFilter);

  return (
    <>
      <div className="max-w-[1200px] mx-auto  md:py-[32px] pt-20 md:pt-32 pb-10 px-[24px]   xl:px-0">
        <h2 className="text-[24px] sm:text-2xl font-text  text-[#444444] sm:max-w-2/3">
          Discover all cities worldwide
        </h2>

        <>
          <div className="flex gap-3 overflow-x-auto py-4 mt-2 scrollbar-hide">
            {cityFilters.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedFilter(city)}
                className={`px-4 py-1.5 text-sm rounded hover:cursor-pointer font-halyard-text-light whitespace-nowrap border transition-all duration-200 ${
                  selectedFilter === city
                    ? "bg-purple-600/10 text-purple-600 border-purple-600/10"
                    : "text-gray-700 border-gray-200 hover:bg-purple-600/10 hover:text-purple-600 hover:border-purple-600/10"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap md:flex-row flex-col justify-center md:justify-start -ml-4 gap-y-0 md:gap-y-10 mt-6">
            {filteredDestinations.map((destination) => (
              <CityCard
                key={destination.id}
                image={destination.image}
                description={destination.description}
                place={destination.place}
                city={destination.slug}
                displayName={destination.displayName}
              />
            ))}
          </div>
        </>
      </div>
      <div className="px-[24px]">
        <Stats />
      </div>
    </>
  );
};

export default Cities;
