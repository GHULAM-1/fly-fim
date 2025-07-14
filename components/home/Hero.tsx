"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Input } from "../ui/input";
import { ArrowLeft, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerClose,
  DrawerTrigger,
} from "../ui/drawer";

const Hero = () => {
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 1000], [1, 1.5]);
  const { t } = useTranslation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [previousPlaceholderIndex, setPreviousPlaceholderIndex] = useState(-1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentIndexRef = useRef(0);

  const placeholderOptions = [
    "experiences and cities",
    "Burj Khalifa",
    "Dubai",
    "things to do",
    "attractions",
    "tours",
  ];

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
  const topActivities = [
    {
      id: 1,
      title: "London Theatre Tickets",
      location: "London, United Kingdom",
      image: "/images/a1.jpg.avif",
    },
    {
      id: 2,
      title: "Dubai Desert Safari Tours",
      location: "Dubai, United Arab Emirates",
      image: "/images/a2.jpg.avif",
    },
    {
      id: 3,
      title: "Vatican Museums",
      location: "Rome, Italy",
      image: "/images/a3.png.avif",
    },
    {
      id: 4,
      title: "Disneyland® Paris Tickets",
      location: "Paris, France",
      image: "/images/a4.jpg.avif",
    },
  ];

  const filteredDestinations = topDestinations.filter(
    (dest) =>
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredActivities = topActivities.filter(
    (activity) =>
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.location.toLowerCase().includes(searchQuery.toLowerCase())
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

  // Rotate placeholder text
  useEffect(() => {
    if (!isInputFocused && !searchQuery) {
      const interval = setInterval(() => {
        const nextIndex =
          (currentIndexRef.current + 1) % placeholderOptions.length;

        setIsTransitioning(true);
        setPreviousPlaceholderIndex(currentIndexRef.current);

        // Small delay to ensure state is set before animation
        setTimeout(() => {
          currentIndexRef.current = nextIndex;
          setCurrentPlaceholderIndex(nextIndex);
        }, 50);

        // Reset transition after animation completes
        setTimeout(() => {
          setIsTransitioning(false);
          setPreviousPlaceholderIndex(-1);
        }, 650);
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [isInputFocused, searchQuery, placeholderOptions.length]);

  // Keep ref in sync with state
  useEffect(() => {
    currentIndexRef.current = currentPlaceholderIndex;
  }, [currentPlaceholderIndex]);

  // Prevent scrolling when input is focused
  useEffect(() => {
    if (isInputFocused) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isInputFocused]);

  return (
    <div
      className={`h-[45vh] sm:h-[60vh] md:h-[78vh] 2xl:h-[50vh] relative ${
        isInputFocused ? "z-50" : ""
      }`}
    >
      <div className="h-[45vh] sm:h-[60vh] md:h-[78vh] 2xl:h-[50vh] w-full absolute top-0 left-0 -z-20 overflow-hidden">
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
      {/* Focus overlay - covers entire viewport */}
      {isInputFocused && (
        <div className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300" />
      )}
      <div className="w-full h-full px-4 sm:px-8 md:px-16 lg:px-24 xl:px-28 2xl:px-0 py-10 sm:py-20 flex flex-col justify-end gap-10 2xl:max-w-screen-xl mx-auto">
        <h1
          id="scroll-target"
          className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-[2.7rem] font-bold max-w-2xl leading-tight"
        >
          {t("hero.title")}
        </h1>

        {/* Search Container */}
        <div
          className={`relative hidden md:block transition-all duration-300 z-50 ${
            isInputFocused ? "max-w-md" : "max-w-sm"
          }`}
          ref={searchRef}
        >
          <div
            className="flex items-center bg-white gap-2 rounded-md py-3 px-4 shadow cursor-pointer relative"
            onClick={() => {
              setIsSearchOpen(true);
              inputRef.current?.focus();
              const target = document.getElementById("scroll-target");
              if (target) {
                target.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                className="bg-transparent border-none focus-visible:ring-0 shadow-none cursor-pointer w-full"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => {
                  setIsSearchOpen(true);
                  setIsInputFocused(true);
                }}
                onBlur={() => {
                  setIsInputFocused(false);
                }}
              />
              {/* Custom animated placeholder */}
              {!isInputFocused && (
                <div className="absolute inset-0 flex items-center pointer-events-none text-gray-500">
                  <span className="mr-1">Search for</span>
                  <div className="relative overflow-hidden h-5 flex items-center w-40">
                    {/* Previous text - fading out upward */}
                    {isTransitioning && previousPlaceholderIndex >= 0 && (
                      <span
                        key={`prev-${previousPlaceholderIndex}`}
                        className="absolute whitespace-nowrap"
                        style={{
                          animation: "slideOutUp 0.6s ease-out forwards",
                        }}
                      >
                        {placeholderOptions[previousPlaceholderIndex]}
                      </span>
                    )}

                    {/* Current text - fading in from below */}
                    <span
                      key={`current-${currentPlaceholderIndex}`}
                      className="absolute whitespace-nowrap"
                      style={{
                        animation: isTransitioning
                          ? "slideInUp 0.6s ease-out 0.05s both"
                          : "none",
                        opacity: isTransitioning ? 0 : 1,
                      }}
                    >
                      {placeholderOptions[currentPlaceholderIndex]}
                    </span>
                  </div>
                </div>
              )}
            </div>
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
        {/* Search Drawer */}
        <Drawer>
          <DrawerTrigger className="max-w-sm flex md:hidden items-center bg-white gap-2 rounded-md py-3 px-4 shadow cursor-pointer relative">
            <div className="flex-1 relative">
              <Input className="bg-transparent border-none focus-visible:ring-0 shadow-none cursor-pointer w-full" />
              {/* Custom animated placeholder */}
              <div className="absolute inset-0 flex items-center pointer-events-none text-gray-500">
                <span className="mr-1">Search for</span>
                <div className="relative overflow-hidden h-5 flex items-center w-40">
                  {/* Previous text - fading out upward */}
                  {isTransitioning && previousPlaceholderIndex >= 0 && (
                    <span
                      key={`mobile-prev-${previousPlaceholderIndex}`}
                      className="absolute whitespace-nowrap"
                      style={{
                        animation: "slideOutUp 0.6s ease-out forwards",
                      }}
                    >
                      {placeholderOptions[previousPlaceholderIndex]}
                    </span>
                  )}

                  {/* Current text - fading in from below */}
                  <span
                    key={`mobile-current-${currentPlaceholderIndex}`}
                    className="absolute whitespace-nowrap"
                    style={{
                      animation: isTransitioning
                        ? "slideInUp 0.6s ease-out 0.05s both"
                        : "none",
                      opacity: isTransitioning ? 0 : 1,
                    }}
                  >
                    {placeholderOptions[currentPlaceholderIndex]}
                  </span>
                </div>
              </div>
            </div>
            <Search strokeWidth={1} />
          </DrawerTrigger>
          <DrawerContent className="h-full max-h-[90vh]">
            <DrawerTitle className="bg-white p-4">
              <div className="flex items-center border border-black rounded-md">
                <DrawerClose asChild>
                  <button className="p-2">
                    <ArrowLeft size={20} className="text-gray-600" />
                  </button>
                </DrawerClose>
                <div className="flex-1">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 border-none px-2 text-base focus:border-gray-400 focus-visible:ring-0"
                    autoFocus
                  />
                </div>
              </div>
            </DrawerTitle>

            <div className="flex-1 overflow-y-auto px-4 pb-4">
              {!searchQuery ? (
                <>
                  {/* Top destinations near you */}
                  <div className="mb-4">
                    <h3 className="text-xs font-medium text-gray-600 mb-2 px-2">
                      Top destinations near you
                    </h3>
                    <div className="space-y-0">
                      {topDestinations.map((dest, index) => (
                        <div key={dest.id}>
                          <div className="flex items-center gap-2 py-3 px-2 cursor-pointer">
                            <div className="w-10 h-10 rounded overflow-hidden">
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
                              <div className="text-gray-500 text-xs">
                                {dest.country}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top things to do worldwide */}
                  <div className="mb-4">
                    <h3 className="text-xs font-medium text-gray-600 mb-2 px-2">
                      Top things to do worldwide
                    </h3>
                    <div className="space-y-0">
                      {topActivities.map((activity, index) => (
                        <div key={activity.id}>
                          <div className="flex items-center gap-2 py-3 px-2 cursor-pointer">
                            <div className="w-10 h-10 rounded overflow-hidden">
                              <img
                                src={activity.image}
                                alt={activity.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 text-sm">
                                {activity.title}
                              </div>
                              <div className="text-gray-500 text-xs">
                                {activity.location}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Search Results */}
                  {filteredDestinations.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-xs font-medium text-gray-600 mb-2 px-2">
                        Destinations ({filteredDestinations.length})
                      </h3>
                      <div className="space-y-0">
                        {filteredDestinations.map((dest) => (
                          <div key={dest.id}>
                            <div className="flex items-center gap-2 py-3 px-2 cursor-pointer">
                              <div className="w-10 h-10 rounded overflow-hidden">
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
                                <div className="text-gray-500 text-xs">
                                  {dest.country}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredActivities.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-xs font-medium text-gray-600 mb-2 px-2">
                        Activities ({filteredActivities.length})
                      </h3>
                      <div className="space-y-0">
                        {filteredActivities.map((activity) => (
                          <div key={activity.id}>
                            <div className="flex items-center gap-2 py-3 px-2 cursor-pointer">
                              <div className="w-10 h-10 rounded overflow-hidden">
                                <img
                                  src={activity.image}
                                  alt={activity.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900 text-sm">
                                  {activity.title}
                                </div>
                                <div className="text-gray-500 text-xs">
                                  {activity.location}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredDestinations.length === 0 &&
                    filteredActivities.length === 0 && (
                      <div className="text-center py-8">
                        <div className="text-gray-500">
                          No results found for "{searchQuery}"
                        </div>
                      </div>
                    )}
                </>
              )}
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default Hero;
