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

const experiences = [
  {
    id: "ex-1",
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
    id: "ex-2",
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
    id: "ex-3",
    image: "/images/d3.jpg.avif",
    place: "Guadalquivir Cruise",
    rating: 4.5,
    reviews: 5210,
    description: "1‑hour scenic river cruise",
    price: 18,
  },
  {
    id: "ex-4",
    image: "/images/d4.jpg.avif",
    place: "Flamenco Show",
    rating: 4.6,
    reviews: 6632,
    description: "Authentic tablao experience",
    price: 25,
  },
  {
    id: "ex-5",
    image: "/images/d5.jpg.avif",
    place: "City Card",
    rating: 4.3,
    reviews: 2101,
    description: "Multi‑attraction pass for 48h",
    price: 49,
  },
  {
    id: "ex-6",
    image: "/images/d6.jpeg.avif",
    place: "Guided Walking Tour",
    rating: 4.7,
    reviews: 3889,
    description: "Old Town & Jewish Quarter",
    price: 22,
  },
  {
    id: "ex-7",
    image: "/images/d2.jpg.avif",
    place: "Museum of Fine Arts",
    rating: 4.4,
    reviews: 980,
    description: "Entry ticket",
    price: 12,
  },
  {
    id: "ex-8",
    image: "/images/d3.jpg.avif",
    place: "Hop-on Hop-off Bus",
    rating: 4.2,
    reviews: 4312,
    description: "24‑hour ticket with audio guide",
    price: 30,
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
        <div className="pt-16 md:pt-[76px]">
          {!isWorldwideRoute ? (
            <>
              {/* Breadcrumb Section - Hidden on mobile */}
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
                        href="/things-to-do"
                      >
                        Things to do
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
                      <BreadcrumbPage className="text-[14px] font-halyard-text-light text-[#666666]">
                        {formattedItemName}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>

              {/* Mobile Back Button */}
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

              {/* Mobile Layout - Image Background with Overlay Content */}
              <div className="md:hidden relative px-0 -mx-4">
                {/* Background Image Carousel */}
                <div
                  className="relative cursor-pointer"
                  style={{ height: "33vh" }}
                  onClick={handleImageClick}
                >
                  {/* Auto-rotating background images */}
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
                          className="w-full h-full object-contain"
                          style={{ maxHeight: "100%", maxWidth: "100%" }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Gradient overlay that blends into the solid navy section */}
                  <div
                    className="
                      pointer-events-none absolute inset-0
                      bg-gradient-to-b
                      from-transparent from-[35%]
                      via-[#0a174e]/55 via-[75%]
                      to-[#0a174e] to-100%
                    "
                  />

                  {/* Animated progress indicator dots/bars */}
                  <div className="absolute left-4 bottom-[70px] px-1 flex flex-row items-center gap-1.5 z-10">
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
                            !isClient && index === 0 ? "white" : undefined,
                          width: !isClient && index === 0 ? "24px" : undefined,
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
                              !isClient && index === 0 ? "100%" : undefined,
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Bottom Content Overlay - This sits on top of the gradient */}
                  <div
                    className="
                      absolute bottom-0 left-0 right-0 px-5 py-3 text-white
                      bg-gradient-to-t from-[#0a174e] via-[#0a174e]/95 to-transparent
                    "
                  >
                    {/* Subcategory and NEW badge - spaced apart */}
                    <div className="flex justify-between items-center mb-0 font-halyard-text">
                      <span className="text-[14px] text-white/90 font-medium">
                        {formattedSubcategoryName}
                      </span>
                      <span className="text-[14px] bg-transparent text-pink-500 px-2 py-1 rounded font-medium">
                        NEW
                      </span>
                    </div>

                    {/* Thin separator line */}
                    <div className="w-full h-px bg-white/20 mb-1" />

                    {/* Main title */}
                    <h2 className="text-[18px] font-bold leading-tight font-halyard-text">
                      {formattedItemName} in {itemCity}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Desktop Layout - Original Structure */}
              <div className="hidden md:block">
                {/* Subcategory and Item Name Section */}
                <div className="block mt-0">
                  <div className="flex items-center gap-2 mb-0">
                    <div className="flex items-center gap-1">
                      {/* Optional SVG or icons */}
                    </div>
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

                {/* Image Gallery for Item - Desktop only */}
                <ImageGallery
                  images={images}
                  itemName={formattedItemName}
                  city={city}
                />
              </div>

              {/* Tablet Layout - You can customize this for intermediate screen sizes */}
              <div className="hidden sm:block md:hidden">
                {/* Option 2: Use desktop layout for tablets but with adjusted styling */}
                <div className="block mt-0">
                  <div className="flex items-center gap-2 mb-0">
                    <div className="flex items-center gap-1">
                      {/* Optional SVG or icons */}
                    </div>
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
              {/* Only Breadcrumb for Worldwide Routes */}
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
                      <BreadcrumbPage className="text-[14px] font-halyard-text-light text-[#666666]">
                        {formattedItemName}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </div>
          )}

          <div className="md:mt-10 mt-6" id="checkout-section">
            {/* Checkout Section - Features, FAQs, and Sticky Right Section */}
            {/* Desktop/Tablet Only: Features, FAQs, and Sticky Right Section */}
            <div className="md:flex flex-col lg:flex-row gap-8">
              {/* Left Content - Features and FAQs */}
              <div className="w-full lg:w-2/3">
                {/* Features Section */}
                <div className="mb-8">
                  <ExperienceDetails />
                </div>

                {/* FAQ Section */}
                <div className="bg-white rounded-lg">
                  <FaqSection />
                </div>
              </div>

              {/* Sticky Right Section */}
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

            {/* Additional Content Section */}
            <div>
              {/* Similar Experiences Section */}
              <div className="mb-6 md:mb-10 mt-6 md:mt-10">
                <Recommendations />
              </div>

              {/* Things to do in city */}
              <div className="mb-6 md:mb-10 mt-6 md:mt-10">
                <Activities title={`Top Things to do in ${itemCity}`} />
              </div>

              {/* Browse Themes Section */}
              <div className="mb-6 md:mb-10 mt-6 md:mt-10">
                <BrowseThemes
                  title="Browse by themes"
                  themes={currentSubCategory.components.themes || []}
                />
              </div>

              {/* Nearby Cities and Stats */}
              {!isWorldwideRoute && (
                <div className="mb-6 md:mb-10">
                  <CarouselGrid
                    title="Explore world's top destinations"
                    variant="simple"
                    recommendations={destinations}
                  />
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

      {/* Mobile Sticky Bottom Bar - Conditionally Rendered */}
      {!isModalOpen && (
        <div className="lg:hidden fixed bottom-14 md:bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-7 py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Price section */}
            <div className="flex flex-col">
              <span className="line-through text-gray-500 text-sm font-halyard-text">
                €55
              </span>
              <span className="text-xl font-halyard-text font-bold text-green-600">
                €49.50
              </span>
            </div>
            {/* Check availability button */}
            <button
              onClick={handleMobileCheckAvailability}
              className="w-47 py-3 bg-purple-600 text-white font-semibold font-halyard-text rounded-xl text-[14px] hover:bg-purple-700 transition-colors duration-200"
            >
              Check availability
            </button>
          </div>
        </div>
      )}

      {/* Photo Gallery Drawer */}
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
