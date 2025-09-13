"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import CategoriesDropdown from "@/components/category/CategoriesDropdown";
import ImageGallery from "@/components/checkout/gallery";
import Banner from "@/components/home/Banner";
import Activities from "@/components/checkout/top-things-to-do";
import Recommendations from "@/components/checkout/similar-experiences";
import ExperienceDetails from "@/components/checkout/features";
import FaqSection from "@/components/checkout/faqs";
import CheckAvailability from "@/components/checkout/checkAvailability";
import PhotoGalleryDrawer from "@/components/ui/photo-gallery-drawer";
import { useNavigationStore } from "@/lib/store/navigationStore";
import {
  BreadcrumbList,
  BreadcrumbSeparator,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  Ticket,
  BadgePercent,
  Landmark,
  SunMedium,
  Ship,
  Leaf,
  Users,
  Music,
  Bus,
} from "lucide-react";
import CarouselGrid from "@/components/grids/CarouselGrid";
import BrowseThemes from "@/components/tickets/BrowseThemes";
import Stats from "@/components/home/Stats";
import WhyHeadout from "@/components/checkout/WhyHeadout";
import ItinerarySection from "@/components/checkout/ItinerarySection";
import CheckoutNav from "@/components/checkout/CheckoutNav";
import Destinations from "@/components/home/Destinations";

const experiences = [
  {
    id: "seville-cathedral-skip-the-line",
    image: "/images/d1.jpg.avif",
    place: "Seville Cathedral",
    rating: 4.7,
    reviews: 8123,
    description: "Skip-the-line entry with optional guided tour",
    price: 24,
    off: 10,
    oldPrice: 64.18,
    badge: "Free cancellation",
    cancellation: "Free cancellation",
  },
  {
    id: "real-alcazar-priority-entrance",
    image: "/images/d2.jpg.avif",
    place: "Real Alcázar",
    rating: 4.8,
    reviews: 15234,
    description: "Priority entrance + audio guide",
    price: 29,
    off: 10,
    oldPrice: 32.18,
    badge: "Free cancellation",
    cancellation: "Free cancellation",
  },
  {
    id: "guadalquivir-cruise",
    image: "/images/d3.jpg.avif",
    place: "Guadalquivir Cruise",
    rating: 4.5,
    reviews: 5210,
    description: "1‑hour scenic river cruise",
    price: 18,
  },
  {
    id: "flamenco-show-tablao",
    image: "/images/d4.jpg.avif",
    place: "Flamenco Show",
    rating: 4.6,
    reviews: 6632,
    description: "Authentic tablao experience",
    price: 25,
  },
  {
    id: "city-card-seville",
    image: "/images/d5.jpg.avif",
    place: "City Card",
    rating: 4.3,
    reviews: 2101,
    description: "Multi‑attraction pass for 48h",
    price: 49,
  },
  {
    id: "guided-walking-tour-seville",
    image: "/images/d6.jpeg.avif",
    place: "Guided Walking Tour",
    rating: 4.7,
    reviews: 3889,
    description: "Old Town & Jewish Quarter",
    price: 22,
  },
  {
    id: "museum-fine-arts-seville",
    image: "/images/d2.jpg.avif",
    place: "Museum of Fine Arts",
    rating: 4.4,
    reviews: 980,
    description: "Entry ticket",
    price: 12,
  },
  {
    id: "hop-on-hop-off-bus-seville",
    image: "/images/d3.jpg.avif",
    place: "Hop-on Hop-off Bus",
    rating: 4.2,
    reviews: 4312,
    description: "24‑hour ticket with audio guide",
    price: 30,
  },
  {
    id: "skydive-dubai",
    description: "Skydive Dubai: Tandem Skydiving at the Palm Drop Zone",
    badge: "Selling out fast",
    place: "Dubai",
    image: "/images/r4.jpg.avif",
    price: 100,
    rating: 4.5,
    reviews: 100,
  },
  {
    id: "acropolis-tickets",
    description: "Acropolis Parthenon Tickets with Optional Audio Guide",
    place: "Athens",
    image: "/images/r3.jpg.avif",
    price: 100,
    rating: 4.5,
    reviews: 100,
  },
  {
    id: "pompeii-amalfi-tour",
    badge: "Free cancellation",
    description:
      "From Rome: Pompeii, Amalfi Coast and Sorrento or Positano Day Trip",
    place: "Italy",
    image: "/images/r2.jpg.avif",
    price: 100,
    rating: 4.5,
    reviews: 100,
  },
  {
    id: "harry-potter-studio",
    description:
      "From London: Harry Potter™ Warner Bros. Studio Tickets with Coach Transfers",
    place: "London",
    image: "/images/r1.jpg.avif",
    price: 100,
    rating: 4.5,
    reviews: 100,
  },
];

const CheckoutPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const city = params.city as string;
  const categoryName = params.category as string;
  const subcategory = params.subcategory as string;
  const itemId = params.itemId as string;
  const { isModalOpen } = useNavigationStore();

  const currentExperience = experiences.find((exp) => exp.id === itemId);

  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const isWorldwideRoute = city === "worldwide";

  const decodedCategoryName = decodeURIComponent(
    categoryName ? categoryName.split("-").join(" ") : ""
  );
  const formattedCategoryName = decodedCategoryName
    ? decodedCategoryName.charAt(0).toUpperCase() + decodedCategoryName.slice(1)
    : "Category";

  const decodedCity = decodeURIComponent(city);

  const formattedCityName = decodedCity
    ? decodedCity
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "City";

  const decodedSubcategoryName = decodeURIComponent(
    subcategory ? subcategory.split("-").join(" ") : ""
  );
  const formattedSubcategoryName = decodedSubcategoryName
    ? decodedSubcategoryName.charAt(0).toUpperCase() +
      decodedSubcategoryName.slice(1)
    : "Subcategory";

  const formattedItemName =
    currentExperience?.description ||
    decodeURIComponent(itemId ? itemId.split("-").join(" ") : "Item");

  const itemCity = currentExperience?.place || formattedCityName;

  const configKey = decodedSubcategoryName.toLowerCase().replace(/\s+/g, "-");

  const handleMobileCheckAvailability = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString();

    const bookingUrl = `/booking?itemName=${encodeURIComponent(
      formattedItemName
    )}&city=${encodeURIComponent(city)}&category=${encodeURIComponent(
      categoryName
    )}&subcategory=${encodeURIComponent(
      subcategory
    )}&itemId=${encodeURIComponent(itemId)}&date=${dateString}`;
    router.push(bookingUrl);
  };

  const getDynamicHeading = (): string => {
    const cityFormatted = city.charAt(0).toUpperCase() + city.slice(1);

    if (subcategory) {
      return `${formattedSubcategoryName} in ${cityFormatted}`;
    } else {
      return `${formattedCategoryName} in ${cityFormatted}`;
    }
  };

  const subCategoryConfig = isWorldwideRoute
    ? {
        museums: {
          heading: "Global Museums",
          components: {
            themes: [
              { icon: Ticket, text: "Global Museum Tickets", href: "#" },
              {
                icon: BadgePercent,
                text: "Religious Site Tickets",
                href: "#",
              },
              { icon: Landmark, text: "Landmark Tickets", href: "#" },
              { icon: SunMedium, text: "Zoo Tickets", href: "#" },
              { icon: Ship, text: "City Cards", href: "#" },
              { icon: Leaf, text: "Theme Park Tickets", href: "#" },
            ],
          },
        },

        default: {
          heading: `Global ${formattedSubcategoryName}`,
          components: {
            themes: [
              { icon: Ticket, text: "Global Tickets", href: "#" },
              { icon: Landmark, text: "Global Landmarks", href: "#" },
            ],
          },
        },
      }
    : {
        default: {
          heading: getDynamicHeading(),
          components: {
            themes: [
              {
                icon: Landmark,
                text: `Landmarks in ${formattedCityName}`,
                href: "#",
              },
              {
                icon: Ticket,
                text: `Combo Tickets in ${formattedCityName}`,
                href: "#",
              },
              {
                icon: Users,
                text: `Guided Tours in ${formattedCityName}`,
                href: "#",
              },
              {
                icon: Music,
                text: `Dance Shows in ${formattedCityName}`,
                href: "#",
              },
              {
                icon: Bus,
                text: `Hop-on Hop-off Tours in ${formattedCityName}`,
                href: "#",
              },
              {
                icon: SunMedium,
                text: `${formattedCityName} Attractions`,
                href: "#",
              },
              { icon: Ship, text: `Guadalquivir River Cruises`, href: "#" },
            ],
          },
        },
      };

  const currentSubCategory =
    subCategoryConfig[configKey as keyof typeof subCategoryConfig] ||
    subCategoryConfig.default;

  if (!currentSubCategory) {
    return <div>Subcategory not found</div>;
  }
  const recommendations = [
    {
      id: 1,
      description: "Edge Observation Deck Tickets: Timed Entry",
      place: "Edge NYC",
      image: "/images/r4.jpg.avif",
      price: 39.2,
      off: 3,
      oldPrice: 42.2,
      rating: 4.5,
      reviews: 5897,
      badge: "Free cancellation",
    },
    {
      id: 2,
      description: "The Museum of Modern Art (MoMA) Tickets",
      place: "Museum of Modern Art (MoMA)",
      image: "/images/r3.jpg.avif",
      price: 30,
      oldPrice: 32.2,
      off: 3,
      rating: 4.4,
      reviews: 4489,
    },
    {
      id: 3,
      description: "NYC Helicopter Tour from Downtown Manhattan",
      place: "Helicopter Tours",
      image: "/images/r2.jpg.avif",
      price: 259,
      rating: 4.5,
      reviews: 7792,
      badge: "Free cancellation",
    },
    {
      id: 4,
      description: "Go City New York Explorer Pass: Choose 2 to 10 Attractions",
      place: "City Cards",
      image: "/images/r1.jpg.avif",
      price: 89,
      rating: 4.5,
      reviews: 2110,
      badge: "Free cancellation",
    },
    {
      id: 5,
      description: "The Museum of Modern Art (MoMA) Tickets",
      place: "Museum of Modern Art (MoMA)",
      image: "/images/r3.jpg.avif",
      price: 30,
      off: 3,
      oldPrice: 32.2,
      rating: 4.4,
      reviews: 4489,
    },
    {
      id: 6,
      description: "NYC Helicopter Tour from Downtown Manhattan",
      place: "Helicopter Tours",
      image: "/images/r2.jpg.avif",
      price: 259,
      rating: 4.5,
      reviews: 7792,
      badge: "Free cancellation",
    },
    {
      id: 7,
      description: "Go City New York Explorer Pass: Choose 2 to 10 Attractions",
      place: "City Cards",
      image: "/images/r1.jpg.avif",
      price: 89,
      rating: 4.5,
      reviews: 2110,
      badge: "Free cancellation",
    },
    {
      id: 8,
      description: "The Museum of Modern Art (MoMA) Tickets",
      place: "Museum of Modern Art (MoMA)",
      image: "/images/r3.jpg.avif",
      price: 30,
      off: 3,
      oldPrice: 32.2,
      rating: 4.4,
      reviews: 4489,
    },
    {
      id: 9,
      description: "NYC Helicopter Tour from Downtown Manhattan",
      place: "Helicopter Tours",
      image: "/images/r2.jpg.avif",
      price: 259,
      rating: 4.5,
      reviews: 7792,
      badge: "Free cancellation",
    },
    {
      id: 10,
      description: "Go City New York Explorer Pass: Choose 2 to 10 Attractions",
      place: "City Cards",
      image: "/images/r1.jpg.avif",
      price: 89,
      rating: 4.5,
      reviews: 2110,
      badge: "Free cancellation",
    },
  ];
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

  const images = [
    "/images/tickets-included-01.avif",
    "/images/tickets-included-02.avif",
    "/images/tickets-included-03.avif",
    "/images/tickets-included-04.avif",
    "/images/tickets-included-05.avif",
    "/images/tickets-included-07.avif",
  ];

  const navItems =
    (currentSubCategory.components.themes || []).map((t: any) => {
      const id = (t.text || "")
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\-]/g, "");
      return {
        id,
        label: t.text,
        icon: t.icon,
      };
    }) || [];

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Separate effect for scroll to top - only run once on mount
  useEffect(() => {
    // Ensure page starts at top - only run once
    // Use setTimeout to ensure this runs after any other scroll behavior and DOM is ready
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 100);

    // Prevent any unwanted scroll behavior during initial load
    const preventScroll = (e: Event) => {
      e.preventDefault();
    };

    // Temporarily disable programmatic scrolling during page load
    document.addEventListener('scroll', preventScroll, { passive: false });
    
    // Re-enable scrolling after initial load is complete
    const enableScrollTimer = setTimeout(() => {
      document.removeEventListener('scroll', preventScroll);
    }, 300);

    return () => {
      clearTimeout(timer);
      clearTimeout(enableScrollTimer);
      document.removeEventListener('scroll', preventScroll);
    };
  }, []); // Empty dependency array means this only runs once

  useEffect(() => {
    if (!isClient) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length, isClient]);

  const handleImageClick = () => {
    setIsGalleryOpen(true);
  };

  return (
    <>
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 xl:px-0 md:mt-5">
        <CheckoutNav />
        <div className=" md:pt-[76px]">
          {!isWorldwideRoute ? (
            <>
              <div className="mb-[14px] hidden md:block">
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
                        href={`/things-to-do/${city}`}
                      >
                        {formattedCityName}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        className="text-[14px] underline font-halyard-text-light text-[#666666]"
                        href={`/things-to-do/${city}/${categoryName}`}
                      >
                        {formattedCategoryName}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        className="text-[14px] underline font-halyard-text-light text-[#666666]"
                        href={`/things-to-do/${city}/${categoryName}/${subcategory}`}
                      >
                        {formattedSubcategoryName}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="text-[14px] font-halyard-text-light text-[#666666] truncate max-w-[200px]">
                        {formattedItemName}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>

              <div className="hidden sm:block md:hidden mb-4">
                <button className="flex items-center text-gray-600 text-sm">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="mr-2"
                  >
                    <path
                      d="M10 12L6 8L10 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Back
                </button>
              </div>

              <div className="md:hidden relative px-0 -mx-4">
                <div
                  className="relative cursor-pointer"
                  style={{ height: "58vh", overflow: "hidden" }}
                  onClick={handleImageClick}
                >
                  <div className="absolute inset-0">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ${
                          isClient && index === currentImageIndex
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                        style={{
                          opacity: !isClient && index === 0 ? 1 : undefined,
                        }}
                      >
                        <img
                          src={image}
                          alt={`${formattedItemName} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>

                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(188.04deg, rgba(21, 1, 42, 0) 30%, rgb(21, 1, 42) 80%)",
                    }}
                  />

                  <div
                    className="absolute bottom-0 left-0 right-0 px-5 py-4 text-white"
                    style={{
                      background:
                        "linear-gradient(188.04deg, rgba(21, 1, 42, 0) 30%, rgb(21, 1, 42) 80%)",
                    }}
                  >
                    <div className="flex justify-between items-start mb-3 font-halyard-text">
                      <div className="flex flex-col">
                        {/* Pagination dots */}
                        <div className="flex flex-row items-center gap-1.5 mb-2">
                          {images.map((_, index) => (
                            <div
                              key={index}
                              className={`relative h-1.5 rounded-full transition-all duration-500 ease-in-out ${
                                isClient && index === currentImageIndex
                                  ? "bg-white w-6"
                                  : isClient && index < currentImageIndex
                                    ? "bg-white w-1.5"
                                    : "bg-white/30 w-1.5"
                              }`}
                              style={{
                                backgroundColor:
                                  !isClient && index === 0
                                    ? "white"
                                    : undefined,
                                width:
                                  !isClient && index === 0 ? "24px" : undefined,
                              }}
                            >
                              <div
                                className={`absolute left-0 top-0 h-full bg-white rounded-full transition-all duration-5000 ease-linear ${
                                  isClient && index === currentImageIndex
                                    ? "w-full"
                                    : "w-0"
                                }`}
                                style={{
                                  transition:
                                    isClient && index === currentImageIndex
                                      ? "width 5s linear"
                                      : "none",
                                  width:
                                    !isClient && index === 0
                                      ? "100%"
                                      : undefined,
                                }}
                              />
                            </div>
                          ))}
                        </div>
                        <div className="text-[14px] flex justify-between text-white/90 font-medium mb-2">
                          {formattedSubcategoryName}
                          <div className="flex items-center gap-1 text-pink-500">
                            <svg
                              className="w-4 h-4 fill-current"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-[14px] font-medium">4.5</span>
                            <span className="text-[14px] font-medium underline">
                              (194)
                            </span>
                          </div>
                        </div>

                        <h2 className="text-[18px] font-bold leading-tight font-halyard-text">
                          {formattedItemName} in {itemCity}
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden md:block">
                <div className="block mt-0">
                  <div className="flex items-center gap-2 mb-0">
                    <div className="flex items-center gap-1"></div>
                  </div>
                  <h1 className="text-[12px] sm:text-[14px] md:text-[17px] font-bold text-[#444444] font-halyard-text-light">
                    <span className="text-[#666666]">
                      {formattedSubcategoryName}
                    </span>
                    <span className="text-[#9F9F9F] mx-1 rounded-full">
                      {" "}
                      •{" "}
                    </span>
                    <span className="text-[#e5006e] md:text-[15px]">NEW</span>
                  </h1>
                  <h2 className="text-[20px] md:text-[32px] font-semibold text-[#222222] font-halyard-text-bold mt-2 mb-4 leading-tight">
                    {formattedItemName} in {itemCity}
                  </h2>
                </div>

                <ImageGallery
                  images={images}
                  itemName={formattedItemName}
                  city={city}
                />
              </div>

              <div className="hidden sm:block md:hidden">
                <div className="block mt-0">
                  <div className="flex items-center gap-2 mb-0">
                    <div className="flex items-center gap-1"></div>
                  </div>
                  <h1 className="text-[14px] font-bold text-[#444444] font-halyard-text-light">
                    <span className="text-[#666666]">
                      {formattedSubcategoryName}
                    </span>
                    <span className="text-[#9F9F9F] mx-1 rounded-full">
                      {" "}
                      •{" "}
                    </span>
                    <span className="text-[#e5006e]">NEW</span>
                  </h1>
                  <h2 className="text-[24px] font-semibold text-[#222222] font-halyard-text-bold mt-2 mb-4 leading-tight">
                    {formattedItemName} in {itemCity}
                  </h2>
                </div>
                <ImageGallery
                  images={images}
                  itemName={formattedItemName}
                  city={city}
                />
              </div>
            </>
          ) : (
            <div>
              <div className="mb-[34px] hidden md:block">
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
                        href={`/things-to-do/worldwide/${categoryName}`}
                      >
                        {formattedCategoryName}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        className="text-[14px] underline font-halyard-text-light text-[#666666]"
                        href={`/things-to-do/worldwide/${categoryName}/${subcategory}`}
                      >
                        {formattedSubcategoryName}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="text-[14px] font-halyard-text-light text-[#666666] truncate max-w-[200px]">
                        {formattedItemName}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </div>
          )}

          <div className="md:mt-10 mt-6" id="checkout-section">
            <div className="md:flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-2/3">
                <div className="mb-8">
                  <ExperienceDetails />
                </div>

                <div className="bg-white rounded-lg">
                  <FaqSection />
                </div>
              </div>

              <div className="hidden md:block w-full lg:w-1/3">
                <div className="lg:sticky lg:top-[160px] space-y-6">
                  <CheckAvailability
                    itemName={formattedItemName}
                    city={itemCity}
                  />
                  <WhyHeadout />
                </div>
              </div>
            </div>

            <div>
              <div className="mb-6 md:mb-10 z-0 mt-6 md:mt-10">
                <CarouselGrid
                  title="Similar experiences you'd love"
                  recommendations={recommendations}
                  variant="subcategory"
                />
              </div>

              <div className="mb-6 md:mb-10 mt-6 md:mt-10">
                <Activities title={`Top Things to do in ${itemCity}`} className="px-[0px]" />
              </div>

              <div className="mb-6 md:mb-15 mt-6 md:mt-10">
                <BrowseThemes
                  title="Browse by themes"
                  themes={currentSubCategory.components.themes || []}
                />
              </div>

              {!isWorldwideRoute && (
                <div className="mb-6 md:mb-15">
                  <Destinations />
                </div>
              )}

              <div className="mb-6 md:mb-10">
                <Banner />
              </div>
              <div className="mb-6 md:mb-10">
                <Stats />
              </div>
            </div>
          </div>
        </div>
      </div>

      {!isModalOpen && (
        <div className="lg:hidden fixed bottom-14 md:bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-7 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className=" text-gray-500 text-sm font-halyard-text">
                <span className="text-gray-500 text-sm font-halyard-text">
                  from
                </span>
                {" "}
                <span className="line-through">€55</span>
              </span>
              <span className="text-[18px] font-halyard-text font-bold text-[#095730]">
                €49.50
              </span>
            </div>
            <button
              onClick={handleMobileCheckAvailability}
              className="w-47 py-3 bg-purple-600 text-white font-semibold font-halyard-text rounded-xl text-[14px] hover:bg-purple-700 transition-colors duration-200"
            >
              Check availability
            </button>
          </div>
        </div>
      )}

      <PhotoGalleryDrawer
        images={images}
        itemName={formattedItemName}
        city={itemCity}
        initialIndex={currentImageIndex}
        isOpen={isGalleryOpen}
        onOpenChange={setIsGalleryOpen}
      />
    </>
  );
};

export default CheckoutPage;
