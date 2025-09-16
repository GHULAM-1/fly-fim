"use client";
import React, { useState, useEffect } from "react";
import Stats from "@/components/home/Stats";
import CityCard from "@/components/cards/CityCard";
import { fetchCities } from "@/api/cities/cities-api";
import { City } from "@/types/cities/cities-types";

interface TransformedCity {
  id: string;
  description: string;
  place: string;
  displayName: string;
  slug: string;
  image: string;
}

// Function to transform API response to match component structure
const transformCityData = (response: any): TransformedCity[] => {
    const cities = response.data || response;  
  // Check if cities is an array
  if (!Array.isArray(cities)) {
    console.error('Cities is not an array:', cities);
    return [];
  }
  
  return cities.map((city) => {
    console.log('Individual city:', city); // Debug log for each city
    return {
      id: city._id,
      description: "Things to do in", // Default description
      place: city.countryName,
      displayName: city.cityName,
      slug: city.cityName.toLowerCase().replace(/\s+/g, '-'),
      image: city.imageUrl || city.image || "/images/d6.jpeg.avif", // Fallback to default image
    };
  });
};

const Cities = () => {
  const [selectedFilter, setSelectedFilter] = useState("All Cities");
  const [allCities, setAllCities] = useState<TransformedCity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch cities from API
  useEffect(() => {
    const loadCities = async () => {
      try {
        setLoading(true);
        const cities = await fetchCities();
        console.log("cities", cities);
        const transformedCities = transformCityData(cities);
        console.log("transformedCities", transformedCities);
        setAllCities(transformedCities);
      } catch (err) {
        console.error('Error loading cities:', err);
        setError('Failed to load cities.');
        // Keep using the default allCitiesData
      } finally {
        setLoading(false);
      }
    };

    loadCities();
  }, []);

  const cityFilters = [
    "All Cities",
    ...Array.from(new Set(allCities.map((city) => city.place))),
  ];

  const filteredDestinations =
    selectedFilter === "All Cities"
      ? allCities
      : allCities.filter((dest) => dest.place === selectedFilter);

  return (
    <>
      <div className="max-w-[1200px] mx-auto  md:py-[32px] pt-20 md:pt-32 pb-10 px-[24px]   xl:px-0">
        <h2 className="text-[24px] sm:text-2xl font-text  text-[#444444] sm:max-w-2/3">
          Discover all cities worldwide
        </h2>

        {error && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-2 text-gray-600">Loading cities...</span>
          </div>
        )}

        {!loading && (
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
        )}
      </div>
      <div className="px-[24px]">
        <Stats />
      </div>
    </>
  );
};

export default Cities;
