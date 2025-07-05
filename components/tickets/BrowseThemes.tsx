import React from "react";
import Link from "next/link";
import {
  Music,
  Theater,
  Globe,
  Bus,
  Ticket,
  MapPin,
  Ship,
  Calendar,
} from "lucide-react";

const BrowseThemes = () => {
  const themes = [
    {
      icon: Music,
      text: "London Musicals",
      href: "#",
    },
    {
      icon: Theater,
      text: "Plays in London",
      href: "#",
    },
    {
      icon: Globe,
      text: "Day Trips From London",
      href: "#",
    },
    {
      icon: Bus,
      text: "Hop-on Hop-off Tours London",
      href: "#",
    },
    {
      icon: Ticket,
      text: "Combos Tickets in London",
      href: "#",
    },
    {
      icon: MapPin,
      text: "Guided Tours in London",
      href: "#",
    },
    {
      icon: Ship,
      text: "Thames River Cruise",
      href: "#",
    },
  ];

  return (
    <div className="py-10 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-28 max-w-screen-2xl mx-auto 2xl:px-0">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-8">
        Browse by themes
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {themes.map((theme, index) => {
          const IconComponent = theme.icon;
          return (
            <Link
              key={index}
              href={theme.href}
              className="flex items-center gap-3 text-gray-700 hover:text-gray-900 transition-colors group"
            >
              <div className="flex-shrink-0">
                <IconComponent
                  size={20}
                  className="text-gray-600 group-hover:text-gray-800 transition-colors"
                />
              </div>
              <span className="text-sm font-medium underline">
                {theme.text}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BrowseThemes;
