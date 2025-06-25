"use client";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

const Hero = () => {
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 1000], [1, 1.5]);
  const { t } = useTranslation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  const topDestinations = [
    {
      id: 1,
      name: "Dubai",
      country: "United Arab Emirates",
      image: "/images/d4.jpg.avif",
    },
    {
      id: 2,
      name: "Abu Dhabi",
      country: "United Arab Emirates",
      image: "/images/d4.jpg.avif",
    },
    {
      id: 3,
      name: "Chiang Mai",
      country: "Thailand",
      image: "/images/d3.jpg.avif",
    },
  ];

  const filteredDestinations = topDestinations.filter(
    (dest) =>
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="h-[60vh] md:h-[78vh] relative">
      <div className="h-[60vh] md:h-[78vh] w-full absolute top-0 left-0 -z-20 overflow-hidden">
        <motion.video
          src="/videos/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          style={{ scale }}
        />
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-black/30 -z-10" />
      <div className="w-full h-full px-4 sm:px-8 md:px-16 lg:px-24 xl:px-28 py-10 sm:py-20 flex flex-col justify-end gap-10">
        <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold max-w-2xl leading-tight">
          {t("hero.title")}
        </h1>

        {/* Search Container */}
        <div className="relative max-w-sm" ref={searchRef}>
          <div
            className="flex items-center bg-white gap-2 rounded-md py-3 px-4 shadow cursor-pointer"
            onClick={() => setIsSearchOpen(true)}
          >
            <Input
              className="bg-transparent border-none focus-visible:ring-0 shadow-none cursor-pointer"
              placeholder={searchQuery || t("hero.subtitle")}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
            />
            <Search strokeWidth={1} />
          </div>

          {isSearchOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto">
              {/* Top destinations */}
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-600 mb-3">
                  Top destinations near you
                </h3>
                <div className="space-y-0">
                  {(searchQuery ? filteredDestinations : topDestinations).map(
                    (dest) => (
                      <div
                        key={dest.id}
                        className="flex items-center gap-3 py-3 hover:bg-gray-50 cursor-pointer rounded-lg px-2"
                        onClick={() => {
                          setSearchQuery(dest.name);
                          setIsSearchOpen(false);
                        }}
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={dest.image}
                            alt={dest.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">
                            {dest.name}
                          </div>
                          <div className="text-gray-500 text-sm">
                            {dest.country}
                          </div>
                        </div>
                      </div>
                    )
                  )}

                  {searchQuery && filteredDestinations.length === 0 && (
                    <div className="py-3 px-2 text-gray-500 text-sm text-center">
                      No destinations found for "{searchQuery}"
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
