"use client";
import Activities from "@/components/home/Activities";
import Banner from "@/components/home/Banner";
import BrowseThemes from "@/components/home/BrowseThemes";
import Faqs from "@/components/things-to-do/Faqs";
import CarouselGrid from "@/components/grids/CarouselGrid";
import Stats from "@/components/home/Stats";
import { Menu, Smartphone, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import Destinations from "@/components/home/Destinations";
import MustDo from "@/components/things-to-do/MustDo";
import Hero from "@/components/things-to-do/Hero";
import TravelGuide from "@/components/things-to-do/TravelGuide";
import {
  BadgePercent,
  BusFront,
  Landmark,
  Leaf,
  Music,
  Ship,
  Tv,
  SunMedium,
} from "lucide-react";
import Testimonials from "@/components/things-to-do/Testimonials";

const ThingsToDo = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [scroll, setScroll] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [showSectionNav, setShowSectionNav] = useState(true);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Custom scroll function that accounts for navigation height
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 200; // Approximate height of both navigation bars
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

  useEffect(() => {
    const handleScroll = () => {
      // Calculate when navigation becomes sticky based on viewport
      const viewportHeight = window.innerHeight;
      const heroHeight = viewportHeight * 0.6; // Hero takes 60% of viewport
      const stickyThreshold = heroHeight - 200; // Show shadow earlier

      setScroll(window.scrollY > stickyThreshold);

      // Check if we should hide the section navigation
      const activitiesElement = document.getElementById("activities");
      const lastSectionElement = document.getElementById("hop-on-hop-off-tours");
      
      if (activitiesElement && lastSectionElement) {
        const activitiesRect = activitiesElement.getBoundingClientRect();
        const lastSectionRect = lastSectionElement.getBoundingClientRect();
        
        // Hide nav if activities section is visible or if we're past the last section
        if (activitiesRect.top < window.innerHeight * 0.5 || lastSectionRect.bottom < window.innerHeight * 0.2) {
          console.log("Hiding navigation - Activities visible or past last section");
          setShowSectionNav(false);
          setActiveSection("");
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    checkScrollButtons();
    const handleResize = () => checkScrollButtons();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.addEventListener("scroll", checkScrollButtons);
      return () => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.removeEventListener(
            "scroll",
            checkScrollButtons
          );
        }
      };
    }
  }, []);

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
            if (entry.target.id === "activities") {
              // Hide section nav when Activities section is visible
              setShowSectionNav(false);
              setActiveSection("");
            } else if (sections.includes(entry.target.id)) {
              // Show section nav and set active section for carousel sections
              setShowSectionNav(true);
              setActiveSection(entry.target.id);
            }
          } else {
            // When a section is no longer intersecting, check if we should hide the nav
            if (sections.includes(entry.target.id)) {
              // Check if activities section is coming into view or if we're past the last section
              const activitiesElement = document.getElementById("activities");
              if (activitiesElement) {
                const activitiesRect = activitiesElement.getBoundingClientRect();
                const lastSectionElement = document.getElementById("hop-on-hop-off-tours");
                
                if (lastSectionElement) {
                  const lastSectionRect = lastSectionElement.getBoundingClientRect();
                  
                  // Hide nav if activities section is visible or if we're past the last section
                  if (activitiesRect.top < window.innerHeight * 0.5 || lastSectionRect.bottom < window.innerHeight * 0.2) {
                    setShowSectionNav(false);
                    setActiveSection("");
                  }
                }
              }
            }
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0.1,
      }
    );

    // Observe all carousel sections
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    // Observe Activities section to hide nav
    const activitiesElement = document.getElementById("activities");
    if (activitiesElement) {
      observer.observe(activitiesElement);
    }

    return () => observer.disconnect();
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
        <div className="flex justify-between items-center max-w-[1200px] mx-auto  px-[24px] xl:px-0">
          <ul className="flex gap-3 lg:gap-8 text-xs lg:text-[15px] font-halyard-text-light text-[#444444] font-light">
            <li className="flex hover:cursor-pointer items-center gap-1">
              <Menu size={16} className="text-[#444444]" />
              All Categories
            </li>
            <li className="hover:cursor-pointer">Best Sellers</li>
            <li className="hover:cursor-pointer">London theatre tickets</li>
            <li className="hover:cursor-pointer">London Eye</li>
            <li className="hover:cursor-pointer">Tower of London</li>
          </ul>
          <button
            className="text-[15px] text-[#444444] hover:cursor-pointer font-halyard-text-light flex items-center gap-1"
            onMouseEnter={() => setShowBanner(true)}
            onMouseLeave={() => setShowBanner(false)}
          >
            <Smartphone size={16} />
            Get Offer{" "}
          </button>
        </div>
        <div
          className={` transition-all duration-300 origin-top overflow-hidden ${
            showBanner ? "scale-y-100 h-auto" : "scale-y-0 h-0"
          }`}
        >
          <Banner />
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto px-[24px]   xl:px-0">
        <Hero />
      </div>
      <div
        className={` hidden md:block fixed top-16 md:top-30 w-full bg-white z-30 py-4 transition-all duration-500 transform ${
          scroll ? "border-y shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]" : ""
        } ${
          showSectionNav 
            ? "translate-y-0" 
            : "-translate-y-full"
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
      <div className="max-w-[1200px] mx-auto  pb-10 px-[24px] xl:px-0">
        <CarouselGrid
          title="Top experiences in London"
          recommendations={recommendations}
        />
        <div id="musicals">
          <CarouselGrid
            title="London Musicals"
            recommendations={recommendations}
          />
        </div>
        <div id="landmarks">
          <CarouselGrid
            title="Landmarks in London"
            recommendations={recommendations}
          />
        </div>
        <div id="day-trips">
          <CarouselGrid
            title="Day Trips From London"
            recommendations={recommendations}
          />
        </div>
        <div id="combos">
          <CarouselGrid
            title="Combos Tickets in London"
            recommendations={recommendations}
          />
        </div>
        <div id="cruises">
          <CarouselGrid
            title="Thames River Cruise"
            recommendations={recommendations}
          />
        </div>
        <div id="plays">
          <CarouselGrid
            title="Plays in London"
            recommendations={recommendations}
          />
        </div>
        <div id="museums">
          <CarouselGrid
            title="Museums in London"
            recommendations={recommendations}
          />
        </div>
        <div id="hop-on-hop-off-tours">
          <CarouselGrid
            title="Hop-on Hop-off Tours London"
            recommendations={recommendations}
          />
        </div>
      </div>
      <div id="activities">
        <Activities />
      </div>
      <div className="max-w-[1200px] mx-auto mt-10  pb-10 px-[24px] xl:px-0">
        <MustDo />
        <TravelGuide />
        <BrowseThemes />
        <Testimonials />
        <Destinations />
        <Faqs />
        <Banner />
        <Stats />
      </div>
    </div>
  );
};

export default ThingsToDo;
