"use client";
import React, { useState, useEffect } from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { fetchCities } from "@/api/cities/cities-api";
import { City } from "@/types/cities/cities-types";

const getNavItems = (cities: string[]) => [
  {
    name: "Destinations",
    hasDropdown: true,
    dropdownItems: cities,
  },
  {
    name: "Guides",
    hasDropdown: true,
    dropdownItems: [
      "Travel Tips",
      "City Guides",
      "Food & Dining",
      "Culture & History",
      "Budget Travel",
      "Luxury Travel",
    ],
  },
  {
    name: "Deals & Offers",
    hasDropdown: false,
  },
  {
    name: "Reviews",
    hasDropdown: true,
    dropdownItems: [
      "Attraction Reviews",
      "Hotel Reviews",
      "Restaurant Reviews",
      "Tour Reviews",
    ],
  },
  {
    name: "Reach Us",
    hasDropdown: true,
    dropdownItems: ["Contact", "Support", "About Us", "Partnership"],
  },
];

export default function BlogNavbar() {
  const [isSlidingNavVisible, setIsSlidingNavVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [navItems, setNavItems] = useState<any[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  // Fetch cities from API
  useEffect(() => {
    const fetchCitiesData = async () => {
      try {
        const response = await fetchCities();

        // Handle the response structure: response might be City[] or {data: City[]}
        const cities = Array.isArray(response) ? response : (response as any)?.data || [];
        const cityNames = cities.map((city: City) => city.cityName).filter(Boolean);
        setCities(cityNames);
        setNavItems(getNavItems(cityNames));
      } catch (error) {
        // Fallback to original hardcoded items if API fails
        setCities([]);
        setNavItems([]);
      }
    };

    fetchCitiesData();
  }, []);

  const toggleDropdown = (itemName: string) => {
    setOpenDropdowns((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    );
  };

  const handleCityClick = (cityName: string) => {
    // Convert city name to URL format and redirect to things-to-do page
    const citySlug = cityName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    router.push(`/things-to-do/${citySlug}`);
    setIsMobileMenuOpen(false);
  };

  const handleReachUsClick = (item: string) => {
    router.push('/help');
    setIsMobileMenuOpen(false);
  };

  // Reset dropdowns when mobile menu closes
  useEffect(() => {
    if (!isMobileMenuOpen) {
      setOpenDropdowns([]);
    }
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Determine if we're on a blog post page or main blog page
  const isBlogPostPage = pathname?.startsWith("/blog/") && pathname !== "/blog";
  const isMainBlogPage = pathname === "/blog";
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector("[data-hero-section]");
      if (heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        setIsSlidingNavVisible(heroBottom <= 0);
      }

      // Calculate scroll progress for blog post pages
      if (isBlogPostPage) {
        const totalHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(progress, 100));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isBlogPostPage]);

  return (
    <>
      {/* Original Navbar - Always visible */}
      <div
        className="relative max-w-[1200px] px-[14px] xl:px-0  py-1 md:py-3"
        style={{ zIndex: 9999 }}
      >
        {/* Mobile: flex with gap-4, Desktop: justify-between */}
        <div className="flex lg:hidden items-center gap-4">
          {/* Mobile Hamburger Menu Button - Left side */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className=" hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-8 h-8 text-[#444444]" color="#444444" />
            ) : (
              <Menu className="w-8 h-8 text-[#444444]" color="#444444" />
            )}
          </button>

          <div className="flex items-center gap-2">
            <img
              src="/images/new-purple-logo.png"
              alt="logo"
              className="w-24 sm:w-24 py-2"
            />
            <span className="text-[#aeaeae] font-halyard-text text-sm">
              | BLOG
            </span>
          </div>
        </div>

        <div className="flex justify-between">
          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center gap-2">
            <img
              src="/images/new-purple-logo.png"
              alt="logo"
              className="w-24 sm:w-24 py-2"
            />
            <span className="text-[#aeaeae] font-halyard-text text-sm">
              | BLOG
            </span>
          </div>

          {/* Desktop Navigation */}
          <div>
            <nav className="mt-6 hidden  lg:block order-3 lg:order-2">
              <div className="flex items-center  font-halyard-text text-[15px] text-[#000000] gap-8 pb-4">
                {navItems.map((item) => (
                  <div key={item.name} className="relative group ">
                    <button className="flex items-center gap-1 hover:cursor-pointer hover:text-[#8000ff] font-medium text-sm transition-colors">
                      {item.name}
                      {item.hasDropdown && (
                        <svg
                          className="w-4 h-4 transition-transform group-hover:rotate-180"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      )}
                    </button>

                    {item.hasDropdown && item.dropdownItems && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[9999] shadow-lg">
                        <div className="py-2 overflow-hidden">
                          {item.dropdownItems.map((dropdownItem: string) => (
                            <div
                              className="px-2 mx-4 py-1 my-3 hover:text-[#8000ff] hover:bg-[#f8f6ff]"
                              onClick={() =>
                                item.name === "Destinations"
                                  ? handleCityClick(dropdownItem)
                                  : item.name === "Reach Us"
                                  ? handleReachUsClick(dropdownItem)
                                  : null
                              }
                            >
                              <button
                                key={dropdownItem}
                                className="block  text-sm  hover:cursor-pointer  transition-colors text-left"
                              >
                                {dropdownItem}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-50 z-[60] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-70 bg-white shadow-xl transform transition-transform duration-300  lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ zIndex: 9999 }}
      >
        <div className="h-full flex flex-col">
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <nav className="space-y-1">
                {navItems.map((item, index) => (
                  <div key={item.name}>
                    <div
                      className="flex items-center justify-between py-2 border-b border-gray-100 cursor-pointer"
                      onClick={() =>
                        item.hasDropdown ? toggleDropdown(item.name) : undefined
                      }
                    >
                      <span className="font-halyard-text text-[12px] font-semibold text-[#080808] uppercase tracking-wider">
                        {item.name}
                      </span>
                      {item.hasDropdown && (
                        <span
                          className={`text-[#080808] text-xl transition-transform duration-200 ${
                            openDropdowns.includes(item.name) ? "rotate-45" : ""
                          }`}
                        >
                          +
                        </span>
                      )}
                    </div>

                    {item.hasDropdown &&
                      item.dropdownItems &&
                      openDropdowns.includes(item.name) && (
                        <div className="ml-4 mt-2 mb-4 space-y-2">
                          {item.dropdownItems.map((dropdownItem: string) => (
                            <button
                              key={dropdownItem}
                              onClick={() =>
                                item.name === "Destinations"
                                  ? handleCityClick(dropdownItem)
                                  : item.name === "Reach Us"
                                  ? handleReachUsClick(dropdownItem)
                                  : null
                              }
                              className="block py-2 text-sm text-gray-600 hover:text-[#8000ff] transition-colors w-full text-left"
                            >
                              {dropdownItem}
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                ))}

                {/* Footer - Social Media Links */}
                <div className="p-5 flex-shrink-0">
                  <div className="flex justify-center space-x-6">
                    <a href="#" className=" transition-colors">
                      <Facebook className="w-4 h-4" fill="#080808" />
                    </a>
                    <a href="#" className=" transition-colors">
                      <Twitter className="w-4 h-4" fill="#080808" />
                    </a>
                    <a href="#" className=" transition-colors">
                      <Instagram className="w-4 h-4" color="#080808" />
                    </a>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sliding Navbar - Appears after hero section */}
      <div
        className={`hidden md:block fixed top-0 left-0 right-0 z-[100] transition-transform duration-500 ${
          isSlidingNavVisible ? "translate-y-0" : "-translate-y-full"
        } ${
          isBlogPostPage
            ? "bg-white shadow-lg border-b border-gray-200"
            : "bg-white shadow-lg"
        }`}
      >
        <div className="w-full px-[14px] lg:px-[20px] relative">
          {isBlogPostPage ? (
            // New design for blog post pages
            <div className="flex items-center justify-between py-2 px-4 lg:px-0">
              {/* Logo and Text */}
              <div className="flex items-center gap-3 flex-1">
                <img
                  src="/images/new-purple-logo.png"
                  alt="logo"
                  className="w-22 h-8"
                />

                {/* Text */}
                <div className="flex-1">
                  <div className="text-black font-bold text-sm leading-tight pr-4">
                    Find Your Sanctuary: Monasteries, Convents & Retreats in the
                    Vatican & Rome
                  </div>
                </div>
              </div>

              {/* Progress bar starting from 2nd word to max width */}
              <div
                className="absolute bottom-0 h-0.5 bg-purple-600 transition-all duration-500 ease-out"
                style={{
                  left: "120px",
                  width: `${scrollProgress}%`,
                }}
              ></div>
            </div>
          ) : (
            // Original design for main blog page
            <div className="flex justify-between items-center py-2 px-4 lg:px-0">
              {/* Left side - Logo */}
              <div className="flex items-center gap-2">
                <img
                  src="/images/new-purple-logo.png"
                  alt="logo"
                  className="w-18 h-8"
                />
                <span className="text-[#aeaeae] font-halyard-text text-sm">
                  | BLOG
                </span>
              </div>

              {/* Right side - Navigation and Follow Us */}
              <div className="flex items-center gap-8">
                {/* Desktop Navigation */}
                <nav className="mt-6">
                  <div className="flex items-center font-halyard-text text-[15px] text-[#000000] gap-8 pb-4">
                    {navItems.map((item) => (
                      <div key={item.name} className="relative group">
                        <button className="flex items-center gap-1 hover:cursor-pointer hover:text-[#8000ff] font-medium text-sm transition-colors">
                          {item.name}
                          {item.hasDropdown && (
                            <svg
                              className="w-4 h-4 transition-transform group-hover:rotate-180"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          )}
                        </button>

                        {item.hasDropdown && item.dropdownItems && (
                          <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[9999] shadow-lg">
                            <div className="py-2">
                              {item.dropdownItems.map(
                                (dropdownItem: string) => (
                                  <button
                                    key={dropdownItem}
                                    onClick={() =>
                                      item.name === "Destinations"
                                        ? handleCityClick(dropdownItem)
                                        : item.name === "Reach Us"
                                        ? handleReachUsClick(dropdownItem)
                                        : null
                                    }
                                    className="block px-2 mx-4 py-3 text-sm hover:bg-[#f8f6ff] hover:cursor-pointer hover:text-[#8000ff] transition-colors w-full text-left"
                                  >
                                    {dropdownItem}
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </nav>
              </div>
              {/* Follow Us Dropdown - Separate div */}
              <div className="relative group">
                <button className="flex text-[13px] items-center gap-1 hover:cursor-pointer hover:text-[#8000ff] font-medium transition-colors mt-6 pb-4">
                  <p>Follow Us</p>
                  <svg
                    className="w-4 h-4 transition-transform group-hover:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <div className="absolute top-full right-0 mt-2 w-32 bg-white border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[9999] shadow-lg">
                  <div className="py-2 border">
                    <a
                      href="#"
                      className="flex border-b items-center gap-3 px-4 py-2 text-xs hover:bg-[#f8f6ff] hover:cursor-pointer hover:text-[#8000ff] transition-colors"
                    >
                      <Facebook className="w-4 h-4" />
                      Facebook
                    </a>
                    <a
                      href="#"
                      className="flex border-b items-center gap-3 px-4 py-2 text-xs hover:bg-[#f8f6ff] hover:cursor-pointer hover:text-[#8000ff] transition-colors"
                    >
                      <Twitter className="w-4 h-4" />
                      Twitter
                    </a>
                    <a
                      href="#"
                      className="flex items-center gap-3 px-4 py-2 text-xs hover:bg-[#f8f6ff] hover:cursor-pointer hover:text-[#8000ff] transition-colors"
                    >
                      <Instagram className="w-4 h-4" />
                      Instagram
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
