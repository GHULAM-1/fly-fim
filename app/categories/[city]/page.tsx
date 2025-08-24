"use client";
import React from "react";
import { useParams } from "next/navigation";
import CategoriesCards from "@/components/categories/categories";
import {
  Ticket,
  Flag,
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

export default function Categories() {
  const params = useParams();
  
  // Get the city from URL params and decode URL encoding (e.g., "New%20York" -> "New York")
  const city = decodeURIComponent(params.city as string);
  
  // Check if we're on a city-specific route
  const isCityRoute = Boolean(city);
  
  const destinations = [
    {
      id: 1,
      description: "Things to do in",
      place: "United States",
      price: "from $10.0",
      image: "/images/d6.jpeg.avif",
      city: "New York",
    },
    {
      id: 2,
      description: "Things to do in",
      place: "United Kingdom",
      price: "from $10.0",
      image: "/images/d5.jpg.avif",
      city: "London",
    },
    {
      id: 3,
      description: "Things to do in",
      place: "United Arab Emirates",
      price: "from $10.0",
      image: "/images/d4.jpg.avif",
      city: "Dubai",
    },
    {
      id: 4,
      description: "Things to do in",
      place: "Italy",
      price: "from $10.0",
      image: "/images/d3.jpg.avif",
      city: "Rome",
    },
    {
      id: 5,
      description: "Things to do in",
      place: "France",
      price: "from $10.0",
      image: "/images/d2.jpg.avif",
      city: "Paris",
    },
    {
      id: 6,
      description: "Things to do in",
      place: "Singapore",
      price: "from $10.0",
      image: "/images/d1.jpg.avif",
      city: "Singapore",
    },
    {
      id: 7,
      description: "Things to do in York",
      place: "United States",
      price: "from $10.0",
      image: "/images/d6.jpeg.avif",
      city: "New York",
    },
    {
      id: 8,
      description: "Things to do in",
      place: "United Kingdom",
      price: "from $10.0",
      image: "/images/d5.jpg.avif",
      city: "London",
    },
    {
      id: 9,
      description: "Things to do in",
      place: "United Arab Emirates",
      price: "from $10.0",
      image: "/images/d4.jpg.avif",
      city: "Dubai",
    },
    {
      id: 10,
      description: "Things to do in",
      place: "Italy",
      price: "from $10.0",
      image: "/images/d3.jpg.avif",
      city: "Rome",
    },
    {
      id: 11,
      description: "Things to do in",
      place: "France",
      price: "from $10.0",
      image: "/images/d2.jpg.avif",
      city: "Paris",
    },
    {
      id: 12,
      description: "Things to do in",
      place: "Singapore",
      price: "from $10.0",
      image: "/images/d1.jpg.avif",
      city: "Singapore",
    },
  ];
  const categories = [
    {
      id: 2,
      name: "Tickets",
      color: "gray",
      url: `/things-to-do/${city}/tickets`,
      icon: Ticket,
    },
    { 
      id: 3, 
      name: "Tours", 
      color: "gray", 
      url: `/things-to-do/${city}/tours`,
      icon: Flag,
    },
    {
      id: 4,
      name: "Transportation",
      color: "gray",
      url: `/things-to-do/${city}/transportation`,
      icon: Bus,
    },
    {
      id: 5,
      name: "Travel Services",
      color: "gray",
      url: `/things-to-do/${city}/travel-services`,
      icon: Briefcase,
    },
    {
      id: 6,
      name: "Cruises",
      color: "gray",
      url: `/things-to-do/${city}/cruises`,
      icon: Ship,
    },
    {
      id: 7,
      name: "Food & Drink",
      color: "gray",
      url: `/things-to-do/${city}/food-drink`,
      icon: Utensils,
    },
    {
      id: 8,
      name: "Entertainment",
      color: "gray",
      url: `/things-to-do/${city}/entertainment`,
      icon: Tv,
    },
    {
      id: 9,
      name: "Adventure",
      color: "gray",
      url: `/things-to-do/${city}/adventure`,
      icon: Backpack,
    },
    {
      id: 10,
      name: "Water Sports",
      color: "gray",
      url: `/things-to-do/${city}/water-sports`,
      icon: Waves,
    },
    {
      id: 11,
      name: "Wellness",
      color: "gray",
      url: `/things-to-do/${city}/wellness`,
      icon: Heart,
    },
    {
      id: 12,
      name: "Specials",
      color: "gray",
      url: `/things-to-do/${city}/specials`,
      icon: Star,
    },
  ];
  return (
    <div className="px-4">
             <div className="mt-18">
         <CategoriesCards
           title={isCityRoute ? `Things to do in ${city}` : "Things to do worldwide"}
           recommendations={destinations}
         />
       </div>
       <div className="mt-10">
         <h1 className="text-[19px] font-halyard-text text-[#444444]">
           {isCityRoute ? `Categories in ${city}` : "Categories"}
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
                <span className={`text-sm text-wrap font-halyard-text-light text-[#444444] ${
                  category.color === "purple" 
                    ? "text-purple-700" 
                    : "text-gray-700"
                }`}>
                  {category.name}
                </span>
              </a>
            );
          })}
        </div>
      </div>
      <div className="mt-10 mb-10">
        <h1 className="text-[19px] font-halyard-text text-[#444444]">
          Categories Worldwide
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
                <span className={`text-sm text-wrap font-halyard-text-light text-[#444444] ${
                  category.color === "purple" 
                    ? "text-purple-700" 
                    : "text-gray-700"
                }`}>
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
