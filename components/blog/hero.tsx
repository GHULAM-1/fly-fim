"use client";
import { MapPin, ChevronDown, Search } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { getAllCities, searchBlogPosts, getAllBlogPostsForTesting } from "@/lib/sanity/queries";
import { getUniqueCities } from "@/lib/utils/cityNormalization";

interface HeroProps {
  onSearchResults?: (results: any[], searchQuery: string, cityName?: string) => void;
  clearTrigger?: number;
}

export default function Hero({ onSearchResults, clearTrigger }: HeroProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Select city");
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [cities, setCities] = useState<Array<{_id: string, name: string}>>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch cities on component mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const citiesData = await getAllCities();
        // Remove duplicates and normalize city names
        const uniqueCities = getUniqueCities(citiesData);
        setCities(uniqueCities);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCitySelect = (city: {_id: string, name: string}) => {
    setSelectedCity(city.name);
    setSelectedCityId(city._id);
    setIsDropdownOpen(false);
  };

  // Clear search fields
  const clearSearchFields = () => {
    setSearchQuery("");
    setSelectedCity("Select city");
    setSelectedCityId(null);
    setIsDropdownOpen(false);
  };

  // React to clear trigger from parent
  useEffect(() => {
    if (clearTrigger && clearTrigger > 0) {
      clearSearchFields();
    }
  }, [clearTrigger]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      return;
    }

    setIsSearching(true);
    try {

      // Test: Get all blog posts first
      const allPosts = await getAllBlogPostsForTesting();
      // Search with city filter only if city is selected AND not "Select city"
      const shouldFilterByCity = selectedCity && selectedCity !== "Select city";
      const results = await searchBlogPosts(searchQuery, shouldFilterByCity ? selectedCity : undefined);
      if (onSearchResults) {
        onSearchResults(results || [], searchQuery, selectedCity !== "Select city" ? selectedCity : undefined);
      }
    } catch (error) {
      console.error("Search error:", error);
      if (onSearchResults) {
        onSearchResults([], searchQuery, selectedCity !== "Select city" ? selectedCity : undefined);
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative" data-hero-section>
      <img
        src="/blog-banner.jpg"
        alt=""
        className="w-full object-cover h-[180px] lg:h-[450px]"
      />
      <div
        className="gradient"
        style={{
          background:
            "linear-gradient(90deg, #131b26 4.83%, rgba(14, 18, 22, .88) 35.88%, rgba(0, 0, 0, .00) 92.18%)",
          mixBlendMode: "multiply",
          width: "min(1283px, 100%)",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 2,
        }}
      ></div>
      <div className="absolute mt-13 lg:mt-30 max-w-[1200px] inset-0 flex flex-col justify-start z-[4]">
        <div className="w-full max-w-[1200px] px-[24px] lg:pl-5 lg:px-0 mx-auto">
          <h1 className="text-white text-left font-halyard-text font-medium text-[21px] lg:text-[48px] leading-tight lg:mb-4">
            Make This Spring Unforgettable
          </h1>
          <p className="text-white text-left max-w-[280px] lg:max-w-none font-halyard-text text-[14px] lg:text-[24px] mb-8">
            Discover breathtaking places to visit this season
          </p>
        </div>
      </div>
      <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-full max-w-[1200px] px-[24px] lg:px-0 z-20">
        <div className="flex items-center bg-transparent gap-2">
          <div className="lg:flex-[0.29] flex-[0.6] relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex hover:cursor-pointer items-center justify-between gap-2 lg:px-4 px-2 py-[14px] bg-white rounded-[4px] shadow-lg hover:bg-gray-50 transition-colors relative z-[9998]"
            >
              <div className="flex items-center lg:gap-2 gap-1">
                <MapPin size={20} className="text-gray-400" />
                <span className={`text-gray-600 lg:text-sm text-[13px] font-medium ${isDropdownOpen ? 'text-purple-600' : ''}`}>
                  {selectedCity}
                </span>
              </div>
              <ChevronDown size={16} className={`text-gray-400 md:block hidden transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 bg-white rounded-[4px] shadow-lg border border-gray-200 z-[9999] max-h-60 overflow-y-auto">
                {cities.map((city) => (
                  <button
                    key={city._id}
                    onClick={() => handleCitySelect(city)}
                    className="w-full text-left px-4 py-3 lg:text-sm text-[15px] text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    {city.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex-1 bg-white rounded-[4px] relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search blog posts by title..."
              className="w-full px-4 py-[14px] pr-12 text-[#444444] shadow-lg text-sm font-halyard-text-light placeholder-[#666666] focus:outline-none rounded-[4px]"
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors lg:hidden"
            >
              <Search size={20} />
            </button>
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="bg-purple-600 lg:flex hidden shadow-lg hover:bg-purple-700 disabled:bg-purple-400 text-white px-12 py-[12px] font-medium transition-colors rounded-[4px]
             items-center gap-2"
          >
            {isSearching ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Searching...
              </>
            ) : (
              <>
                <Search size={16} />
                Search
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
