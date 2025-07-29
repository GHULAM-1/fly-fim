"use client";
import React, { useState } from "react";
import Stats from "@/components/home/Stats";
import CityCard from "@/components/cards/CityCard";

const Cities = () => {
  const [selectedFilter, setSelectedFilter] = useState("Top 100");

  const destinations = [
    {
      id: 1,
      description: "Things to do in New York",
      place: "United States",
      image: "/images/d6.jpeg.avif",
      city: "New York",
    },
    {
      id: 2,
      description: "Things to do in London",
      place: "United Kingdom",
      image: "/images/d5.jpg.avif",
      city: "London",
    },
    {
      id: 3,
      description: "Things to do in Dubai",
      place: "United Arab Emirates",
      image: "/images/d4.jpg.avif",
      city: "Dubai",
    },
    {
      id: 4,
      description: "Things to do in Rome",
      place: "Italy",
      image: "/images/d3.jpg.avif",
      city: "Rome",
    },
    {
      id: 5,
      description: "Things to do in Paris",
      place: "France",
      image: "/images/d2.jpg.avif",
      city: "Paris",
    },
    {
      id: 6,
      description: "Things to do in Singapore",
      place: "Singapore",
      image: "/images/d1.jpg.avif",
      city: "Singapore",
    },
    {
      id: 7,
      description: "Things to do in New York",
      place: "United States",
      image: "/images/d6.jpeg.avif",
      city: "New York",
    },
    {
      id: 8,
      description: "Things to do in London",
      place: "United Kingdom",
      image: "/images/d5.jpg.avif",
      city: "London",
    },
    {
      id: 9,
      description: "Things to do in Dubai",
      place: "United Arab Emirates",
      image: "/images/d4.jpg.avif",
      city: "Dubai",
    },
    {
      id: 10,
      description: "Things to do in Rome",
      place: "Italy",
      image: "/images/d3.jpg.avif",
      city: "Rome",
    },
    {
      id: 11,
      description: "Things to do in Paris",
      place: "France",
      image: "/images/d2.jpg.avif",
      city: "Paris",
    },
    {
      id: 12,
      description: "Things to do in Singapore",
      place: "Singapore",
      image: "/images/d1.jpg.avif",
      city: "Singapore",
    },
  ];

  // Get unique cities for filter
  const cities = [
    "Top 100",
    ...Array.from(new Set(destinations.map((dest) => dest.city))),
  ];

  // Filter destinations based on selected filter
  const filteredDestinations =
    selectedFilter === "Top 100"
      ? destinations
      : destinations.filter((dest) => dest.city === selectedFilter);

  return (
    <>
      <div className="max-w-[1200px] mx-auto  md:py-[32px] pt-20 md:pt-32 pb-10 px-[24px]   xl:px-0">
        <h2 className="text-[24px] sm:text-2xl font-text  text-[#444444] sm:max-w-2/3">
          Discover all cities worldwide
        </h2>
        <div className="flex gap-3 overflow-x-auto py-4 mt-2 scrollbar-hide">
          {cities.map((city) => (
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
        <div className="flex flex-wrap md:flex-row flex-col justify-center md:justify-start -ml-4 gap-y-4 md:gap-y-10 mt-6">
          {filteredDestinations.map((destination) => (
            <CityCard
              key={destination.id}
              image={destination.image}
              description={destination.description}
              place={destination.place}
              city={destination.city}
            />
          ))}
        </div>
      </div>

      <Stats />
    </>
  );
};

export default Cities;
