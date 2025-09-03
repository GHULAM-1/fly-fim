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
import ReviewsSection from "@/components/detail/ReviewsSection";

interface Experience {
  _id: string;
  title: string;
  price: string;
  sale: string;
  images: string[];
  mainImage: string;
  highlights: string;
  inclusions: string;
  exclusions: string;
  cancellationPolicy: string;
  knowBeforeYouGo: string;
  myTickets: string;
  operatingHours: any[];
  whereTo: { address: string; lat: number; lng: number };
  tagOnCards: string;
}

interface Faq {
  _id: string;
  question: string;
  answer: string;
}

interface Review {
  _id: string;
  userId: string;
  stars: number;
  text: string;
  images: string[];
  _creationTime: number;
}

const CheckoutPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const city = params.city as string;
  const categoryName = params.category as string;
  const subcategory = params.subcategory as string;
  const itemId = params.itemId as string;
  const { isModalOpen } = useNavigationStore();

  const [currentExperience, setCurrentExperience] = useState<Experience | null>(
    null
  );
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [recommendations, setRecommendations] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (itemId) {
      const fetchAllData = async () => {
        try {
          setLoading(true);

          const [expResponse, faqResponse, reviewResponse] = await Promise.all([
            fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/experiences/${itemId}`
            ),
            fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/faqs/experience/${itemId}`
            ),
            fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/reviews/experience/${itemId}`
            ),
          ]);

          if (!expResponse.ok)
            throw new Error("Failed to fetch experience data.");

          const expResult = await expResponse.json();
          if (expResult.success) {
            setCurrentExperience(expResult.data);
          } else {
            throw new Error(expResult.message || "Could not find experience.");
          }

          const faqResult = await faqResponse.json();
          if (faqResult.success) setFaqs(faqResult.data);

          const reviewResult = await reviewResponse.json();
          if (reviewResult.success) setReviews(reviewResult.data);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "An unknown error occurred"
          );
        } finally {
          setLoading(false);
        }
      };
      fetchAllData();
    }
  }, [itemId]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!city || !categoryName || !subcategory) return;

      try {
        const citiesRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/cities`
        );
        const citiesResult = await citiesRes.json();
        const cityData = citiesResult.data.find(
          (c: any) => c.cityName.replace(/\s+/g, "-").toLowerCase() === city
        );
        if (!cityData) return;

        const recRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/experiences/by-city-category-subcategory/${cityData._id}/${categoryName}/${subcategory}?limit=5`
        );
        const recResult = await recRes.json();

        if (recResult.success) {
          const filteredRecs = recResult.data.filter(
            (exp: Experience) => exp._id !== itemId
          );
          setRecommendations(filteredRecs);
        }
      } catch (e) {
        console.error("Failed to fetch recommendations:", e);
      }
    };

    if (currentExperience) {
      fetchRecommendations();
    }
  }, [currentExperience, city, categoryName, subcategory, itemId]);

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
    currentExperience?.title ||
    decodeURIComponent(itemId ? itemId.split("-").join(" ") : "Item");

  const itemCity = formattedCityName;

  const configKey = decodedSubcategoryName.toLowerCase().replace(/\s+/g, "-");

  const handleMobileCheckAvailability = () => {
  };

  const getDynamicHeading = (): string => {
    return "Experience Details";
  };

  const subCategoryConfig = {
    default: {
      name: "Default Subcategory",
      description: "Description for the default subcategory.",
    },
  };
  const currentSubCategory = subCategoryConfig.default;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const experienceImages = currentExperience?.images?.length
    ? currentExperience.images.map(
        (id) => `https://sincere-roadrunner-227.convex.cloud/api/storage/${id}`
      )
    : ["/images/tickets-included-01.avif"];

  useEffect(() => {
    if (!isClient) return;
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % experienceImages.length
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [experienceImages.length, isClient]);

  const handleImageClick = () => {
    setIsGalleryOpen(true);
  };

  if (loading)
    return <div className="pt-40 text-center">Loading Experience...</div>;
  if (error)
    return <div className="pt-40 text-center text-red-500">Error: {error}</div>;
  if (!currentExperience)
    return <div className="pt-40 text-center">Experience not found.</div>;

  return (
    <>
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 xl:px-0 md:mt-5">
        <div className="pt-16 md:pt-[76px]">
          <ImageGallery
            images={experienceImages}
            itemName={formattedItemName}
            city={city}
          />

          <div className="md:mt-10 mt-6" id="checkout-section">
            <div className="md:flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-2/3">
                <div className="mb-8">
                  <ExperienceDetails />
                </div>
                <div className="bg-white rounded-lg">
                  <FaqSection experience={currentExperience} faqs={faqs} />
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
              <div className="mb-6 md:mb-10 mt-6 md:mt-10">
                <ReviewsSection reviews={reviews} />
              </div>
              <div className="mb-6 md:mb-10 mt-6 md:mt-10">
                <Recommendations recommendations={recommendations} />
              </div>
              <div className="mb-6 md:mb-10 mt-6 md:mt-10">
                <Activities title={`Top Things to do in ${itemCity}`} />
              </div>
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

      <PhotoGalleryDrawer
        images={experienceImages}
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
