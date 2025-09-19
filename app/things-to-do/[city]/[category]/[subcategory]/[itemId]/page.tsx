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
import { fetchExperienceById } from "@/api/expereince/expereince-api";
import { ExperienceResponse } from "@/types/experience/experience-types";
import { fetchReviewsById } from "@/api/reviews/review-api";
import { Reviews } from "@/types/reviews/review-types";
import { fetchCityBycityName } from "@/api/cities/cities-api";
import { fetchCategoryBycategoryName } from "@/api/category/category-api";
import { fetchSubcategoryPageById } from "@/api/subcategory-page/subcategory-page-api";
import { SubcategoryPageData } from "@/types/subcategory-page/subcategory-page-types";

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
  const [subcategoryPageData, setSubcategoryPageData] = useState<SubcategoryPageData | null>(null);

  const currentExperience = experiences.find((exp) => exp.id === itemId);

  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [experience, setExperience] = useState<ExperienceResponse | null>(null);
  const [reviews, setReviews] = useState<Reviews | null>(null);
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
  useEffect(() => {
    const loadSubcategoryPageData = async () => {
      if (!city || !categoryName || !subcategory) return;

      try {
        const cityData = await fetchCityBycityName(city)
        const categoryData = await fetchCategoryBycategoryName(categoryName)
        const response = await fetchSubcategoryPageById(cityData._id, categoryData._id, subcategory);
        setSubcategoryPageData(response.data);
      } catch (err) {
        console.error('Error loading subcategory page data:', err);
      }
    };

    loadSubcategoryPageData();
  }, [city, categoryName, subcategory]);
  const transformApiExperiencesToRecommendations = (apiExperiences: any[]) => {
    if (!apiExperiences || !Array.isArray(apiExperiences)) {
      return [];
    }
    return apiExperiences.map(exp => ({
      id: exp._id,
      description: exp.basicInfo?.title || exp.description || '',
      place: exp.basicInfo?.tagOnCards || exp.place || '',
      image: exp.basicInfo?.mainImage?.[0] || exp.image || "/images/default.jpg",
      price: exp.basicInfo?.price || exp.price || 0,
      oldPrice: exp.basicInfo?.oldPrice || exp.oldPrice,
      off: exp.basicInfo?.sale || exp.off,
      rating: 4.5, // Default since not in API structure
      reviews: Math.floor(Math.random() * 5000) + 1000, // Random reviews
      badge: exp.basicInfo?.tagOnCards || exp.badge || "Free cancellation"
    }));
  };
useEffect(() => {
  const fetchExperience = async () => {
    const experience = await fetchExperienceById(itemId);
    const reviews = await fetchReviewsById(itemId);

    // Add HTML FAQ sections to the API response
    const enhancedExperience = {
      ...experience,
      data: {
        ...experience.data,
        reviews: reviews ? [reviews] : [],
        faqSections: {
          highlights: `
            <p>Experience the stunning beauty and rich history of Seville's Royal Alcázar on this comprehensive guided tour.</p>
            <ul>
              <li>Skip the long entry lines with priority access</li>
              <li>Explore the magnificent Mudéjar architecture and royal chambers</li>
              <li>Discover the beautiful gardens and courtyards</li>
              <li>Learn about centuries of Spanish royal history</li>
            </ul>
          `,
          inclusions: `
            <ul>
              <li>Skip-the-line entry to Alcázar of Seville</li>
              <li>Professional English-speaking guide</li>
              <li>Small group tour (maximum 20 people)</li>
              <li>Access to royal chambers and gardens</li>
            </ul>
          `,
          exclusions: `
            <ul>
              <li>Hotel pickup and drop-off</li>
              <li>Food and beverages</li>
              <li>Gratuities (optional)</li>
              <li>Access to Royal High Room (additional fee applies)</li>
            </ul>
          `,
          cancellationPolicy: `
            <p><strong>Free cancellation up to 24 hours before the experience</strong></p>
            <p>Get a full refund if you cancel at least 24 hours in advance.</p>
            <p><strong>Cancellation timeline:</strong></p>
            <ul>
              <li>24+ hours before: Full refund</li>
              <li>Less than 24 hours: No refund</li>
              <li>No-show: No refund</li>
            </ul>
            <p><em>Weather-related cancellations by the operator will result in a full refund or alternative date.</em></p>
          `,
          yourExperience: `
            <h3>Step into Spanish Royal History</h3>
            <p>Begin your journey at the main entrance where your expert guide will meet you with skip-the-line tickets. No waiting in long queues - dive straight into centuries of fascinating history.</p>

            <h3>Explore Magnificent Architecture</h3>
            <p>Marvel at the intricate Mudéjar architecture as you walk through the royal chambers. Your guide will share stories of the kings and queens who once called this palace home, bringing the walls to life with tales of romance, intrigue, and power.</p>

            <h3>Discover Hidden Gardens</h3>
            <p>End your tour in the breathtaking gardens, where you'll have time to explore the peaceful courtyards, fountains, and orange groves. Perfect for photos and quiet reflection on this unforgettable experience.</p>
          `,
          knowBeforeYouGo: `
            <h3>What to bring</h3>
            <ul>
              <li>Valid passport or ID card for entry verification</li>
              <li>Comfortable walking shoes (lots of walking involved)</li>
              <li>Water bottle (especially during summer months)</li>
              <li>Camera for photos (no flash allowed inside)</li>
            </ul>

            <h3>What's not allowed</h3>
            <ul>
              <li>Large bags or backpacks (storage not available)</li>
              <li>Flash photography inside the palace</li>
              <li>Food and drinks (water bottles are permitted)</li>
              <li>Selfie sticks and tripods</li>
              <li>Pets (except service animals with documentation)</li>
            </ul>

            <h3>Accessibility</h3>
            <p>The Alcázar has limited wheelchair accessibility due to its historical nature. Some areas may be challenging to access. Please contact us in advance if you have mobility concerns.</p>
          `,
          myTickets: `
            <p><strong>Instant Confirmation</strong></p>
            <p>Your voucher will be emailed to you immediately after booking. Check your spam folder if you don't see it within a few minutes.</p>

            <h3>How to use your ticket</h3>
            <ol>
              <li>Show your mobile voucher or printed ticket at the meeting point</li>
              <li>Present a valid photo ID along with your ticket</li>
              <li>Arrive 15 minutes before your scheduled time</li>
            </ol>

            <p><strong>Meeting Point:</strong> Main entrance of the Royal Alcázar, Patio de Banderas. Look for your guide holding a sign with our company logo.</p>
          `
        }
      }
    };

    setExperience(enhancedExperience);
  };
  fetchExperience();
}, [itemId]);
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

  const images = experience?.data.images || [ ];


  useEffect(() => {
    setIsClient(true);
    // Simple scroll to top on mount
    window.scrollTo(0, 0);
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
        <CheckoutNav experience={experience} />
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
                        {experience?.data.title}
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
                          {experience?.data.title} in {itemCity}
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
                    {experience?.data.title} in {itemCity}
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
                    {experience?.data.title} in {itemCity}
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
                        {experience?.data.title}
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
                  {experience && (
                    <ExperienceDetails experience={experience} />
                  )}
                </div>

                <div className="bg-white rounded-lg">
                  <FaqSection  experience={experience}/>
                </div>
              </div>

              <div className="hidden md:block w-full lg:w-1/3">
                <div className="lg:sticky lg:top-[160px] space-y-6">
                  <CheckAvailability
                    itemName={formattedItemName}
                    city={itemCity}
                    experience={experience || undefined}
                  />
                  <WhyHeadout />
                </div>
              </div>
            </div>

            <div>
              <div className="mb-6 md:mb-10 z-0 mt-6 md:mt-10" data-carousel-grid>
                <CarouselGrid
                  title="Similar experiences you'd love"
                  recommendations={transformApiExperiencesToRecommendations(subcategoryPageData?.experiences || [])}
                  variant="subcategory"
                />
              </div>

              <div className="mb-6 md:mb-10 mt-6 md:mt-10">
                <Activities title={`Top Things to do in ${itemCity}`} className="px-[0px]" />
              </div>

              <div className="mb-6 md:mb-15 mt-6 md:mt-10">
                <BrowseThemes
                  title="Browse by themes"
                  themes={subcategoryPageData?.category.subcategories.map(sub => ({
                    icon: Landmark,
                    text: sub,
                    href: `/things-to-do/${city}/${categoryName}/${sub.toLowerCase().replace(/\s+/g, '-')}`
                  })) || currentSubCategory.components.themes || []}                />
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
