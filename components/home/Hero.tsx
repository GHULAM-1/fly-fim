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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [previousPlaceholderIndex, setPreviousPlaceholderIndex] = useState(-1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentIndexRef = useRef(0);

  // Handle hydration and viewport
  useEffect(() => {
    setIsMounted(true);
    
    // Set CSS custom property for viewport height
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
    
    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

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

  // Rotate placeholder text with smoother timing
  useEffect(() => {
    if (!isMounted) return;
    
    if (!isInputFocused && !searchQuery) {
      const interval = setInterval(() => {
        const nextIndex =
          (currentIndexRef.current + 1) % placeholderOptions.length;

        // Set up the transition immediately
        setPreviousPlaceholderIndex(currentIndexRef.current);
        setIsTransitioning(true);

        // Update to next index immediately
        currentIndexRef.current = nextIndex;
        setCurrentPlaceholderIndex(nextIndex);

        // Reset transition state after animation completes
        setTimeout(() => {
          setIsTransitioning(false);
          setPreviousPlaceholderIndex(-1);
        }, 700); // Match animation duration
      }, 3000); // Show each text for 3 seconds
      return () => clearInterval(interval);
    }
  }, [isInputFocused, searchQuery, placeholderOptions.length, isMounted]);

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

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isInputFocused]);

  // Animated placeholder component for reusability
  const AnimatedPlaceholder = ({ prefix = "Search for" }) => (
    <div className="absolute inset-0 flex items-center pointer-events-none text-gray-500">
      <span className="mr-1 flex-shrink-0">{prefix}</span>
      <div className="relative overflow-hidden h-5 flex items-center flex-1 min-w-0">
        {/* Previous text - sliding out upward */}
        {isTransitioning && previousPlaceholderIndex >= 0 && (
          <span
            key={`prev-${previousPlaceholderIndex}`}
            className="absolute whitespace-nowrap"
            style={{
              animation: "slideOutUp 0.7s ease-out forwards",
              animationFillMode: "both",
            }}
          >
            {placeholderOptions[previousPlaceholderIndex]}
          </span>
        )}

        {/* Current text - sliding in from below */}
        <span
          key={`current-${currentPlaceholderIndex}`}
          className="absolute whitespace-nowrap"
          style={{
            animation: isTransitioning
              ? "slideInUp 0.7s ease-out forwards"
              : "none",
            animationFillMode: "both",
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? "translateY(100%)" : "translateY(0)",
          }}
        >
          {placeholderOptions[currentPlaceholderIndex]}
        </span>
      </div>
    </div>
  );

  return (
    <>
      {/* Add the CSS animations as a style tag */}
      <style jsx>{`
        @keyframes slideOutUp {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-100%);
            opacity: 0;
          }
        }

        @keyframes slideInUp {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .smooth-transition {
          transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      <div
        className={`h-[414px] md:h-[640px]  relative`}
      >
        <div className="h-[414px] md:h-[640px] w-full absolute top-0 left-0 -z-20 overflow-hidden">
          <motion.video
            src="/videos/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover object-center"
            style={{ scale }}
          />
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-black/30 -z-10" />

        {/* Focus overlay - covers entire viewport */}
        {isInputFocused && (
          <div
            className="fixed inset-0  bg-black/50 transition-opacity duration-300"
            style={{ zIndex: 10 }}
          />
        )}

        <div className="w-full h-full xl:px-0 px-[24px] max-w-[1200px]  py-10 md:py-20 flex flex-col justify-end gap-10  mx-auto relative ">
          <h1
            id="scroll-target"
            className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl !font-heading max-w-2xl leading-tight relative "
          >
            {t("hero.title")}
          </h1>

          {/* Desktop Search Container */}
          <div
            className={`relative hidden md:block transition-all  duration-300 ${
              isInputFocused ? "max-w-md" : "max-w-sm"
            }`}
            style={{ zIndex: 90 }}
            ref={searchRef}
          >
            <div
              className="flex items-center bg-white gap-2 rounded-md py-3 px-4 shadow cursor-pointer relative"
              onClick={() => {
                setIsSearchOpen(true);
                inputRef.current?.focus();
                setTimeout(() => {
                  const target = document.getElementById("scroll-target");
                  if (target) {
                    target.scrollIntoView({ behavior: "smooth" });
                  }
                }, 100);
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
                    setTimeout(() => {
                      const target = document.getElementById("scroll-target");
                      if (target) {
                        target.scrollIntoView({ behavior: "smooth" });
                      }
                    }, 100);
                  }}
                  onBlur={() => {
                    setIsInputFocused(false);
                  }}
                />
                {/* Animated placeholder for desktop */}
                { !isInputFocused && !searchQuery && <AnimatedPlaceholder />}
              </div>
              <Search strokeWidth={1} />
            </div>

            {isSearchOpen && (
              <div
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto"
                style={{ zIndex: 60 }}
              >
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

          {/* Mobile Search Drawer */}
          <Drawer 
            open={isDrawerOpen} 
            onOpenChange={setIsDrawerOpen}
            shouldScaleBackground={false}
          >
            <DrawerTrigger
              className="max-w-sm flex md:hidden items-center bg-white gap-2 rounded-md py-3 px-4 shadow cursor-pointer relative"
              asChild
            >
              <button
                onClick={() => {
                  setIsDrawerOpen(true);
                }}
              >
                <div className="flex-1 relative">
                  <Input className="bg-transparent border-none focus-visible:ring-0 shadow-none cursor-pointer w-full pointer-events-none" />
                  {/* Animated placeholder for mobile */}
                  <AnimatedPlaceholder />
                </div>
                <Search strokeWidth={1} />
              </button>
            </DrawerTrigger>

            <DrawerContent 
              className="drawer-content"
              style={{
                transform: 'translateY(0)',
                transition: 'transform 0.3s ease-out'
              }}
            >
              <div className="h-full flex flex-col">
                <DrawerTitle className="bg-white p-4 flex-shrink-0">
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
                        placeholder="Search for experiences and cities"
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
                        {topDestinations.map((dest) => (
                          <div key={dest.id}>
                            <div className="flex items-center gap-2 py-3 px-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors">
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
                        {topActivities.map((activity) => (
                          <div key={activity.id}>
                            <div className="flex items-center gap-2 py-3 px-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors">
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
                              <div className="flex items-center gap-2 py-3 px-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors">
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
                              <div className="flex items-center gap-2 py-3 px-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors">
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
            </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </>
  );
};

export default Hero;