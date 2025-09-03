"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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

interface Experience {
  _id: string;
  title: string;
  price: string;
  images: string[];
  mainImage: string;
}

interface City {
  _id: string;
  cityName: string;
  slug: string;
}

export default function SubcategoryPage() {
  const params = useParams();
  const city = params.city as string;
  const categoryName = params.category as string;
  const subcategory = params.subcategory as string;

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const fetchExperiences = async () => {
      if (!city || !categoryName || !subcategory) return;

      try {
        setLoading(true);

        const citiesRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/cities`
        );
        if (!citiesRes.ok) throw new Error("Failed to fetch cities.");
        const citiesResult = await citiesRes.json();

        if (!citiesResult.success || !Array.isArray(citiesResult.data)) {
          throw new Error("Invalid city data format.");
        }

        const cityData = citiesResult.data.find(
          (c: any) => c.cityName.replace(/\s+/g, "-").toLowerCase() === city
        );

        if (!cityData) {
          throw new Error(`City '${city}' not found.`);
        }
        const cityId = cityData._id;

        const expRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/experiences/by-city-category-subcategory/${cityId}/${categoryName}/${subcategory}`
        );
        if (!expRes.ok)
          throw new Error("Failed to fetch experiences for this subcategory.");

        const expResult = await expRes.json();
        if (expResult.success) {
          const formattedExperiences = expResult.data.map((exp: any) => ({
            id: exp._id,
            image: exp.mainImage
              ? `/api/images/${exp.mainImage}`
              : "/images/d1.jpg.avif",
            place: cityData.cityName,
            rating: 4.5,
            reviews: 100,
            description: exp.title,
            price: parseFloat(exp.price) || 0,
            badge: exp.tagOnCards,
            cancellation: exp.cancellationPolicy,
          }));
          setExperiences(formattedExperiences);
        } else {
          throw new Error(expResult.message || "Could not fetch experiences.");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, [city, categoryName, subcategory]);

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

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="hidden md:block fixed md:top-19 bg-[#fff] w-full py-3 z-40 border-b">
        <div className="max-w-[1200px] mx-auto px-[24px] xl:px-0">
          <CategoriesDropdown
            showCategoriesDropdown={showCategoriesDropdown}
            setShowCategoriesDropdown={setShowCategoriesDropdown}
            setShowBanner={setShowBanner}
          />
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
                      4.3
                    </span>
                    <span className="text-[#e5006e] text-[17px] font-halyard-text">
                      (151,002)
                    </span>
                  </div>
                </div>
                <h1 className="text-[21px] md:text-[30px] font-bold text-[#444444] font-halyard-text">
                  {getDynamicHeading()}
                </h1>
              </div>

              <div className="block mt-5">
                <SubcategoryNavigation
                  categoryName={formattedCategoryName}
                  currentSubcategory={subcategory}
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
                      4.3
                    </span>
                    <span className="text-[#e5006e] text-[17px] font-halyard-text">
                      (151,002)
                    </span>
                  </div>
                </div>
                <h1 className="text-[21px] md:text-[30px] font-bold text-[#444444] font-halyard-text">
                  {currentSubCategory.heading}
                </h1>
              </div>
            </div>
          )}
          <div className="md:mt-10 mt-0">
            <div className="md:mt-10 mt-0">
              <CarouselGrid
                title={`Top experiences in ${formattedCityName}`}
                variant="subcategory"
                navigationItems={navItems}
                recommendations={experiences}
                initialSelectedId={configKey}
              />
            </div>

            <div className="mb-10 mt-10">
              <CarouselGrid
                title={`Travel Guide and Tips for ${formattedCityName}`}
                variant="transport"
                recommendations={guides}
              />
            </div>
            <div className="mb-10 mt-10 ">
              <BrowseThemes
                title="Browse by themes"
                themes={currentSubCategory.components.themes || []}
              />
            </div>
            {!isWorldwideRoute && (
              <div className="mb-10">
                <CarouselGrid
                  title="Nearby cities to explore"
                  variant="simple"
                  recommendations={destinations}
                />
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
