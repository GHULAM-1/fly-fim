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
  const [hoveredCategory, setHoveredCategory] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);
  const categoriesScrollRef = useRef<HTMLDivElement>(null);
  const customScrollbarRef = useRef<HTMLDivElement>(null);

  // Categories data
  const categories = [
    { id: 1, name: "Top things to do in Rome", color: "gray" },
    { id: 2, name: "Tickets", color: "gray" },
    { id: 3, name: "Tours", color: "gray" },
    { id: 4, name: "Transportation", color: "gray" },
    { id: 5, name: "Travel Services", color: "gray" },
    { id: 6, name: "Cruises", color: "gray" },
    { id: 7, name: "Food & Drink", color: "gray" },
    { id: 8, name: "Entertainment", color: "gray" },
    { id: 9, name: "Adventure", color: "gray" },
    { id: 10, name: "Water Sports", color: "gray" },
  ];

  // Tour listings data for each category
  const tourListings = {
    1: [ // Top things to do in Rome
      "Colosseum",
      "Vatican Museums", 
      "Rome To Pompeii Tours",
      "St. Peter's Basilica",
      "Rome Pantheon",
    ],
    2: [ // Tickets
      "Colosseum Tickets",
      "Vatican Museums Pass",
      "Roman Forum Access",
      "Pantheon Entry",
      "Castel Sant'Angelo"
    ],
    3: [ // Tours
      "Rome Walking Tour",
      "Vatican City Tour",
      "Colosseum Guided Tour",
      "Food & Wine Tour",
      "Night Photography Tour",
      "Historical Rome Tour",
    ],
    4: [ // Transportation
      "Airport Transfers",
      "Public Transport",
      "Train Tickets",
      "Train Passes",
      "Private Airport Transfers",
      "Shared Airport Transfers"
    ],
    5: [ // Travel Services
      "Wifi & SIM Cards",
      "Airport Services",
      "Luggage Storage",
      "Travel Insurance",
      "Visa Services",
    ],
    6: [ // Cruises
      "River Cruises",
      "Day Cruises",
      "Luxury Cruises",
      "Dinner Cruises",
    ],
    7: [ // Food & Drink
      "Cooking Classes",
      "Wine Tasting",
      "Restaurant Tours",
      "Food Markets",
      "Pizza Making",
      "Gelato Tours",
      "Coffee Tours",
      "Street Food Tours"
    ],
    8: [ // Entertainment
      "Theater Shows",
      "Concerts",
      "Opera Tickets",
      "Comedy Shows",
      "Dance Performances",
      "Live Music",
      "Cinema Tickets"
    ],
    9: [ // Adventure
      "Hiking Tours",
      "Rock Climbing",
      "Zip Lining",
      "Paragliding",
      "Mountain Biking",
      "Caving Tours",
      "Rafting Adventures"
    ],
    10: [ // Water Sports
      "Scuba Diving",
      "Snorkeling",
      "Jet Skiing",
      "Sailing",
      "Kayaking",
      "Paddleboarding",
      "Fishing Tours"
    ]
  };

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

  // Custom scrollbar functionality
  useEffect(() => {
    const handleCategoriesScroll = () => {
      if (categoriesScrollRef.current && customScrollbarRef.current) {
        const scrollElement = categoriesScrollRef.current;
        const scrollbarThumb = customScrollbarRef.current;
        
        const scrollTop = scrollElement.scrollTop;
        const scrollHeight = scrollElement.scrollHeight;
        const clientHeight = scrollElement.clientHeight;
        
        if (scrollHeight > clientHeight) {
          const maxScroll = scrollHeight - clientHeight;
          const scrollPercentage = Math.min(scrollTop / maxScroll, 1);
          const thumbHeight = Math.max((clientHeight / scrollHeight) * clientHeight, 30);
          const maxThumbTop = clientHeight - thumbHeight;
          const thumbTop = scrollPercentage * maxThumbTop;
          
          // Force thumb to bottom when at the very end
          const finalThumbTop = scrollTop >= maxScroll - 1 ? maxThumbTop : thumbTop;
          
          scrollbarThumb.style.height = `${thumbHeight}px`;
          scrollbarThumb.style.top = `${finalThumbTop}px`;
          scrollbarThumb.style.display = 'block';
          
          console.log('Scroll Debug:', {
            scrollTop,
            maxScroll,
            scrollPercentage,
            thumbTop,
            finalThumbTop,
            maxThumbTop
          });
        } else {
          scrollbarThumb.style.display = 'none';
        }
      }
    };

    const scrollElement = categoriesScrollRef.current;
    if (scrollElement) {
      // Initial setup
      handleCategoriesScroll();
      
      // Add multiple event listeners to catch all scroll events
      scrollElement.addEventListener("scroll", handleCategoriesScroll);
      scrollElement.addEventListener("wheel", handleCategoriesScroll);
      scrollElement.addEventListener("touchmove", handleCategoriesScroll);
      
      return () => {
        scrollElement.removeEventListener("scroll", handleCategoriesScroll);
        scrollElement.removeEventListener("wheel", handleCategoriesScroll);
        scrollElement.removeEventListener("touchmove", handleCategoriesScroll);
      };
    }
  }, [showCategoriesDropdown]);

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
              onMouseLeave={() => {
                setShowCategoriesDropdown(false);
                setHoveredCategory(0);
              }}
            >
              <Menu size={16} className="text-[#444444]" />
              All Categories
              
              {/* Categories Dropdown */}
              <div
                className={`fixed top-28 left-1/2 transform -translate-x-1/2 mt-2 bg-white  overflow-hidden transition-all duration-300 origin-top ${
                  showCategoriesDropdown 
                    ? "scale-y-100 opacity-100" 
                    : "scale-y-0 opacity-0"
                }`}
                style={{ zIndex: 1000, width: '1200px', maxWidth: 'calc(100vw - 48px)' }}
              >
                <div className="flex">
                  {/* Left Sidebar - Categories */}
                  <div className="w-[25%] p-4 relative">
                    <div className="border-r border-gray-200 h-full absolute right-0 top-0 bottom-0"></div>
                    <div 
                      ref={categoriesScrollRef}
                      className="max-h-[400px] overflow-y-auto pr-0 scrollbar-hide" 
                      id="categories-scroll"
                    >
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <div 
                            key={category.id}
                            className={`text-[15px] font-halyard-text cursor-pointer py-2 flex items-center justify-between ${
                              hoveredCategory === category.id
                                ? 'text-[#8000ff]' 
                                : 'text-[#666666]'
                            } hover:text-[#8000ff]`}
                            onMouseEnter={() => setHoveredCategory(category.id)}
                          >
                            {category.name} <ChevronRight size={20} />
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Gradient overlay for scroll effect */}
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                    
                    {/* Custom scrollbar positioned over border */}
                    <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gray-100 pointer-events-none">
                      <div 
                        ref={customScrollbarRef}
                        className="w-[1px] bg-black rounded-full transition-all duration-200 absolute"
                        style={{ 
                          height: '20%',
                          top: '0%'
                        }}
                      ></div>
                    </div>
                  </div>
                  
                                    {/* Right Content - Tour Listings */}
                  <div className="w-[75%] p-4">
                    <div className="grid grid-cols-3 gap-6">
                      {hoveredCategory && tourListings[hoveredCategory as keyof typeof tourListings] ? (
                        // Show simple list for hovered category
                        <div className="col-span-3">
                          <div className="space-y-3">
                            {tourListings[hoveredCategory as keyof typeof tourListings].map((item, index) => (
                              <div key={index} className="text-[15px] font-halyard-text text-[#444444] hover:text-[#8000ff] cursor-pointer py-1">
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        // Default content when no category is hovered
                        <>
                          {/* Column 1 */}
                          <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                              <img src="/images/a1.jpg.avif" alt="Colosseum" className="w-12 h-12 object-cover rounded" />
                              <div>
                                <div className="font-halyard-text text-[16px] text-[#444444]">Colosseum</div>
                                <div className="text-[12px] font-halyard-text-light text-[#666666]">from $21.04</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <img src="/images/a2.jpg.avif" alt="Vatican Museums" className="w-12 h-12 object-cover rounded" />
                              <div>
                                <div className="font-halyard-text text-[16px] text-[#444444]">Vatican Museums</div>
                                <div className="text-[12px] font-halyard-text-light text-[#666666]">from $29.22</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <img src="/images/a3.png.avif" alt="Rome To Pompeii Tours" className="w-12 h-12 object-cover rounded" />
                              <div>
                                <div className="font-halyard-text text-[16px] text-[#444444]">Rome To Pompeii Tours</div>
                                <div className="text-[12px] font-halyard-text-light text-[#666666]">from $93.89</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <img src="/images/a4.jpg.avif" alt="St. Peter's Basilica" className="w-12 h-12 object-cover rounded" />
                              <div>
                                <div className="font-halyard-text text-[16px] text-[#444444]">St. Peter's Basilica</div>
                                <div className="text-[12px] font-halyard-text-light text-[#666666]">from $7.01</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <img src="/images/a5.jpg.avif" alt="Rome Pantheon" className="w-12 h-12 object-cover rounded" />
                              <div>
                                <div className="font-halyard-text text-[16px] text-[#444444]">Rome Pantheon</div>
                                <div className="text-[12px] font-halyard-text-light text-[#666666]">from $5.73</div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Column 2 */}
                          <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                              <img src="/images/a6.jpg.avif" alt="Castel Sant Angelo" className="w-12 h-12 object-cover rounded" />
                              <div>
                                <div className="font-halyard-text text-[16px] text-[#444444]">Castel Sant Angelo</div>
                                <div className="text-[12px] font-halyard-text-light text-[#666666]">from $18.70</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <img src="/images/d1.jpg.avif" alt="Sistine Chapel" className="w-12 h-12 object-cover rounded" />
                              <div>
                                <div className="font-halyard-text text-[16px] text-[#444444]">Sistine Chapel</div>
                                <div className="text-[12px] font-halyard-text-light text-[#666666]">from $29.22</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <img src="/images/d2.jpg.avif" alt="Musei Capitolini" className="w-12 h-12 object-cover rounded" />
                              <div>
                                <div className="font-halyard-text text-[16px] text-[#444444]">Musei Capitolini</div>
                                <div className="text-[12px] font-halyard-text-light text-[#666666]">from $32.61</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <img src="/images/d3.jpg.avif" alt="Roman Catacombs Tour" className="w-12 h-12 object-cover rounded" />
                              <div>
                                <div className="font-halyard-text text-[16px] text-[#444444]">Roman Catacombs Tour</div>
                                <div className="text-[12px] font-halyard-text-light text-[#666666]">from $14.03</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <img src="/images/d4.jpg.avif" alt="Borghese Gallery" className="w-12 h-12 object-cover rounded" />
                              <div>
                                <div className="font-halyard-text text-[16px] text-[#444444]">Borghese Gallery</div>
                                <div className="text-[12px] font-halyard-text-light text-[#666666]">from $26.89</div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Column 3 */}
                          <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                              <img src="/images/d5.jpg.avif" alt="Altare della Patria" className="w-12 h-12 object-cover rounded" />
                              <div>
                                <div className="font-halyard-text text-[16px] text-[#444444]">Altare della Patria</div>
                                <div className="text-[12px] font-halyard-text-light text-[#666666]">from $38.58</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <img src="/images/d6.jpeg.avif" alt="Doria Pamphilj Gallery" className="w-12 h-12 object-cover rounded" />
                              <div>
                                <div className="font-halyard-text text-[16px] text-[#444444]">Doria Pamphilj Gallery</div>
                                <div className="text-[12px] font-halyard-text-light text-[#666666]">from $33.90</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <img src="/images/a1.jpg.avif" alt="Rome To Amalfi Coast Tours" className="w-12 h-12 object-cover rounded" />
                              <div>
                                <div className="font-halyard-text text-[16px] text-[#444444]">Rome To Amalfi Coast Tours</div>
                                <div className="text-[12px] font-halyard-text-light text-[#666666]">from $139.11</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <img src="/images/a2.jpg.avif" alt="Rome To Tuscany Tours" className="w-12 h-12 object-cover rounded" />
                              <div>
                                <div className="font-halyard-text text-[16px] text-[#444444]">Rome To Tuscany Tours</div>
                                <div className="text-[12px] font-halyard-text-light text-[#666666]">from $115.73</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <img src="/images/a4.jpg.avif" alt="Bioparco Rome" className="w-12 h-12 object-cover rounded" />
                              <div>
                                <div className="font-halyard-text text-[16px] text-[#444444]">Bioparco Rome</div>
                                <div className="text-[12px] font-halyard-text-light text-[#666666]">from $22.21</div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
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
