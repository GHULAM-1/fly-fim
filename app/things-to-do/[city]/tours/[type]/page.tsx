"use client";
import React, { useState } from "react";
import { Car, ChevronRight, Menu, Smartphone, Star } from "lucide-react";
import {
  Building,
  Sparkles,
  Users,
  CreditCard,
  Church,
  Landmark,
  Eye,
  Fish,
  TreePine,
  MapPin,
  Globe,
  ChefHat,
  Bus,
  Ticket,
  Utensils,
  Footprints,
} from "lucide-react";
import Banner from "@/components/home/Banner";
import Testimonials from "@/components/things-to-do/Testimonials";
import Destinations from "@/components/home/Destinations";
import Faqs from "@/components/things-to-do/Faqs";
import Stats from "@/components/home/Stats";
import BrowseThemes from "@/components/tickets/BrowseThemes";
import PopularThings from "@/components/tours/PopularThings";
import TravelGuides from "@/components/tickets/TravelGuides";
import Link from "next/link";
import CarouselGrid from "@/components/grids/CarouselGrid";

const Tours = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [activeTab, setActiveTab] = useState("All");

  const categories = [
    { key: "All", icon: Building, label: "All" },
    { key: "Walking Tours", icon: Users, label: "Walking Tours" },
    { key: "Guided Tours", icon: Eye, label: "Guided Tours" },
    {
      key: "Hop-on hop-off Tours London",
      icon: CreditCard,
      label: "Hop-on hop-off Tours London",
    },
    { key: "City Tours", icon: Landmark, label: "City Tours" },
    { key: "Private Tours", icon: Users, label: "Private Tours" },
    { key: "Photography Tours", icon: Sparkles, label: "Photography Tours" },
    { key: "Day Trips", icon: TreePine, label: "Day Trips" },
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
            <li className="flex items-center gap-1">
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
            Tours
          </Link>
          <ChevronRight size={16} strokeWidth={1} className="text-gray-600" />
          <Link
            href="/things-to-do/london/tickets/london-eye"
            className="text-gray-600 text-sm"
          >
            Walking Tours
          </Link>
        </div>
        <h1 className="text-xs sm:hidden">TOURS</h1>
        <div className="flex flex-col-reverse sm:flex-col mt-3 sm:mt-10 sm:gap-2">
          <div className="flex items-center gap-1">
            <Star size={16} fill="currentColor" className="text-pink-600" />
            <span className="text-pink-500 font-semibold ml-1">
              4.5 (63,477)
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-semibold md:font-bold text-gray-700">
            Walking Tours in London
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
      <BrowseThemes       title="Browse by themes"
                themes={[
                  {
                    icon: MapPin,
                    text: "Rome Tours",
                    href: "#",
                  },
                  {
                    icon: Globe,
                    text: "Day Trips From Rome",
                    href: "#",
                  },
                  {
                    icon: ChefHat,
                    text: "Cooking Classes in Rome",
                    href: "#",
                  },
                  {
                    icon: Bus,
                    text: "Hop-on Hop-off Tours Rome",
                    href: "#",
                  },
                  {
                    icon: Ticket,
                    text: "Combos Tickets in Rome",
                    href: "#",
                  },
                  {
                    icon: Utensils,
                    text: "Food Tours in Rome",
                    href: "#",
                  },
                  {
                    icon: Footprints,
                    text: "Walking Tours in Rome",
                    href: "#",
                  },
                  {
                    icon: Car,
                    text: "Transportation in Rome",
                    href: "#",
                  },
                ]} />
      <TravelGuides />
      <Faqs />
      <Destinations />
      <Banner />
      <Testimonials variant="default" />
      <Stats />
    </div>
  );
};

export default Tours;
