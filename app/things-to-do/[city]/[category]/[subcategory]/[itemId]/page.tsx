'use client';
import React, { useState } from "react";
import { useParams } from "next/navigation";
import CategoriesDropdown from "@/components/category/CategoriesDropdown";
import ImageGallery from "@/components/checkout/gallery"; 
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
  Bus
} from "lucide-react";
import CarouselGrid from "@/components/grids/CarouselGrid";
import BrowseThemes from "@/components/tickets/BrowseThemes";
import Stats from "@/components/home/Stats";

export default function CheckoutPage() {
  const params = useParams();
  const city = params.city as string;
  const categoryName = params.category as string;
  const subcategory = params.subcategory as string;
  const itemId = params.itemId as string;

  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  const isWorldwideRoute = city === "worldwide";

  // Decode and format category
  const decodedCategoryName = decodeURIComponent(
    categoryName ? categoryName.split("-").join(" ") : ""
  );
  const formattedCategoryName = decodedCategoryName
    ? decodedCategoryName.charAt(0).toUpperCase() +
      decodedCategoryName.slice(1)
    : "Category";

      // Decode URL-encoded characters first, then process
  const decodedCity = decodeURIComponent(city);

  // Format city name properly (for display)
  const formattedCityName = decodedCity
  ? decodedCity.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  : "City";

  // Decode and format subcategory
  const decodedSubcategoryName = decodeURIComponent(
    subcategory ? subcategory.split("-").join(" ") : ""
  );
  const formattedSubcategoryName = decodedSubcategoryName
    ? decodedSubcategoryName.charAt(0).toUpperCase() +
      decodedSubcategoryName.slice(1)
    : "Subcategory";

  // Decode and format item
  const decodedItemName = decodeURIComponent(
    itemId ? itemId.split("-").join(" ") : ""
  );
  const formattedItemName = decodedItemName
    ? decodedItemName.charAt(0).toUpperCase() +
      decodedItemName.slice(1)
    : "Item";

  // Convert to lowercase hyphenated for config key
  const configKey = decodedSubcategoryName.toLowerCase().replace(/\s+/g, "-");

  // Dynamic heading logic based on subcategory
  const getDynamicHeading = (): string => {
    const cityFormatted = city.charAt(0).toUpperCase() + city.slice(1);
    
    if (subcategory) {
      // If we have a subcategory, format it as "Subcategory in City"
      return `${formattedSubcategoryName} in ${cityFormatted}`;
    } else {
      // If no subcategory (shouldn't happen on this page, but fallback)
      return `${formattedCategoryName} in ${cityFormatted}`;
    }
  };

  // Comprehensive subcategory configuration - conditional based on worldwide vs city-specific
  const subCategoryConfig = isWorldwideRoute
    ? {
        // WORLDWIDE CONFIGURATION (placeholders mimicking category structure)
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
        // Add more as needed, default for others
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
        // Add more as needed, default for others
        default: {
            heading: getDynamicHeading(),
            components: {
                themes: [
                { icon: Landmark, text: `Landmarks in ${formattedCityName}`, href: "#" },
                { icon: Ticket, text: `Combo Tickets in ${formattedCityName}`, href: "#" },
                { icon: Users, text: `Guided Tours in ${formattedCityName}`, href: "#" },
                { icon: Music, text: `Dance Shows in ${formattedCityName}`, href: "#" },
                { icon: Bus, text: `Hop-on Hop-off Tours in ${formattedCityName}`, href: "#" },
                { icon: SunMedium, text: `${formattedCityName} Attractions`, href: "#" },
                { icon: Ship, text: `Guadalquivir River Cruises`, href: "#" },
                ],
            },
        },
      };

  // Get current subcategory configuration
  const currentSubCategory =
    subCategoryConfig[configKey as keyof typeof subCategoryConfig] ||
    subCategoryConfig.default;

  // Early return if no subcategory found
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
    "/images/tickets-included-06.avif",
  ];

  // Build navigation items from current subcategory config
  const navItems =
    (currentSubCategory.components.themes || []).map((t: any) => {
      const id =
        (t.text || "")
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9\-]/g, "");
      return {
        id,
        label: t.text,
        icon: t.icon,
      };
    }) || [];

return (
  <>
    <div className="max-w-[1200px] mx-auto px-[24px] xl:px-0 md:mt-5 ">
      <div className="pt-[76px]">
        {!isWorldwideRoute ? (
          <>
            {/* Breadcrumb Section */}
            <div className="mb-[14px] md:block hidden">
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

            {/* Subcategory and Item Name Section */}
            <div className="md:block hidden mt-0">
              <div className="flex items-center gap-2 mb-0">
                <div className="flex items-center gap-1">
                  {/* Optional SVG or icons */}
                </div>
              </div>
              <h1 className="text-[12px] sm:text-[14px] md:text-[17px] font-bold text-[#444444] font-halyard-text-light">
                <span className="text-[#666666]">{formattedSubcategoryName}</span>
                <span className="text-[#9F9F9F] mx-1 rounded-full"> • </span>
                <span className="text-[#e5006e] md:text-[15px]">NEW</span>
              </h1>
              <h2 className="text-[18px] md:text-[32px] font-semibold text-[#222222] font-halyard-text-bold mt-2 mb-4">
                {formattedItemName} in {formattedCityName}
              </h2>
            </div>

            {/* Image Gallery for Item */}
            <ImageGallery images={images} itemName={formattedItemName} city={city} />
          </>
        ) : (
          <div>
            {/* Only Breadcrumb for Worldwide Routes */}
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

        {/* Checkout Section */}
        <div className="md:mt-10 mt-0">
          <div className="p-8 border rounded-lg shadow mb-10">
            <h2 className="text-xl font-bold mb-4">Checkout Details</h2>
            <p className="text-lg">
              You're now at the checkout page of <span className="font-semibold">{formattedItemName}</span>{" "}
              <br />
              in category <span className="font-semibold">{formattedCategoryName}</span> <br />
              in subcategory <span className="font-semibold">{formattedSubcategoryName}</span> <br />
              in <span className="font-semibold">{formattedCityName}</span>
            </p>
            {/* Add checkout form and payment details here */}
          </div>

          {/* Browse Themes Section */}
          <div className="mb-10 mt-10 ">
            <BrowseThemes
              title="Browse by themes"
              themes={currentSubCategory.components.themes || []}
            />
          </div>

          {/* Nearby Cities and Stats */}
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