"use client";
import React, { useState, useEffect } from "react";
import Stats from "@/components/home/Stats";
import CityCard from "@/components/cards/CityCard";


interface CityFromAPI {
  _id: string;
  cityName: string;
  countryName: string;
}


interface CityForCard {
  id: string;
  description: string;
  place: string;
  image: string;
  displayName: string; 
  slug: string; 
}


const cityImageMap: { [key: string]: string } = {
  paris: "/images/d2.jpg.avif",
  london: "/images/d5.jpg.avif",
  "new york": "/images/d6.jpeg.avif",
  rome: "/images/d3.jpg.avif",
  dubai: "/images/d4.jpg.avif",
  singapore: "/images/d1.jpg.avif",
};


const formatCityName = (name: string) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const Cities = () => {
  const [selectedFilter, setSelectedFilter] = useState("All Cities");
  const [allCities, setAllCities] = useState<CityForCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/cities`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch cities");
        }
        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          
          const formattedCities = result.data.map((city: CityFromAPI) => {
            const cityNameLower = city.cityName.trim().toLowerCase();
            return {
              id: city._id,
              description: "Things to do in",
              place: city.countryName,
              displayName: formatCityName(city.cityName),
              slug: city.cityName.replace(/\s+/g, "-").toLowerCase(),
              image: cityImageMap[cityNameLower] || "/images/d1.jpg.avif",
            };
          });
          setAllCities(formattedCities);
        } else {
          throw new Error("Invalid data format from API");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  
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

        {loading ? (
          <div className="py-4 mt-2">Loading cities...</div>
        ) : error ? (
          <div className="py-4 mt-2 text-red-500">Error: {error}</div>
        ) : (
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

      <Stats />
    </>
  );
};

export default Cities;
