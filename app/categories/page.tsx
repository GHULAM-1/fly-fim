"use client";
import React, { useEffect, useState } from "react";
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
import { fetchHomePage } from "@/api/worldwide/worlwide-home-api";
import { WorldwideResponse } from "@/types/worldwide/worldwide-home-types";

export default function Categories() {
  const [data, setData] = useState<WorldwideResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
    useEffect(() => {
      const loadData = async () => {
        try {
          setLoading(true);
          const data = await fetchHomePage();
          setData(data);
        } catch (err) {
          console.error('Error loading cities:', err);
          setError('Failed to load cities.');
          // Keep empty array instead of fallback data
          setData(null);  
        } finally {
          setLoading(false);
        }
      };
  
      loadData();
    }, []);
  
  // Hardcoded categories array with icons and styling
  const hardcodedCategories = [
    { name: "Tickets", icon: Ticket, color: "gray" },
    { name: "Tours", icon: Flag, color: "gray" },
    { name: "Transportation", icon: Bus, color: "gray" },
    { name: "Travel Services", icon: Briefcase, color: "gray" },
    { name: "Cruises", icon: Ship, color: "gray" },
    { name: "Food & Drink", icon: Utensils, color: "gray" },
    { name: "Entertainment", icon: Tv, color: "gray" },
    { name: "Adventure", icon: Backpack, color: "gray" },
    { name: "Water Sports", icon: Waves, color: "gray" },
    { name: "Wellness", icon: Heart, color: "gray" },
    { name: "Specials", icon: Star, color: "purple" },
    { name: "Museums", icon: Ticket, color: "gray" },
    { name: "Attractions", icon: Flag, color: "gray" },
    { name: "Activities", icon: Backpack, color: "gray" },
  ];

  // Function to map only API categories with hardcoded styling
  const getRestructuredCategories = () => {
    if (!data?.data?.categories) return [];
    
    return data.data.categories
      .map(apiCategory => {
        // Find matching hardcoded category for styling
        const hardcodedCategory = hardcodedCategories.find(
          hardcoded => hardcoded.name.toLowerCase() === apiCategory.categoryName.toLowerCase()
        );
        
        return {
          name: apiCategory.categoryName,
          icon: hardcodedCategory?.icon || Backpack, // fallback icon
          color: hardcodedCategory?.color || "gray", // fallback color
          apiData: apiCategory, // Include original API data
        };
      })
      .filter(category => category); // Remove any null/undefined entries
  };
  return (
    <div className="px-4">
             <div className="mt-18">
         <CategoriesCards
           title={"Things to do worldwide"}
           recommendations={data?.data?.experiences || []}
         />
       </div>
       <div className="mt-10 mb-10">
         <h1 className="text-[19px] font-halyard-text text-[#444444]">
           Categories
         </h1>
        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {getRestructuredCategories().map((category) => {
            const IconComponent = category.icon;
            return (
              <a
                key={category.name}
                href={`/things-to-do/worldwide/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
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
