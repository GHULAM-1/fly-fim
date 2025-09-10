import React, { useRef, useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CarouselCard from "../cards/CarouselCard";
import { useTranslation } from "react-i18next";
import { ChevronDown, Check } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { StarIcon } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import PriceDisplay from "../PriceDisplay";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

const SortIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M6 2L6 14"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M6 14L2 10"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M10 14L10 2"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M9.99999 2L14 6"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </svg>
);

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
    | "transport"
    | "subcategory";
  navigationItems?: Array<{
    id: string;
    label: string;
    icon?: any;
    color?: string;
  }>;
  pills?: boolean;
  initialSelectedId?: string;
}

const CarouselGrid = ({
  title,
  recommendations,
  variant = "default",
  navigationItems,
  pills = true,
  initialSelectedId,
}: CarouselGridProps) => {
  const { t } = useTranslation();
  const { city, category, subcategory } = useParams();

  const cityStr = city ? (Array.isArray(city) ? city[0] : city) : "";
  const categoryStr = category
    ? Array.isArray(category)
      ? category[0]
      : category
    : "";
  const subcategoryStr = subcategory
    ? Array.isArray(subcategory)
      ? subcategory[0]
      : subcategory
    : "";
  const [sortBy, setSortBy] = useState("Picked for you");
  const [visibleCards, setVisibleCards] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const categoriesDropdownRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCards(4);
      } else {
        setVisibleCards(8);
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  useEffect(() => {
    if (showCategoriesDropdown) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
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
  };

  const handleShowMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCards((prev) => prev + 4);
      setIsLoading(false);
    }, 1000);
  };

  if (variant === "full") {
    return (
      <div className="py-4  max-w-screen-2xl mx-auto 2xl:px-0">
        <h2 className="text-2xl font-heading text-[#444444] mb-2">{title}</h2>
        <div className="flex justify-between items-start mb-6">
          <p className="text-gray-600 text-sm">
            {recommendations.length} experiences
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center font-light gap-2 font-halyard-text text-gray-500 hover:text-gray-900 transition-colors bg-transparent hover:bg-gray-50 px-3 py-2 md:py-3 md:px-3 cursor-pointer">
              <SortIcon />
              <span className="text-sm ">{`Sort by: ${sortBy}`}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 font-halyard-text text-gray-500"
            >
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={() => handleSortChange(option)}
                  className="flex items-center justify-between cursor-pointer "
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
                  <span className="text-pink-600 text-xs font-medium">
                    {recommendation.rating}
                  </span>
                  <span className="text-pink-600 text-xs">
                    ({recommendation.reviews})
                  </span>
                </span>
              </div>
              <p className="font-medium text-gray-700 mt-2">
                {recommendation.description}
              </p>
              <p className="font-medium text-gray-700 mt-2 max-w-32">
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
    const [selectedPills, setSelectedPills] = useState<string[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState<"bottom" | "top">(
      "bottom"
    );
    const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);

    const filteredRecommendations =
      selectedPills.length === 0
        ? recommendations
        : recommendations.filter((rec) => selectedPills.includes(rec.type));

    const calculateDropdownPosition = (buttonElement: HTMLElement) => {
      const rect = buttonElement.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const dropdownHeight = 300; // Estimated dropdown height
      const dropdownWidth = 230; // Estimated dropdown width
      const isMobile = window.innerWidth < 768;

      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      const spaceRight = viewportWidth - rect.left;

      // On mobile, always try to open above due to bottom navbar
      // On desktop, use normal logic
      if (isMobile) {
        // On mobile, prefer opening above, but fallback to below if not enough space above
        if (spaceAbove > dropdownHeight) {
          setDropdownPosition("top");
        } else {
          setDropdownPosition("bottom");
        }
      } else {
        // Desktop logic: if there's not enough space below but enough above, position above
        if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
          setDropdownPosition("top");
        } else {
          setDropdownPosition("bottom");
        }
      }
    };

    const handleDropdownClick = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setButtonRect(rect);
      calculateDropdownPosition(e.currentTarget);
      setShowDropdown(!showDropdown);
    };

    // Close dropdown when clicking outside and prevent scroll when open
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (showDropdown) {
          const target = event.target as Element;
          // Check if click is outside both the button and dropdown
          const isOutsideButton = !target.closest("[data-categories-button]");
          const isOutsideDropdown = !target.closest(
            "[data-categories-dropdown]"
          );

          if (isOutsideButton && isOutsideDropdown) {
            setShowDropdown(false);
            setButtonRect(null);
          }
        }
      };

      if (showDropdown) {
        // Prevent body scroll when dropdown is open
        document.body.style.overflow = "hidden";
        document.addEventListener("mousedown", handleClickOutside);
      } else {
        // Restore body scroll when dropdown is closed
        document.body.style.overflow = "unset";
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        // Cleanup: restore scroll when component unmounts
        document.body.style.overflow = "unset";
      };
    }, [showDropdown]);

    return (
      <div className="py-4 max-w-screen-2xl mx-auto xl:px-0">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-lg sm:text-2xl font-heading text-[#444444] mb-2">
              {title}
            </h2>
          </div>
        </div>

        {pills && (
          <div
            className="mt-4 sm:mt-5 flex gap-2 overflow-x-auto scrollbar-hide"
            ref={scrollContainerRef}
          >
            <div className="relative">
              <div
                data-categories-button
                className={`flex items-center gap-1 px-[12px] py-[6px] border-[1px] hover:border-[#444] border-[#e2e2e2]  rounded-full whitespace-nowrap cursor-pointer transition-colors text-[#444444] ${
                  selectedPills.length > 0 ? "bg-[#f0f0f0] border-[#222]" : ""
                }`}
                onClick={handleDropdownClick}
              >
                {selectedPills.length > 0 && (
                  <div className="w-5 h-5 text-white bg-[#000c] rounded-full flex items-center justify-center text-xs font-bold">
                    {selectedPills.length}
                  </div>
                )}
                <span className="text-sm font-halyard-text">Categories</span>
                <svg
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                  className="ml-1"
                >
                  <path
                    d="M1 1.5L6 6.5L11 1.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {showDropdown && buttonRect && (
                <div
                  data-categories-dropdown
                  className="fixed bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[230px] max-h-[300px] overflow-y-auto"
                  style={{
                    top:
                      dropdownPosition === "top"
                        ? `${Math.max(10, buttonRect.top - 300)}px`
                        : `${buttonRect.bottom + 8}px`,
                    left: `${Math.max(10, Math.min(buttonRect.left, window.innerWidth - 250))}px`,
                    // On mobile, add extra bottom margin to avoid bottom navbar
                    ...(window.innerWidth < 768 &&
                      dropdownPosition === "bottom" && {
                        maxHeight: `${Math.min(300, window.innerHeight - buttonRect.bottom - 80)}px`,
                      }),
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-2">
                    {(navigationItems || []).map((pill, index) => {
                      const isSelected = selectedPills.includes(pill.id);

                      return (
                        <div
                          key={pill.id || index}
                          className="flex items-center gap-3 px-3 py-2 pb-4 hover:bg-gray-50 rounded cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isSelected) {
                              setSelectedPills((prev) =>
                                prev.filter((id) => id !== pill.id)
                              );
                            } else {
                              setSelectedPills((prev) => [...prev, pill.id]);
                            }
                          }}
                        >
                          {pill.icon && (
                            <pill.icon size={16} className="text-[#222222]" />
                          )}
                          <span className="text-[14px] font-halyard-text text-[#222222] flex-1">
                            {pill.label}
                          </span>
                          <div
                            className={`w-5 h-5 border-[1px] rounded-[3px] flex items-center justify-center ${
                              isSelected
                                ? "bg-purple-600 border-purple-600"
                                : "border-gray-300"
                            }`}
                          >
                            {isSelected && (
                              <svg
                                width="20"
                                height="12"
                                viewBox="0 0 10 8"
                                fill="none"
                              >
                                <path
                                  d="M1 4L3.5 6.5L9 1"
                                  stroke="white"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {(navigationItems || []).slice(0, 5).map((pill, index) => {
              const isSelected = selectedPills.includes(pill.id);

              return (
                <div
                  key={pill.id || index}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedPills((prev) =>
                        prev.filter((id) => id !== pill.id)
                      );
                    } else {
                      setSelectedPills((prev) => [...prev, pill.id]);
                    }
                  }}
                  className={`flex items-center gap-1 px-[12px] py-[6px] border rounded-full whitespace-nowrap cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-[#f0f0f0] text-[#444444] border-[#222]"
                      : "bg-white text-[#444444] border-[#e2e2e2] hover:border-[#444]"
                  }`}
                >
                  {pill.icon && (
                    <pill.icon size={16} className="text-gray-600" />
                  )}
                  <span className="text-sm font-halyard-text">
                    {pill.label}
                  </span>
                  {isSelected && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPills((prev) =>
                          prev.filter((id) => id !== pill.id)
                        );
                      }}
                      className="ml-1 hover:cursor-pointer w-4 h-4 flex items-center justify-center text-gray-500 hover:text-[#444444]"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M9 3L3 9M3 3L9 9"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-4 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-y-10 gap-y-4 gap-x-4">
          {filteredRecommendations
            .slice(0, visibleCards)
            .map((recommendation) => (
              <CarouselCard
                variant="recommendation"
                image={recommendation.image}
                place={recommendation.place}
                rating={recommendation.rating}
                reviews={recommendation.reviews}
                description={recommendation.description}
                price={recommendation.price}
                off={recommendation.off}
                oldPrice={recommendation.oldPrice}
                badge={recommendation.badge}
                city={cityStr}
                category={categoryStr}
                subcategory={subcategoryStr}
                itemId={recommendation.id}
              />
            ))}
        </div>

        {visibleCards < filteredRecommendations.length && (
          <div className="mt-6 text-center">
            <button
              onClick={handleShowMore}
              disabled={isLoading}
              className="px-[46px] py-[10px] w-full md:w-[174.4px] hover:cursor-pointer min-h-[43.6px] bg-white border border-gray-300 text-[#444444] rounded-lg hover:border-gray-400 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
      <div className="py-4 max-w-screen-[1200px] mx-auto 2xl:px-0">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg sm:text-2xl font-heading text-[#444444]">
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

        <div className="hidden md:block">
          <div
            className="flex gap-6 overflow-x-scroll h-[369px] scrollbar-hide"
            ref={scrollContainerRef}
          >
            {recommendations.map((museum) => (
              <div
                key={museum.id}
                className="flex-shrink-0 cursor-pointer group w-[calc(24%-10px)] h-[354px] relative"
              >
                <div className="flex justify-center relative h-[15px] items-center flex-col ">
                  <div className="w-[89%] h-[12px] border-t-[1px] border-l-[1px] border-r-[1px] border-[#cacaca] bg-[#f8f8f8] rounded-t-lg z-0 group-hover:h-[12px] transition-all duration-150 group-hover:mb-[-6px] ease-in-out"></div>
                  <div className="w-[92%] h-[12px] bg-white border-[1px] border-[#cacaca] rounded-t-lg  z-0 group-hover:mb-[-6px] group-hover:h-[12px] transition-all duration-100 ease-in-out"></div>
                </div>
                <div className="relative h-full rounded-lg overflow-hidden shadow-lg z-10 group">
                  <div className="relative h-full overflow-hidden">
                    <img
                      src={museum.image}
                      alt={museum.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    <div
                      className="absolute bottom-0 left-0 right-0 h-[35%] transition-all duration-500 ease-in-out group-hover:h-[50%] group-hover:bottom-0"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(21, 1, 42, 0) 0%, rgba(21, 1, 42, 0.3) 20%, rgba(21, 1, 42, 0.7) 60%, rgb(21, 1, 42) 100%)",
                      }}
                    />

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

        <div className="md:hidden">
          <div className="relative overflow-hidden w-full max-w-[420px] mx-auto">
            <div
              className="flex gap-4 transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentMuseumIndex * 27}%)`,
                width: `${recommendations.length * 27}%`,
              }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {recommendations.map((museum, index) => {
                const active = index === currentMuseumIndex;

                return (
                  <div key={museum.id} className="w-[27%] shrink-0">
                    <div className="relative h-[334px] rounded-lg overflow-hidden shadow-lg">
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

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-20" />

                      <div
                        className="absolute bottom-0 left-0 right-0 pointer-events-none transition-all duration-500 z-20"
                        style={{
                          height: "50%",
                          background:
                            "linear-gradient(180deg, rgba(21, 1, 42, 0) 0%, rgba(21, 1, 42, 0.3) 20%, rgba(21, 1, 42, 0.7) 60%, rgb(21, 1, 42) 100%)",
                        }}
                      />

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
    return (
      <div className="py-4">
        <div className="flex justify-between items-center mb-4 px-[24px] xl:px-0 max-w-[1200px] mx-auto">
          <h2 className="text-lg sm:text-2xl font-heading text-[#444444]">
            {title}
          </h2>
          <div className="hidden md:flex items-center gap-2">
            <button
              className="cursor-pointer hover:border-gray-400 text-sm text-[#666666] underline underline-offset-4 whitespace-nowrap border p-2 rounded-full"
              onClick={scrollLeft}
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button
              className="cursor-pointer hover:border-gray-400 text-sm text-[#666666] underline underline-offset-4 whitespace-nowrap border p-2 rounded-full"
              onClick={scrollRight}
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          className="mt-4 sm:mt-8 flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          ref={scrollContainerRef}
        >
          {recommendations.map((rec, index) => (
            <div
              key={rec.id}
              className="w-[45%] sm:w-[27%] md:w-[20%] lg:w-1/6 flex-shrink-0 snap-center pr-2 first:ml-[24px] last:mr-[24px] xl:first:ml-0 xl:last:mr-0"
            >
              <div className="group cursor-pointer">
                <img
                  src={rec.image}
                  alt={rec.city}
                  className="w-full h-32 sm:h-40 object-cover rounded-sm mb-2"
                />
                <h3 className="font-heading text-[#444444] text-sm">
                  {rec.description}{" "}
                  <span className="font-heading">{rec.city}</span>
                </h3>
                <p className="text-xs text-gray-500">{rec.place}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "tours") {
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 1;
    const totalPages = Math.ceil(recommendations.length / itemsPerPage);

    const handlePageChange = (page: number) => {
      setCurrentPage(page);
    };

    const scrollLeft = () => {
      if (scrollContainerRef.current) {
        const cardWidth = window.innerWidth >= 768 ? 24 : 25; // percentage
        const containerWidth = scrollContainerRef.current.clientWidth;
        const scrollAmount = ((containerWidth * cardWidth) / 100) * 2; // scroll 2 cards
        scrollContainerRef.current.scrollBy({
          left: -scrollAmount,
          behavior: "smooth",
        });
      }
    };

    const scrollRight = () => {
      if (scrollContainerRef.current) {
        const cardWidth = window.innerWidth >= 768 ? 24 : 25; // percentage
        const containerWidth = scrollContainerRef.current.clientWidth;
        const scrollAmount = ((containerWidth * cardWidth) / 100) * 2; // scroll 2 cards
        scrollContainerRef.current.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
    };

    return (
      <div className="py-4 px-[24px] xl:px-0">
        <div className="flex justify-between items-center  max-w-[1200px] mx-auto">
          <h2 className="text-lg sm:text-2xl font-heading text-[#444444]">
            {title}
          </h2>
          <div className="hidden md:flex items-center gap-2">
            <button
              className="cursor-pointer hover:border-gray-400 text-sm text-[#666666] underline underline-offset-4 whitespace-nowrap border p-2 rounded-full"
              onClick={scrollLeft}
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button
              className="cursor-pointer hover:border-gray-400 text-sm text-[#666666] underline underline-offset-4 whitespace-nowrap border p-2 rounded-full"
              onClick={scrollRight}
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          className="mt-2 sm:mt-4 flex md:flex-row flex-col gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          ref={scrollContainerRef}
        >
          {recommendations.map((guide, index) => (
            <div
              key={guide.id}
              className="w-[25%] md:block hidden md:w-[24%] flex-shrink-0"
            >
              <img
                src={guide.image}
                alt={guide.heading}
                className="w-[96%] mb-2 object-cover rounded-lg"
              />
              <div className="text-[#444444]">
                <h3 className="font-semibold font-halyard-text text-[17px]">
                  {guide.heading}
                </h3>
                <p className="text-sm mt-1 font-halyard-text-light line-clamp-3">
                  {guide.description}
                </p>
              </div>
            </div>
          ))}
          {recommendations.map((guide, index) => (
            <div
              key={guide.id}
              className={`flex md:hidden mt-2 gap-4 ${index < recommendations.length - 1 ? "border-b border-gray-200 pb-4 mb-4" : ""}`}
            >
              <div className="w-[40%]">
                <img
                  src={guide.image}
                  alt={guide.heading}
                  className="w-full h-[84px] object-cover rounded-lg"
                />
              </div>
              <div className="text-[#444444] w-[60%]">
                <h3 className="font-semibold font-halyard-text text-[14px]">
                  {guide.heading}
                </h3>
                <p className="text-[12px] mt-1 font-halyard-text-light line-clamp-3">
                  {guide.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (variant === "transport") {
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 1;
    const totalPages = Math.ceil(recommendations.length / itemsPerPage);

    const handlePageChange = (page: number) => {
      setCurrentPage(page);
    };

    const scrollLeft = () => {
      if (scrollContainerRef.current) {
        const cardWidth = window.innerWidth >= 768 ? 49 : 25; // percentage
        const containerWidth = scrollContainerRef.current.clientWidth;
        const scrollAmount = ((containerWidth * cardWidth) / 100) * 2; // scroll 2 cards
        scrollContainerRef.current.scrollBy({
          left: -scrollAmount,
          behavior: "smooth",
        });
      }
    };

    const scrollRight = () => {
      if (scrollContainerRef.current) {
        const cardWidth = window.innerWidth >= 768 ? 49 : 25; // percentage
        const containerWidth = scrollContainerRef.current.clientWidth;
        const scrollAmount = ((containerWidth * cardWidth) / 100) * 2; // scroll 2 cards
        scrollContainerRef.current.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
    };

    return (
      <div className="py-4 xl:px-0">
        <div className="flex justify-between items-center  max-w-[1200px] mx-auto">
          <h2 className="text-lg sm:text-2xl font-heading text-[#444444]">
            {title}
          </h2>
          <div className="hidden md:flex items-center gap-2">
            <button
              className="cursor-pointer hover:border-gray-400 text-sm text-[#666666] underline underline-offset-4 whitespace-nowrap border p-2 rounded-full"
              onClick={scrollLeft}
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button
              className="cursor-pointer hover:border-gray-400 text-sm text-[#666666] underline underline-offset-4 whitespace-nowrap border p-2 rounded-full"
              onClick={scrollRight}
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          className="mt-2 sm:mt-8 flex md:flex-row flex-col gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          ref={scrollContainerRef}
        >
          {recommendations.map((guide, index) => (
            <div key={guide.id} className={`w-[25%] hidden md:block md:w-[49%] flex-shrink-0`}>
              <div className="flex gap-4">
                <div className="w-[30%]">
                  <img
                    src={guide.image}
                    alt={guide.heading}
                    className="w-full h-full object-cover rounded-sm"
                  />
                </div>
                <div className="text-[#444444] w-[60%]">
                  <h3 className="font-semibold font-halyard-text text-[17px]">
                    {guide.heading}
                  </h3>
                  <p className="text-[14px] mt-1 font-halyard-text-light line-clamp-3">
                    {guide.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {recommendations.map((guide, index) => (
            <div
              key={guide.id}
              className={`flex md:hidden mt-2 gap-4 ${index < recommendations.length - 1 ? "border-b border-gray-200 pb-4 mb-4" : ""}`}
            >
              <div className="w-[40%]">
                <img
                  src={guide.image}
                  alt={guide.heading}
                  className="w-full h-[84px] object-cover rounded-lg"
                />
              </div>
              <div className="text-[#444444] w-[60%]">
                <h3 className="font-semibold font-halyard-text text-[14px]">
                  {guide.heading}
                </h3>
                <p className="text-[12px] mt-1 font-halyard-text-light line-clamp-3">
                  {guide.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (variant === "subcategory") {
    return (
      <div className="py-4 sm:py-10 max-w-[1200px] mx-auto 2xl:px-0">
        <div className="flex justify-between items-center  xl:px-0">
          <h2 className="text-lg sm:text-2xl font-heading text-[#444444]">
            {title}
          </h2>
          <div className="flex items-center gap-1 md:gap-2  ">
            <Link
              href="/cities"
              className="text-[15px] md:mr-2 font-halyard-text text-[#444444] md:underline underline-offset-4 whitespace-nowrap"
            >
              {t("recommendations.seeAll")}
            </Link>
            <ChevronRightIcon className="md:hidden block w-4 h-4" />
            <button
              className="cursor-pointer hidden md:flex hover:border-gray-400 text-sm text-[#666666] border p-2 rounded-full"
              onClick={scrollLeft}
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button
              className="cursor-pointer hidden md:flex hover:border-gray-400 text-sm text-[#666666] border p-2 rounded-full"
              onClick={scrollRight}
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div
          className="mt-4  xl:ml-0 sm:mt-4 flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          ref={scrollContainerRef}
        >
          {recommendations.map((recommendation, index) => (
            <div className="snap-start flex-shrink-0 w-[282px]">
              <CarouselCard
                variant="recommendation"
                image={recommendation.image}
                place={recommendation.place}
                rating={recommendation.rating}
                reviews={recommendation.reviews}
                description={recommendation.description}
                price={recommendation.price}
                off={recommendation.off}
                oldPrice={recommendation.oldPrice}
                badge={recommendation.badge}
                city={cityStr}
                category={categoryStr}
                subcategory={subcategoryStr}
                itemId={recommendation.id}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 max-w-screen-2xl mx-auto 2xl:px-0">
      <div className="flex justify-between items-center">
        <h2 className="text-lg sm:text-2xl font-heading text-[#444444]">
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
            variant="full"
            image={recommendation.image}
            place={recommendation.place}
            rating={recommendation.rating}
            reviews={recommendation.reviews}
            description={recommendation.description}
            price={recommendation.price}
            city={cityStr}
            category={categoryStr}
            subcategory={subcategoryStr}
            itemId={recommendation.id}
          />
        ))}
      </div>
    </div>
  );
};

export default CarouselGrid;
