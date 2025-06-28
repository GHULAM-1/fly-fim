"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
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
  | "Aerial Sightseeing";

const BrowseThemes = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabKey>("Tickets");

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
  ];

  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-28 py-10 max-w-screen-2xl mx-auto 2xl:px-0">
      <h2 className="text-lg sm:text-2xl font-semibold md:font-bold text-gray-700 mb-4 md:mb-10">
        {t("browseThemes.title")}
      </h2>
      <div className="flex items-center gap-6 mb-4 md:mb-8 justify-between border-b border-gray-200 overflow-x-auto scrollbar-none">
        {categories.map((category) => {
          const IconComponent = category.icon;
          const isActive = activeTab === category.key;
          return (
            <button
              key={category.key}
              onClick={() => setActiveTab(category.key)}
              className={`flex items-center gap-2 pb-2 ${
                isActive
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-600"
              }`}
            >
              <IconComponent
                size={16}
                className={isActive ? "text-purple-600" : "text-gray-600"}
              />
              <span className="text-sm whitespace-nowrap">
                {category.label}
              </span>
            </button>
          );
        })}
        <div className="bg-white shadow-lg border border-gray-200 shadow-white rounded-full p-1.5">
          <ChevronRight size={16} className="text-gray-400" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-2 md:gap-y-4 gap-x-8">
        {tabData[activeTab].items.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={index}
              href="#"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <IconComponent size={16} className="text-gray-600" />
              <span className="text-sm underline">{item.text}</span>
            </Link>
          );
        })}
      </div>
      <div className="mt-4 sm:mt-8">
        <Link
          href="#"
          className="text-sm text-gray-600 hover:text-gray-900 underline"
        >
          {tabData[activeTab].viewAll}
        </Link>
      </div>
    </div>
  );
};

export default BrowseThemes;
