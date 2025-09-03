"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import CategoriesCards from "@/components/categories/categories";
import {
  Ticket,
  Flag,
  Car,
  Bus,
  Briefcase,
  Ship,
  Utensils,
  Tv,
  Backpack,
  Waves,
  Heart,
  Star,
} from "lucide-react";

interface Destination {
  id: string;
  description: string;
  place: string;
  price: string;
  image: string;
  city: string;
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

export default function Categories() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/cities`
        );
        if (!response.ok) throw new Error("Failed to fetch destinations");
        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          const formattedDests = result.data.map((city: any) => ({
            id: city._id,
            description: `Things to do in ${city.cityName.charAt(0).toUpperCase() + city.cityName.slice(1)}`,
            place: city.countryName,
            price: "from $10.0",
            image:
              cityImageMap[city.cityName.toLowerCase()] ||
              "/images/d1.jpg.avif",
            city:
              city.cityName.charAt(0).toUpperCase() + city.cityName.slice(1),
            slug: city.cityName.replace(/\s+/g, "-").toLowerCase(),
          }));
          setDestinations(formattedDests);
        } else {
          throw new Error("Invalid data format from API");
        }
      } catch (error) {
        console.error("Error fetching destinations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  const categories = [
    {
      id: 2,
      name: "Tickets",
      color: "gray",
      url: `/things-to-do/worldwide/tickets`,
      icon: Ticket,
    },
    {
      id: 3,
      name: "Tours",
      color: "gray",
      url: `/things-to-do/worldwide/tours`,
      icon: Flag,
    },
    {
      id: 4,
      name: "Transportation",
      color: "gray",
      url: `/things-to-do/worldwide/transportation`,
      icon: Bus,
    },
    {
      id: 5,
      name: "Travel Services",
      color: "gray",
      url: `/things-to-do/worldwide/travel-services`,
      icon: Briefcase,
    },
    {
      id: 6,
      name: "Cruises",
      color: "gray",
      url: `/things-to-do/worldwide/cruises`,
      icon: Ship,
    },
    {
      id: 7,
      name: "Food & Drink",
      color: "gray",
      url: `/things-to-do/worldwide/food-drink`,
      icon: Utensils,
    },
    {
      id: 8,
      name: "Entertainment",
      color: "gray",
      url: `/things-to-do/worldwide/entertainment`,
      icon: Tv,
    },
    {
      id: 9,
      name: "Adventure",
      color: "gray",
      url: `/things-to-do/worldwide/adventure`,
      icon: Backpack,
    },
    {
      id: 10,
      name: "Water Sports",
      color: "gray",
      url: `/things-to-do/worldwide/water-sports`,
      icon: Waves,
    },
    {
      id: 11,
      name: "Wellness",
      color: "gray",
      url: `/things-to-do/worldwide/wellness`,
      icon: Heart,
    },
    {
      id: 12,
      name: "Specials",
      color: "gray",
      url: `/things-to-do/worldwide/specials`,
      icon: Star,
    },
  ];

  return (
    <div className="px-4">
      <div className="mt-18">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <CategoriesCards
            title={"Things to do worldwide"}
            recommendations={destinations}
          />
        )}
      </div>
      <div className="mt-10 mb-10">
        <h1 className="text-[19px] font-halyard-text text-[#444444]">
          Categories
        </h1>
        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <a
                key={category.id}
                href={category.url}
                className={`flex flex-row items-center justify-start gap-2 py-[14px] px-[12px] bg-white rounded-[4px] border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200 cursor-pointer ${
                  category.color === "purple"
                    ? "border-purple-200 bg-purple-50"
                    : "hover:bg-gray-50"
                }`}
              >
                <IconComponent
                  size={16}
                  className={`font-halyard-text-light text-[#444444] ${
                    category.color === "purple"
                      ? "text-purple-600"
                      : "text-gray-600"
                  }`}
                />
                <span
                  className={`text-sm text-wrap font-halyard-text-light text-[#444444] ${
                    category.color === "purple"
                      ? "text-purple-700"
                      : "text-gray-700"
                  }`}
                >
                  {category.name}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
