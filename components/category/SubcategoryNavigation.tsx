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
  Ticket,
  Building,
  Car,
  Ship,
  Plane,
  Bike,
  Train,
  ChefHat,
  Wine,
  Utensils,
  ShoppingCart,
  Theater,
  Music,
  Mountain,
  Activity,
  Waves,
  Heart,
  Sparkles,
  Star,
  Gift,
  Anchor,
  Briefcase,
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
        { id: "walking-tours", label: "Rome Walking Tour", url: `${baseUrl}/walking-tours`, icon: Footprints },
        { id: "guided-tours", label: "Vatican City Tour", url: `${baseUrl}/guided-tours`, icon: User },
        { id: "city-tours", label: "Historical Rome Tour", url: `${baseUrl}/city-tours`, icon: MapPin },
        { id: "hop-on-hop-off-tours", label: "Hop-on Hop-off Tours", url: `${baseUrl}/hop-on-hop-off-tours`, icon: Bus },
        { id: "day-trips", label: "Rome To Pompeii Tours", url: `${baseUrl}/day-trips`, icon: Globe },
        { id: "heritage-experiences", label: "Colosseum Guided Tour", url: `${baseUrl}/heritage-experiences`, icon: Landmark },
      ];
    case "tickets":
      return [
        { id: "all", label: "All", url: baseUrl },
        { id: "museums", label: "Vatican Museums Pass", url: `${baseUrl}/museums`, icon: Building },
        { id: "landmarks", label: "Colosseum Tickets", url: `${baseUrl}/landmarks`, icon: Landmark },
        { id: "zoos", label: "Zoos", url: `${baseUrl}/zoos`, icon: Ticket },
        { id: "religious-sites", label: "St. Peter's Basilica", url: `${baseUrl}/religious-sites`, icon: Building },
        { id: "city-cards", label: "City Cards", url: `${baseUrl}/city-cards`, icon: Ticket },
        { id: "theme-parks", label: "Pantheon Entry", url: `${baseUrl}/theme-parks`, icon: Star },
      ];
    case "transportation":
      return [
        { id: "all", label: "All", url: baseUrl },
        { id: "public-transport", label: "Public Transport", url: `${baseUrl}/public-transport`, icon: Bus },
        { id: "car-rentals", label: "Car Rentals", url: `${baseUrl}/car-rentals`, icon: Car },
        { id: "ferry-services", label: "Ferry Services", url: `${baseUrl}/ferry-services`, icon: Ship },
        { id: "airport-transfers", label: "Airport Transfers", url: `${baseUrl}/airport-transfers`, icon: Plane },
        { id: "bike-rentals", label: "Bike Rentals", url: `${baseUrl}/bike-rentals`, icon: Bike },
        { id: "metro-services", label: "Train Tickets", url: `${baseUrl}/metro-services`, icon: Train },
      ];
    case "food-drink":
      return [
        { id: "all", label: "All", url: baseUrl },
        { id: "cooking-classes", label: "Cooking Classes", url: `${baseUrl}/cooking-classes`, icon: ChefHat },
        { id: "food-tours", label: "Food Markets", url: `${baseUrl}/food-tours`, icon: ShoppingCart },
        { id: "wine-tastings", label: "Wine Tasting", url: `${baseUrl}/wine-tastings`, icon: Wine },
        { id: "restaurant-reservations", label: "Restaurant Tours", url: `${baseUrl}/restaurant-reservations`, icon: Utensils },
        { id: "local-markets", label: "Street Food Tours", url: `${baseUrl}/local-markets`, icon: ShoppingCart },
        { id: "dietary-options", label: "Dietary Options", url: `${baseUrl}/dietary-options`, icon: Utensils },
      ];
    case "entertainment":
      return [
        { id: "all", label: "All", url: baseUrl },
        { id: "live-shows", label: "Theater Shows", url: `${baseUrl}/live-shows`, icon: Theater },
        { id: "theater", label: "Opera Tickets", url: `${baseUrl}/theater`, icon: Theater },
        { id: "theme-parks", label: "Theme Parks", url: `${baseUrl}/theme-parks`, icon: Star },
        { id: "concerts", label: "Concerts", url: `${baseUrl}/concerts`, icon: Music },
        { id: "comedy-clubs", label: "Comedy Shows", url: `${baseUrl}/comedy-clubs`, icon: Theater },
        { id: "nightlife", label: "Live Music", url: `${baseUrl}/nightlife`, icon: Music },
      ];
    case "adventure":
      return [
        { id: "all", label: "All", url: baseUrl },
        { id: "hiking", label: "Hiking Tours", url: `${baseUrl}/hiking`, icon: Mountain },
        { id: "rock-climbing", label: "Rock Climbing", url: `${baseUrl}/rock-climbing`, icon: Activity },
        { id: "off-road-tours", label: "Off-Road Tours", url: `${baseUrl}/off-road-tours`, icon: Car },
        { id: "skydiving", label: "Skydiving", url: `${baseUrl}/skydiving`, icon: Plane },
        { id: "bungee-jumping", label: "Bungee Jumping", url: `${baseUrl}/bungee-jumping`, icon: Mountain },
        { id: "ziplining", label: "Zip Lining", url: `${baseUrl}/ziplining`, icon: Mountain },
      ];
    case "water-sports":
      return [
        { id: "all", label: "All", url: baseUrl },
        { id: "kayaking", label: "Kayaking", url: `${baseUrl}/kayaking`, icon: Waves },
        { id: "surfing", label: "Surfing", url: `${baseUrl}/surfing`, icon: Waves },
        { id: "snorkeling", label: "Snorkeling", url: `${baseUrl}/snorkeling`, icon: Waves },
        { id: "scuba-diving", label: "Scuba Diving", url: `${baseUrl}/scuba-diving`, icon: Waves },
        { id: "jet-skiing", label: "Jet Skiing", url: `${baseUrl}/jet-skiing`, icon: Waves },
        { id: "sailing", label: "Sailing", url: `${baseUrl}/sailing`, icon: Ship },
      ];
    case "wellness":
      return [
        { id: "all", label: "All", url: baseUrl },
        { id: "spa-retreats", label: "Spa", url: `${baseUrl}/spa-retreats`, icon: Sparkles },
        { id: "yoga-classes", label: "Yoga Classes", url: `${baseUrl}/yoga-classes`, icon: Heart },
        { id: "meditation", label: "Meditation Retreats", url: `${baseUrl}/meditation`, icon: Heart },
        { id: "fitness-centers", label: "Fitness Centers", url: `${baseUrl}/fitness-centers`, icon: Heart },
        { id: "thermal-baths", label: "Thermal Baths", url: `${baseUrl}/thermal-baths`, icon: Sparkles },
        { id: "mindfulness", label: "Mindfulness Workshops", url: `${baseUrl}/mindfulness`, icon: Heart },
      ];
    case "specials":
      return [
        { id: "all", label: "All", url: baseUrl },
        { id: "discount-deals", label: "Discount Deals", url: `${baseUrl}/discount-deals`, icon: Gift },
        { id: "vip-experiences", label: "VIP Experiences", url: `${baseUrl}/vip-experiences`, icon: Star },
        { id: "package-deals", label: "Package Deals", url: `${baseUrl}/package-deals`, icon: Gift },
        { id: "seasonal-offers", label: "Seasonal Offers", url: `${baseUrl}/seasonal-offers`, icon: Gift },
        { id: "last-minute", label: "Last Minute Deals", url: `${baseUrl}/last-minute`, icon: Gift },
        { id: "group-discounts", label: "Group Discounts", url: `${baseUrl}/group-discounts`, icon: Gift },
      ];
    case "cruises":
      return [
        { id: "all", label: "All", url: baseUrl },
        { id: "port-excursions", label: "Port Excursions", url: `${baseUrl}/port-excursions`, icon: Anchor },
        { id: "shore-tours", label: "Shore Tours", url: `${baseUrl}/shore-tours`, icon: Ship },
        { id: "cruise-packages", label: "Cruise Packages", url: `${baseUrl}/cruise-packages`, icon: Ship },
        { id: "onboard-activities", label: "Onboard Activities", url: `${baseUrl}/onboard-activities`, icon: Ship },
        { id: "dining-options", label: "Dinner Cruises", url: `${baseUrl}/dining-options`, icon: Utensils },
        { id: "entertainment", label: "Entertainment", url: `${baseUrl}/entertainment`, icon: Music },
      ];
    case "travel-services":
      return [
        { id: "all", label: "All", url: baseUrl },
        { id: "planning", label: "Travel Planning", url: `${baseUrl}/planning`, icon: Briefcase },
        { id: "concierge", label: "Concierge Services", url: `${baseUrl}/concierge`, icon: Briefcase },
        { id: "insurance", label: "Travel Insurance", url: `${baseUrl}/insurance`, icon: Briefcase },
        { id: "visa-services", label: "Visa Services", url: `${baseUrl}/visa-services`, icon: Briefcase },
        { id: "currency", label: "Currency Exchange", url: `${baseUrl}/currency`, icon: Briefcase },
        { id: "translations", label: "Translation Services", url: `${baseUrl}/translations`, icon: Briefcase },
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
      const hasIcon = item.icon !== undefined;
      let base = `font-halyard-text hover:cursor-pointer flex items-center text-sm sm:text-base ${hasIcon ? 'gap-2' : ''} py-[11px] rounded-[4px] whitespace-nowrap transition-all duration-200 mb-0 ${
        isActive
          ? "text-purple-600"
          : "text-[#444444] hover:text-purple-600"}`;
      // If 'All' and no icon, remove left padding for all screen sizes
      if (item.label === 'All' && !hasIcon) {
        base += ' pl-0 pr-[15px]';
      } else {
        base += ' px-[15px]';
      }
      return base;
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