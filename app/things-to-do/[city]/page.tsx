"use client";
import Activities from "@/components/home/Activities";
import Banner from "@/components/home/Banner";
import BrowseThemes from "@/components/home/BrowseThemes";
import Faqs from "@/components/things-to-do/Faqs";
import CarouselGrid from "@/components/grids/CarouselGrid";
import Stats from "@/components/home/Stats";
import { Menu, Smartphone } from "lucide-react";
import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > window.innerHeight - 260);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
      <div className="hidden md:block fixed top-22 bg-white w-full py-3 z-50 border-b">
        <div className="flex justify-between items-center px-4 sm:px-8 md:px-16 lg:px-24 xl:px-28 max-w-screen-2xl mx-auto">
          <ul className="flex gap-3 lg:gap-8 text-xs lg:text-sm text-gray-600">
            <li className="flex items-center gap-1">
              <Menu size={16} className="text-gray-600" />
              All Categories
            </li>
            <li>Best Sellers</li>
            <li>London theatre tickets</li>
            <li>London Eye</li>
            <li>Tower of London</li>
          </ul>
          <button
            className="text-sm text-gray-600 flex items-center gap-1"
            onMouseEnter={() => setShowBanner(true)}
            onMouseLeave={() => setShowBanner(false)}
          >
            <Smartphone size={16} />
            Download App
          </button>
        </div>
        <div
          className={`transition-all duration-300 origin-top overflow-hidden ${
            showBanner ? "scale-y-100 h-auto" : "scale-y-0 h-0"
          }`}
        >
          <Banner />
        </div>
      </div>
      <Hero />
      {showSectionNav && (
        <div
          className={`sticky top-16 md:top-33 w-full bg-white z-50 py-3 transition-all duration-300 ${
            scroll ? "border-y" : ""
          }`}
        >
          <div className="flex gap-2 overflow-x-auto scrollbar-hide z-10 w-full px-4 sm:px-8 md:px-16 lg:px-24 xl:px-28 max-w-screen-2xl mx-auto">
            <button
              onClick={() => scrollToSection("musicals")}
              className={`flex items-center text-sm sm:text-base gap-2 py-1.5 px-3 border rounded whitespace-nowrap transition-all duration-200 ${
                activeSection === "musicals"
                  ? "bg-purple-600/10 text-purple-600 border-purple-600/20"
                  : "text-gray-700 border-gray-200 hover:bg-purple-600/10 hover:text-purple-600"
              }`}
            >
              <Music strokeWidth={1} />
              Musicals
            </button>
            <button
              onClick={() => scrollToSection("landmarks")}
              className={`flex items-center text-sm sm:text-base gap-2 py-1.5 px-3 border rounded whitespace-nowrap transition-all duration-200 ${
                activeSection === "landmarks"
                  ? "bg-purple-600/10 text-purple-600 border-purple-600/20"
                  : "text-gray-700 border-gray-200 hover:bg-purple-600/10 hover:text-purple-600"
              }`}
            >
              <Landmark strokeWidth={1} />
              Landmarks
            </button>
            <button
              onClick={() => scrollToSection("day-trips")}
              className={`flex items-center text-sm sm:text-base gap-2 py-1.5 px-3 border rounded whitespace-nowrap transition-all duration-200 ${
                activeSection === "day-trips"
                  ? "bg-purple-600/10 text-purple-600 border-purple-600/20"
                  : "text-gray-700 border-gray-200 hover:bg-purple-600/10 hover:text-purple-600"
              }`}
            >
              <SunMedium strokeWidth={1} />
              Day Trips
            </button>
            <button
              onClick={() => scrollToSection("combos")}
              className={`flex items-center text-sm sm:text-base gap-2 py-1.5 px-3 border rounded whitespace-nowrap transition-all duration-200 ${
                activeSection === "combos"
                  ? "bg-purple-600/10 text-purple-600 border-purple-600/20"
                  : "text-gray-700 border-gray-200 hover:bg-purple-600/10 hover:text-purple-600"
              }`}
            >
              <BadgePercent strokeWidth={1} />
              Combos
            </button>
            <button
              onClick={() => scrollToSection("cruises")}
              className={`flex items-center text-sm sm:text-base gap-2 py-1.5 px-3 border rounded whitespace-nowrap transition-all duration-200 ${
                activeSection === "cruises"
                  ? "bg-purple-600/10 text-purple-600 border-purple-600/20"
                  : "text-gray-700 border-gray-200 hover:bg-purple-600/10 hover:text-purple-600"
              }`}
            >
              <Ship strokeWidth={1} />
              Cruises
            </button>
            <button
              onClick={() => scrollToSection("plays")}
              className={`flex items-center text-sm sm:text-base gap-2 py-1.5 px-3 border rounded whitespace-nowrap transition-all duration-200 ${
                activeSection === "plays"
                  ? "bg-purple-600/10 text-purple-600 border-purple-600/20"
                  : "text-gray-700 border-gray-200 hover:bg-purple-600/10 hover:text-purple-600"
              }`}
            >
              <Leaf strokeWidth={1} />
              Plays
            </button>
            <button
              onClick={() => scrollToSection("museums")}
              className={`flex items-center text-sm sm:text-base gap-2 py-1.5 px-3 border rounded whitespace-nowrap transition-all duration-200 ${
                activeSection === "museums"
                  ? "bg-purple-600/10 text-purple-600 border-purple-600/20"
                  : "text-gray-700 border-gray-200 hover:bg-purple-600/10 hover:text-purple-600"
              }`}
            >
              <Tv strokeWidth={1} />
              Museums
            </button>
            <button
              onClick={() => scrollToSection("hop-on-hop-off-tours")}
              className={`flex items-center text-sm sm:text-base gap-2 py-1.5 px-3 border rounded whitespace-nowrap transition-all duration-200 ${
                activeSection === "hop-on-hop-off-tours"
                  ? "bg-purple-600/10 text-purple-600 border-purple-600/20"
                  : "text-gray-700 border-gray-200 hover:bg-purple-600/10 hover:text-purple-600"
              }`}
            >
              <BusFront strokeWidth={1} />
              Hop-On Hop-Off Tours London
            </button>
          </div>
        </div>
      )}
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
      <div id="activities">
        <Activities />
      </div>
      <MustDo />
      <TravelGuide />
      <BrowseThemes />
      <Testimonials />
      <Destinations />
      <Faqs />
      <Banner />
      <Stats />
    </div>
  );
};

export default ThingsToDo;
