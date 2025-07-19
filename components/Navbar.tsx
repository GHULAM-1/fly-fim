"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { CircleHelp, Search, ArrowLeft } from "lucide-react";
import { Input } from "./ui/input";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerClose,
  DrawerTrigger,
} from "./ui/drawer";
import LanguageCurrencyDropdown from "./LanguageCurrencyDropdown";
import { AuthDialog } from "./auth/AuthDialog";
import { UserDropdown } from "./UserDropdown";
import { useAuth } from "@/lib/hooks/useAuth";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [previousPlaceholderIndex, setPreviousPlaceholderIndex] = useState(-1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const { user, loading } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => {
      const getHeroHeight = () => {
        const width = window.innerWidth;

        if (width >= 768) {
          // md breakpoint and up - trigger just before Hero ends
          return 580; // 640px - 60px early
        } else {
          // mobile - trigger just before Hero ends
          return 364; // 414px - 50px early
        }
      };

      if (window.scrollY > getHeroHeight()) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // Rotate placeholder text for navbar search
  useEffect(() => {
    if (!isSearchOpen && !searchQuery) {
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
  }, [isSearchOpen, searchQuery, placeholderOptions.length]);

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

  // Top destinations data
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

  // Top activities data
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

  // Filter function for search
  const filterResults = (items: any[], query: string) => {
    if (!query) return items;
    return items.filter(
      (item) =>
        (item.name && item.name.toLowerCase().includes(query.toLowerCase())) ||
        (item.title &&
          item.title.toLowerCase().includes(query.toLowerCase())) ||
        (item.country &&
          item.country.toLowerCase().includes(query.toLowerCase())) ||
        (item.location &&
          item.location.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const filteredDestinations = filterResults(topDestinations, searchQuery);
  const filteredActivities = filterResults(topActivities, searchQuery);

  return (
    <>
      {/* Focus overlay - covers entire viewport */}
      {isInputFocused && (
        <div className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 pointer-events-none" />
      )}

      <div
        className={`fixed top-0 left-0 w-full z-50 py-2 ${
          scrolled || pathname !== "/"
            ? `bg-white ${
                pathname === "/" || scrolled ? "border-b border-gray-200" : ""
              } text-black`
            : "text-white"
        }`}
      >
        <div className="max-w-[1200px] mx-auto xl:px-[0px] px-[24px]">
          <div className="flex justify-between items-center">
            <Link href="/">
              {scrolled || pathname !== "/" ? (
                <img
                  src="/images/logo.png"
                  alt="logo"
                  className="w-24 sm:w-32"
                />
              ) : (
                <img
                  src="/images/logo-white.png"
                  alt="logo"
                  className="w-24 sm:w-32"
                />
              )}
            </Link>
            {(scrolled || pathname !== "/") && (
              <div
                ref={searchRef}
                className={`relative hidden lg:flex items-center bg-zinc-100 border border-gray-200 gap-2 rounded-md py-2 px-4 transition-all duration-300 z-50 ${
                  isInputFocused
                    ? "min-w-sm xl:min-w-md"
                    : "min-w-xs xl:min-w-sm"
                }`}
                onClick={() => {
                  setIsSearchOpen(true);
                  inputRef.current?.focus();
                }}
              >
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    className="bg-transparent border-none focus-visible:ring-0 shadow-none w-full cursor-pointer"
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
                  {!isSearchOpen && (
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
                {isSearchOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto">
                    {/* Top destinations */}
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-600 mb-3">
                        Top destinations near you
                      </h3>
                      <div className="space-y-0">
                        {(searchQuery
                          ? filteredDestinations
                          : topDestinations
                        ).map((dest) => (
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
                              <div className="font-heading text-gray-900 text-sm">
                                {dest.name}
                              </div>
                              <div className="text-gray-500 text-sm">
                                {dest.country}
                              </div>
                            </div>
                          </div>
                        ))}

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
            )}
            <div className="hidden md:flex items-center gap-6">
              <LanguageCurrencyDropdown
                scrolled={scrolled || pathname !== "/"}
              />
              <Link
                href="/help"
                className="text-sm font-semibold flex items-center gap-1"
              >
                <CircleHelp strokeWidth={1} size={16} />
                <span className="hidden font-extralight md:block">Help</span>
              </Link>

              {loading ? (
                // Loading state
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
              ) : user ? (
                // Authenticated state - show user dropdown
                <UserDropdown
                  user={user}
                  scrolled={scrolled || pathname !== "/"}
                />
              ) : (
                // Unauthenticated state - show sign in button
                <button
                  onClick={() => setAuthDialogOpen(true)}
                  className={`border ${
                    scrolled || pathname !== "/" ? "" : "border-white"
                  } rounded-md cursor-pointer font-extralight py-1.5 px-3 text-sm`}
                >
                  Sign in
                </button>
              )}
            </div>
            <div className="md:hidden flex items-center gap-4">
              {/* Mobile Search Drawer - Refactored */}
              <Drawer
                open={isSearchDrawerOpen}
                onOpenChange={setIsSearchDrawerOpen}
              >
                <DrawerTrigger asChild>
                  <button>
                    <Search size={16} />
                  </button>
                </DrawerTrigger>
                
                <DrawerContent className="max-h-[85vh]">
                  <DrawerTitle className="sr-only">Search</DrawerTitle>
                  
                  {/* Header with search input */}
                  <div className="bg-white p-4 ">
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
                  </div>

                  {/* Scrollable content */}
                  <div className="overflow-y-auto px-4 pb-4 flex-1">
                    {!searchQuery ? (
                      <>
                        {/* Top destinations near you */}
                        <div className="mb-4">
                          <h3 className="text-xs font-medium text-gray-600 mb-2 px-2">
                            Top destinations near you
                          </h3>
                          <div className="space-y-0">
                            {topDestinations.map((dest) => (
                              <div key={dest.id} className="flex items-center gap-2 py-3 px-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="w-10 h-10 rounded overflow-hidden">
                                  <img
                                    src={dest.image}
                                    alt={dest.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="font-heading text-[#444444] text-sm">
                                    {dest.name}
                                  </div>
                                  <div className="text-[#888888] font-lightText text-xs">
                                    {dest.country}
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
                              <div key={activity.id} className="flex items-center gap-2 py-3 px-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="relative w-10 h-10">
                                  {/* Stacked background images */}
                                  <div className="absolute left-[2px] -top-[1px] w-10 h-10 rounded overflow-hidden transform rotate-2 opacity-40">
                                    <img
                                      src={activity.image}
                                      alt={activity.title}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="absolute -left-[2px] -top-[1px] w-10 h-10 rounded overflow-hidden transform -rotate-4 opacity-50">
                                    <img
                                      src={activity.image}
                                      alt={activity.title}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="absolute -left-[0px] -top-[3px] w-10 h-10 rounded overflow-hidden transform opacity-30">
                                    <img
                                      src={activity.image}
                                      alt={activity.title}
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gray-500 bg-blend-overlay"></div>
                                  </div>
                                  {/* Main image */}
                                  <div className="relative border-white border w-10 h-10 rounded overflow-hidden">
                                    <img
                                      src={activity.image}
                                      alt={activity.title}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <div className="font-heading  text-[#444444] text-[15px]">
                                    {activity.title}
                                  </div>
                                  <div className="text-[#888888] font-lightText text-xs">
                                    {activity.location}
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
                                <div key={dest.id} className="flex items-center gap-2 py-3 px-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors">
                                  <div className="w-10 h-10 rounded overflow-hidden">
                                    <img
                                      src={dest.image}
                                      alt={dest.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <div className="font-heading text-gray-900 text-sm">
                                      {dest.name}
                                    </div>
                                    <div className="text-gray-500 text-xs">
                                      {dest.country}
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
                                <div key={activity.id} className="flex items-center gap-2 py-3 px-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors">
                                  <div className="w-10 h-10 rounded overflow-hidden">
                                    <img
                                      src={activity.image}
                                      alt={activity.title}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <div className="font-heading text-gray-900 text-sm">
                                      {activity.title}
                                    </div>
                                    <div className="text-gray-500 text-xs">
                                      {activity.location}
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

              <LanguageCurrencyDropdown
                scrolled={scrolled || pathname !== "/"}
              />
            </div>
          </div>
        </div>
      </div>

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  );
};

export default Navbar;