"use client";
import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "../ui/input";
import { Search, ArrowLeft } from "lucide-react";

  interface HeroProps {
  city?: string;
  }

const Hero: React.FC<HeroProps> = ({ city }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isCustomDrawerOpen, setIsCustomDrawerOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [previousPlaceholderIndex, setPreviousPlaceholderIndex] = useState(-1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [safeAreaBottom, setSafeAreaBottom] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const currentIndexRef = useRef(0);
  const decodedCity = decodeURIComponent(city ?? "");
  const formattedCityName = decodedCity
    ? decodedCity.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    : "London";

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

  const placeholderOptions = [
    "experiences and cities",
    "Burj Khalifa",
    "Dubai",
    "things to do",
    "attractions",
    "tours",
  ];

  // Progress animation effect
  useEffect(() => {
    let animationId: number;
    let startTime: number | null = null;

    const animateProgress = (currentTime: number) => {
      if (!startTime) startTime = currentTime;

      const elapsed = currentTime - startTime;
      const progressPercent = Math.min((elapsed / 5000) * 100, 100); // 5 seconds = 5000ms

      setProgress(progressPercent);

      if (progressPercent < 100) {
        animationId = requestAnimationFrame(animateProgress);
      } else {
        setProgress(0);
        startTime = null;
      }
    };

    animationId = requestAnimationFrame(animateProgress);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [currentSlide]);

  // Update CSS custom property for progress
  useEffect(() => {
    const activeBullet = document.querySelector(
      ".swiper-pagination-bullet-active"
    );
    if (activeBullet) {
      (activeBullet as HTMLElement).style.setProperty(
        "--progress",
        `${progress}%`
      );
    }

    // Make previous dots white
    const allBullets = document.querySelectorAll(".swiper-pagination-bullet");
    allBullets.forEach((bullet, index) => {
      if (index < currentSlide) {
        bullet.classList.add("swiper-pagination-bullet-active-prev");
      } else {
        bullet.classList.remove("swiper-pagination-bullet-active-prev");
      }
    });
  }, [progress, currentSlide]);

  // Reset progress when slide changes
  const handleSlideChange = (swiper: any) => {
    setCurrentSlide(swiper.activeIndex);
    setProgress(0);
  };

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

      <div className="relative pt-20 md:pt-36 pb-4 mx-auto">
<div className="relative mx-auto">
  {/* Text Overlay - positioned absolutely over the image */}
  <div className="absolute top-6 left-6 md:top-12 md:left-12 z-10 text-left max-w-md md:max-w-2xl">
    <h1 className="text-2xl md:text-5xl font-bold text-white font-halyard-text drop-shadow-lg leading-tight md:leading-normal">
      Best things to do in {formattedCityName}
    </h1>
  </div>

  {/* Dark overlay when search is open */}
  {isSearchOpen && (
    <div
      className="fixed inset-0 bg-black/50 z-[9998]"
      onClick={() => {
        setIsSearchOpen(false);
        setIsInputFocused(false);
      }}
    />
  )}

  <Swiper
    autoplay={{
      delay: 5000,
      disableOnInteraction: false,
    }}
    modules={[Autoplay, Navigation, Pagination]}
    navigation={{
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    }}
    pagination={{
      clickable: true,
      dynamicBullets: false,
      renderBullet: function (index, className) {
        return '<span class="' + className + ' custom-bullet"></span>';
      },
    }}
    className="mySwiper w-full rounded-2xl overflow-hidden"
    onSlideChange={handleSlideChange}
  >
    <SwiperSlide className="rounded-2xl">
      <div className="relative w-full h-[45vh] md:h-[60vh] lg:h-[70vh]">
        <img
          src="https://cdn-imgix.headout.com/media/images/8515c147e2627c8da9f48f62c9bf254a-Harry%20Potter-Dweb.png?w=1800&h=750&crop=faces&auto=compress%2Cformat&fit=min"
          className="w-full h-full object-cover rounded-2xl"
          alt="Hero slide 1"
        />
      </div>
    </SwiperSlide>
    <SwiperSlide className="rounded-2xl">
      <div className="relative w-full h-[45vh] md:h-[60vh] lg:h-[70vh]">
        <img
          src="https://cdn-imgix.headout.com/media/images/d8700da23f2d351a6f107c1f67da371b-Mean%20Girls%20London%20promo%20banner%20desktop.png?w=1800&h=750&crop=faces&auto=compress%2Cformat&fit=min"
          className="w-full h-full object-cover rounded-2xl"
          alt="Hero slide 2"
        />
      </div>
    </SwiperSlide>
    <SwiperSlide className="rounded-2xl">
      <div className="relative w-full h-[45vh] md:h-[60vh] lg:h-[70vh]">
        <img
          src="https://cdn-imgix.headout.com/media/images/0a8f6ede9e1b32f3277c4e49bb6aba93-MocoMuseum-Desktop%20Banner-min.png?w=1800&h=750&crop=faces&auto=compress%2Cformat&fit=min"
          className="w-full h-full object-cover rounded-2xl"
          alt="Hero slide 3"
        />
      </div>
    </SwiperSlide>
    <div className="!hidden md:!block swiper-button-next after:text-black after:!text-xs after:w-8 after:h-8 after:absolute after:bg-white after:flex after:items-center after:justify-center after:rounded-full after:shadow-lg mr-5" />
    <div className="!hidden md:!block swiper-button-prev after:text-black after:!text-xs after:w-8 after:h-8 after:absolute after:bg-white after:flex after:items-center after:justify-center after:rounded-full after:shadow-lg ml-5" />
  </Swiper>

  {/* Mobile Search Trigger - positioned over the image */}
  <div className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 w-[90%] md:hidden z-10">
    <button
      className="pl-2 w-full flex items-center bg-white gap-2 rounded-md p-1 shadow-lg text-sm cursor-pointer"
      onClick={() => setIsCustomDrawerOpen(true)}
    >
      <div className="flex-1 relative">
        <Input className="bg-transparent border-none focus-visible:ring-0 shadow-none cursor-pointer text-[13px] pointer-events-none" />
        <AnimatedPlaceholder />
      </div>
      <div className="bg-[#8000FF] rounded p-2">
        <Search strokeWidth={1} className="text-white" />
      </div>
    </button>
  </div>
</div>


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
                  mass: 0.8,
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
                <div
                  className="flex-1 min-h-0 px-4 pb-4"
                  style={{ minHeight: "calc(var(--vh, 1vh) * 85 - 120px)" }}
                >
                  {!searchQuery ? (
                    <>
                      {/* Top things to do worldwide */}
                      <div className="mb-4">
                        <h3 className="text-xs font-halyard-text font-medium text-[#444444] mb-2">
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
                                    className="w-full h-full object-cover rounded"
                                  />
                                </div>
                                <div className="absolute -left-[2px] -top-[1px] w-10 h-10 rounded overflow-hidden transform -rotate-4 opacity-50">
                                  <img
                                    src={activity.image}
                                    alt={activity.title}
                                    className="w-full h-full object-cover rounded"
                                  />
                                </div>
                                <div className="absolute -left-[0px] -top-[3px] w-10 h-10 rounded overflow-hidden transform opacity-30">
                                  <img
                                    src={activity.image}
                                    alt={activity.title}
                                    className="w-full h-full object-cover rounded"
                                  />
                                  <div className="absolute inset-0 bg-gray-500 bg-blend-overlay"></div>
                                </div>
                                {/* Main image */}
                                <div className="relative border-white border w-10 h-10 rounded overflow-hidden">
                                  <img
                                    src={activity.image}
                                    alt={activity.title}
                                    className="w-full h-full object-cover rounded"
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="font-semibold text-[#444444] text-sm">
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

                      {/* Top destinations near you */}
                      <div className="mb-4">
                        <h3 className="text-xs font-medium text-[#444444] mb-2">
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
                                  className="w-full h-full object-cover rounded"
                                />
                              </div>
                              <div>
                                <div className="font-semibold text-[#444444] text-sm">
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
                    </>
                  ) : (
                    <>
                      {/* Search Results */}
                      {filteredDestinations.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-xs font-medium text-[#444444] mb-2">
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
                                    className="w-full h-full object-cover rounded"
                                  />
                                </div>
                                <div>
                                  <div className="font-semibold text-[#444444] text-sm">
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
                          <h3 className="text-xs font-medium text-[#444444] mb-2">
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
                                    className="w-full h-full object-cover rounded"
                                  />
                                </div>
                                <div>
                                  <div className="font-semibold text-[#444444] text-sm">
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
      </div>
    </>
  )}
export default Hero;