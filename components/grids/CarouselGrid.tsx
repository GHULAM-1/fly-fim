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
        <h2 className="text-2xl font-heading text-gray-800 mb-2">{title}</h2>
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
    const [activePill, setActivePill] = useState(initialSelectedId || "all");

    const filteredRecommendations =
      activePill === "all"
        ? recommendations
        : recommendations.filter((rec) => rec.type === activePill);

    return (
      <div className="py-4 max-w-screen-2xl mx-auto px-[24px] 2xl:px-0">
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
            <div
              onClick={() => setActivePill("all")}
              className={`flex items-center gap-1 px-[12px] py-[6px] border rounded-full whitespace-nowrap cursor-pointer transition-colors ${
                activePill === "all"
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
              }`}
            >
              <span className="text-sm font-halyard-text">All</span>
            </div>

            {(navigationItems || []).map((pill, index) => (
              <div
                key={pill.id || index}
                onClick={() => setActivePill(pill.id)}
                className={`flex items-center gap-1 px-[12px] py-[6px] border rounded-full whitespace-nowrap cursor-pointer transition-colors ${
                  activePill === pill.id
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                }`}
              >
                {pill.icon && (
                  <pill.icon
                    size={16}
                    className={
                      activePill === pill.id ? "text-white" : "text-gray-600"
                    }
                  />
                )}
                <span className="text-sm font-halyard-text">{pill.label}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-10 gap-x-4">
          {filteredRecommendations
            .slice(0, visibleCards)
            .map((recommendation) => (
              <CarouselCard
                key={recommendation.id}
                image={recommendation.image}
                place={recommendation.place}
                rating={recommendation.rating}
                reviews={recommendation.reviews}
                description={recommendation.description}
                price={recommendation.price}
                off={recommendation.cancellation}
                badge={recommendation.cancellation}
                city={cityStr}
                category={categoryStr}
                subcategory={subcategoryStr}
                itemId={recommendation.id}
                variant="full"
              />
            ))}
        </div>

        {visibleCards < filteredRecommendations.length && (
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
      <div className="py-4 max-w-screen-2xl  mx-auto 2xl:px-0">
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
              className="w-[45%] sm:w-[30%] md:w-[20%] lg:w-1/6 flex-shrink-0 snap-center pr-2 first:ml-[24px] last:mr-[24px] xl:first:ml-0 xl:last:mr-0"
            >
              <div className="group cursor-pointer">
                <img
                  src={rec.image}
                  alt={rec.city}
                  className="w-full h-32 sm:h-40 object-cover rounded-lg mb-2"
                />
                <h3 className="font-heading text-gray-800 text-sm">
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

  if (variant === "tours" || variant === "transport") {
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 1;
    const totalPages = Math.ceil(recommendations.length / itemsPerPage);

    const handlePageChange = (page: number) => {
      setCurrentPage(page);
    };

    return (
      <div className="py-4">
        <div className="flex justify-between items-center mb-4 px-[24px] xl:px-0 max-w-[1200px] mx-auto">
          <h2 className="text-lg sm:text-2xl font-heading text-[#444444]">
            {title}
          </h2>
        </div>

        <div
          className="mt-4 sm:mt-8 flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          ref={scrollContainerRef}
        >
          {recommendations.map((guide, index) => (
            <div
              key={guide.id}
              className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 snap-center pr-2 first:ml-[24px] last:mr-[24px] xl:first:ml-0 xl:last:mr-0"
            >
              <div className="relative group cursor-pointer">
                <img
                  src={guide.image}
                  alt={guide.heading}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"></div>
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <h3 className="font-bold text-lg">{guide.heading}</h3>
                  <p className="text-sm mt-1">{guide.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (variant === "subcategory") {
    return (
      <div className="py-4 max-w-screen-2xl mx-auto px-4 2xl:px-0">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-heading text-gray-800">{title}</h2>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center font-light gap-2 font-halyard-text text-gray-500 hover:text-gray-900 transition-colors bg-transparent hover:bg-gray-50 px-3 py-2 md:py-3 md:px-3 cursor-pointer">
              <SortIcon />
              <span className="text-sm">{`Sort by: ${sortBy}`}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 font-halyard-text text-gray-500"
            >
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {recommendations.map((recommendation) => (
            <CarouselCard
              key={recommendation.id}
              image={recommendation.image}
              place={recommendation.place}
              rating={recommendation.rating}
              reviews={recommendation.reviews}
              description={recommendation.description}
              price={recommendation.price}
              off={recommendation.cancellation}
              badge={recommendation.cancellation}
              city={cityStr}
              category={categoryStr}
              subcategory={subcategoryStr}
              itemId={recommendation.id}
              variant="full"
            />
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
