"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchSubcategoryPageById } from "@/api/subcategory-page/subcategory-page-api";
import { SubcategoryPageData } from "@/types/subcategory-page/subcategory-page-types";
import { fetchCityBycityName } from "@/api/cities/cities-api";
import { fetchCategoryBycategoryName } from "@/api/category/category-api";
import CategoriesDropdown from "@/components/category/CategoriesDropdown";
import SubcategoryNavigation from "@/components/category/SubcategoryNavigation";
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
import Destinations from "@/components/home/Destinations";

export default function SubcategoryPage() {
  const params = useParams();
  const city = params.city as string;
  const categoryName = params.category as string;
  const subcategory = params.subcategory as string;

  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  // API state
  const [subcategoryPageData, setSubcategoryPageData] = useState<SubcategoryPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isWorldwideRoute = city === "worldwide";

  const decodedCategoryName = decodeURIComponent(
    categoryName ? categoryName.split("-").join(" ") : ""
  );
  const decodedCity = decodeURIComponent(city);

  const formattedCategoryName = decodedCategoryName
    ? decodedCategoryName.charAt(0).toUpperCase() + decodedCategoryName.slice(1)
    : "Category";

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

  const configKey = decodedSubcategoryName.toLowerCase().replace(/\s+/g, "-");

  const getDynamicHeading = (): string => {
    const cityFormatted = formattedCityName;

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
              { icon: BadgePercent, text: "Religious Site Tickets", href: "#" },
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
        museums: {
          heading: `Museums in ${city.charAt(0).toUpperCase() + city.slice(1)}`,
          components: {
            themes: [
              { icon: Ticket, text: "Museum Tickets", href: "#" },
              { icon: BadgePercent, text: "Religious Site Tickets", href: "#" },
              { icon: Landmark, text: "Landmark Tickets", href: "#" },
              { icon: SunMedium, text: "Zoo Tickets", href: "#" },
              { icon: Ship, text: "City Cards", href: "#" },
              { icon: Leaf, text: "Theme Park Tickets", href: "#" },
            ],
          },
        },
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
      subcategoryId: navItems[0]?.id ?? "landmarks",
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
      subcategoryId: navItems[0]?.id ?? "landmarks",
    },
    {
      id: "guadalquivir-cruise",
      image: "/images/d3.jpg.avif",
      place: "Guadalquivir Cruise",
      rating: 4.5,
      reviews: 5210,
      description: "1‑hour scenic river cruise",
      price: 18,
      subcategoryId: navItems[3]?.id ?? "hop-on-hop-off-tours",
    },
    {
      id: "flamenco-show-tablao",
      image: "/images/d4.jpg.avif",
      place: "Flamenco Show",
      rating: 4.6,
      reviews: 6632,
      description: "Authentic tablao experience",
      price: 25,
      subcategoryId: navItems[2]?.id ?? "dance-shows",
    },
    {
      id: "city-card-seville",
      image: "/images/d5.jpg.avif",
      place: "City Card",
      rating: 4.3,
      reviews: 2101,
      description: "Multi‑attraction pass for 48h",
      price: 49,
      subcategoryId: navItems[1]?.id ?? "combo-tickets",
    },
    {
      id: "guided-walking-tour-seville",
      image: "/images/d6.jpeg.avif",
      place: "Guided Walking Tour",
      rating: 4.7,
      reviews: 3889,
      description: "Old Town & Jewish Quarter",
      price: 22,
      subcategoryId: navItems[2]?.id ?? "guided-tours",
    },
    {
      id: "museum-fine-arts-seville",
      image: "/images/d2.jpg.avif",
      place: "Museum of Fine Arts",
      rating: 4.4,
      reviews: 980,
      description: "Entry ticket",
      price: 12,
      subcategoryId: navItems[0]?.id ?? "landmarks",
    },
    {
      id: "hop-on-hop-off-bus-seville",
      image: "/images/d3.jpg.avif",
      place: "Hop-on Hop-off Bus",
      rating: 4.2,
      reviews: 4312,
      description: "24‑hour ticket with audio guide",
      price: 30,
      subcategoryId: navItems[3]?.id ?? "hop-on-hop-off-tours",
    },
    {
      id: "museum-fine-arts-seville",
      image: "/images/d2.jpg.avif",
      place: "Museum of Fine Arts",
      rating: 4.4,
      reviews: 980,
      description: "Entry ticket",
      price: 12,
      subcategoryId: navItems[0]?.id ?? "landmarks",
    },
    {
      id: "hop-on-hop-off-bus-seville",
      image: "/images/d3.jpg.avif",
      place: "Hop-on Hop-off Bus",
      rating: 4.2,
      reviews: 4312,
      description: "24‑hour ticket with audio guide",
      price: 30,
      subcategoryId: navItems[3]?.id ?? "hop-on-hop-off-tours",
    },
  ];
  // Transform API experiences to recommendations format
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

  const guides = [
    {
      id: 1,
      description:
        "Vatican City is a special place. It may not be the biggest in size but what it holds within its walls is truly unrivalled in scale and significance. From the breathtaking Sistine Chapel to the vast collections of the Vatican Museums, every corner tells a story of art, history, and faith.",
      heading: "Explore the best of Vatican with these guided tours and tips",
      image: "/images/van.avif",
      city: "Vatican City",
    },
    {
      id: 2,
      description:
        "Discover the hidden gems and iconic landmarks that make Rome the eternal city. From the ancient Colosseum to the romantic Trevi Fountain, experience the perfect blend of history, culture, and modern Italian life.",
      heading: "Uncover the secrets of Rome with expert local guides",
      image: "/images/van.avif",
      city: "Rome",
    },
    {
      id: 3,
      description:
        "Experience the magic of Paris through carefully curated tours that reveal the city's artistic soul. From the Louvre's masterpieces to the charming streets of Montmartre, discover why Paris continues to captivate visitors.",
      heading: "Experience the magic of Paris through curated tours and tips",
      image: "/images/van.avif",
      city: "Paris",
    },
    {
      id: 4,
      description:
        "Immerse yourself in the rich cultural heritage of London with guided experiences that bring history to life. From the Tower of London to Buckingham Palace, explore the stories behind Britain's most iconic landmarks.",
      heading: "Immerse yourself in London's rich cultural heritage",
      image: "/images/van.avif",
      city: "London",
    },
    {
      id: 5,
      description:
        "Discover the perfect blend of tradition and innovation in Tokyo. From ancient temples to cutting-edge technology, experience the unique culture that makes Japan's capital a must-visit destination.",
      heading: "Discover Tokyo's perfect blend of tradition and innovation",
      image: "/images/van.avif",
      city: "Tokyo",
    },
    {
      id: 6,
      description:
        "Explore the vibrant energy of New York City through guided tours that showcase its diverse neighborhoods, world-class museums, and iconic skyline. Experience the city that never sleeps like a true New Yorker.",
      heading: "Explore New York City's vibrant energy and diversity",
      image: "/images/van.avif",
      city: "New York",
    },
  ];

  // API call effect
  useEffect(() => {
    const loadSubcategoryPageData = async () => {
      if (!city || !categoryName || !subcategory) return;

      try {
        setLoading(true);
        setError(null);

        console.log('Fetching city and category IDs:', { city, categoryName, subcategory });

        // First, get city ID by city name
        const cityData = await fetchCityBycityName(city);
        console.log('City data received:', cityData);

        // Second, get category ID by category name
        const categoryData = await fetchCategoryBycategoryName(categoryName);
        console.log('Category data received:', categoryData);

        // Finally, fetch subcategory page data using IDs
        console.log('Fetching subcategory page data with IDs:', {
          cityId: cityData._id,
          categoryId: categoryData._id,
          subcategory
        });
        const response = await fetchSubcategoryPageById(cityData._id, categoryData._id, subcategory);
        console.log('Subcategory page data received:', response);
        setSubcategoryPageData(response.data);
      } catch (err) {
        console.error('Error loading subcategory page data:', err);
        setError('Failed to load subcategory page data');
      } finally {
        setLoading(false);
      }
    };

    loadSubcategoryPageData();
  }, [city, categoryName, subcategory]);

  // Show loading state
  if (loading) {
    return <div className="max-w-[1200px] mx-auto px-[24px] xl:px-0 py-20 text-center">Loading...</div>;
  }

  // Show error state
  if (error) {
    return <div className="max-w-[1200px] mx-auto px-[24px] xl:px-0 py-20 text-center text-red-600">{error}</div>;
  }

  return (
    <>
      <div className="hidden md:block fixed md:top-19 bg-[#fff] w-full py-3 z-40 border-b">
        <div className="max-w-[1200px] mx-auto px-[24px] xl:px-0">
          {subcategoryPageData && (
            <CategoriesDropdown
              categories={subcategoryPageData.allCategories.map(category => ({
                categoryName: category.categoryName,
                subcategories: category.subcategories.map(sub => ({
                  subcategoryName: sub.subcategoryName
                }))
              }))}
              topExperiences={subcategoryPageData.allCategories
                .flatMap(category =>
                  category.subcategories.flatMap(sub => sub.experiences)
                )
                .slice(0, 15)
              }
              showCategoriesDropdown={showCategoriesDropdown}
              setShowCategoriesDropdown={setShowCategoriesDropdown}
              setShowBanner={setShowBanner}
            />
          )}
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
          {!isWorldwideRoute ? (
            <>
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
                      <BreadcrumbPage className="text-[14px] font-halyard-text-light text-[#666666]">
                        {formattedSubcategoryName}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
              <div className="block mt-0">
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
                      {subcategoryPageData?.reviewStats.averageRating.toFixed(1) || '4.3'}
                    </span>
                    <span className="text-[#e5006e] text-[17px] font-halyard-text">
                      ({subcategoryPageData?.reviewStats.totalReviews.toLocaleString() || '151,002'})
                    </span>
                  </div>
                </div>
                <h1 className="text-[21px] md:text-[30px] font-bold text-[#444444] font-halyard-text">
                  {getDynamicHeading()}
                </h1>
              </div>

              <div className="block mt-5">
                <SubcategoryNavigation
                  categoryName={subcategoryPageData?.category.categoryName || decodedCategoryName}
                  currentSubcategory={subcategory}
                  subcategories={subcategoryPageData?.category.subcategories || []}
                />
              </div>
            </>
          ) : (
            <div>
              <div className="mb-[34px]">
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
                      <BreadcrumbPage className="text-[14px] font-halyard-text-light text-[#666666]">
                        {formattedSubcategoryName}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
              <div className="md:block hidden mt-0">
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
                    {subcategoryPageData?.reviewStats.averageRating.toFixed(1) || '4.3'}
                    </span>
                    <span className="text-[#e5006e] text-[17px] font-halyard-text">
                      ({subcategoryPageData?.reviewStats.totalReviews.toLocaleString() || '151,002'})
                    </span>
                  </div>
                </div>
                <h1 className="text-[21px] md:text-[30px] font-bold text-[#444444] font-halyard-text">
                  {currentSubCategory.heading}
                </h1>
              </div>
            </div>
          )}
          <div className=" mt-0">
            <div className=" mt-0">
              {subcategoryPageData?.experiences && subcategoryPageData.experiences.length > 0 ? (
                <CarouselGrid
                  title={`Top experiences in ${formattedCityName}`}
                  variant="pills"
                  pills={false}
                  recommendations={transformApiExperiencesToRecommendations(subcategoryPageData.experiences)}
                />
              ) : (
                <div className="text-center py-20">
                  <h2 className="text-2xl font-semibold text-gray-600 mb-2">Coming Soon...</h2>
                  <p className="text-gray-500">We're working on adding amazing experiences for this category.</p>
                </div>
              )}
            </div>

            <div className="mb-10 mt-5">
              <CarouselGrid
                title={`Travel Guide and Tips for ${formattedCityName}`}
                variant="transport"
                recommendations={guides}
              />
            </div>
            <div className="mb-10 mt-10 ">
              <BrowseThemes
                title="Browse by themes"
                themes={subcategoryPageData?.category.subcategories.map(sub => ({
                  icon: Landmark,
                  text: sub,
                  href: `/things-to-do/${city}/${categoryName}/${sub.toLowerCase().replace(/\s+/g, '-')}`
                })) || currentSubCategory.components.themes || []}
              />
            </div>
            {!isWorldwideRoute && (
              <div className="mb-15 mt-5">
                <Destinations />
              </div>
            )}

            <div className="mb-10">
              <Banner />
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
