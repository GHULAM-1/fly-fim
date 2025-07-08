"use client";
import React, { useState } from "react";
import { ChevronRight, Menu, Smartphone, Star } from "lucide-react";
import {
  Building,
  Sparkles,
  Users,
  CreditCard,
  Church,
  Landmark,
  Eye,
  Fish,
} from "lucide-react";
import Banner from "@/components/home/Banner";
import Testimonials from "@/components/things-to-do/Testimonials";
import Destinations from "@/components/home/Destinations";
import Faqs from "@/components/things-to-do/Faqs";
import Stats from "@/components/home/Stats";
import BrowseThemes from "@/components/tickets/BrowseThemes";
import PopularThings from "@/components/tickets/PopularThings";
import TravelGuides from "@/components/tickets/TravelGuides";
import Link from "next/link";
import CarouselGrid from "@/components/grids/CarouselGrid";

const Tickets = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [hoveredNavItem, setHoveredNavItem] = useState(
    "Top things to do in London"
  );
  const [activeTab, setActiveTab] = useState("Museums");

  // Categories dropdown navigation items
  const navItems = [
    "Top things to do in London",
    "Tickets",
    "Tours",
    "Transportation",
    "Travel Services",
    "Cruises",
    "Food & Drink",
    "Entertainment",
    "Adventure",
    "Specials",
  ];

  // Content for each navigation item
  const navContent: Record<string, any> = {
    "Top things to do in London": [
      {
        title: "London Theatre Tickets",
        subtitle: "from £5.25",
        image: "/images/1.avif",
      },
      {
        title: "Madame Tussauds London",
        subtitle: "from £29",
        image: "/images/2.avif",
      },
      {
        title: "Moco Museum London",
        subtitle: "from £13.52",
        image: "/images/3.png.avif",
      },
      {
        title: "London Eye",
        subtitle: "from £29",
        image: "/images/4.png.avif",
      },
      {
        title: "Westminster Abbey",
        subtitle: "from £30",
        image: "/images/5.png.avif",
      },
      {
        title: "London Dungeon",
        subtitle: "from £27",
        image: "/images/6.png.avif",
      },
      {
        title: "Tower of London",
        subtitle: "from £35.80",
        image: "/images/7.png.avif",
      },
      {
        title: "The Shard",
        subtitle: "from £28.50",
        image: "/images/8.png.avif",
      },
      {
        title: "Frameless London",
        subtitle: "from £25",
        image: "/images/9.png.avif",
      },
      {
        title: "London To Stonehenge Tours",
        subtitle: "from £99",
        image: "/images/10.png.avif",
      },
      {
        title: "SEA LIFE London Aquarium",
        subtitle: "from £28",
        image: "/images/11.png.avif",
      },
      {
        title: "Tower Bridge",
        subtitle: "from £12",
        image: "/images/12.png.avif",
      },
      {
        title: "Harry Potter Warner Bros. Studio Tour",
        subtitle: "from £93",
        image: "/images/13.png.avif",
      },
      {
        title: "London To Windsor Castle Tours",
        subtitle: "from £31",
        image: "/images/14.png.avif",
      },
      {
        title: "Up At The O2 Climb",
        subtitle: "from £37",
        image: "/images/15.png.avif",
      },
    ],
    Tickets: [
      "Museums",
      "Theme Parks",
      "Zoos",
      "City Cards",
      "Religious Sites",
      "Landmarks",
      "Observation Decks",
      "Aquariums",
      "Immersive Experiences",
    ],
    Tours: [
      "Walking Tours",
      "Bus Tours",
      "Private Tours",
      "Day Trips",
      "Multi-day Tours",
      "Food Tours",
      "Historical Tours",
      "Photography Tours",
    ],
    Transportation: [
      "Airport Transfers",
      "City Transport",
      "Train Tickets",
      "Bus Passes",
      "Car Rentals",
      "Bike Rentals",
    ],
    "Travel Services": [
      "Travel Insurance",
      "Currency Exchange",
      "SIM Cards",
      "Luggage Storage",
      "Travel Guides",
    ],
    Cruises: [
      "River Cruises",
      "Dinner Cruises",
      "Sightseeing Cruises",
      "Day Cruises",
    ],
    "Food & Drink": [
      "Restaurant Bookings",
      "Food Tours",
      "Cooking Classes",
      "Wine Tastings",
      "Pub Crawls",
    ],
    Entertainment: [
      "Theatre Shows",
      "Concerts",
      "Comedy Shows",
      "Nightlife",
      "Festivals",
    ],
    Adventure: [
      "Outdoor Activities",
      "Extreme Sports",
      "Water Sports",
      "Adventure Tours",
      "Climbing",
    ],
    Specials: [
      "Last Minute Deals",
      "Group Discounts",
      "Student Offers",
      "Early Bird Specials",
    ],
  };

  const categories = [
    { key: "Museums", icon: Building, label: "Museums" },
    { key: "Theme Parks", icon: Sparkles, label: "Theme Parks" },
    { key: "Zoos", icon: Users, label: "Zoos" },
    { key: "City Cards", icon: CreditCard, label: "City Cards" },
    { key: "Religious Sites", icon: Church, label: "Religious Sites" },
    { key: "Landmarks", icon: Landmark, label: "Landmarks" },
    { key: "Observation Decks", icon: Eye, label: "Observation Decks" },
    { key: "Aquariums", icon: Fish, label: "Aquariums" },
    { key: "Immersive Experiences", icon: Sparkles, label: "Immersive..." },
  ];
  const recommendations = [
    {
      id: 1,
      description: "Skydive Dubai: Tandem Skydiving at the Palm Drop Zone",
      place: "Dubai",
      image: "/images/r4.jpg.avif",
      price: 100,
      rating: 4.5,
      reviews: 100,
    },
    {
      id: 2,
      description: "Acropolis Parthenon Tickets with Optional Audio Guide",
      place: "Athens",
      image: "/images/r3.jpg.avif",
      price: 100,
      rating: 4.5,
      reviews: 100,
    },
    {
      id: 3,
      description:
        "From Rome: Pompeii, Amalfi Coast and Sorrento or Positano Day Trip",
      place: "Italy",
      image: "/images/r2.jpg.avif",
      price: 100,
      rating: 4.5,
      reviews: 100,
    },
    {
      id: 4,
      description:
        "From London: Harry Potter™ Warner Bros. Studio Tickets with Coach Transfers",
      place: "London",
      image: "/images/r1.jpg.avif",
      price: 100,
      rating: 4.5,
      reviews: 100,
    },
  ];

  return (
    <div className="relative min-h-screen">
      <div className="hidden md:block fixed top-22 bg-white w-full py-3 z-50 border-b">
        <div className="flex justify-between items-center px-4 sm:px-8 md:px-16 lg:px-24 xl:px-28 max-w-screen-2xl mx-auto">
          <ul className="flex gap-3 lg:gap-8 text-xs lg:text-sm text-gray-600">
            <li
              className="flex items-center gap-1 cursor-pointer relative"
              onMouseEnter={() => setShowCategoriesDropdown(true)}
              onMouseLeave={() => setShowCategoriesDropdown(false)}
            >
              <Menu size={16} className="text-gray-600" />
              All Categories
            </li>
            <li>Best Sellers</li>
            <li>London theatre tickets</li>
            <li>London Eye</li>
            <li>Tower of London</li>
          </ul>
          <button
            className="text-sm text-gray-600 flex items-center gap-1"
            onMouseEnter={() => setShowBanner(true)}
            onMouseLeave={() => setShowBanner(false)}
          >
            <Smartphone size={16} />
            Download App
          </button>
        </div>

        {/* Categories Dropdown */}
        <div
          className={`absolute left-0 w-full bg-white border-b transition-all duration-300 origin-top overflow-hidden ${
            showCategoriesDropdown
              ? "scale-y-100 h-auto opacity-100"
              : "scale-y-0 h-0 opacity-0"
          }`}
          onMouseEnter={() => setShowCategoriesDropdown(true)}
          onMouseLeave={() => setShowCategoriesDropdown(false)}
        >
          <div className="flex max-w-screen-2xl mx-auto px-4 sm:px-8 md:px-16 lg:px-24 xl:px-28">
            {/* Left Navigation */}
            <div className="w-64 py-6 border-r border-gray-100">
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item}>
                    <button
                      className={`w-full text-left font-medium px-4 py-2 text-sm transition-colors rounded-md flex items-center justify-between ${
                        hoveredNavItem === item
                          ? "text-purple-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                      onMouseEnter={() => setHoveredNavItem(item)}
                    >
                      {item}{" "}
                      <ChevronRight
                        strokeWidth={1.5}
                        className={`${
                          hoveredNavItem === item
                            ? "text-purple-600"
                            : "text-gray-600"
                        }`}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Content */}
            <div className="flex-1 py-6 px-6">
              {hoveredNavItem === "Top things to do in London" ? (
                <div className="grid grid-cols-3 gap-4">
                  {navContent[hoveredNavItem].map(
                    (item: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {item.title}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {navContent[hoveredNavItem]?.map(
                    (item: any, index: number) => (
                      <div
                        key={index}
                        className="text-sm text-gray-600 hover:text-purple-600 cursor-pointer py-1"
                      >
                        {item}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Download App Banner */}
        <div
          className={`transition-all duration-300 origin-top overflow-hidden ${
            showBanner ? "scale-y-100 h-auto" : "scale-y-0 h-0"
          }`}
        >
          <Banner />
        </div>
      </div>
      <div className="pt-20 md:pt-40 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-28 max-w-screen-2xl mx-auto">
        <div className="hidden sm:flex items-center gap-2">
          <Link href="/" className="underline text-gray-600 text-sm">
            Home
          </Link>
          <ChevronRight size={16} strokeWidth={1} className="text-gray-600" />
          <Link
            href="/things-to-do"
            className="underline text-gray-600 text-sm"
          >
            Things to do in London
          </Link>
          <ChevronRight size={16} strokeWidth={1} className="text-gray-600" />
          <Link
            href="/things-to-do/london"
            className="underline text-gray-600 text-sm"
          >
            Tickets
          </Link>
          <ChevronRight size={16} strokeWidth={1} className="text-gray-600" />
          <Link
            href="/things-to-do/london/tickets/london-eye"
            className="text-gray-600 text-sm"
          >
            Museums
          </Link>
        </div>
        <h1 className="text-xs sm:hidden">TICKETS</h1>
        <div className="flex flex-col-reverse sm:flex-col mt-3 sm:mt-10 sm:gap-2">
          <div className="flex items-center gap-1">
            <Star size={16} fill="currentColor" className="text-pink-600" />
            <span className="text-pink-500 font-semibold ml-1">
              4.4 (47,554)
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-semibold md:font-bold text-gray-700">
            Museums in London
          </h2>
        </div>
        {/* Horizontal Tab Navigation */}
        <div className="flex items-center gap-5 mt-6 mb-8 justify-between border-b border-gray-200 overflow-x-auto scrollbar-none">
          {categories.map((category) => {
            const IconComponent = category.icon;
            const isActive = activeTab === category.key;
            return (
              <button
                key={category.key}
                onClick={() => setActiveTab(category.key)}
                className={`flex items-center gap-2 pb-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <IconComponent
                  size={16}
                  className={isActive ? "text-purple-600" : "text-gray-600"}
                />
                <span>{category.label}</span>
              </button>
            );
          })}
          <div className="bg-white shadow-lg border border-gray-200 shadow-white rounded-full p-1.5 ml-2">
            <ChevronRight size={16} className="text-gray-400" />
          </div>
        </div>
      </div>
      <PopularThings />
      <CarouselGrid
        title="Top experiences in London"
        recommendations={recommendations}
        variant="full"
      />
      <BrowseThemes />
      <TravelGuides />
      <Faqs />
      <Destinations />
      <Banner />
      <Testimonials />
      <Stats />
    </div>
  );
};

export default Tickets;
