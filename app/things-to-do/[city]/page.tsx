"use client";
import Activities from "@/components/home/Activities";
import Banner from "@/components/home/Banner";
import BrowseThemes from "@/components/home/BrowseThemes";
import Faqs from "@/components/things-to-do/Faqs";
import CarouselGrid from "@/components/grids/CarouselGrid";
import Stats from "@/components/home/Stats";
import React, { useState, useEffect, useRef } from "react";
import Destinations from "@/components/home/Destinations";
import MustDo from "@/components/things-to-do/MustDo";
import Hero from "@/components/things-to-do/Hero";
import TravelGuide from "@/components/things-to-do/TravelGuide";
import Testimonials from "@/components/things-to-do/Testimonials";
import CategoriesDropdown from "@/components/category/CategoriesDropdown";
import {
  ArrowLeft,
  BadgePercent,
  BusFront,
  Landmark,
  Leaf,
  Music,
  Search,
  Ship,
  Tv,
  SunMedium,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useNavigationStore } from "@/lib/store/navigationStore";
import { useParams } from "next/navigation";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Input } from "@/components/ui/input";

const ThingsToDo = () => {
  const {
    showBanner,
    setShowBanner,
    setScroll,
    setIsSectionActive,
    setShowSectionNavigation,
    activeSection,
    setActiveSection,
    isSectionActive,
  } = useNavigationStore();

  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const [isCustomDrawerOpen, setIsCustomDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [previousPlaceholderIndex, setPreviousPlaceholderIndex] = useState(-1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const currentIndexRef = useRef(0);

  useEffect(() => {
    setIsMounted(true);
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
    if (!isMounted) return;
    if (!searchQuery) {
      const interval = setInterval(() => {
        const nextIndex =
          (currentIndexRef.current + 1) % placeholderOptions.length;
        setPreviousPlaceholderIndex(currentIndexRef.current);
        setIsTransitioning(true);
        currentIndexRef.current = nextIndex;
        setCurrentPlaceholderIndex(nextIndex);
        setTimeout(() => {
          setIsTransitioning(false);
          setPreviousPlaceholderIndex(-1);
        }, 700);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [searchQuery, placeholderOptions.length, isMounted]);

  useEffect(() => {
    currentIndexRef.current = currentPlaceholderIndex;
  }, [currentPlaceholderIndex]);

  useEffect(() => {
    if (isCustomDrawerOpen) {
      document.body.style.overflow = "hidden";
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

  useEffect(() => {
    if (isCustomDrawerOpen && mobileInputRef.current) {
      setTimeout(() => {
        mobileInputRef.current?.focus();
      }, 300);
    }
  }, [isCustomDrawerOpen]);

  const AnimatedPlaceholder = ({ prefix = "Search for" }) => (
    <div className="absolute inset-0 flex items-center pointer-events-none text-[#666666]">
      <span className="mr-1 font-halyard-text-light md:text-base text-sm flex-shrink-0">
        {prefix}
      </span>
      <div className="relative overflow-hidden h-5 flex items-center flex-1 min-w-0">
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

  const params = useParams();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);
  const city = params.city as string;

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navigationElement = navigationRef.current;
      const navHeight = navigationElement ? navigationElement.offsetHeight : 0;

      const isMobile = window.innerWidth < 768;
      const mainHeaderHeight = isMobile ? 64 : 120;

      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navHeight - mainHeaderHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  useEffect(() => {
    const handleGlobalScroll = () => {
      const scrollTop = window.scrollY;

      const viewportHeight = window.innerHeight;
      const heroHeight = viewportHeight * 0.6;

      const isMobile = window.innerWidth < 768;
      const stickyThreshold = isMobile ? heroHeight - 100 : heroHeight - 200;

      setScroll(scrollTop > stickyThreshold);

      const navigationElement = document.querySelector("[data-navigation]");
      if (navigationElement) {
        const navigationRect = navigationElement.getBoundingClientRect();

        const mobileStickyPoint = 64;
        const desktopStickyPoint = 120;

        const shouldBeFixed = isMobile
          ? navigationRect.top <= mobileStickyPoint + 1
          : navigationRect.top <= desktopStickyPoint + 1;

        setIsSectionActive(shouldBeFixed);
      }
    };

    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleGlobalScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledHandleScroll);
    window.addEventListener("resize", throttledHandleScroll);
    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
      window.removeEventListener("resize", throttledHandleScroll);
    };
  }, [setScroll, setIsSectionActive, setShowSectionNavigation]);

  useEffect(() => {
    const sections = [
      "musicals",
      "landmarks",
      "day-trips",
      "combos",
      "cruises",
      "plays",
      "museums",
      "hop-on-hop-off-tours",
    ];

    const navigationElement = navigationRef.current;
    const navHeight = navigationElement ? navigationElement.offsetHeight : 0;
    const isMobile = window.innerWidth < 768;
    const mainHeaderHeight = isMobile ? 64 : 120;
    const topOffset = navHeight + mainHeaderHeight;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: `-${topOffset}px 0px -${window.innerHeight - topOffset - 100}px 0px`,
        threshold: 0.1,
      }
    );

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [setActiveSection]);

  useEffect(() => {
    const handleResize = () => checkScrollButtons();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => checkScrollButtons();
    const scrollElement = scrollContainerRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      return () => scrollElement.removeEventListener("scroll", handleScroll);
    }
  }, []);

  useEffect(() => {
    checkScrollButtons();
  }, []);

  const recommendations = [
    {
      id: 1,
      description: "Edge Observation Deck Tickets: Timed Entry",
      place: "Edge NYC",
      image: "/images/r4.jpg.avif",
      price: 39.2,
      rating: 4.5,
      reviews: 5897,
      badge: "Free cancellation",
    },
    {
      id: 2,
      description: "The Museum of Modern Art (MoMA) Tickets",
      place: "Museum of Modern Art (MoMA)",
      image: "/images/r3.jpg.avif",
      price: 30,
      off: 3,
      rating: 4.4,
      reviews: 4489,
    },
    {
      id: 3,
      description: "NYC Helicopter Tour from Downtown Manhattan",
      place: "Helicopter Tours",
      image: "/images/r2.jpg.avif",
      price: 259,
      rating: 4.5,
      reviews: 7792,
      badge: "Free cancellation",
    },
    {
      id: 4,
      description: "Go City New York Explorer Pass: Choose 2 to 10 Attractions",
      place: "City Cards",
      image: "/images/r1.jpg.avif",
      price: 89,
      rating: 4.5,
      reviews: 2110,
      badge: "Free cancellation",
    },
  ];

  return (
    <div className="relative min-h-screen">
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
        .drawer-container {
          height: calc(var(--vh, 1vh) * 85);
          max-height: calc(var(--vh, 1vh) * 85);
        }
        @supports (padding: max(0px)) {
          .drawer-container {
            padding-bottom: max(1rem, env(safe-area-inset-bottom));
          }
        }
      `}</style>
      <section className="relative">
        <div className="hidden md:block fixed top-19 bg-white w-full py-3 z-20 border-b">
          <div className="hidden md:block">
            <CategoriesDropdown
              showCategoriesDropdown={showCategoriesDropdown}
              setShowCategoriesDropdown={setShowCategoriesDropdown}
              setShowBanner={setShowBanner}
            />
          </div>
          <div
            className={` transition-all duration-300 origin-top overflow-hidden ${
              showBanner ? "scale-y-100 h-auto" : "scale-y-0 h-0"
            }`}
          >
            <Banner />
          </div>
        </div>

        <div className="max-w-[1200px] relative mx-auto px-[24px] xl:px-0 ">
          <Hero city={city} />
          <div className="md:hidden px-3 mt-[-30px] pb-2  relative z-20">
            <button
              className="pl-2 w-full flex items-center bg-white gap-2 rounded-md p-1 shadow-lg text-sm cursor-pointer"
              onClick={() => setIsCustomDrawerOpen(true)}
            >
              <div className="flex-1 relative">
                <Input className="bg-transparent border-none focus-visible:ring-0 shadow-none cursor-pointer text-[13px] pointer-events-none h-auto" />
                <AnimatedPlaceholder />
              </div>
              <div className="bg-[#8000FF] rounded p-2">
                <Search strokeWidth={1} className="text-white" />
              </div>
            </button>
          </div>
        </div>

        <div
          ref={navigationRef}
          data-navigation
          className={`block sticky w-full bg-white z-10 py-4 md:top-30 top-16 ${
            isSectionActive ? "shadow-lg" : ""
          }`}
        >
          <div className="relative">
            <div
              ref={scrollContainerRef}
              className="flex relative gap-2 overflow-x-auto scrollbar-hide z-10 max-w-[1200px] mx-auto px-[24px] xl:px-0"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {showLeftButton && (
                <div className="absolute left-3.5 top-0 z-10 bottom-0 items-center flex">
                  <div className="bg-gradient-to-r from-white via-white/50 to-transparent w-20 h-full flex items-center justify-start">
                    <div className="bg-white shadow-sm shadow-white border border-gray-200 rounded-full p-1.5 cursor-pointer hover:border-gray-400">
                      <ChevronLeft
                        size={16}
                        className="text-[#444444]"
                        onClick={scrollLeft}
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => scrollToSection("musicals")}
                className={`font-halyard-text flex items-center text-sm sm:text-base gap-2 py-[11px] px-[15px] border rounded-[4px] whitespace-nowrap transition-all duration-200 ${
                  activeSection === "musicals"
                    ? "bg-purple-600/10 text-purple-600 border-purple-600/20"
                    : "text-[#444444] border-gray-200 hover:bg-purple-600/10 hover:text-purple-600"
                }`}
              >
                <Music strokeWidth={1} />
                Musicals
              </button>
              <button
                onClick={() => scrollToSection("landmarks")}
                className={`font-halyard-text flex items-center text-sm sm:text-base gap-2 py-[11px] px-[15px] border rounded-[4px] whitespace-nowrap transition-all duration-200 ${
                  activeSection === "landmarks"
                    ? "bg-purple-600/10 text-purple-600 border-purple-600/20"
                    : "text-[#444444] border-gray-200 hover:bg-purple-600/10 hover:text-purple-600"
                }`}
              >
                <Landmark strokeWidth={1} />
                Landmarks
              </button>
              <button
                onClick={() => scrollToSection("day-trips")}
                className={`font-halyard-text flex items-center text-sm sm:text-base gap-2 py-[11px] px-[15px] border rounded-[4px] whitespace-nowrap transition-all duration-200 ${
                  activeSection === "day-trips"
                    ? "bg-purple-600/10 text-purple-600 border-purple-600/20"
                    : "text-[#444444] border-gray-200 hover:bg-purple-600/10 hover:text-purple-600"
                }`}
              >
                <SunMedium strokeWidth={1} />
                Day Trips
              </button>
              <button
                onClick={() => scrollToSection("combos")}
                className={`font-halyard-text flex items-center text-sm sm:text-base gap-2 py-[11px] px-[15px] border rounded-[4px] whitespace-nowrap transition-all duration-200 ${
                  activeSection === "combos"
                    ? "bg-purple-600/10 text-purple-600 border-purple-600/20"
                    : "text-[#444444] border-gray-200 hover:bg-purple-600/10 hover:text-purple-600"
                }`}
              >
                <BadgePercent strokeWidth={1} />
                Combos
              </button>
              <button
                onClick={() => scrollToSection("cruises")}
                className={`font-halyard-text flex items-center text-sm sm:text-base gap-2 py-[11px] px-[15px] border rounded-[4px] whitespace-nowrap transition-all duration-200 ${
                  activeSection === "cruises"
                    ? "bg-purple-600/10 text-purple-600 border-purple-600/20"
                    : "text-[#444444] border-gray-200 hover:bg-purple-600/10 hover:text-purple-600"
                }`}
              >
                <Ship strokeWidth={1} />
                Cruises
              </button>
              <button
                onClick={() => scrollToSection("plays")}
                className={`font-halyard-text flex items-center text-sm sm:text-base gap-2 py-[11px] px-[15px] border rounded-[4px] whitespace-nowrap transition-all duration-200 ${
                  activeSection === "plays"
                    ? "bg-purple-600/10 text-purple-600 border-purple-600/20"
                    : "text-[#444444] border-gray-200 hover:bg-purple-600/10 hover:text-purple-600"
                }`}
              >
                <Leaf strokeWidth={1} />
                Plays
              </button>
              <button
                onClick={() => scrollToSection("museums")}
                className={`font-halyard-text flex items-center text-sm sm:text-base gap-2 py-[11px] px-[15px] border rounded-[4px] whitespace-nowrap transition-all duration-200 ${
                  activeSection === "museums"
                    ? "bg-purple-600/10 text-purple-600 border-purple-600/20"
                    : "text-[#444444] border-gray-200 hover:bg-purple-600/10 hover:text-purple-600"
                }`}
              >
                <Tv strokeWidth={1} />
                Museums
              </button>
              <button
                onClick={() => scrollToSection("hop-on-hop-off-tours")}
                className={`font-halyard-text flex items-center text-sm sm:text-base gap-2 py-[11px] px-[15px] border rounded-[4px] whitespace-nowrap transition-all duration-200 ${
                  activeSection === "hop-on-hop-off-tours"
                    ? "bg-purple-600/10 text-purple-600 border-purple-600/20"
                    : "text-[#444444] border-gray-200 hover:bg-purple-600/10 hover:text-purple-600"
                }`}
              >
                <BusFront strokeWidth={1} />
                Hop-On Hop-Off Tours
              </button>

              {showRightButton && (
                <div className="absolute right-0 top-0 bottom-0 z-10 md:flex hidden items-center">
                  <div className="bg-gradient-to-l from-white via-white to-transparent w-20 h-full flex items-center justify-end">
                    <div className="bg-white shadow-2xl shadow-white border border-gray-200 rounded-full p-1.5 cursor-pointer hover:border-gray-400">
                      <ChevronRight
                        size={16}
                        className="text-[#444444]"
                        onClick={scrollRight}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto pb-10">
          <CarouselGrid
            title="Top experiences in London"
            recommendations={recommendations}
            variant="subcategory"
          />
          <div id="musicals">
            <CarouselGrid
              title="London Musicals"
              recommendations={recommendations}
              variant="subcategory"
            />
          </div>
          <div id="landmarks">
            <CarouselGrid
              title="Landmarks in London"
              recommendations={recommendations}
              variant="subcategory"
            />
          </div>
          <div id="day-trips">
            <CarouselGrid
              title="Day Trips From London"
              recommendations={recommendations}
              variant="subcategory"
            />
          </div>
          <div id="combos">
            <CarouselGrid
              title="Combos Tickets in London"
              recommendations={recommendations}
              variant="subcategory"
            />
          </div>
          <div id="cruises">
            <CarouselGrid
              title="Thames River Cruise"
              recommendations={recommendations}
              variant="subcategory"
            />
          </div>
          <div id="plays">
            <CarouselGrid
              title="Plays in London"
              recommendations={recommendations}
              variant="subcategory"
            />
          </div>
          <div id="museums">
            <CarouselGrid
              title="Museums in London"
              recommendations={recommendations}
              variant="subcategory"
            />
          </div>
          <div id="hop-on-hop-off-tours">
            <CarouselGrid
              title="Hop-on Hop-off Tours London"
              recommendations={recommendations}
              variant="subcategory"
            />
          </div>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto mt-10 pb-10 px-[24px] xl:px-0">
        <MustDo />
        <TravelGuide />
        <BrowseThemes />
        <Testimonials variant="default" />
        <Destinations />
        <Faqs />
        <Banner />
        <Stats />
      </div>

      <AnimatePresence>
        {isCustomDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 z-[9998]"
              onClick={() => setIsCustomDrawerOpen(false)}
            />
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
            >
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
              </div>
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
              <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4">
                {!searchQuery ? (
                  <>
                    <div className="mb-4">
                      <h3 className="text-xs font-medium text-[#444444] mb-2 px-2">
                        Top destinations near you
                      </h3>
                      <div className="space-y-0">
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
                    <div className="mb-4">
                      <h3 className="text-xs font-medium text-[#444444] mb-2 px-2">
                        Top things to do worldwide
                      </h3>
                      <div className="space-y-0">
                        {topActivities.map((activity) => (
                          <div
                            key={activity.id}
                            className="flex items-center gap-2 py-3 px-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <div className="relative w-10 h-10">
                              <div className="relative border-white border w-10 h-10 rounded overflow-hidden">
                                <img
                                  src={activity.image}
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
                    {filteredDestinations.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-xs font-medium text-[#444444] mb-2 px-2">
                          Destinations ({filteredDestinations.length})
                        </h3>
                        <div className="space-y-0">
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
                        <h3 className="text-xs font-medium text-[#444444] mb-2 px-2">
                          Activities ({filteredActivities.length})
                        </h3>
                        <div className="space-y-0">
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
  );
};

export default ThingsToDo;
