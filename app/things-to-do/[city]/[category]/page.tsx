"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import CategoriesDropdown from "@/components/category/CategoriesDropdown";
import Banner from "@/components/home/Banner";
import {
  BreadcrumbList,
  BreadcrumbSeparator,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
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
  MapPin,
  Globe,
  ChefHat,
  Bus,
  Ticket,
  Utensils,
  Footprints,
  Car,
} from "lucide-react";
import { useNavigationStore } from "@/lib/store/navigationStore";
import PopularThings from "@/components/category/PopularThings";
import CarouselGrid from "@/components/grids/CarouselGrid";
import BrowseThemes from "@/components/tickets/BrowseThemes";
import CityCard from "@/components/cards/CityCard";
import Stats from "@/components/home/Stats";
import Testimonials from "@/components/things-to-do/Testimonials";
import { Button } from "@/components/ui/button";

export default function CategoryPage() {
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [isCarouselVisible, setIsCarouselVisible] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);

  const params = useParams();
  const { activeSection, setActiveSection } = useNavigationStore();

  const recommendations = [
    {
      id: 1,
      description: "Skydive Dubai: Tandem Skydiving at the Palm Drop Zone",
      place: "Dubai",
      image: "/images/r4.jpg.avif",
      price: 100,
      rating: 4.5,
      reviews: 100,
      off: 10,
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
    {
      id: 5,
      description: "Skydive Dubai: Tandem Skydiving at the Palm Drop Zone",
      place: "Dubai",
      image: "/images/r4.jpg.avif",
      price: 100,
      rating: 4.5,
      reviews: 100,
      off: 10,
    },
    {
      id: 6,
      description: "Acropolis Parthenon Tickets with Optional Audio Guide",
      place: "Athens",
      image: "/images/r3.jpg.avif",
      price: 100,
      rating: 4.5,
      reviews: 100,
      cancellation: "Free cancellation",
    },
    {
      id: 7,
      description:
        "From Rome: Pompeii, Amalfi Coast and Sorrento or Positano Day Trip",
      place: "Italy",
      image: "/images/r2.jpg.avif",
      price: 100,
      rating: 4.5,
      reviews: 100,
    },
    {
      id: 8,
      description:
        "From London: Harry Potter™ Warner Bros. Studio Tickets with Coach Transfers",
      place: "London",
      image: "/images/r1.jpg.avif",
      price: 100,
      rating: 4.5,
      reviews: 100,
    },
    {
      id: 9,
      description:
        "From London: Harry Potter™ Warner Bros. Studio Tickets with Coach Transfers",
      place: "London",
      image: "/images/r1.jpg.avif",
      price: 100,
      rating: 4.5,
      reviews: 100,
    },
    {
      id: 10,
      description: "Skydive Dubai: Tandem Skydiving at the Palm Drop Zone",
      place: "Dubai",
      image: "/images/r4.jpg.avif",
      price: 100,
      rating: 4.5,
      reviews: 100,
      off: 10,
    },
    {
      id: 11,
      description: "Acropolis Parthenon Tickets with Optional Audio Guide",
      place: "Athens",
      image: "/images/r3.jpg.avif",
      price: 100,
      rating: 4.5,
      reviews: 100,
    },
    {
      id: 12,
      description:
        "From Rome: Pompeii, Amalfi Coast and Sorrento or Positano Day Trip",
      place: "Italy",
      image: "/images/r2.jpg.avif",
      price: 100,
      rating: 4.5,
      reviews: 100,
    },
    {
      id: 13,
      description:
        "From London: Harry Potter™ Warner Bros. Studio Tickets with Coach Transfers",
      place: "London",
      image: "/images/r1.jpg.avif",
      price: 100,
      rating: 4.5,
      reviews: 100,
    },
  ];

  // Get the category name from URL and capitalize first letter
  const categoryName = params.category as string;
  const formattedCategoryName = categoryName
    ? categoryName
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "Category";

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Get the actual sticky navigation height dynamically
      const stickyNav = document.querySelector("[data-navigation]");
      const fixedNav = document.querySelector(".fixed.md\\:top-19");

      let totalOffset = 0;

      // Add fixed top navigation height if it exists
      if (fixedNav) {
        const fixedNavRect = fixedNav.getBoundingClientRect();
        totalOffset += fixedNavRect.height;
      }

      // Add sticky category carousel height if it exists
      if (stickyNav) {
        const stickyNavRect = stickyNav.getBoundingClientRect();
        totalOffset += stickyNavRect.height;
      }

      // Add some extra padding for better visibility
      totalOffset += 20;

      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - totalOffset;

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

  // Intersection observer for active section tracking
  useEffect(() => {
    const sections = [
      "museums",
      "landmarks",
      "zoos",
      "religious-sites",
      "city-cards",
      "theme-parks",
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

  // Hide/show carousel logic
  useEffect(() => {
    const handleScroll = () => {
      const lastSectionElement = document.getElementById(
        "hop-on-hop-off-tours"
      );
      const activitiesElement = document.getElementById("activities");

      if (lastSectionElement && activitiesElement) {
        const lastSectionRect = lastSectionElement.getBoundingClientRect();

        if (lastSectionRect.bottom < 0) {
          setIsCarouselVisible(false);
        } else {
          setIsCarouselVisible(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const destinations = [
    {
      id: 1,
      description: "Things to do in",
      place: "United States",
      image: "/images/d6.jpeg.avif",
      city: "New York",
    },
    {
      id: 2,
      description: "Things to do in",
      place: "United Kingdom",
      image: "/images/d5.jpg.avif",
      city: "London",
    },
    {
      id: 3,
      description: "Things to do in",
      place: "United Arab Emirates",
      image: "/images/d4.jpg.avif",
      city: "Dubai",
    },
    {
      id: 4,
      description: "Things to do in",
      place: "Italy",
      image: "/images/d3.jpg.avif",
      city: "Rome",
    },
    {
      id: 5,
      description: "Things to do in",
      place: "France",
      image: "/images/d2.jpg.avif",
      city: "Paris",
    },
    {
      id: 6,
      description: "Things to do in",
      place: "Singapore",
      image: "/images/d1.jpg.avif",
      city: "Singapore",
    },
    {
      id: 7,
      description: "Things to do in York",
      place: "United States",
      image: "/images/d6.jpeg.avif",
      city: "New York",
    },
    {
      id: 8,
      description: "Things to do in",
      place: "United Kingdom",
      image: "/images/d5.jpg.avif",
      city: "London",
    },
    {
      id: 9,
      description: "Things to do in",
      place: "United Arab Emirates",
      image: "/images/d4.jpg.avif",
      city: "Dubai",
    },
    {
      id: 10,
      description: "Things to do in",
      place: "Italy",
      image: "/images/d3.jpg.avif",
      city: "Rome",
    },
    {
      id: 11,
      description: "Things to do in",
      place: "France",
      image: "/images/d2.jpg.avif",
      city: "Paris",
    },
    {
      id: 12,
      description: "Things to do in",
      place: "Singapore",
      image: "/images/d1.jpg.avif",
      city: "Singapore",
    },
  ];

  return (
    <>
      <div className="hidden md:block fixed md:top-19 bg-[#fff] w-full py-3 z-40 border-b">
        <div className="max-w-[1200px] mx-auto px-[24px] xl:px-0">
          <CategoriesDropdown
            showCategoriesDropdown={showCategoriesDropdown}
            setShowCategoriesDropdown={setShowCategoriesDropdown}
            setShowBanner={setShowBanner}
          />
          <div
            className={` transition-all duration-300 origin-top overflow-hidden ${
              showBanner ? "scale-y-100 h-auto" : "scale-y-0 h-0"
            }`}
          >
            <Banner />
          </div>
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto px-[24px] xl:px-0 md:mt-20 ">
        <div className="pt-[76px]">
          <div className="mb-[34px] md:block hidden">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    className="text-[14px] underline font-halyard-text-light text-[#666666]"
                    href="/"
                  >
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    className="text-[14px] underline font-halyard-text-light text-[#666666]"
                    href="/components"
                  >
                    Things to do
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-[14px] font-halyard-text-light text-[#666666]">
                    {formattedCategoryName}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="mt-0">
            <div className="flex items-center gap-2 mb-0">
              <div className="flex items-center gap-1">
                <svg
                  className="w-5 h-5  text-[#e5006e] text-[17px]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-[#e5006e] text-[17px] font-halyard-text">
                  4.3
                </span>
                <span className="text-[#e5006e] text-[17px] font-halyard-text">
                  (151,002)
                </span>
              </div>
            </div>
            <h1 className="text-[21px] md:text-[30px] font-bold text-[#444444] font-halyard-text">
              {formattedCategoryName} Attractions
            </h1>
          </div>

          {/* Category Carousel - Integrated directly in the page */}
          <div
            ref={navigationRef}
            data-navigation
            className={`sticky md:top-30 top-15 w-full bg-white z-30 py-4 transition-all duration-500 transform ${
              isCarouselVisible ? "translate-y-0" : "-translate-y-full"
            }`}
          >
            <div className="relative">
              <div
                ref={scrollContainerRef}
                className="flex relative gap-2 overflow-x-auto scrollbar-hide z-10 max-w-[1200px] mx-auto md:px-[24px] xl:px-0"
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
                <Button
                  onClick={() => scrollToSection("museums")}
                  className={`font-halyard-text bg-transparent hover:cursor-pointer flex items-center text-sm sm:text-base gap-2 md:py-[25px] md:px-[15px] py-[0px] px-[11px] border rounded-[4px] whitespace-nowrap transition-all duration-200 ${
                    activeSection === "museums"
                      ? "bg-purple-600/10 text-purple-600 border-purple-600/20"
                      : "text-[#444444] border-gray-200 hover:bg-purple-600/10 hover:text-purple-600"
                  }`}
                >
                  <Tv strokeWidth={1} className="md:w-5 md:h-5 w-5 h-5" />
                  Museums
                </Button>
                <Button
                  onClick={() => scrollToSection("landmarks")}
                  className={`font-halyard-text bg-transparent hover:cursor-pointer flex items-center text-sm sm:text-base gap-2 md:py-[25px] md:px-[15px] py-[0px] px-[11px] border rounded-[4px] whitespace-nowrap transition-all duration-200 ${
                    activeSection === "landmarks"
                      ? "bg-purple-600/10 text-purple-600 border-purple-600/20"
                      : "text-[#444444] border-gray-200 hover:bg-purple-600/10 hover:text-purple-600"
                  }`}
                >
                  <Landmark strokeWidth={1} />
                  Landmarks
                </Button>
                <Button
                  onClick={() => scrollToSection("zoos")}
                  className={`font-halyard-text bg-transparent hover:cursor-pointer flex items-center text-sm sm:text-base gap-2 md:py-[25px] md:px-[15px] py-[0px] px-[11px] border rounded-[4px] whitespace-nowrap transition-all duration-200 ${
                    activeSection === "zoos"
                      ? "bg-purple-600/10 text-purple-600 border-purple-600/20"
                      : "text-[#444444] border-gray-200 hover:bg-purple-600/10 hover:text-purple-600"
                  }`}
                >
                  <SunMedium strokeWidth={1} />
                  Zoos
                </Button>
                <Button
                  onClick={() => scrollToSection("religious-sites")}
                  className={`font-halyard-text bg-transparent hover:cursor-pointer flex items-center text-sm sm:text-base gap-2 md:py-[25px] md:px-[15px] py-[0px] px-[11px] border rounded-[4px] whitespace-nowrap transition-all duration-200 ${
                    activeSection === "religious-sites"
                      ? "bg-purple-600/10 text-purple-600 border-purple-600/20"
                      : "text-[#444444] border-gray-200 hover:bg-purple-600/10 hover:text-purple-600"
                  }`}
                >
                  <BadgePercent strokeWidth={1} />
                  Religious Sites
                </Button>
                <Button
                  onClick={() => scrollToSection("city-cards")}
                  className={`font-halyard-text bg-transparent hover:cursor-pointer flex items-center text-sm sm:text-base gap-2 md:py-[25px] md:px-[15px] py-[0px] px-[11px] border rounded-[4px] whitespace-nowrap transition-all duration-200 ${
                    activeSection === "city-cards"
                      ? "bg-purple-600/10 text-purple-600 border-purple-600/20"
                      : "text-[#444444] border-gray-200 hover:bg-purple-600/10 hover:text-purple-600"
                  }`}
                >
                  <Ship strokeWidth={1} />
                  City Cards
                </Button>
                <Button
                  onClick={() => scrollToSection("theme-parks")}
                  className={`font-halyard-text bg-transparent hover:cursor-pointer flex items-center text-sm sm:text-base gap-2 md:py-[25px] md:px-[15px] py-[0px] px-[11px] border rounded-[4px] whitespace-nowrap transition-all duration-200 ${
                    activeSection === "theme-parks"
                      ? "bg-purple-600/10 text-purple-600 border-purple-600/20"
                      : "text-[#444444] border-gray-200 hover:bg-purple-600/10 hover:text-purple-600"
                  }`}
                >
                  <Leaf strokeWidth={1} />
                  Theme Parks
                </Button>

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
          <div className="md:mt-10 mt-5">
            <PopularThings />
          </div>
          <div>
            <CarouselGrid
              title="Top experiences in London"
              variant="pills"
              recommendations={recommendations}
            />
            {/* <CarouselGrid
          title="Top experiences in London"
          recommendations={recommendations}
        /> */}
            <div className="mb-10" id="museums">
              <CarouselGrid
                title="Museums"
                variant="museums"
                recommendations={recommendations}
              />
            </div>
            <div className="mb-10" id="landmarks">
              <CarouselGrid
                title="Landmarks"
                variant="museums"
                recommendations={recommendations}
              />
            </div>
            <div className="mb-10" id="zoos">
              <CarouselGrid
                title="Zoos"
                variant="museums"
                recommendations={recommendations}
              />
            </div>
            <div className="mb-10" id="religious-sites">
              <CarouselGrid
                title="Religious Sites"
                variant="museums"
                recommendations={recommendations}
              />
            </div>
            <div className="mb-10" id="city-cards">
              <CarouselGrid
                title="City Cards"
                variant="museums"
                recommendations={recommendations}
              />
            </div>
            <div className="mb-10" id="theme-parks">
              <CarouselGrid
                title="Theme Parks"
                variant="museums"
                recommendations={recommendations}
              />
            </div>
            <div className="mb-10">
              <BrowseThemes
                title="Browse by themes"
                themes={[
                  {
                    icon: MapPin,
                    text: "Rome Tours",
                    href: "#",
                  },
                  {
                    icon: Globe,
                    text: "Day Trips From Rome",
                    href: "#",
                  },
                  {
                    icon: ChefHat,
                    text: "Cooking Classes in Rome",
                    href: "#",
                  },
                  {
                    icon: Bus,
                    text: "Hop-on Hop-off Tours Rome",
                    href: "#",
                  },
                  {
                    icon: Ticket,
                    text: "Combos Tickets in Rome",
                    href: "#",
                  },
                  {
                    icon: Utensils,
                    text: "Food Tours in Rome",
                    href: "#",
                  },
                  {
                    icon: Footprints,
                    text: "Walking Tours in Rome",
                    href: "#",
                  },
                  {
                    icon: Car,
                    text: "Transportation in Rome",
                    href: "#",
                  },
                ]}
              />
            </div>
            <div className="mb-10">
              <CarouselGrid
                title="Nearby cities to explore"
                variant="simple"
                recommendations={destinations}
              />
            </div>
            <div className="mb-10">
              <Banner />
            </div>
            <div className="mb-10">
              <Testimonials variant="things-to-do" />
            </div>
            <div className="mb-10">
              <Stats />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
