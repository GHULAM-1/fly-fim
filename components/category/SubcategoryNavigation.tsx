"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Footprints,
  User,
  Bus,
  MapPin,
  Globe,
  Landmark,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubcategoryNavigationProps {
  categoryName: string;
  currentSubcategory?: string;
}

interface SubcategoryItem {
  id: string;
  label: string;
  url: string;
  icon?: React.ComponentType<any>;
}

const SubcategoryNavigation: React.FC<SubcategoryNavigationProps> = ({
  categoryName,
  currentSubcategory,
}) => {
  const params = useParams();
  const router = useRouter();
  const city = params.city as string;
  const category = params.category as string;
  const subcategory = params.subcategory as string;

  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Get subcategories based on category
  const getSubcategories = (): SubcategoryItem[] => {
    const baseUrl = `/things-to-do/${city}/${category}`;
    
    switch (categoryName.toLowerCase()) {
      case "tours":
        return [
          { id: "all", label: "All", url: baseUrl },
          { id: "walking-tours", label: "Walking Tours", url: `${baseUrl}/walking-tours`, icon: Footprints },
          { id: "guided-tours", label: "Guided Tours", url: `${baseUrl}/guided-tours`, icon: User },
          { id: "city-tours", label: "City Tours", url: `${baseUrl}/city-tours`, icon: MapPin },
          { id: `hop-on-hop-off-tours`, label: `Hop-on Hop-off Tours`, url: `${baseUrl}/hop-on-hop-off-tours`, icon: Bus },
          { id: "day-trips", label: "Day Trips", url: `${baseUrl}/day-trips`, icon: Globe },
          { id: "heritage-experiences", label: "Heritage Experiences", url: `${baseUrl}/heritage-experiences`, icon: Landmark },
        ];
      case "tickets":
        return [
          { id: "all", label: "All", url: baseUrl },
          { id: "museums", label: "Museums", url: `${baseUrl}/museums` },
          { id: "landmarks", label: "Landmarks", url: `${baseUrl}/landmarks` },
          { id: "zoos", label: "Zoos", url: `${baseUrl}/zoos` },
          { id: "religious-sites", label: "Religious Sites", url: `${baseUrl}/religious-sites` },
          { id: "city-cards", label: "City Cards", url: `${baseUrl}/city-cards` },
          { id: "theme-parks", label: "Theme Parks", url: `${baseUrl}/theme-parks` },
        ];
      case "transportation":
        return [
          { id: "all", label: "All", url: baseUrl },
          { id: "public-transport", label: "Public Transport", url: `${baseUrl}/public-transport` },
          { id: "car-rentals", label: "Car Rentals", url: `${baseUrl}/car-rentals` },
          { id: "ferry-services", label: "Ferry Services", url: `${baseUrl}/ferry-services` },
          { id: "airport-transfers", label: "Airport Transfers", url: `${baseUrl}/airport-transfers` },
          { id: "bike-rentals", label: "Bike Rentals", url: `${baseUrl}/bike-rentals` },
          { id: "metro-services", label: "Metro Services", url: `${baseUrl}/metro-services` },
        ];
      case "food-drink":
        return [
          { id: "all", label: "All", url: baseUrl },
          { id: "cooking-classes", label: "Cooking Classes", url: `${baseUrl}/cooking-classes` },
          { id: "food-tours", label: "Food Tours", url: `${baseUrl}/food-tours` },
          { id: "wine-tastings", label: "Wine Tastings", url: `${baseUrl}/wine-tastings` },
          { id: "restaurant-reservations", label: "Restaurant Reservations", url: `${baseUrl}/restaurant-reservations` },
          { id: "local-markets", label: "Local Markets", url: `${baseUrl}/local-markets` },
          { id: "dietary-options", label: "Dietary Options", url: `${baseUrl}/dietary-options` },
        ];
      case "entertainment":
        return [
          { id: "all", label: "All", url: baseUrl },
          { id: "live-shows", label: "Live Shows", url: `${baseUrl}/live-shows` },
          { id: "theater", label: "Theater", url: `${baseUrl}/theater` },
          { id: "theme-parks", label: "Theme Parks", url: `${baseUrl}/theme-parks` },
          { id: "concerts", label: "Concerts", url: `${baseUrl}/concerts` },
          { id: "comedy-clubs", label: "Comedy Clubs", url: `${baseUrl}/comedy-clubs` },
          { id: "nightlife", label: "Nightlife", url: `${baseUrl}/nightlife` },
        ];
      case "adventure":
        return [
          { id: "all", label: "All", url: baseUrl },
          { id: "hiking", label: "Hiking Trails", url: `${baseUrl}/hiking` },
          { id: "rock-climbing", label: "Rock Climbing", url: `${baseUrl}/rock-climbing` },
          { id: "off-road-tours", label: "Off-Road Tours", url: `${baseUrl}/off-road-tours` },
          { id: "skydiving", label: "Skydiving", url: `${baseUrl}/skydiving` },
          { id: "bungee-jumping", label: "Bungee Jumping", url: `${baseUrl}/bungee-jumping` },
          { id: "ziplining", label: "Ziplining", url: `${baseUrl}/ziplining` },
        ];
      case "water-sports":
        return [
          { id: "all", label: "All", url: baseUrl },
          { id: "kayaking", label: "Kayaking", url: `${baseUrl}/kayaking` },
          { id: "surfing", label: "Surfing", url: `${baseUrl}/surfing` },
          { id: "snorkeling", label: "Snorkeling", url: `${baseUrl}/snorkeling` },
          { id: "scuba-diving", label: "Scuba Diving", url: `${baseUrl}/scuba-diving` },
          { id: "jet-skiing", label: "Jet Skiing", url: `${baseUrl}/jet-skiing` },
          { id: "sailing", label: "Sailing", url: `${baseUrl}/sailing` },
        ];
      case "wellness":
        return [
          { id: "all", label: "All", url: baseUrl },
          { id: "spa-retreats", label: "Spa Retreats", url: `${baseUrl}/spa-retreats` },
          { id: "yoga-classes", label: "Yoga Classes", url: `${baseUrl}/yoga-classes` },
          { id: "meditation", label: "Meditation Retreats", url: `${baseUrl}/meditation` },
          { id: "fitness-centers", label: "Fitness Centers", url: `${baseUrl}/fitness-centers` },
          { id: "thermal-baths", label: "Thermal Baths", url: `${baseUrl}/thermal-baths` },
          { id: "mindfulness", label: "Mindfulness Workshops", url: `${baseUrl}/mindfulness` },
        ];
      case "specials":
        return [
          { id: "all", label: "All", url: baseUrl },
          { id: "discount-deals", label: "Discount Deals", url: `${baseUrl}/discount-deals` },
          { id: "vip-experiences", label: "VIP Experiences", url: `${baseUrl}/vip-experiences` },
          { id: "package-deals", label: "Package Deals", url: `${baseUrl}/package-deals` },
          { id: "seasonal-offers", label: "Seasonal Offers", url: `${baseUrl}/seasonal-offers` },
          { id: "last-minute", label: "Last Minute Deals", url: `${baseUrl}/last-minute` },
          { id: "group-discounts", label: "Group Discounts", url: `${baseUrl}/group-discounts` },
        ];
      case "cruises":
        return [
          { id: "all", label: "All", url: baseUrl },
          { id: "port-excursions", label: "Port Excursions", url: `${baseUrl}/port-excursions` },
          { id: "shore-tours", label: "Shore Tours", url: `${baseUrl}/shore-tours` },
          { id: "cruise-packages", label: "Cruise Packages", url: `${baseUrl}/cruise-packages` },
          { id: "onboard-activities", label: "Onboard Activities", url: `${baseUrl}/onboard-activities` },
          { id: "dining-options", label: "Dining Options", url: `${baseUrl}/dining-options` },
          { id: "entertainment", label: "Entertainment", url: `${baseUrl}/entertainment` },
        ];
      case "travel-services":
        return [
          { id: "all", label: "All", url: baseUrl },
          { id: "planning", label: "Travel Planning", url: `${baseUrl}/planning` },
          { id: "concierge", label: "Concierge Services", url: `${baseUrl}/concierge` },
          { id: "insurance", label: "Travel Insurance", url: `${baseUrl}/insurance` },
          { id: "visa-services", label: "Visa Services", url: `${baseUrl}/visa-services` },
          { id: "currency", label: "Currency Exchange", url: `${baseUrl}/currency` },
          { id: "translations", label: "Translation Services", url: `${baseUrl}/translations` },
        ];
      default:
        return [
          { id: "all", label: "All", url: baseUrl },
        ];
    }
  };

  const subcategories = getSubcategories();

  // Determine the active subcategory
  const getActiveSubcategory = (): string => {
    if (subcategory) {
      // If we're on a subcategory page, find the matching subcategory
      const decodedSubcategory = decodeURIComponent(subcategory.replace(/-/g, ' '));
      const found = subcategories.find(sub => 
        sub.id !== "all" && 
        (sub.id === subcategory || sub.label.toLowerCase() === decodedSubcategory.toLowerCase())
      );
      return found ? found.id : "all";
    }
    return "all";
  };

  const activeSubcategory = getActiveSubcategory();

  const handleSubcategoryClick = (subcategoryItem: SubcategoryItem) => {
    if (subcategoryItem.id === "all") {
      // Navigate to category page (without subcategory)
      router.push(subcategoryItem.url);
    } else {
      // Navigate to subcategory page
      router.push(subcategoryItem.url);
    }
  };

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  // Handle scroll visibility
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setShowLeftButton(scrollLeft > 0);
        setShowRightButton(scrollLeft + clientWidth < scrollWidth - 1);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      handleScroll(); // Initial check
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Button styles (mimic main category menu)
  const getButtonStyles = (item: SubcategoryItem, isActive: boolean) => {
    return `font-halyard-text hover:cursor-pointer flex items-center text-sm sm:text-base gap-2 py-[11px] px-[15px] rounded-[4px] whitespace-nowrap transition-all duration-200 mb-0 ${
      isActive
        ? "text-purple-600 font-semibold"
        : "text-[#444444] hover:text-purple-600"
    }`;
  };

  return (
    <div className="relative">
      <div
        ref={scrollContainerRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide z-10 max-w-[1200px] mx-auto px-[24px] xl:px-0"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {showLeftButton && (
          <div className="absolute left-3.5 top-0 z-10 bottom-0 items-center md:flex hidden">
            <div className="bg-gradient-to-r from-white via-white/50 to-transparent w-20 h-full flex items-center justify-start">
              <div className="bg-white shadow-sm shadow-white border border-gray-200 rounded-full p-1.5 cursor-pointer hover:border-gray-400">
                <ChevronLeft
                  size={16}
                  className="text-[#444444]"
                  onClick={scrollLeft}
                />
              </div>
            </div>
          </div>
        )}

        {subcategories.map((subcategoryItem) => {
          const isActive = activeSubcategory === subcategoryItem.id;
          const Icon = subcategoryItem.icon;
          return (
            <div key={subcategoryItem.id} className="relative">
              <button
                onClick={() => handleSubcategoryClick(subcategoryItem)}
                className={getButtonStyles(subcategoryItem, isActive)}
              >
                {Icon && <Icon strokeWidth={1} className="md:w-5 md:h-5 w-5 h-5" />}
                {subcategoryItem.label}
              </button>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full mb-0 pb-0" />
              )}
            </div>
          );
        })}

        {showRightButton && (
          <div className="absolute right-0 top-0 bottom-0 z-10 md:flex hidden items-center">
            <div className="bg-gradient-to-l from-white via-white to-transparent w-20 h-full flex items-center justify-end">
              <div className="bg-white shadow-2xl shadow-white border border-gray-200 rounded-full p-1.5 cursor-pointer hover:border-gray-400">
                <ChevronRight
                  size={16}
                  className="text-[#444444]"
                  onClick={scrollRight}
                />
              </div>
            </div>
          </div>
        )}
      </div>
  <div className="h-px bg-gray-200" />
    </div>
  );
};

export default SubcategoryNavigation;