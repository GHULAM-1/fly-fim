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
  BadgePercent,
  BusFront,
  Landmark,
  Leaf,
  Music,
  Ship,
  Tv,
  SunMedium,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigationStore } from "@/lib/store/navigationStore";

const ThingsToDo = () => {
  const {
    showBanner,
    setShowBanner,
    setScroll,
    setIsSectionActive,
    setShowSectionNavigation,
    activeSection,
    setActiveSection,
  } = useNavigationStore();

  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [isCarouselVisible, setIsCarouselVisible] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 200;
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - navHeight;

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
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  // Global scroll handler to coordinate all navigation state
  useEffect(() => {
    const handleGlobalScroll = () => {
      const scrollTop = window.scrollY;

      // Calculate when navigation becomes sticky based on viewport
      const viewportHeight = window.innerHeight;
      const heroHeight = viewportHeight * 0.6; // Hero takes 60% of viewport
      const stickyThreshold = heroHeight - 200; // Show shadow earlier

      setScroll(scrollTop > stickyThreshold);

      // Check if navigation is about to go out of viewport
      const navigationElement = document.querySelector("[data-navigation]");
      if (navigationElement) {
        const navigationRect = navigationElement.getBoundingClientRect();

        // Make it fixed when it's about to go out of viewport (when top is near 0)
        const shouldBeFixed = navigationRect.top <= 50; // Back to original threshold
        setIsSectionActive(shouldBeFixed);
      }

      // Check if we should hide the section navigation
      const activitiesElement = document.getElementById("activities");
      const lastSectionElement = document.getElementById(
        "hop-on-hop-off-tours"
      );

      if (activitiesElement && lastSectionElement) {
        const activitiesRect = activitiesElement.getBoundingClientRect();
        const lastSectionRect = lastSectionElement.getBoundingClientRect();

        // Hide nav if we're completely past the last section
        if (lastSectionRect.bottom < 0) {
          setShowSectionNavigation(false);
          setIsCarouselVisible(false);
        } else {
          setShowSectionNavigation(true);
          setIsCarouselVisible(true);
        }
      }
    };

    // Use throttled scroll handler
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
    return () => window.removeEventListener("scroll", throttledHandleScroll);
  }, [setScroll, setIsSectionActive, setShowSectionNavigation]);

  // Intersection observer for active section tracking
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

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (sections.includes(entry.target.id)) {
              setActiveSection(entry.target.id);
            }
          }
        });
      },
      {
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0.3,
      }
    );

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [setActiveSection]);

  // Scroll button handlers
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
      description: "Skydive Dubai: Tandem Skydiving at the Palm Drop Zone",
      place: "Dubai",
      image: "/images/r4.jpg.avif",
      price: 100,
      rating: 4.5,
      reviews: 100,
    },
    {
      id: 2,
      description: "Acropolis Parthenon Tickets with Optional Audio Guide",
      place: "Athens",
      image: "/images/r3.jpg.avif",
      price: 100,
      rating: 4.5,
      reviews: 100,
    },
    {
      id: 3,
      description:
        "From Rome: Pompeii, Amalfi Coast and Sorrento or Positano Day Trip",
      place: "Italy",
      image: "/images/r2.jpg.avif",
      price: 100,
      rating: 4.5,
      reviews: 100,
    },
    {
      id: 4,
      description:
        "From London: Harry Potter™ Warner Bros. Studio Tickets with Coach Transfers",
      place: "London",
      image: "/images/r1.jpg.avif",
      price: 100,
      rating: 4.5,
      reviews: 100,
    },
  ];

  return (
    <div className="relative min-h-screen">
      <div className="hidden md:block fixed top-19 bg-white w-full py-3 z-40 border-b">
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
      <div className="max-w-[1200px] mx-auto px-[24px] xl:px-0">
        <Hero />
      </div>

      {/* Category Carousel - Now integrated directly in the page */}
      <div
        ref={navigationRef}
        data-navigation
        className={`hidden md:block sticky top-30 w-full bg-white z-30 py-4 transition-all duration-500 transform ${
          isCarouselVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex relative gap-2 overflow-x-auto scrollbar-hide z-10 max-w-[1200px] mx-auto px-[24px] xl:px-0"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {showLeftButton && (
              <div className="absolute left-3.5 top-0 z-10 bottom-0 items-center md:flex hidden">
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
              className={`font-halyard-text hover:cursor-pointer flex items-center text-sm sm:text-base gap-2 py-[11px] px-[15px] border rounded-[4px] whitespace-nowrap transition-all duration-200 ${
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
              className={`font-halyard-text hover:cursor-pointer flex items-center text-sm sm:text-base gap-2 py-[11px] px-[15px] border rounded-[4px] whitespace-nowrap transition-all duration-200 ${
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
              className={`font-halyard-text hover:cursor-pointer flex items-center text-sm sm:text-base gap-2 py-[11px] px-[15px] border rounded-[4px] whitespace-nowrap transition-all duration-200 ${
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
              className={`font-halyard-text hover:cursor-pointer flex items-center text-sm sm:text-base gap-2 py-[11px] px-[15px] border rounded-[4px] whitespace-nowrap transition-all duration-200 ${
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
              className={`font-halyard-text hover:cursor-pointer flex items-center text-sm sm:text-base gap-2 py-[11px] px-[15px] border rounded-[4px] whitespace-nowrap transition-all duration-200 ${
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
              className={`font-halyard-text hover:cursor-pointer flex items-center text-sm sm:text-base gap-2 py-[11px] px-[15px] border rounded-[4px] whitespace-nowrap transition-all duration-200 ${
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
              className={`font-halyard-text hover:cursor-pointer flex items-center text-sm sm:text-base gap-2 py-[11px] px-[15px] border rounded-[4px] whitespace-nowrap transition-all duration-200 ${
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
              className={`font-halyard-text hover:cursor-pointer flex items-center text-sm sm:text-base gap-2 py-[11px] px-[15px] border rounded-[4px] whitespace-nowrap transition-all duration-200 ${
                activeSection === "hop-on-hop-off-tours"
                  ? "bg-purple-600/10 text-purple-600 border-purple-600/20"
                  : "text-[#444444] border-gray-200 hover:bg-purple-600/10 hover:text-purple-600"
              }`}
            >
              <BusFront strokeWidth={1} />
              Hop-On Hop-Off Tours London
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

      <div className="max-w-[1200px] mx-auto pb-10 px-[24px] xl:px-0">
      <CarouselGrid
        title="Top experiences in London"
        recommendations={recommendations}
        variant="subcategory"
      />
      <CarouselGrid
        title="London Musicals"
        recommendations={recommendations}
        variant="subcategory"
      />
      <CarouselGrid
        title="Landmarks in London"
        recommendations={recommendations}
        variant="subcategory"
      />
      <CarouselGrid
        title="Day Trips From London"
        recommendations={recommendations}
        variant="subcategory"
      />
      <CarouselGrid
        title="Combos Tickets in London"
        recommendations={recommendations}
        variant="subcategory"
      />
      <CarouselGrid
        title="Thames River Cruise"
        recommendations={recommendations}
        variant="subcategory"
      />
      <CarouselGrid
        title="Plays in London"
        recommendations={recommendations}
        variant="subcategory"
      />
      <CarouselGrid
        title="Museums in London"
        recommendations={recommendations}
        variant="subcategory"
      />
      <CarouselGrid
        title="Hop-on Hop-off Tours London"
        recommendations={recommendations}
        variant="subcategory"
      />     
      </div>
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
    </div>
  );
};

export default ThingsToDo;
