import React, { useRef, useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CarouselCard from "../cards/CarouselCard";
import { useTranslation } from "react-i18next";
import { ChevronDown, ArrowUpDown, Check } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { StarIcon } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import PriceDisplay from "../PriceDisplay";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Checkbox } from "../ui/checkbox";

interface CarouselGridProps {
  title: string;
  recommendations: any[];
  variant?:
    | "default"
    | "full"
    | "pills"
    | "museums"
    | "simple"
    | "tours"
    | "transport";
  navigationItems?: Array<{
    id: string;
    label: string;
    icon: any;
    color: string;
  }>;
}

const CarouselGrid = ({
  title,
  recommendations,
  variant = "default",
  navigationItems,
}: CarouselGridProps) => {
  const { t } = useTranslation();
  const [sortBy, setSortBy] = useState("Picked for you");
  const [visibleCards, setVisibleCards] = useState(8); // Initially show 4 cards
  const [isLoading, setIsLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const categoriesDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoriesDropdownRef.current &&
        !categoriesDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCategoriesDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scrolling when dropdown is open
  useEffect(() => {
    if (showCategoriesDropdown) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showCategoriesDropdown]);

  const handleCheckboxChange = (itemId: string) => {
    setCheckedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleCategoriesClick = () => {
    const newState = !showCategoriesDropdown;
    setShowCategoriesDropdown(newState);
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -scrollContainerRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollContainerRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  };

  const sortOptions = [
    "Picked for you",
    "Most popular",
    "Price (low to high)",
    "Price (high to low)",
  ];

  const handleSortChange = (option: string) => {
    setSortBy(option);
    // Add sorting logic here if needed
  };

  const handleShowMore = () => {
    setIsLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setVisibleCards((prev) => prev + 4); // Load 4 more cards
      setIsLoading(false);
    }, 1000);
  };

  if (variant === "full") {
    return (
      <div className="py-4  max-w-screen-2xl mx-auto 2xl:px-0">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
        <div className="flex justify-between items-start mb-6">
          <p className="text-gray-600 text-sm">
            {recommendations.length} experiences
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center font-light gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowUpDown size={16} />
              <span className="text-sm">Sort by: {sortBy}</span>
              <ChevronDown size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={() => handleSortChange(option)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <span>{option}</span>
                  {sortBy === option && <Check size={16} />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {recommendations.map((recommendation) => (
            <div key={recommendation.id} className="w-full group">
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
                }}
                className="mySwiper w-full rounded overflow-hidden mb-4"
              >
                <SwiperSlide>
                  <img
                    src={recommendation.image}
                    className="w-full object-cover"
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src={recommendation.image}
                    className="w-full object-cover"
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src={recommendation.image}
                    className="w-full object-cover"
                  />
                </SwiperSlide>
                <div className="hidden group-hover:block">
                  <div className="swiper-button-next after:text-black after:!text-xs after:w-6 after:h-6 after:absolute after:bg-white after:flex after:items-center after:justify-center after:rounded-full after:shadow-lg" />
                  <div className="swiper-button-prev after:text-black after:!text-xs after:w-6 after:h-6 after:absolute after:bg-white after:flex after:items-center after:justify-center after:rounded-full after:shadow-lg" />
                </div>
              </Swiper>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-500 text-xs">
                  {recommendation.place}
                </span>
                <span className="flex items-center gap-1">
                  <StarIcon
                    className="text-pink-600"
                    fill="currentColor"
                    size={12}
                  />
                  <span className="text-pink-600 text-xs font-semibold">
                    {recommendation.rating}
                  </span>
                  <span className="text-pink-600 text-xs">
                    ({recommendation.reviews})
                  </span>
                </span>
              </div>
              <p className="font-semibold text-gray-700 mt-2">
                {recommendation.description}
              </p>
              <p className="font-semibold text-gray-700 mt-2 max-w-32">
                <span className="text-gray-500 text-xs">
                  {t("recommendations.from")}
                </span>{" "}
                <br /> <PriceDisplay amount={recommendation.price} />
              </p>
            </div>
          ))}
        </div>
        <button className="w-full sm:w-auto py-3 px-12 rounded-lg border border-gray-700 text-gray-700 font-semibold mt-4 sm:mt-10 mx-auto block">
          Show more
        </button>
      </div>
    );
  }
  if (variant === "pills") {
    return (
      <div className="py-4 max-w-screen-2xl mx-auto 2xl:px-0">
        <div className="flex justify-between items-center">
          <h2 className="text-lg sm:text-2xl font-halyard-text md:font-bold text-[#444444]">
            {title}
          </h2>
        </div>
        {/* Pills Section */}
        <div
          className="mt-4 sm:mt-5 flex gap-2 overflow-x-scroll scrollbar-hide"
          ref={scrollContainerRef}
        >
          {/* Categories Dropdown Pill - Always shown first */}
          <div className="relative" ref={categoriesDropdownRef}>
            <div
              onClick={handleCategoriesClick}
              className="flex items-center gap-1 px-[12px] py-[6px] border border-gray-300 rounded-full bg-white text-gray-700 whitespace-nowrap cursor-pointer hover:border-gray-400 transition-colors"
            >
              <span className="text-sm font-halyard-text">Categories</span>
              <ChevronDown
                size={12}
                className={`text-gray-500 transition-transform ${
                  showCategoriesDropdown ? "rotate-180" : ""
                }`}
              />
            </div>

            {/* Dropdown Menu */}
            <div
              className={`fixed max-w-72 w-full bg-white border border-gray-200 rounded-lg shadow-lg transition-all duration-200 z-[99999] ${
                showCategoriesDropdown
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }`}
              style={{
                top: categoriesDropdownRef.current
                  ? (() => {
                      const rect = categoriesDropdownRef.current.getBoundingClientRect();
                      const dropdownHeight = 350; // Approximate dropdown height
                      const spaceBelow = window.innerHeight - rect.bottom;
                      
                      // If not enough space below, position above with minimal gap
                      if (spaceBelow < dropdownHeight + 10) {
                        return rect.top - dropdownHeight - (-40);
                      } else {
                        return rect.bottom + 2;
                      }
                    })()
                  : 0,
                left: categoriesDropdownRef.current
                  ? categoriesDropdownRef.current.getBoundingClientRect().left
                  : 0,
              }}
            >
              <div className="p-3">
                <div className="space-y-2 max-h-72 overflow-y-auto scrollbar-hide">
                  {(
                    navigationItems || [
                      { id: "museums", icon: "🏛️", label: "Museums" },
                      { id: "zoos", icon: "🐘", label: "Zoos" },
                      { id: "city-cards", icon: "🎫", label: "City Cards" },
                      {
                        id: "religious-sites",
                        icon: "⛪",
                        label: "Religious Sites",
                      },
                      { id: "landmarks", icon: "🏛️", label: "Landmarks" },
                    ]
                  ).map((item, index) => (
                    <div
                      key={item.id || index}
                      className="flex items-center justify-between px-2 py-2 rounded-md hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        {item.icon && typeof item.icon === "string" ? (
                          <span className="text-sm">{item.icon}</span>
                        ) : item.icon ? (
                          <item.icon size={16} className="text-gray-600" />
                        ) : null}
                        <span className="text-sm text-gray-700">
                          {item.label}
                        </span>
                      </div>
                      <Checkbox
                        checked={checkedItems.has(item.id || `item-${index}`)}
                        onCheckedChange={() =>
                          handleCheckboxChange(item.id || `item-${index}`)
                        }
                        className="w-4 h-4 appearance-none checked:bg-[#60c] checked:border-purple-300 border border-gray-300 rounded hover:cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Show first 4 navigation items as pills */}
          {(
            navigationItems || [
              { id: "museums", icon: "🏛️", label: "Museums" },
              { id: "zoos", icon: "🐘", label: "Zoos" },
              { id: "city-cards", icon: "🎫", label: "City Cards" },
              { id: "religious-sites", icon: "⛪", label: "Religious Sites" },
            ]
          )
            .slice(0, 4)
            .map((pill, index) => (
              <div
                key={pill.id || index}
                className="flex items-center gap-1 px-[12px] py-[6px] border border-gray-300 rounded-full bg-white text-gray-700 whitespace-nowrap cursor-pointer hover:border-gray-400 transition-colors"
              >
                {pill.icon && typeof pill.icon === "string" ? (
                  <span className="text-sm">{pill.icon}</span>
                ) : pill.icon ? (
                  <pill.icon size={16} className="text-gray-600" />
                ) : null}
                <span className="text-sm font-halyard-text">{pill.label}</span>
              </div>
            ))}
        </div>

        {/* Original Carousel Section */}
        <div className="mt-4 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {recommendations.slice(0, visibleCards).map((recommendation) => (
            <CarouselCard
              key={recommendation.id}
              image={recommendation.image}
              place={recommendation.place}
              rating={recommendation.rating}
              reviews={recommendation.reviews}
              description={recommendation.description}
              price={recommendation.price}
              off={recommendation.off}
              badge={recommendation.cancellation}
              variant="full"
            />
          ))}
        </div>

        {/* Show More Button */}
        {visibleCards < recommendations.length && (
          <div className="mt-6 text-center">
            <button
              onClick={handleShowMore}
              disabled={isLoading}
              className="px-[46px] py-[10px] min-w-[174.4px] hover:cursor-pointer min-h-[43.6px] bg-white border border-gray-300 text-[#444444] rounded-lg hover:border-gray-400 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-1">
                  <div className="w-1 h-1 bg-gray-700 rounded-full animate-pulse"></div>
                  <div
                    className="w-1 h-1 bg-gray-700 rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-1 h-1 bg-gray-700 rounded-full animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              ) : (
                "Show More"
              )}
            </button>
          </div>
        )}
      </div>
    );
  }

  if (variant === "museums") {
    const [currentMuseumIndex, setCurrentMuseumIndex] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const handleNavigate = (direction: "prev" | "next") => {
      if (direction === "prev") {
        setCurrentMuseumIndex((prev) =>
          prev === 0 ? recommendations.length - 1 : prev - 1
        );
      } else {
        setCurrentMuseumIndex((prev) =>
          prev === recommendations.length - 1 ? 0 : prev + 1
        );
      }
    };

    const onTouchStart = (e: React.TouchEvent) => {
      setTouchEnd(null);
      setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
      setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
      if (!touchStart || !touchEnd) return;

      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > 50;
      const isRightSwipe = distance < -50;

      if (isLeftSwipe) {
        handleNavigate("next");
      }
      if (isRightSwipe) {
        handleNavigate("prev");
      }
    };

    return (
      <div className="py-4 max-w-screen-2xl mx-auto 2xl:px-0">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg sm:text-2xl font-halyard-text md:font-bold text-[#444444]">
            {title}
          </h2>
          <div className="flex items-center gap-4">
            <Link
              href="/museums"
              className="text-sm text-gray-500 underline underline-offset-4 whitespace-nowrap"
            >
              See all
            </Link>
            <div className="hidden md:flex items-center gap-2">
              <button
                className="text-sm hover:cursor-pointer text-gray-500 underline underline-offset-4 whitespace-nowrap border p-2 rounded-full"
                onClick={scrollLeft}
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <button
                className="text-sm hover:cursor-pointer text-gray-500 underline underline-offset-4 whitespace-nowrap border p-2 rounded-full"
                onClick={scrollRight}
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop: Horizontal scroll with multiple cards */}
        <div className="hidden md:block">
          <div
            className="flex gap-4 overflow-x-scroll h-[369px] scrollbar-hide"
            ref={scrollContainerRef}
          >
            {recommendations.map((museum) => (
              <div
                key={museum.id}
                className="flex-shrink-0 w-80 cursor-pointer group max-w-[280px] h-[354px] relative"
              >
                <div className="flex justify-center relative h-[15px] items-center flex-col ">
                  <div className="w-[89%] h-[12px] border-t-[1px] border-l-[1px] border-r-[1px] border-[#cacaca] bg-[#f8f8f8] rounded-t-lg z-0 group-hover:h-[12px] transition-all duration-150 group-hover:mb-[-6px] ease-in-out"></div>
                  <div className="w-[92%] h-[12px] bg-white border-[1px] border-[#cacaca] rounded-t-lg  z-0 group-hover:mb-[-6px] group-hover:h-[12px] transition-all duration-100 ease-in-out"></div>
                </div>
                {/* Main card - stays in place */}
                <div className="relative h-full rounded-lg overflow-hidden shadow-lg z-10 group">
                  {/* Image */}
                  <div className="relative h-full overflow-hidden">
                    <img
                      src={museum.image}
                      alt={museum.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Dark overlay for text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Dark overlay for text - using the same gradient as PopularThings */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-[35%] transition-all duration-500 ease-in-out group-hover:h-[50%] group-hover:bottom-0"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(21, 1, 42, 0) 0%, rgba(21, 1, 42, 0.3) 20%, rgba(21, 1, 42, 0.7) 60%, rgb(21, 1, 42) 100%)",
                      }}
                    />

                    {/* Text overlay - positioned at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <div className="max-h-[25px] group-hover:max-h-[200px] transition-all duration-700 ease-in-out overflow-hidden">
                        <h3 className="text-lg font-halyard-text mb-1">
                          {museum.place}
                        </h3>
                        {museum.description && (
                          <p className="text-sm font-halyard-text-light text-gray-200 mb-2 line-clamp-2">
                            {museum.description}
                          </p>
                        )}
                      </div>
                      <div className="text-lg font-bold">${museum.price}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: Single card with museums variant hover effect */}
        <div className="md:hidden">
          <div className="relative overflow-hidden w-full max-w-[420px] mx-auto">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentMuseumIndex * 25}%)`,
                width: `${recommendations.length * 25}%`,
              }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {recommendations.map((museum, index) => {
                const active = index === currentMuseumIndex;

                return (
                  <div key={museum.id} className="w-[25%] shrink-0 px-2">
                    <div className="relative h-[354px] rounded-lg overflow-hidden shadow-lg">
                      {/* Browser-like top decoration - positioned above image content */}
                      <div className="flex justify-center relative h-[15px] items-center flex-col z-10">
                        <div
                          className={`w-[89%] h-[12px] border-t-[1px] border-l-[1px] border-r-[1px] border-[#cacaca] bg-[#f8f8f8] rounded-t-lg transition-all duration-150 ease-in-out ${
                            active ? "h-[12px] mb-[-6px]" : "h-[12px] mb-0"
                          }`}
                        ></div>
                        <div
                          className={`w-[92%] h-[12px] bg-white border-[1px] border-[#cacaca] rounded-t-lg transition-all duration-100 ease-in-out ${
                            active ? "h-[12px] mb-[-6px]" : "h-[12px] mb-0"
                          }`}
                        ></div>
                      </div>

                      <img
                        src={museum.image}
                        alt={museum.name}
                        className="w-full h-full rounded-lg object-cover mt-0 relative z-20"
                      />

                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-20" />

                      {/* Bottom gradient pad - always expanded like museums variant */}
                      <div
                        className="absolute bottom-0 left-0 right-0 pointer-events-none transition-all duration-500 z-20"
                        style={{
                          height: "50%",
                          background:
                            "linear-gradient(180deg, rgba(21, 1, 42, 0) 0%, rgba(21, 1, 42, 0.3) 20%, rgba(21, 1, 42, 0.7) 60%, rgb(21, 1, 42) 100%)",
                        }}
                      />

                      {/* Text: slide-up + fade for active */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-20">
                        <div
                          className={`transform transition-all duration-700 ease-in-out ${
                            active
                              ? "translate-y-0 opacity-100"
                              : "translate-y-4 opacity-0"
                          }`}
                        >
                          <h3 className="text-lg mb-1">{museum.place}</h3>
                          <p className="text-sm text-gray-200 mb-2 line-clamp-2">
                            {museum.description}
                          </p>
                          <div className="text-lg font-bold">
                            ${museum.price}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (variant === "simple") {
    // Local state for simple variant pagination
    const [currentPage, setCurrentPage] = useState(0);

    const simpleScrollLeft = () => {
      if (currentPage > 0) {
        console.log(
          "Scrolling left from card",
          currentPage,
          "to",
          currentPage - 1
        );
        setCurrentPage((prev) => prev - 1);
      }
    };

    const simpleScrollRight = () => {
      const maxCards = Math.max(0, recommendations.length); // Show 3 cards at once
      if (currentPage < maxCards) {
        console.log(
          "Scrolling right from card",
          currentPage,
          "to",
          currentPage + 1
        );
        setCurrentPage((prev) => prev + 1);
      }
    };

    // Touch/swipe functionality for mobile
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const onTouchStart = (e: React.TouchEvent) => {
      setTouchEnd(null);
      setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
      setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
      if (!touchStart || !touchEnd) return;

      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > 50;
      const isRightSwipe = distance < -50;

      if (isLeftSwipe) {
        simpleScrollRight(); // Swipe left = go to next card
      }
      if (isRightSwipe) {
        simpleScrollLeft(); // Swipe right = go to previous card
      }
    };

    return (
      <div className="py-4 max-w-screen-2xl mx-auto 2xl:px-0">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg sm:text-2xl font-halyard-text md:font-bold text-[#444444]">
            {title}
          </h2>
          <div className="md:flex hidden items-center gap-4">
            <Link
              href="/museums"
              className="text-sm text-gray-500 underline underline-offset-4 whitespace-nowrap"
            >
              See all
            </Link>
            <div className="flex items-center gap-2">
              <button
                className="text-sm hover:cursor-pointer text-gray-500 underline underline-offset-4 whitespace-nowrap border p-2 rounded-full"
                onClick={simpleScrollLeft}
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <button
                className="text-sm hover:cursor-pointer text-gray-500 underline underline-offset-4 whitespace-nowrap border p-2 rounded-full"
                onClick={simpleScrollRight}
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="mt-6 relative overflow-hidden">
          <div
            className="flex gap-3 md:gap-2 transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${currentPage * 200}px)`,
              width: `${recommendations.length * 200}px`,
            }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {recommendations.map((recommendation) => (
              <Link
                key={recommendation.id}
                href={`/things-to-do/${recommendation.city}`}
                className="flex-shrink-0 cursor-pointer group w-[200px] md:w-[190px]"
              >
                <div className="flex flex-col gap-2 transition-all duration-500 ease-out transform hover:-translate-y-1 rounded-lg p-2">
                  <div>
                    <img
                      src={recommendation.image}
                      alt={recommendation.description}
                      className="rounded md:w-full w-full"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-text text-[#444444] md:mt-2 leading-tight text-sm md:text-base break-words">
                      {recommendation.description}{" "}
                      <span className="font-text md:hidden inline-block text-[#444444] md:mt-2 leading-tight break-words">
                        {recommendation.city}
                      </span>
                    </p>
                    <p className="font-text md:block hidden text-[#444444] md:mt-2 leading-tight md:max-w-32">
                      {recommendation.city}
                    </p>

                    <p className="text-[#666666] font-halyard-text-light text-xs md:text-sm mt-1 break-words">
                      {recommendation.place}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (variant === "tours") {
    // Local state for simple variant pagination
    const [currentPage, setCurrentPage] = useState(0);

    const simpleScrollLeft = () => {
      if (currentPage > 0) {
        console.log(
          "Scrolling left from card",
          currentPage,
          "to",
          currentPage - 1
        );
        setCurrentPage((prev) => prev - 1);
      }
    };

    const simpleScrollRight = () => {
      const maxCards = Math.max(0, recommendations.length); // Show 3 cards at once
      if (currentPage < maxCards) {
        console.log(
          "Scrolling right from card",
          currentPage,
          "to",
          currentPage + 1
        );
        setCurrentPage((prev) => prev + 1);
      }
    };

    // Touch/swipe functionality for mobile
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const onTouchStart = (e: React.TouchEvent) => {
      setTouchEnd(null);
      setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
      setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
      if (!touchStart || !touchEnd) return;

      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > 50;
      const isRightSwipe = distance < -50;

      if (isLeftSwipe) {
        simpleScrollRight(); // Swipe left = go to next card
      }
      if (isRightSwipe) {
        simpleScrollLeft(); // Swipe right = go to previous card
      }
    };

    return (
      <div className="py-4 md:max-w-screen-2xl mx-auto 2xl:px-0">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-2xl font-halyard-text md:font-bold text-[#444444]">
            {title}
          </h2>
          <div className="md:flex hidden items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                className="text-sm hover:cursor-pointer text-gray-500 underline underline-offset-4 whitespace-nowrap border p-2 rounded-full"
                onClick={simpleScrollLeft}
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <button
                className="text-sm hover:cursor-pointer text-gray-500 underline underline-offset-4 whitespace-nowrap border p-2 rounded-full"
                onClick={simpleScrollRight}
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <div className=" relative md:overflow-hidden">
          <div
            className="flex md:flex-row flex-col gap-3 md:gap-2 transition-transform duration-700 ease-in-out"
            style={{
              transform:
                window.innerWidth >= 768
                  ? `translateX(-${currentPage * 200}px)`
                  : "none",
              width:
                window.innerWidth >= 768
                  ? `${recommendations.length * 200}px`
                  : "auto",
            }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {recommendations.map((recommendation, index) => (
              <Link
                key={recommendation.id}
                href={`/things-to-do/${recommendation.city}`}
                className={`flex-shrink-0 cursor-pointer group md:w-[290px] ${
                  index === recommendations.length - 1
                    ? "pb-0 border-b-0"
                    : "pb-[12px] md:pb-0 md:border-0 border-b-[1px]"
                }`}
              >
                <div className="flex md:flex-col flex-row gap-2 transition-all duration-500 ease-out transform hover:-translate-y-1 rounded-lg md:p-2">
                  <div className="w-[70%] md:w-full">
                    <img
                      src={recommendation.image}
                      alt={recommendation.description}
                      className="rounded-lg md:rounded-xl h-[65%] w-full"
                    />
                  </div>
                  <div className="w-[60%] md:w-full">
                    <p className="font-text text-[#444444] md:mt-2 leading-tight text-[15px] md:text-lg mb-2 break-words">
                      {recommendation.heading}{" "}
                    </p>

                    <p className="text-[#666666] font-halyard-text-light line-clamp-3 text-xs md:text-sm mt-1 break-words">
                      {recommendation.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (variant === "transport") {
    // Local state for simple variant pagination
    const [currentPage, setCurrentPage] = useState(0);

    const simpleScrollLeft = () => {
      if (currentPage > 0) {
        console.log(
          "Scrolling left from card",
          currentPage,
          "to",
          currentPage - 1
        );
        setCurrentPage((prev) => prev - 1);
      }
    };

    const simpleScrollRight = () => {
      const maxCards = Math.max(0, recommendations.length); // Allow scrolling through all cards
      if (currentPage < maxCards) {
        console.log(
          "Scrolling right from card",
          currentPage,
          "to",
          currentPage + 1
        );
        setCurrentPage((prev) => prev + 1);
      }
    };

    // Touch/swipe functionality for mobile
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const onTouchStart = (e: React.TouchEvent) => {
      setTouchEnd(null);
      setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
      setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
      if (!touchStart || !touchEnd) return;

      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > 50;
      const isRightSwipe = distance < -50;

      if (isLeftSwipe) {
        simpleScrollRight(); // Swipe left = go to next card
      }
      if (isRightSwipe) {
        simpleScrollLeft(); // Swipe right = go to previous card
      }
    };

    return (
      <div className="py-4 md:max-w-screen-2xl mx-auto 2xl:px-0">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-2xl font-halyard-text md:font-bold text-[#444444]">
            {title}
          </h2>
          <div className="md:flex hidden items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                className="text-sm hover:cursor-pointer text-gray-500 underline underline-offset-4 whitespace-nowrap border p-2 rounded-full"
                onClick={simpleScrollLeft}
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <button
                className="text-sm hover:cursor-pointer text-gray-500 underline underline-offset-4 whitespace-nowrap border p-2 rounded-full"
                onClick={simpleScrollRight}
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <div className=" relative md:overflow-hidden">
          <div
            className="flex md:flex-row flex-col gap-3 md:gap-2 transition-transform duration-700 ease-in-out"
            style={{
              transform:
                window.innerWidth >= 768
                  ? `translateX(-${currentPage * 400}px)`
                  : "none",
              width:
                window.innerWidth >= 768
                  ? `${recommendations.length * 400}px`
                  : "auto",
            }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {recommendations.map((recommendation, index) => (
              <Link
                key={recommendation.id}
                href={`/things-to-do/${recommendation.city}`}
                className={`flex-shrink-0 cursor-pointer group md:w-[590px] ${
                  index === recommendations.length - 1
                    ? "pb-0 border-b-0"
                    : "pb-[12px] md:pb-0 md:border-0 border-b-[1px]"
                }`}
              >
                <div className="flex flex-row gap-2 md:gap-6 transition-all duration-500 ease-out transform hover:-translate-y-1 rounded-lg md:p-2">
                  <div className="w-[70%] md:w-[47%]">
                    <img
                      src={recommendation.image}
                      alt={recommendation.description}
                      className="rounded-sm w-full"
                    />
                  </div>
                  <div className="w-[60%] md:w-full">
                    <p className="font-text text-[#444444] md:mt-2 leading-tight text-[15px] md:text-lg mb-2 break-words">
                      {recommendation.heading}{" "}
                    </p>

                    <p className="text-[#666666] font-halyard-text-light md:line-clamp-2 line-clamp-3 text-xs md:text-sm mt-1 break-words">
                      {recommendation.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default variant (existing layout)
  return (
    <div className="py-4 max-w-screen-2xl mx-auto 2xl:px-0">
      <div className="flex justify-between items-center">
        <h2 className="text-lg sm:text-2xl font-halyard-text md:font-bold text-[#444444]">
          {title}
        </h2>
        <div className="flex items-center gap-4">
          <Link
            href="/cities"
            className="text-sm text-gray-500 underline underline-offset-4 whitespace-nowrap"
          >
            {t("recommendations.seeAll")}
          </Link>
          <div className="hidden md:flex items-center gap-2">
            <button
              className="text-sm text-gray-500 hover:cursor-pointer underline underline-offset-4 whitespace-nowrap border p-2 rounded-full"
              onClick={scrollLeft}
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button
              className="text-sm text-gray-500 hover:cursor-pointer underline underline-offset-4 whitespace-nowrap border p-2 rounded-full"
              onClick={scrollRight}
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <div
        className="mt-4 sm:mt-8 flex overflow-x-scroll -ml-4 scrollbar-hide"
        ref={scrollContainerRef}
      >
        {recommendations.map((recommendation) => (
          <CarouselCard
            key={recommendation.id}
            image={recommendation.image}
            place={recommendation.place}
            rating={recommendation.rating}
            reviews={recommendation.reviews}
            description={recommendation.description}
            price={recommendation.price}
          />
        ))}
      </div>
    </div>
  );
};

export default CarouselGrid;
