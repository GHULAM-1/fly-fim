"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Input } from "../ui/input";
import { ArrowLeft, Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { searchApi } from "@/api/search/search-api";
import { SearchResponse, SearchCity, SearchExperience } from "@/types/search/search-types";

const Hero = () => {
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 1000], [1, 1.5]);
  const { t } = useTranslation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isCustomDrawerOpen, setIsCustomDrawerOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [previousPlaceholderIndex, setPreviousPlaceholderIndex] = useState(-1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [safeAreaBottom, setSafeAreaBottom] = useState(0);
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const currentIndexRef = useRef(0);
  const router = useRouter();

  // URL generation functions
  const generateDestinationUrl = (dest: SearchCity) => {
    const slugify = (text: string) =>
      text?.toLowerCase()?.replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const citySlug = slugify(dest.cityName || dest.slug);
    return `/things-to-do/${citySlug}`;
  };

  const generateActivityUrl = (activity: SearchExperience) => {
    const slugify = (text: string) =>
      text?.toLowerCase()?.replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const citySlug = slugify(activity.cityName);
    const categorySlug = slugify(activity.categoryName);
    const subcategorySlug = slugify(activity.subcategoryName);
    return `/things-to-do/${citySlug}/${categorySlug}/${subcategorySlug}/${activity._id}`;
  };

  // Handle hydration only
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Dynamic viewport height detection
  useEffect(() => {
    const updateViewportHeight = () => {
      // Get the actual viewport height
      const vh = window.innerHeight * 0.01;
      setViewportHeight(vh);
      
      // Get safe area bottom for devices with home indicator
      const safeAreaBottomValue = parseInt(
        getComputedStyle(document.documentElement)
          .getPropertyValue('--sat') || '0'
      );
      setSafeAreaBottom(safeAreaBottomValue);
    };

    // Set CSS custom property for viewport height
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    updateViewportHeight();
    setVH();

    window.addEventListener('resize', () => {
      updateViewportHeight();
      setVH();
    });

    // Handle iOS Safari viewport changes
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        updateViewportHeight();
        setVH();
      }, 100);
    });

    return () => {
      window.removeEventListener('resize', updateViewportHeight);
      window.removeEventListener('orientationchange', updateViewportHeight);
    };
  }, []);

  // Search API call effect
  useEffect(() => {
    const performSearch = async () => {
      setIsSearchLoading(true);
      try {
        const results = await searchApi(searchQuery.trim());
        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults(null);
      } finally {
        setIsSearchLoading(false);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Initial load with empty params
  useEffect(() => {
    const loadInitialData = async () => {
      setIsSearchLoading(true);
      try {
        const results = await searchApi('');
        setSearchResults(results);
      } catch (error) {
        console.error('Initial data load error:', error);
        setSearchResults(null);
      } finally {
        setIsSearchLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const placeholderOptions = [
    "experiences and cities",
    "Burj Khalifa",
    "Dubai",
    "things to do",
    "attractions",
    "tours",
  ];

  // Get search results from API
  const displayDestinations = searchResults ? searchResults.data.cities : [];
  const displayActivities = searchResults ? searchResults.data.experiences : [];

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

  // Prevent scrolling when custom drawer is open
  useEffect(() => {
    if (isCustomDrawerOpen) {
      document.body.style.overflow = "hidden";
      // Prevent iOS Safari from scrolling the body
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.position = "";
      document.body.style.width = "";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [isCustomDrawerOpen]);

  // Focus mobile input when drawer opens
  useEffect(() => {
    if (isCustomDrawerOpen && mobileInputRef.current) {
      setTimeout(() => {
        mobileInputRef.current?.focus();
      }, 300);
    }
  }, [isCustomDrawerOpen]);

  // Animated placeholder component for reusability
  const AnimatedPlaceholder = ({ prefix = "Search for" }) => (
    <div className="absolute inset-0 flex items-center pointer-events-none text-[#666666]">
      <span className="mr-1 font-halyard-text-light md:text-base text-sm flex-shrink-0">{prefix}</span>
      <div className="relative overflow-hidden h-5 flex items-center flex-1 min-w-0">
        {/* Previous text - sliding out upward */}
        {isTransitioning && previousPlaceholderIndex >= 0 && (
          <span
            key={`prev-${previousPlaceholderIndex}`}
            className="absolute font-halyard-text-light md:text-base text-sm whitespace-nowrap"
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
          className="absolute font-halyard-text-light md:text-base text-sm whitespace-nowrap"
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
      {/* Add the CSS animations and viewport fixes as a style tag */}
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

        /* iOS Safari viewport height fix */
        .drawer-container {
          height: calc(var(--vh, 1vh) * 85);
          max-height: calc(var(--vh, 1vh) * 85);
        }

        /* Safe area support */
        @supports (padding: max(0px)) {
          .drawer-container {
            padding-bottom: max(1rem, env(safe-area-inset-bottom));
          }
        }
      `}</style>

      <div className={`h-[414px] md:h-[640px] relative`}>
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
            className="fixed inset-0 bg-black/50 transition-opacity duration-300"
            style={{ zIndex: 10 }}
          />
        )}

        <div className="w-full h-full xl:px-0 px-[24px] max-w-[1200px] py-10 md:py-20 flex flex-col justify-end gap-10 mx-auto relative">
          <h1
            id="scroll-target"
            className="text-white text-2xl font-heading sm:text-3xl md:text-4xl lg:text-5xl  max-w-2xl leading-tight relative"
          >
            {t("hero.title")}
          </h1>

          {/* Desktop Search Container */}
          <div
            className={`relative hidden md:block transition-all duration-300 ${
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
                {!isInputFocused && !searchQuery && <AnimatedPlaceholder />}
              </div>
              <Search strokeWidth={1} />
            </div>

            {isSearchOpen && (
              <div
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto"
                style={{ zIndex: 60 }}
              >
                <div className="p-4">
                  <h3 className="text-sm font-medium text-[#444444] mb-3">
                    Top destinations near you
                  </h3>
                  <div className="space-y-0">
                    {isSearchLoading ? (
                      <div className="py-3 px-2 text-[#666666] text-sm text-center">
                        Searching...
                      </div>
                    ) : (
                      displayDestinations.map((dest: any) => (
                        <Link
                          key={dest.id}
                          href={generateDestinationUrl(dest)}
                          className="flex items-center gap-3 py-3 hover:bg-gray-50 cursor-pointer rounded-lg px-2"
                          onClick={() => {
                            setIsSearchOpen(false);
                          }}
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={dest.imageUrl || dest.image}
                              alt={dest.cityName || dest.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-semibold text-[#444444] text-sm">
                              {dest.cityName || dest.name}
                            </div>
                            <div className="text-[#666666] text-sm">
                              {dest.countryName || dest.country}
                            </div>
                          </div>
                        </Link>
                      ))
                    )}

                    {searchQuery && !isSearchLoading && displayDestinations.length === 0 && (
                      <div className="py-3 px-2 text-[#666666] text-sm text-center">
                        No destinations found for "{searchQuery}"
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Search Trigger */}
          <button 
            className="flex md:hidden items-center bg-white gap-2 rounded-md p-[7px] px-4 shadow cursor-pointer relative"
            onClick={() => setIsCustomDrawerOpen(true)}
          >
            <div className="flex-1 relative">
              <Input className="bg-transparent border-none focus-visible:ring-0 shadow-none cursor-pointer w-full pointer-events-none" />
              {!searchQuery && <AnimatedPlaceholder />}
            </div>
            <Search strokeWidth={1} />
          </button>

          {/* Custom Mobile Drawer */}
          <AnimatePresence>
            {isCustomDrawerOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 bg-black/50 z-[9998]"
                  onClick={() => setIsCustomDrawerOpen(false)}
                />
                
                {/* Drawer Content */}
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ 
                    type: "spring", 
                    damping: 30, 
                    stiffness: 400,
                    mass: 0.8
                  }}
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(event, info) => {
                    if (info.offset.y > 100) {
                      setIsCustomDrawerOpen(false);
                    }
                  }}
                  className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-[9999] drawer-container flex flex-col"
                  style={{
                    paddingBottom: `max(1rem, ${safeAreaBottom}px)`
                  }}
                >
                  {/* Handle */}
                  <div className="flex justify-center pt-3 pb-2">
                    <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
                  </div>

                  {/* Header with search input */}
                  <div className="bg-white px-4 pb-4 border-gray-200 flex-shrink-0">
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button 
                        className="p-2 flex-shrink-0"
                        onClick={() => setIsCustomDrawerOpen(false)}
                      >
                        <ArrowLeft size={20} className="text-[#444444]" />
                      </button>
                      <div className="flex-1 min-w-0">
                        <Input
                          ref={mobileInputRef}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full h-12 border-none px-2 text-base focus:border-gray-400 focus-visible:ring-0"
                          placeholder="Search for experiences and cities"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Scrollable content */}
                  <div className="flex-1 min-h-0 px-4 pb-4" style={{ minHeight: 'calc(var(--vh, 1vh) * 85 - 120px)' }}>
                    {isSearchLoading ? (
                      <div className="text-center py-8">
                        <div className="text-[#666666]">Loading...</div>
                      </div>
                    ) : !searchQuery ? (
                      <>
                        {/* Top destinations near you */}
                        {displayDestinations.length > 0 && (
                          <div className="mb-4">
                            <h3 className="text-xs font-medium text-[#444444] mb-2 px-2">
                              Top destinations near you
                            </h3>
                            <div className="space-y-0 max-h-40 overflow-y-auto">
                              {displayDestinations.map((dest: any) => (
                                <Link key={dest.id} href={generateDestinationUrl(dest)} className="flex items-center gap-2 py-3 px-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors">
                                  <div className="w-10 h-10 rounded overflow-hidden">
                                    <img
                                      src={dest.imageUrl || dest.image}
                                      alt={dest.cityName || dest.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <div className="font-semibold text-[#444444] text-sm">
                                      {dest.cityName || dest.name}
                                    </div>
                                    <div className="text-[#666666] text-xs">
                                      {dest.countryName || dest.country}
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Top things to do worldwide */}
                        {displayActivities.length > 0 && (
                          <div className="mb-4">
                            <h3 className="text-xs font-medium text-[#444444] mb-2 px-2">
                              Top things to do worldwide
                            </h3>
                            <div className="space-y-0 max-h-48 overflow-y-auto">
                              {displayActivities.map((activity: any) => (
                              <Link key={activity.id} href={generateActivityUrl(activity)} className="flex items-center gap-2 py-3 px-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="relative w-10 h-10">
                                  {/* Stacked background images */}
                                  <div className="absolute left-[2px] -top-[1px] w-10 h-10 rounded overflow-hidden transform rotate-2 opacity-40">
                                    <img
                                      src={activity.imageUrls?.[0] || activity.imageUrl?.[0] || activity.image}
                                      alt={activity.title}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="absolute -left-[2px] -top-[1px] w-10 h-10 rounded overflow-hidden transform -rotate-4 opacity-50">
                                    <img
                                      src={activity.imageUrls?.[0] || activity.imageUrl?.[0] || activity.image}
                                      alt={activity.title}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="absolute -left-[0px] -top-[3px] w-10 h-10 rounded overflow-hidden transform opacity-30">
                                    <img
                                      src={activity.imageUrls?.[0] || activity.imageUrl?.[0] || activity.image}
                                      alt={activity.title}
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gray-500 bg-blend-overlay"></div>
                                  </div>
                                  {/* Main image */}
                                  <div className="relative border-white border w-10 h-10 rounded overflow-hidden">
                                    <img
                                      src={activity.imageUrls?.[0] || activity.imageUrl?.[0] || activity.image}
                                      alt={activity.title}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <div className="font-semibold text-[#444444] text-sm">
                                    {activity.title}
                                  </div>
                                  <div className="text-[#666666] text-xs">
                                    {activity.city}
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                        )}
                      </>

                    ) : (
                      <>
                        {/* Search Results */}
                        {isSearchLoading ? (
                          <div className="text-center py-8">
                            <div className="text-[#666666]">Searching...</div>
                          </div>
                        ) : (
                          <>
                            {displayDestinations.length > 0 && (
                              <div className="mb-4">
                                <h3 className="text-xs font-medium text-[#444444] mb-2 px-2">
                                  Destinations ({displayDestinations.length})
                                </h3>
                                <div className="space-y-0 max-h-40 overflow-y-auto">
                                  {displayDestinations.map((dest: any) => (
                                    <Link key={dest.id} href={generateDestinationUrl(dest)} className="flex items-center gap-2 py-3 px-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors">
                                      <div className="w-10 h-10 rounded overflow-hidden">
                                        <img
                                          src={dest.imageUrl || dest.image}
                                          alt={dest.cityName || dest.name}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <div>
                                        <div className="font-semibold text-[#444444] text-sm">
                                          {dest.cityName || dest.name}
                                        </div>
                                        <div className="text-[#666666] text-xs">
                                          {dest.countryName || dest.country}
                                        </div>
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            )}

                            {displayActivities.length > 0 && (
                              <div className="mb-4">
                                <h3 className="text-xs font-medium text-[#444444] mb-2 px-2">
                                  Activities ({displayActivities.length})
                                </h3>
                                <div className="space-y-0 max-h-48 overflow-y-auto">
                                  {displayActivities.map((activity: any) => (
                                    <Link key={activity.id} href={generateActivityUrl(activity)} className="flex items-center gap-2 py-3 px-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors">
                                      <div className="w-10 h-10 rounded overflow-hidden">
                                        <img
                                          src={activity.imageUrls?.[0] || activity.imageUrl?.[0] || activity.image}
                                          alt={activity.title}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <div>
                                        <div className="font-semibold text-[#444444] text-sm">
                                          {activity.title}
                                        </div>
                                        <div className="text-[#666666] text-xs">
                                          {activity.city}
                                        </div>
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            )}

                            {displayDestinations.length === 0 && displayActivities.length === 0 && (
                              <div className="text-center py-8">
                                <div className="text-[#666666]">
                                  No results found for "{searchQuery}"
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default Hero;