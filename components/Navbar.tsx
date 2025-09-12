"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { CircleHelp, Search, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "./ui/input";
import LanguageCurrencyDropdown from "./LanguageCurrencyDropdown";
import { AuthDialog } from "./auth/AuthDialog";
import { UserDropdown } from "./UserDropdown";
import { useAuth } from "@/lib/hooks/useAuth";
import { usePathname } from "next/navigation";
import { useNavigationStore } from "@/lib/store/navigationStore";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [isCustomSearchDrawerOpen, setIsCustomSearchDrawerOpen] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [previousPlaceholderIndex, setPreviousPlaceholderIndex] = useState(-1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [safeAreaBottom, setSafeAreaBottom] = useState(0);
  const { user, loading } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const currentIndexRef = useRef(0);
  const { isModalOpen } = useNavigationStore();

  const placeholderOptions = [
    "experiences and cities",
    "Burj Khalifa",
    "Dubai",
    "things to do",
    "attractions",
    "tours",
  ];

  // Dynamic viewport height detection
  useEffect(() => {
    const updateViewportHeight = () => {
      // Get the actual viewport height
      const vh = window.innerHeight * 0.01;
      setViewportHeight(vh);

      // Get safe area bottom for devices with home indicator
      const safeAreaBottomValue = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("--sat") ||
          "0"
      );
      setSafeAreaBottom(safeAreaBottomValue);
    };

    // Set CSS custom property for viewport height
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    updateViewportHeight();
    setVH();

    window.addEventListener("resize", () => {
      updateViewportHeight();
      setVH();
    });

    // Handle iOS Safari viewport changes
    window.addEventListener("orientationchange", () => {
      setTimeout(() => {
        updateViewportHeight();
        setVH();
      }, 100);
    });

    return () => {
      window.removeEventListener("resize", updateViewportHeight);
      window.removeEventListener("orientationchange", updateViewportHeight);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const getHeroHeight = () => {
        const width = window.innerWidth;

        // Check if we're on a checkout page (itemId route)
        const isCheckoutPage = pathname.includes('/things-to-do/') && pathname.split('/').length >= 5;

        if (isCheckoutPage) {
          // On checkout page - use mobile hero height (45vh)
          if (width >= 768) {
            // Desktop - no hero, so navbar should be solid
            return 0;
          } else {
            // Mobile - 45vh of viewport height with small buffer
            return window.innerHeight * 0.45 - 20;
          }
        } else {
          // Home page or other pages
          if (width >= 768) {
            // md breakpoint and up - trigger just before Hero ends
            return 580; // 640px - 60px early
          } else {
            // mobile - trigger just before Hero ends
            return 364; // 414px - 50px early
          }
        }
      };

      if (window.scrollY > getHeroHeight()) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    // Initial check on mount with small delay to ensure proper state
    setTimeout(() => {
      handleScroll();
    }, 100);
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
        setIsInputFocused(false);
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

  // Prevent scrolling when custom drawer is open
  useEffect(() => {
    if (isCustomSearchDrawerOpen) {
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
  }, [isCustomSearchDrawerOpen]);

  // Focus mobile input when drawer opens
  useEffect(() => {
    if (isCustomSearchDrawerOpen && mobileInputRef.current) {
      setTimeout(() => {
        mobileInputRef.current?.focus();
      }, 300);
    }
  }, [isCustomSearchDrawerOpen]);

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

  // Check if we're on a checkout page (itemId page with 6 path segments)
  // Example: /things-to-do/new-york/tickets/colosseum-tickets/skip-the-line-entry = 6 segments
  const pathSegments = pathname.split('/').filter(segment => segment !== '');
  const isCheckoutPage = pathname.includes('/things-to-do/') && pathSegments.length >= 5;
  // Navbar should be transparent (isNavSolid = false) ONLY when:
  // 1. On home page (pathname === "/") OR 
  // 2. On checkout page (isCheckoutPage = true)
  // AND not scrolled
  const shouldBeTransparent = !scrolled && (pathname === "/" || isCheckoutPage);
  const isNavSolid = !shouldBeTransparent;
  const navTextColorClass = isNavSolid ? "text-[#444444]" : "text-white";

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

      {/* Focus overlay - covers entire viewport except search dropdown */}
      {isInputFocused && (
        <div
          className="fixed inset-0 bg-black/50 z-80 transition-opacity duration-300"
          onClick={() => {
            setIsSearchOpen(false);
            setIsInputFocused(false);
          }}
        />
      )}

      <div
        className={`fixed top-0 left-0 w-full z-80 py-2 transition-colors duration-300 ${
          isNavSolid ? "bg-white border-gray-200" : "bg-transparent"
        } ${navTextColorClass}`}
      >
        <div className="max-w-[1200px] mx-auto xl:px-[0px] px-[24px]">
          <div className="flex justify-between items-center">
            <Link href="/">
              {isNavSolid ? (
                <img
                  src="/images/new-purple-logo.png"
                  alt="logo"
                  className="w-24 sm:w-32 py-2"
                />
              ) : (
                <img
                  src="/images/white-logo-re.png"
                  alt="logo"
                  className="w-24 sm:w-32 py-2"
                />
              )}
            </Link>
            <div
              ref={searchRef}
              className={`relative hidden lg:flex items-center bg-zinc-100 border border-gray-200 gap-2 rounded-md py-2 px-4 transition-all duration-300 z-80 ${
                isInputFocused
                  ? "min-w-sm xl:min-w-md"
                  : "min-w-xs xl:min-w-sm"
              } ${!isNavSolid ? "opacity-0 pointer-events-none" : "opacity-100"}`}
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
                    <div className="absolute inset-0 flex items-center pointer-events-none text-[#666666]">
                      <span className="mr-1 font-halyard-text-light">
                        Search for
                      </span>
                      <div className="relative overflow-hidden h-5 flex items-center w-40">
                        {/* Previous text - fading out upward */}
                        {isTransitioning && previousPlaceholderIndex >= 0 && (
                          <span
                            key={`prev-${previousPlaceholderIndex}`}
                            className="absolute font-halyard-text-light whitespace-nowrap"
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
                          className="absolute font-halyard-text-light whitespace-nowrap"
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
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-851] max-h-80 overflow-y-auto">
                    {/* Top destinations */}
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-[#444444] mb-3">
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
                              <div className="font-heading text-[#444444] text-sm">
                                {dest.name}
                              </div>
                              <div className="text-[#666666] text-sm">
                                {dest.country}
                              </div>
                            </div>
                          </div>
                        ))}

                        {searchQuery && filteredDestinations.length === 0 && (
                          <div className="py-3 px-2 text-[#666666] text-sm text-center">
                            No destinations found for "{searchQuery}"
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            <div className="hidden md:flex items-center gap-6 ">
              <LanguageCurrencyDropdown scrolled={isNavSolid} />
              <Link
                href="/help"
                className="text-sm font-medium flex items-center gap-1"
              >
                <CircleHelp strokeWidth={1} size={16} />
                <span className={`hidden text-[#444444]  md:block ${navTextColorClass}`}>
                  Help
                </span>
              </Link>

              {loading ? (
                // Loading state
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
              ) : user ? (
                // Authenticated state - show user dropdown
                <UserDropdown user={user} scrolled={isNavSolid} />
              ) : (
                // Unauthenticated state - show sign in button
                <button
                  onClick={() => setAuthDialogOpen(true)}
                  className={`border ${
                    isNavSolid
                      ? "text-[#444444] border-gray-400"
                      : "border-white text-white"
                  } rounded-md cursor-pointer font-medium py-1.5 px-3 text-sm`}
                >
                  Sign in
                </button>
              )}
            </div>
            <div className="md:hidden flex items-center gap-4">
              {/* Mobile Search Trigger */}
              <button
                onClick={() => setIsCustomSearchDrawerOpen(true)}
                className="p-2 font-halyard-text-light"
              >
                <Search
                  size={16}
                  className={`font-halyard-text-light ${navTextColorClass}`}
                />
              </button>

              <LanguageCurrencyDropdown scrolled={isNavSolid} />
            </div>
          </div>
        </div>
      </div>

      {/* Custom Mobile Search Drawer */}
      <AnimatePresence>
        {isCustomSearchDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 z-80"
              onClick={() => setIsCustomSearchDrawerOpen(false)}
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
                mass: 0.8,
              }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={(event, info) => {
                if (info.offset.y > 100) {
                  setIsCustomSearchDrawerOpen(false);
                }
              }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-80 drawer-container flex flex-col"
              style={{
                paddingBottom: `max(1rem, ${safeAreaBottom}px)`,
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
                    onClick={() => setIsCustomSearchDrawerOpen(false)}
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
              <div
                className="flex-1 min-h-0 px-4 pb-4"
                style={{ minHeight: "calc(var(--vh, 1vh) * 85 - 120px)" }}
              >
                {!searchQuery ? (
                  <>
                    {/* Top destinations near you */}
                    <div className="mb-4">
                      <h3 className="text-xs font-medium text-[#444444] mb-2 px-2">
                        Top destinations near you
                      </h3>
                      <div className="space-y-0 max-h-48 overflow-y-auto">
                        {topDestinations.map((dest) => (
                          <div
                            key={dest.id}
                            className="flex items-center gap-2 py-3 px-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                          >
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
                      <h3 className="text-xs font-medium text-[#444444] mb-2 px-2">
                        Top things to do worldwide
                      </h3>
                      <div className="space-y-0 max-h-64 overflow-y-auto">
                        {topActivities.map((activity) => (
                          <div
                            key={activity.id}
                            className="flex items-center gap-2 py-3 px-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                          >
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
                                <div className="absolute inset-0 bg-[#666666] bg-blend-overlay"></div>
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
                              <div className="font-heading text-[#444444] text-[15px]">
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
                        <h3 className="text-xs font-medium text-[#444444] mb-2 px-2">
                          Destinations ({filteredDestinations.length})
                        </h3>
                        <div className="space-y-0 max-h-48 overflow-y-auto">
                          {filteredDestinations.map((dest) => (
                            <div
                              key={dest.id}
                              className="flex items-center gap-2 py-3 px-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                            >
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
                                <div className="text-[#666666] text-xs">
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
                        <h3 className="text-xs font-medium text-[#444444] mb-2 px-2">
                          Activities ({filteredActivities.length})
                        </h3>
                        <div className="space-y-0 max-h-64 overflow-y-auto">
                          {filteredActivities.map((activity) => (
                            <div
                              key={activity.id}
                              className="flex items-center gap-2 py-3 px-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              <div className="w-10 h-10 rounded overflow-hidden">
                                <img
                                  src={activity.image}
                                  alt={activity.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-heading text-[#444444] text-sm">
                                  {activity.title}
                                </div>
                                <div className="text-[#666666] text-xs">
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
                          <div className="text-[#666666]">
                            No results found for "{searchQuery}"
                          </div>
                        </div>
                      )}
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  );
};

export default Navbar;
