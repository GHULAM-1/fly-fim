"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Ticket,
  MapPin,
  Car,
  Luggage,
  Ship,
  UtensilsCrossed,
  Music,
  Mountain,
  Plane,
  Building,
  TreePine,
  Users,
  Waves,
  CreditCard,
  Church,
  Landmark,
  Eye,
  Fish,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Camera,
  Bus,
  ShoppingBag,
  Calendar,
  History,
} from "lucide-react";

type TabKey =
  | "Tickets"
  | "Tours"
  | "Transportation"
  | "Travel Services"
  | "Cruises"
  | "Food & Drink"
  | "Entertainment"
  | "Adventure"
  | "Aerial Sightseeing"
  | "Wellness"
  | "Education"
  | "Sports"
  | "Photography"
  | "Nightlife";

const BrowseThemes = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("Tickets");
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const tabData: Record<
    TabKey,
    { items: Array<{ icon: any; text: string }>; viewAll: string }
  > = {
    Tickets: {
      items: [
        { icon: Building, text: "Museums" },
        { icon: Sparkles, text: "Theme Parks" },
        { icon: Users, text: "Zoos" },
        { icon: TreePine, text: "Parks" },
        { icon: Waves, text: "Water Parks" },
        { icon: CreditCard, text: "City Cards" },
        { icon: Mountain, text: "Religious Sites" },
        { icon: Landmark, text: "Landmarks" },
        { icon: Eye, text: "Observation Decks" },
        { icon: Fish, text: "Aquariums" },
        { icon: Sparkles, text: "Immersive Experiences" },
        { icon: Church, text: "Churches" },
      ],
      viewAll: "View all Tickets",
    },
    Tours: {
      items: [
        { icon: MapPin, text: "Walking Tours" },
        { icon: MapPin, text: "Guided Tours" },
        { icon: Bus, text: "Hop-on Hop-off Bus Tours" },
        { icon: Building, text: "City Tours" },
        { icon: Camera, text: "Private Tours" },
        { icon: Car, text: "Bikes & Segway" },
        { icon: ShoppingBag, text: "Shopping" },
        { icon: Users, text: "Multi-Day Tours" },
        { icon: Camera, text: "Photography Tours" },
        { icon: Ship, text: "Port of Call Tours (Cruise Visitors)" },
        { icon: Calendar, text: "Day Trips" },
        { icon: Waves, text: "Speed Boat Tours" },
        { icon: History, text: "Heritage Experiences" },
      ],
      viewAll: "View all Tours",
    },
    Transportation: {
      items: [
        { icon: Car, text: "Airport Transfers" },
        { icon: Bus, text: "Bus Tours" },
        { icon: Ship, text: "Ferry Services" },
        { icon: Plane, text: "Helicopter Tours" },
        { icon: Car, text: "Car Rentals" },
        { icon: Bus, text: "Shuttle Services" },
        { icon: Car, text: "Bike Rentals" },
        { icon: Car, text: "Private Transfers" },
      ],
      viewAll: "View all Transportation",
    },
    "Travel Services": {
      items: [
        { icon: Luggage, text: "Luggage Storage" },
        { icon: CreditCard, text: "Travel Insurance" },
        { icon: MapPin, text: "Local Guides" },
        { icon: Building, text: "Hotel Bookings" },
        { icon: Camera, text: "Photography Services" },
        { icon: Users, text: "Group Services" },
      ],
      viewAll: "View all Travel Services",
    },
    Cruises: {
      items: [
        { icon: Ship, text: "River Cruises" },
        { icon: Ship, text: "Ocean Cruises" },
        { icon: Waves, text: "Speed Boat Tours" },
        { icon: UtensilsCrossed, text: "Dinner Cruises" },
        { icon: Fish, text: "Sunset Cruises" },
        { icon: Music, text: "Party Cruises" },
      ],
      viewAll: "View all Cruises",
    },
    "Food & Drink": {
      items: [
        { icon: UtensilsCrossed, text: "Food Tours" },
        { icon: UtensilsCrossed, text: "Wine Tasting" },
        { icon: UtensilsCrossed, text: "Cooking Classes" },
        { icon: UtensilsCrossed, text: "Restaurant Reservations" },
        { icon: UtensilsCrossed, text: "Street Food Tours" },
        { icon: UtensilsCrossed, text: "Brewery Tours" },
      ],
      viewAll: "View all Food & Drink",
    },
    Entertainment: {
      items: [
        { icon: Music, text: "Concerts" },
        { icon: Music, text: "Theater Shows" },
        { icon: Music, text: "Comedy Shows" },
        { icon: Music, text: "Nightlife" },
        { icon: Music, text: "Live Music" },
        { icon: Music, text: "Dance Shows" },
      ],
      viewAll: "View all Entertainment",
    },
    Adventure: {
      items: [
        { icon: Mountain, text: "Hiking Tours" },
        { icon: Mountain, text: "Rock Climbing" },
        { icon: Waves, text: "Water Sports" },
        { icon: Mountain, text: "Extreme Sports" },
        { icon: Car, text: "Mountain Biking" },
        { icon: TreePine, text: "Nature Tours" },
      ],
      viewAll: "View all Adventure",
    },
    "Aerial Sightseeing": {
      items: [
        { icon: Plane, text: "Helicopter Tours" },
        { icon: Plane, text: "Hot Air Balloon" },
        { icon: Plane, text: "Scenic Flights" },
        { icon: Plane, text: "Skydiving" },
        { icon: Plane, text: "Paragliding" },
        { icon: Plane, text: "Drone Tours" },
      ],
      viewAll: "View all Aerial Sightseeing",
    },
    Wellness: {
      items: [
        { icon: Sparkles, text: "Spa Treatments" },
        { icon: TreePine, text: "Yoga Classes" },
        { icon: Mountain, text: "Meditation Retreats" },
        { icon: Waves, text: "Hot Springs" },
        { icon: Building, text: "Wellness Centers" },
      ],
      viewAll: "View all Wellness",
    },
    Education: {
      items: [
        { icon: Building, text: "Language Classes" },
        { icon: Camera, text: "Art Workshops" },
        { icon: Music, text: "Music Lessons" },
        { icon: UtensilsCrossed, text: "Cooking Schools" },
        { icon: History, text: "Cultural Workshops" },
      ],
      viewAll: "View all Education",
    },
    Sports: {
      items: [
        { icon: Car, text: "Golf Courses" },
        { icon: Waves, text: "Water Sports" },
        { icon: Mountain, text: "Skiing" },
        { icon: Car, text: "Tennis Courts" },
        { icon: Mountain, text: "Rock Climbing" },
      ],
      viewAll: "View all Sports",
    },
    Photography: {
      items: [
        { icon: Camera, text: "Photo Tours" },
        { icon: Camera, text: "Photography Workshops" },
        { icon: MapPin, text: "Scenic Spots" },
        { icon: Building, text: "Architecture Photography" },
        { icon: Users, text: "Portrait Sessions" },
      ],
      viewAll: "View all Photography",
    },
    Nightlife: {
      items: [
        { icon: Music, text: "Bars & Pubs" },
        { icon: Music, text: "Nightclubs" },
        { icon: Music, text: "Live Music Venues" },
        { icon: Music, text: "Comedy Clubs" },
        { icon: Music, text: "Karaoke Bars" },
      ],
      viewAll: "View all Nightlife",
    },
  };

  const categories: Array<{ key: TabKey; icon: any; label: string }> = [
    { key: "Tickets", icon: Ticket, label: "Tickets" },
    { key: "Tours", icon: MapPin, label: "Tours" },
    { key: "Transportation", icon: Car, label: "Transportation" },
    { key: "Travel Services", icon: Luggage, label: "Travel Services" },
    { key: "Cruises", icon: Ship, label: "Cruises" },
    { key: "Food & Drink", icon: UtensilsCrossed, label: "Food & Drink" },
    { key: "Entertainment", icon: Music, label: "Entertainment" },
    { key: "Adventure", icon: Mountain, label: "Adventure" },
    { key: "Aerial Sightseeing", icon: Plane, label: "Aerial Sightseeing" },
    { key: "Wellness", icon: Sparkles, label: "Wellness" },
    { key: "Education", icon: Building, label: "Education" },
    { key: "Sports", icon: Car, label: "Sports" },
    { key: "Photography", icon: Camera, label: "Photography" },
    { key: "Nightlife", icon: Music, label: "Nightlife" },
  ];

  // Additional items that will be combined with tabData items
  const additionalItems = [
    { icon: Calendar, text: "Seasonal Events" },
    { icon: Camera, text: "Photo Spots" },
    { icon: Users, text: "Group Activities" },
    { icon: Sparkles, text: "Special Offers" },
    { icon: MapPin, text: "Local Experiences" },
    { icon: CreditCard, text: "Gift Cards" },
  ];

  // Combine tabData items with additional items
  const combinedItems = [...tabData[activeTab].items, ...additionalItems];

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -1000,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 1000,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const handleResize = () => checkScrollButtons();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.addEventListener("scroll", checkScrollButtons);
      return () => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.removeEventListener(
            "scroll",
            checkScrollButtons
          );
        }
      };
    }
  }, []);

  return (
    <div className=" max-w-[1200px] mt-3 mx-auto ">
      <h2 className="text-lg sm:text-2xl tracking-wide font-heading text-[#444444] mb-4 md:mb-10">
        Browse by themes{" "}
      </h2>
      <div className="relative">
        <div className="flex items-center mb-4 md:mb-4 ">
          {showLeftButton && (
            <div className="absolute md:flex hidden left-0 top-0 z-10 bottom-0 items-center">
              <div className="bg-gradient-to-r from-white via-white to-transparent w-20 h-full flex items-center justify-start">
                <div className="bg-white shadow-2xl shadow-white border border-gray-200 rounded-full p-1.5 cursor-pointer hover:border-gray-400">
                  <ChevronLeft
                    size={16}
                    className="text-[#444444]"
                    onClick={scrollLeft}
                  />
                </div>
              </div>
            </div>
          )}

          <div
            ref={scrollContainerRef}
            className="flex items-center gap-[24px] border-b border-gray-200 overflow-x-auto scrollbar-none pb-2 "
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isActive = activeTab === category.key;
              return (
                <button
                  key={category.key}
                  onClick={() => setActiveTab(category.key)}
                  className={`cursor-pointer  relative ${
                    isActive ? "text-[#7f00fe]" : "text-[#444444]"
                  }`}
                  style={{ minWidth: "fit-content" }}
                >
                  <div className="flex  items-center gap-2">
                    <IconComponent
                      size={16}
                      className={isActive ? "text-[#7f00fe]" : "text-[#444444]"}
                    />
                    <span className="text-[15px]  font-halyard-text-light whitespace-nowrap">
                      {category.label}
                    </span>
                  </div>
                  {isActive && (
                    <div className="absolute bottom-[-8px] left-0 right-0 h-0.5 bg-[#7f00fe]"></div>
                  )}
                </button>
              );
            })}
          </div>

          {showRightButton && (
            <div className="absolute right-[0px] top-0 bottom-0 z-10 md:flex hidden items-center">
              <div className="bg-gradient-to-l from-white via-white to-transparent w-20 h-full flex items-center justify-end">
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
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3  md:grid-cols-4 gap-y-2 md:gap-y-4 gap-x-8">
        {combinedItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={index}
              href="#"
              className="flex font-halyard-text-light items-center gap-2 group text-[#444444] hover:text-[#7f00fe]"
            >
              <IconComponent
                size={12}
                className="text-[#444444] group-hover:text-[#7f00fe]"
              />
              <span className="text-sm underline">{item.text}</span>
            </Link>
          );
        })}
        <Link
          href="#"
          className="cursor-pointer font-halyard-text-light text-sm text-[#444444] hover:text-[#7f00fe] underline"
        >
          {tabData[activeTab].viewAll}
        </Link>
      </div>
    </div>
  );
};

export default BrowseThemes;
