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
  const [isSectionActive, setIsSectionActive] = useState(false);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);

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

      // Check if navigation is about to go out of viewport
      if (navigationRef.current) {
        const navigationRect = navigationRef.current.getBoundingClientRect();
        
        // Make it fixed when it's about to go out of viewport (when top is near 0)
        const shouldBeFixed = navigationRect.top <= 50; // 50px threshold
        setIsSectionActive(shouldBeFixed);
      }
      
      // Check if we should hide the section navigation
      const activitiesElement = document.getElementById("activities");
      const lastSectionElement = document.getElementById("hop-on-hop-off-tours");
      
      if (activitiesElement && lastSectionElement) {
        const activitiesRect = activitiesElement.getBoundingClientRect();
        const lastSectionRect = lastSectionElement.getBoundingClientRect();
        
        // Only hide nav if we're completely past the last section
        if (lastSectionRect.bottom < 0) {
          console.log("Hiding navigation - Past last section");
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
            if (sections.includes(entry.target.id)) {
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
                  
                  // Only hide nav if we're completely past the last section
                  if (lastSectionRect.bottom < 0) {
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
            <li 
              className="relative flex hover:cursor-pointer items-center gap-1"
              onMouseEnter={() => setShowCategoriesDropdown(true)}
              onMouseLeave={() => setShowCategoriesDropdown(false)}
            >
              <Menu size={16} className="text-[#444444]" />
              All Categories
              
              {/* Categories Dropdown */}
              <div
                className={`absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transition-all duration-300 origin-top ${
                  showCategoriesDropdown 
                    ? "scale-y-100 opacity-100" 
                    : "scale-y-0 opacity-0"
                }`}
                style={{ zIndex: 1000 }}
              >
                <div className="p-4 min-w-[200px]">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-[#444444] mb-2">Tours</div>
                      <div className="text-xs text-[#666666] hover:text-[#8000ff] cursor-pointer py-1">City Tours</div>
                      <div className="text-xs text-[#666666] hover:text-[#8000ff] cursor-pointer py-1">Walking Tours</div>
                      <div className="text-xs text-[#666666] hover:text-[#8000ff] cursor-pointer py-1">Food Tours</div>
                      <div className="text-xs text-[#666666] hover:text-[#8000ff] cursor-pointer py-1">Cultural Tours</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-[#444444] mb-2">Transportation</div>
                      <div className="text-xs text-[#666666] hover:text-[#8000ff] cursor-pointer py-1">Airport Transfers</div>
                      <div className="text-xs text-[#666666] hover:text-[#8000ff] cursor-pointer py-1">Car Rentals</div>
                      <div className="text-xs text-[#666666] hover:text-[#8000ff] cursor-pointer py-1">Public Transport</div>
                      <div className="text-xs text-[#666666] hover:text-[#8000ff] cursor-pointer py-1">Private Drivers</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-[#444444] mb-2">Travel Services</div>
                      <div className="text-xs text-[#666666] hover:text-[#8000ff] cursor-pointer py-1">Travel Insurance</div>
                      <div className="text-xs text-[#666666] hover:text-[#8000ff] cursor-pointer py-1">Visa Services</div>
                      <div className="text-xs text-[#666666] hover:text-[#8000ff] cursor-pointer py-1">Travel Planning</div>
                      <div className="text-xs text-[#666666] hover:text-[#8000ff] cursor-pointer py-1">Concierge</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-[#444444] mb-2">Cruises</div>
                      <div className="text-xs text-[#666666] hover:text-[#8000ff] cursor-pointer py-1">River Cruises</div>
                      <div className="text-xs text-[#666666] hover:text-[#8000ff] cursor-pointer py-1">Ocean Cruises</div>
                      <div className="text-xs text-[#666666] hover:text-[#8000ff] cursor-pointer py-1">Day Cruises</div>
                      <div className="text-xs text-[#666666] hover:text-[#8000ff] cursor-pointer py-1">Luxury Cruises</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-[#444444] mb-2">Food & Drink</div>
                      <div className="text-xs text-[#666666] hover:text-[#8000ff] cursor-pointer py-1">Cooking Classes</div>
                      <div className="text-xs text-[#666666] hover:text-[#8000ff] cursor-pointer py-1">Wine Tasting</div>
                      <div className="text-xs text-[#666666] hover:text-[#8000ff] cursor-pointer py-1">Restaurant Tours</div>
                      <div className="text-xs text-[#666666] hover:text-[#8000ff] cursor-pointer py-1">Food Markets</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-[#444444] mb-2">Entertainment</div>
                      <div className="text-xs text-[#666666] hover:text-[#8000ff] cursor-pointer py-1">Theater Shows</div>
                      <div className="text-xs text-[#666666] hover:text-[#8000ff] cursor-pointer py-1">Concerts</div>
                      <div className="text-xs text-[#666666] hover:text-[#8000ff] cursor-pointer py-1">Museums</div>
                      <div className="text-xs text-[#666666] hover:text-[#8000ff] cursor-pointer py-1">Theme Parks</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-[#444444] mb-2">Adventure</div>
                      <div className="text-xs text-[#666666] hover:text-[#8000ff] cursor-pointer py-1">Hiking</div>
                      <div className="text-xs text-[#666666] hover:text-[#8000ff] cursor-pointer py-1">Rock Climbing</div>
                      <div className="text-xs text-[#666666] hover:text-[#8000ff] cursor-pointer py-1">Zip Lining</div>
                      <div className="text-xs text-[#666666] hover:text-[#8000ff] cursor-pointer py-1">Paragliding</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-[#444444] mb-2">Water Sports</div>
                      <div className="text-xs text-[#666666] hover:text-[#8000ff] cursor-pointer py-1">Scuba Diving</div>
                      <div className="text-xs text-[#666666] hover:text-[#8000ff] cursor-pointer py-1">Snorkeling</div>
                      <div className="text-xs text-[#666666] hover:text-[#8000ff] cursor-pointer py-1">Jet Skiing</div>
                      <div className="text-xs text-[#666666] hover:text-[#8000ff] cursor-pointer py-1">Sailing</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-[#444444] mb-2">Wellness</div>
                      <div className="text-xs text-[#666666] hover:text-[#8000ff] cursor-pointer py-1">Spa Treatments</div>
                      <div className="text-xs text-[#666666] hover:text-[#8000ff] cursor-pointer py-1">Yoga Classes</div>
                      <div className="text-xs text-[#666666] hover:text-[#8000ff] cursor-pointer py-1">Meditation</div>
                      <div className="text-xs text-[#666666] hover:text-[#8000ff] cursor-pointer py-1">Hot Springs</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-[#444444] mb-2">Specials</div>
                      <div className="text-xs text-[#666666] hover:text-[#8000ff] cursor-pointer py-1">Seasonal Offers</div>
                      <div className="text-xs text-[#666666] hover:text-[#8000ff] cursor-pointer py-1">Group Discounts</div>
                      <div className="text-xs text-[#666666] hover:text-[#8000ff] cursor-pointer py-1">Last Minute</div>
                      <div className="text-xs text-[#666666] hover:text-[#8000ff] cursor-pointer py-1">VIP Experiences</div>
                    </div>
                  </div>
                </div>
              </div>
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
        ref={navigationRef}
        className={`hidden md:block ${isSectionActive ? 'fixed' : 'sticky'} top-30 w-full bg-white z-30 py-4 transition-all duration-500 transform ${
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
