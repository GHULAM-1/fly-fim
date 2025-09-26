"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
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
  BadgePercent,
  BusFront,
  Landmark,
  Leaf,
  Music,
  Ship,
  Tv,
  SunMedium,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Globe,
  ChefHat,
  Bus,
  Ticket,
  Utensils,
  Footprints,
  Car,
  Mountain,
  Bike,
  Train,
  User,
  Shield,
  FileText,
  DollarSign,
  Package,
  Wine,
  ShoppingBag,
  Heart,
  Headphones,
  Moon,
  Zap,
  Wind,
  Fish,
  Waves,
  Dumbbell,
  Droplets,
  Star,
  Gift,
  Calendar,
  Clock,
  Users,
  Smile,
  Camera,
} from "lucide-react";
import { useNavigationStore } from "@/lib/store/navigationStore";
import PopularThings from "@/components/category/PopularThings";
import CarouselGrid from "@/components/grids/CarouselGrid";
import BrowseThemes from "@/components/tickets/BrowseThemes";
import CityCard from "@/components/cards/CityCard";
import MobPopularThings from "@/components/category/mob-popular-things";
import Stats from "@/components/home/Stats";
import Testimonials from "@/components/things-to-do/Testimonials";
import { fetchCityBycityName } from "@/api/cities/cities-api";
import { fetchCategoryBycategoryName } from "@/api/category/category-api";
import { fetchCategoryPageById } from "@/api/category-page/category-page-api";
import { CategoryPageData } from "@/types/category-page/category-page-types";
import { Category as APICategory } from "@/types/things-to-do/things-to-do-types";
import {
  CategoryPageHeaderSkeleton,
  CategoryNavigationSkeleton,
  CategoryPopularThingsSkeleton,
  CategoryCarouselGridSkeleton,
  CategoryBrowseThemesSkeleton,
  CategoryTestimonialsSkeleton,
} from "@/components/skeletons/CategoryPageSkeletons";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ChevronDown } from "lucide-react";
import Destinations from "@/components/home/Destinations";
import { fetchWorldwideCategoryPage } from "@/api/worldwide/wordlwide-category-api";

export default function CategoryPage() {
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [isCarouselVisible, setIsCarouselVisible] = useState(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [categoryPageData, setCategoryPageData] =
    useState<CategoryPageData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentCategoryId, setCurrentCategoryId] = useState<string>("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);

  const params = useParams();
  const router = useRouter();
  const { activeSection, setActiveSection } = useNavigationStore();

  // Create consolidated array of all unique experiences
  const allUniqueExperiences = useMemo(() => {
    const allArrays = [
      ...(categoryPageData?.topExperiences || []),
      ...(categoryPageData?.popularExperiences || []),
      ...(categoryPageData?.category?.subcategories?.flatMap(
        (sub) => sub.experiences
      ) || []),
    ];

    // Remove duplicates by _id
    return allArrays.filter(
      (experience, index, self) =>
        index === self.findIndex((exp) => exp._id === experience._id)
    );
  }, [categoryPageData]);

  // Get 6 random blog slugs from API response
  const getRandomBlogSlugs = useMemo(() => {
    const allBlogSlugs = allUniqueExperiences
      .map(exp => exp.flags?.blogSlug)
      .filter(slug => slug && slug.trim() !== '');

    const shuffled = [...allBlogSlugs].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6);
  }, [allUniqueExperiences]);
  const mapExperiencesToAttractions = (experiences: any[]) => {
    return experiences.map((experience, index) => ({
      id: index + 1,
      itemId: experience._id,
      title: experience.basicInfo?.title || `Experience ${index + 1}`,
      description:
        experience.basicInfo?.description || "Discover an amazing experience",
      category:
        categoryPageData?.category?.categoryName ||
        formattedCategoryName ||
        "Experience",
      city: experience.relationships?.cityName,
      subcategory: experience.relationships?.subcategoryName,
      price: experience.basicInfo?.price || 0,
      image:
        experience.basicInfo?.mainImage?.[0] ||
        experience.basicInfo?.images?.[0] ||
        "/images/default.jpg",
      audience: ["Popular", "Recommended"],
      rating: 4.5,
    }));
  };

  const mapTopExperiencesToRecommendations = (experiences: any[]) => {
    if (!experiences || !Array.isArray(experiences)) {
      return [];
    }

    return experiences.map((experience, index) => {
      const price = experience.basicInfo?.price || 0;
      const oldPrice = experience.basicInfo?.oldPrice;
      const off = experience.basicInfo?.sale;

      // Use subcategoryName directly from the experience's relationships
      const subcategorySlug =
        experience.relationships?.subcategoryName
          ?.toLowerCase()
          ?.replace(/\s+/g, "-")
          ?.replace(/[&]/g, "") || "general";

      return {
        id: experience._id,
        itemId: experience._id || `exp-${index + 1}`,
        description:
          experience.basicInfo?.title || `Top Experience ${index + 1}`,
        place:
          experience.relationships?.categoryName ||
          categoryPageData?.category?.categoryName ||
          formattedCategoryName ||
          "Experience",
        image: experience.basicInfo?.images || ["/images/r1.jpg.avif"],
        price: price,
        oldPrice: oldPrice,
        category: experience.relationships?.categoryName,
        subcategory: experience.relationships?.subcategoryName,
        off: off,
        rating: 4.5,
        reviews: Math.floor(Math.random() * 4000) + 1000, // Random reviews between 1000-5000
        badge: experience.flags?.isPopular ? "Free cancellation" : undefined,
        type: subcategorySlug, // Add type for pill filtering
      };
    });
  };

  const categoryName = params.category as string;
  const city = params.city as string;
  const isWorldwideRoute = city.toLowerCase() === "worldwide";

  const decodedCity = decodeURIComponent(city);

  const decodedCategory = decodeURIComponent(categoryName);

  const lastWord = decodedCategory
    ? decodedCategory.split("-").pop() || decodedCategory
    : "";

  const configKey = lastWord.toLowerCase().replace(/\s+/g, "-");

  const formattedCategoryName = lastWord
    ? lastWord.charAt(0).toUpperCase() + lastWord.slice(1)
    : "Category";

  const formattedCityName = decodedCity
    ? decodedCity
        .split("-")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ")
    : "City";

  const categoryConfig = isWorldwideRoute
    ? {
        tickets: {
          style: "bordered",
          heading: "Global Attractions",
          navigationItems: [
            { id: "museums", label: "Museums", icon: Tv, color: "purple" },
            {
              id: "landmarks",
              label: "Landmarks",
              icon: Landmark,
              color: "purple",
            },
            { id: "zoos", label: "Zoos", icon: SunMedium, color: "purple" },
            {
              id: "religious-sites",
              label: "Religious Sites",
              icon: BadgePercent,
              color: "purple",
            },
            {
              id: "city-cards",
              label: "City Cards",
              icon: Ship,
              color: "purple",
            },
            {
              id: "theme-parks",
              label: "Theme Parks",
              icon: Leaf,
              color: "purple",
            },
          ],
          components: {
            popular: false,
            stack: false,
            guides: null,
            transport: null,
            testimonials: true,
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
        tours: {
          style: "simple",
          heading: "Global Tours",
          navigationItems: [
            {
              id: "walking-tours",
              label: "Walking Tours",
              icon: Footprints,
              color: "purple",
            },
            {
              id: "guided-tours",
              label: "Guided Tours",
              icon: User,
              color: "purple",
            },
            {
              id: "city-tours",
              label: "City Tours",
              icon: MapPin,
              color: "purple",
            },
            {
              id: "day-trips",
              label: "Day Trips",
              icon: Globe,
              color: "purple",
            },
          ],
          components: {
            guides: {
              title: "Global travel guides and tips",
              variant: "tours",
            },
            transport: null,
            popular: true,
            stack: false,
            testimonials: true,
            themes: [
              { icon: MapPin, text: "Global City Tours", href: "#" },
              { icon: Globe, text: "Worldwide Day Trips", href: "#" },
              { icon: Footprints, text: "Walking Tours", href: "#" },
            ],
          },
        },
        transportation: {
          style: "simple",
          heading: "Global Transportation",
          navigationItems: [
            {
              id: "public-transport",
              label: "Public Transport",
              icon: Bus,
              color: "purple",
            },
            {
              id: "car-rentals",
              label: "Car Rentals",
              icon: Car,
              color: "purple",
            },
            {
              id: "ferry-services",
              label: "Ferry Services",
              icon: Ship,
              color: "purple",
            },
            {
              id: "airport-transfers",
              label: "Airport Transfers",
              icon: BusFront,
              color: "purple",
            },
          ],
          components: {
            guides: null,
            transport: {
              title: "Global travel guides and tips",
              variant: "transport",
            },
            popular: true,
            stack: false,
            testimonials: true,
            themes: [
              { icon: Bus, text: "Global Public Transport", href: "#" },
              { icon: Car, text: "Worldwide Car Rentals", href: "#" },
              { icon: Ship, text: "Ferry Services", href: "#" },
            ],
          },
        },
        "travel-services": {
          style: "bordered",
          heading: "Global Travel Services",
          navigationItems: [
            {
              id: "planning",
              label: "Travel Planning",
              icon: MapPin,
              color: "purple",
            },
          ],
          components: {
            guides: null,
            transport: null,
            popular: true,
            stack: false,
            testimonials: true,
          },
        },
        cruises: {
          style: "bordered",
          heading: `Cruises in ${formattedCityName}`,
          navigationItems: [
            {
              id: "port-excursions",
              label: "Port Excursions",
              icon: Ship,
              color: "purple",
            },
            {
              id: "shore-tours",
              label: "Shore Tours",
              icon: Globe,
              color: "purple",
            },
            {
              id: "cruise-packages",
              label: "Cruise Packages",
              icon: Package,
              color: "purple",
            },
            {
              id: "onboard-activities",
              label: "Onboard Activities",
              icon: Music,
              color: "purple",
            },
            {
              id: "dining-options",
              label: "Dining Options",
              icon: Utensils,
              color: "purple",
            },
            {
              id: "entertainment",
              label: "Entertainment",
              icon: Tv,
              color: "purple",
            },
          ],
          components: {
            guides: null,
            popular: true,
            stack: false,
            transport: null,
            testimonials: false,
            themes: [
              { icon: Ship, text: "Port Excursions", href: "#" },
              { icon: Globe, text: "Shore Tours", href: "#" },
              { icon: Package, text: "Cruise Packages", href: "#" },
            ],
          },
        },
        "food-drink": {
          style: "simple",
          heading: `Food & Drink in ${formattedCityName}`,
          navigationItems: [
            {
              id: "cooking-classes",
              label: "Cooking Classes",
              icon: ChefHat,
              color: "purple",
            },
            {
              id: "food-tours",
              label: "Food Tours",
              icon: Utensils,
              color: "purple",
            },
            {
              id: "wine-tastings",
              label: "Wine Tastings",
              icon: Wine,
              color: "purple",
            },
            {
              id: "restaurant-reservations",
              label: "Restaurant Reservations",
              icon: MapPin,
              color: "purple",
            },
            {
              id: "local-markets",
              label: "Local Markets",
              icon: ShoppingBag,
              color: "purple",
            },
            {
              id: "dietary-options",
              label: "Dietary Options",
              icon: Heart,
              color: "purple",
            },
          ],
          components: {
            guides: { title: "Food & drink guides", variant: "tours" },
            popular: true,
            stack: false,
            transport: null,
            testimonials: false,
            themes: [
              { icon: ChefHat, text: "Cooking Classes", href: "#" },
              { icon: Utensils, text: "Food Tours", href: "#" },
              { icon: Wine, text: "Wine Tastings", href: "#" },
            ],
          },
        },
        entertainment: {
          style: "bordered",
          heading: `Entertainment shows in ${formattedCityName}`,
          navigationItems: [
            {
              id: "live-shows",
              label: "Live Shows",
              icon: Music,
              color: "purple",
            },
            { id: "theater", label: "Theater", icon: Tv, color: "purple" },
            {
              id: "theme-parks",
              label: "Theme Parks",
              icon: SunMedium,
              color: "purple",
            },
            {
              id: "concerts",
              label: "Concerts",
              icon: Headphones,
              color: "purple",
            },
            {
              id: "comedy-clubs",
              label: "Comedy Clubs",
              icon: Smile,
              color: "purple",
            },
            {
              id: "nightlife",
              label: "Nightlife",
              icon: Moon,
              color: "purple",
            },
          ],
          components: {
            guides: null,
            popular: true,
            stack: false,
            transport: null,
            testimonials: false,
            themes: [
              { icon: Music, text: "Live Shows", href: "#" },
              { icon: Tv, text: "Theater", href: "#" },
              { icon: SunMedium, text: "Theme Parks", href: "#" },
            ],
          },
        },
        adventure: {
          style: "bordered",
          heading: `Adventure in ${formattedCityName}`,
          navigationItems: [
            {
              id: "hiking",
              label: "Hiking Trails",
              icon: Footprints,
              color: "purple",
            },
            {
              id: "rock-climbing",
              label: "Rock Climbing",
              icon: Mountain,
              color: "purple",
            },
            {
              id: "off-road-tours",
              label: "Off-road Tours",
              icon: Car,
              color: "purple",
            },
            {
              id: "zip-lining",
              label: "Zip Lining",
              icon: Zap,
              color: "purple",
            },
            { id: "caving", label: "Caving", icon: Mountain, color: "purple" },
            {
              id: "paragliding",
              label: "Paragliding",
              icon: Wind,
              color: "purple",
            },
          ],
          components: {
            guides: null,
            transport: null,
            popular: true,
            stack: false,
            testimonials: false,
            themes: [
              { icon: Footprints, text: "Hiking Trails", href: "#" },
              { icon: Mountain, text: "Rock Climbing", href: "#" },
              { icon: Car, text: "Off-road Tours", href: "#" },
            ],
          },
        },
        "water-sports": {
          style: "bordered",
          heading: `Water Sports in ${formattedCityName}`,
          navigationItems: [
            { id: "sailing", label: "Sailing", icon: Ship, color: "purple" },
            {
              id: "scuba-diving",
              label: "Scuba Diving",
              icon: Fish,
              color: "purple",
            },
            { id: "surfing", label: "Surfing", icon: Waves, color: "purple" },
            { id: "kayaking", label: "Kayaking", icon: Ship, color: "purple" },
            {
              id: "jet-skiing",
              label: "Jet Skiing",
              icon: Zap,
              color: "purple",
            },
            {
              id: "fishing",
              label: "Fishing Tours",
              icon: Fish,
              color: "purple",
            },
          ],
          components: {
            guides: null,
            transport: null,
            popular: true,
            stack: false,
            testimonials: false,
            themes: [
              { icon: Ship, text: "Sailing", href: "#" },
              { icon: Fish, text: "Scuba Diving", href: "#" },
              { icon: Waves, text: "Surfing", href: "#" },
            ],
          },
        },
        wellness: {
          style: "bordered",
          heading: `Health & Wellness in ${formattedCityName}`,
          navigationItems: [
            {
              id: "spa-retreats",
              label: "Spa Retreats",
              icon: Leaf,
              color: "purple",
            },
            {
              id: "yoga-classes",
              label: "Yoga Classes",
              icon: Heart,
              color: "purple",
            },
            {
              id: "meditation",
              label: "Meditation Retreats",
              icon: Mountain,
              color: "purple",
            },
            {
              id: "fitness-centers",
              label: "Fitness Centers",
              icon: Dumbbell,
              color: "purple",
            },
            {
              id: "thermal-baths",
              label: "Thermal Baths",
              icon: Droplets,
              color: "purple",
            },
            {
              id: "mindfulness",
              label: "Mindfulness Workshops",
              icon: Heart,
              color: "purple",
            },
          ],
          components: {
            guides: null,
            transport: null,
            testimonials: false,
            popular: true,
            stack: false,
            themes: [
              { icon: Leaf, text: "Spa Retreats", href: "#" },
              { icon: Heart, text: "Yoga Classes", href: "#" },
              { icon: Mountain, text: "Meditation Retreats", href: "#" },
            ],
          },
        },
        specials: {
          style: "bordered",
          heading: `${formattedCityName} Specials`,
          navigationItems: [
            {
              id: "discount-deals",
              label: "Discount Deals",
              icon: BadgePercent,
              color: "purple",
            },
            {
              id: "vip-experiences",
              label: "VIP Experiences",
              icon: Star,
              color: "purple",
            },
            {
              id: "package-deals",
              label: "Package Deals",
              icon: Gift,
              color: "purple",
            },
            {
              id: "seasonal-offers",
              label: "Seasonal Offers",
              icon: Calendar,
              color: "purple",
            },
            {
              id: "last-minute",
              label: "Last Minute Deals",
              icon: Clock,
              color: "purple",
            },
            {
              id: "group-discounts",
              label: "Group Discounts",
              icon: Users,
              color: "purple",
            },
          ],
          components: {
            guides: null,
            transport: null,
            popular: true,
            stack: false,
            testimonials: true,
            themes: [
              { icon: BadgePercent, text: "Discount Deals", href: "#" },
              { icon: Star, text: "VIP Experiences", href: "#" },
              { icon: Gift, text: "Package Deals", href: "#" },
            ],
          },
        },
        default: {
          style: "bordered",
          heading: "Global Attractions",
          navigationItems: [
            { id: "museums", label: "Museums", icon: Tv, color: "purple" },
            {
              id: "landmarks",
              label: "Landmarks",
              icon: Landmark,
              color: "purple",
            },
            { id: "zoos", label: "Zoos", icon: SunMedium, color: "purple" },
          ],
          components: {
            guides: null,
            transport: null,
            popular: true,
            stack: false,
            testimonials: false,
            themes: [
              { icon: MapPin, text: "Global Tours", href: "#" },
              { icon: Globe, text: "Worldwide Trips", href: "#" },
            ],
          },
        },
      }
    : {
        tickets: {
          style: "bordered",
          heading: `${formattedCityName} Attractions`,
          navigationItems: [
            { id: "museums", label: "Museums", icon: Tv, color: "purple" },
            {
              id: "landmarks",
              label: "Landmarks",
              icon: Landmark,
              color: "purple",
            },
            { id: "zoos", label: "Zoos", icon: SunMedium, color: "purple" },
            {
              id: "religious-sites",
              label: "Religious Sites",
              icon: BadgePercent,
              color: "purple",
            },
            {
              id: "city-cards",
              label: "City Cards",
              icon: Ship,
              color: "purple",
            },
            {
              id: "theme-parks",
              label: "Theme Parks",
              icon: Leaf,
              color: "purple",
            },
          ],
          components: {
            popular: true,
            stack: true,
            guides: null,
            transport: null,
            testimonials: true,
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
        tours: {
          style: "simple",
          heading: `${formattedCityName} Tours`,
          navigationItems: [
            {
              id: "walking-tours",
              label: "Walking Tours",
              icon: Footprints,
              color: "purple",
            },
            {
              id: "guided-tours",
              label: "Guided Tours",
              icon: User,
              color: "purple",
            },
            {
              id: "hop-on-hop-off",
              label: `Hop-on Hop-off Tours in ${formattedCityName}`,
              icon: Bus,
              color: "purple",
            },
            {
              id: "city-tours",
              label: "City Tours",
              icon: MapPin,
              color: "purple",
            },
            {
              id: "private-tours",
              label: "Private Tours",
              icon: Users,
              color: "purple",
            },
            {
              id: "bikes-segway",
              label: "Bikes & Segway",
              icon: Bike,
              color: "purple",
            },
            {
              id: "photography-tours",
              label: "Photography Tours",
              icon: Camera,
              color: "purple",
            },
            {
              id: "day-trips",
              label: "Day Trips",
              icon: Globe,
              color: "purple",
            },
            {
              id: "heritage-experiences",
              label: "Heritage Experiences",
              icon: Landmark,
              color: "purple",
            },
          ],
          components: {
            guides: { title: "Travel guides and tips", variant: "tours" },
            transport: null,
            popular: true,
            stack: false,
            testimonials: true,
            themes: [
              { icon: MapPin, text: "City Tours", href: "#" },
              { icon: Globe, text: "Day Trips", href: "#" },
              { icon: Footprints, text: "Walking Tours", href: "#" },
              { icon: ChefHat, text: "Food Tours", href: "#" },
            ],
          },
        },
        transportation: {
          style: "simple",
          heading: `Transportation in ${formattedCityName}`,
          navigationItems: [
            {
              id: "public-transport",
              label: "Public Transport",
              icon: Bus,
              color: "purple",
            },
            {
              id: "car-rentals",
              label: "Car Rentals",
              icon: Car,
              color: "purple",
            },
            {
              id: "ferry-services",
              label: "Ferry Services",
              icon: Ship,
              color: "purple",
            },
            {
              id: "airport-transfers",
              label: "Airport Transfers",
              icon: BusFront,
              color: "purple",
            },
            {
              id: "bike-rentals",
              label: "Bike Rentals",
              icon: Bike,
              color: "purple",
            },
            {
              id: "metro-services",
              label: "Metro Services",
              icon: Train,
              color: "purple",
            },
          ],
          components: {
            guides: null,
            transport: {
              title: "Travel guides and tips",
              variant: "transport",
            },
            popular: true,
            stack: false,
            testimonials: true,
            themes: [
              { icon: Bus, text: "Public Transport", href: "#" },
              { icon: Car, text: "Car Rentals", href: "#" },
              { icon: Ship, text: "Ferry Services", href: "#" },
              { icon: BusFront, text: "Airport Transfers", href: "#" },
            ],
          },
        },
        "travel-services": {
          style: "bordered",
          heading: `Travel Services in ${formattedCityName}`,
          navigationItems: [
            {
              id: "planning",
              label: "Travel Planning",
              icon: MapPin,
              color: "purple",
            },
            {
              id: "concierge",
              label: "Concierge Services",
              icon: User,
              color: "purple",
            },
            {
              id: "insurance",
              label: "Travel Insurance",
              icon: Shield,
              color: "purple",
            },
            {
              id: "visa-services",
              label: "Visa Services",
              icon: FileText,
              color: "purple",
            },
            {
              id: "currency",
              label: "Currency Exchange",
              icon: DollarSign,
              color: "purple",
            },
            {
              id: "translations",
              label: "Translation Services",
              icon: Globe,
              color: "purple",
            },
          ],
          components: {
            guides: null,
            popular: true,
            stack: false,
            transport: null,
            testimonials: false,
            themes: [
              { icon: MapPin, text: "Travel Planning", href: "#" },
              { icon: User, text: "Concierge Services", href: "#" },
              { icon: Shield, text: "Travel Insurance", href: "#" },
            ],
          },
        },
        cruises: {
          style: "simple",
          heading: `Cruises in ${formattedCityName}`,
          navigationItems: [
            {
              id: "port-excursions",
              label: "Port Excursions",
              icon: Ship,
              color: "purple",
            },
            {
              id: "shore-tours",
              label: "Shore Tours",
              icon: Globe,
              color: "purple",
            },
            {
              id: "cruise-packages",
              label: "Cruise Packages",
              icon: Package,
              color: "purple",
            },
            {
              id: "onboard-activities",
              label: "Onboard Activities",
              icon: Music,
              color: "purple",
            },
            {
              id: "dining-options",
              label: "Dining Options",
              icon: Utensils,
              color: "purple",
            },
            {
              id: "entertainment",
              label: "Entertainment",
              icon: Tv,
              color: "purple",
            },
          ],
          components: {
            guides: null,
            popular: true,
            stack: false,
            transport: null,
            testimonials: false,
            themes: [
              { icon: Ship, text: "Port Excursions", href: "#" },
              { icon: Globe, text: "Shore Tours", href: "#" },
              { icon: Package, text: "Cruise Packages", href: "#" },
            ],
          },
        },
        "food-drink": {
          style: "simple",
          heading: `Food & Drink in ${formattedCityName}`,
          navigationItems: [
            {
              id: "cooking-classes",
              label: "Cooking Classes",
              icon: ChefHat,
              color: "purple",
            },
            {
              id: "food-tours",
              label: "Food Tours",
              icon: Utensils,
              color: "purple",
            },
            {
              id: "wine-tastings",
              label: "Wine Tastings",
              icon: Wine,
              color: "purple",
            },
            {
              id: "restaurant-reservations",
              label: "Restaurant Reservations",
              icon: MapPin,
              color: "purple",
            },
            {
              id: "local-markets",
              label: "Local Markets",
              icon: ShoppingBag,
              color: "purple",
            },
            {
              id: "dietary-options",
              label: "Dietary Options",
              icon: Heart,
              color: "purple",
            },
          ],
          components: {
            guides: { title: "Food & drink guides", variant: "tours" },
            popular: true,
            stack: false,
            transport: null,
            testimonials: false,
            themes: [
              { icon: ChefHat, text: "Cooking Classes", href: "#" },
              { icon: Utensils, text: "Food Tours", href: "#" },
              { icon: Wine, text: "Wine Tastings", href: "#" },
            ],
          },
        },
        entertainment: {
          style: "simple",
          heading: `Entertainment shows in ${formattedCityName}`,
          navigationItems: [
            {
              id: "live-shows",
              label: "Live Shows",
              icon: Music,
              color: "purple",
            },
            { id: "theater", label: "Theater", icon: Tv, color: "purple" },
            {
              id: "theme-parks",
              label: "Theme Parks",
              icon: SunMedium,
              color: "purple",
            },
            {
              id: "concerts",
              label: "Concerts",
              icon: Headphones,
              color: "purple",
            },
            {
              id: "comedy-clubs",
              label: "Comedy Clubs",
              icon: Smile,
              color: "purple",
            },
            {
              id: "nightlife",
              label: "Nightlife",
              icon: Moon,
              color: "purple",
            },
          ],
          components: {
            guides: null,
            popular: false,
            stack: false,
            transport: null,
            testimonials: false,
            themes: [
              { icon: Music, text: "Live Shows", href: "#" },
              { icon: Tv, text: "Theater", href: "#" },
              { icon: SunMedium, text: "Theme Parks", href: "#" },
            ],
          },
        },
        adventure: {
          style: "simple",
          heading: `Adventure in ${formattedCityName}`,
          navigationItems: [
            {
              id: "hiking",
              label: "Hiking Trails",
              icon: Footprints,
              color: "purple",
            },
            {
              id: "rock-climbing",
              label: "Rock Climbing",
              icon: Mountain,
              color: "purple",
            },
            {
              id: "off-road-tours",
              label: "Off-road Tours",
              icon: Car,
              color: "purple",
            },
            {
              id: "zip-lining",
              label: "Zip Lining",
              icon: Zap,
              color: "purple",
            },
            { id: "caving", label: "Caving", icon: Mountain, color: "purple" },
            {
              id: "paragliding",
              label: "Paragliding",
              icon: Wind,
              color: "purple",
            },
          ],
          components: {
            guides: null,
            transport: null,
            popular: false,
            stack: false,
            testimonials: false,
            themes: [
              { icon: Footprints, text: "Hiking Trails", href: "#" },
              { icon: Mountain, text: "Rock Climbing", href: "#" },
              { icon: Car, text: "Off-road Tours", href: "#" },
            ],
          },
        },
        "water-sports": {
          style: "simple",
          heading: `Water Sports in ${formattedCityName}`,
          navigationItems: [
            { id: "sailing", label: "Sailing", icon: Ship, color: "purple" },
            {
              id: "scuba-diving",
              label: "Scuba Diving",
              icon: Fish,
              color: "purple",
            },
            { id: "surfing", label: "Surfing", icon: Waves, color: "purple" },
            { id: "kayaking", label: "Kayaking", icon: Ship, color: "purple" },
            {
              id: "jet-skiing",
              label: "Jet Skiing",
              icon: Zap,
              color: "purple",
            },
            {
              id: "fishing",
              label: "Fishing Tours",
              icon: Fish,
              color: "purple",
            },
          ],
          components: {
            guides: null,
            transport: null,
            popular: false,
            stack: false,
            testimonials: false,
            themes: [
              { icon: Ship, text: "Sailing", href: "#" },
              { icon: Fish, text: "Scuba Diving", href: "#" },
              { icon: Waves, text: "Surfing", href: "#" },
            ],
          },
        },
        wellness: {
          style: "simple",
          heading: `Health & Wellness in ${formattedCityName}`,
          navigationItems: [
            {
              id: "spa-retreats",
              label: "Spa Retreats",
              icon: Leaf,
              color: "purple",
            },
            {
              id: "yoga-classes",
              label: "Yoga Classes",
              icon: Heart,
              color: "purple",
            },
            {
              id: "meditation",
              label: "Meditation Retreats",
              icon: Mountain,
              color: "purple",
            },
            {
              id: "fitness-centers",
              label: "Fitness Centers",
              icon: Dumbbell,
              color: "purple",
            },
            {
              id: "thermal-baths",
              label: "Thermal Baths",
              icon: Droplets,
              color: "purple",
            },
            {
              id: "mindfulness",
              label: "Mindfulness Workshops",
              icon: Heart,
              color: "purple",
            },
          ],
          components: {
            guides: null,
            transport: null,
            testimonials: false,
            popular: true,
            stack: false,
            themes: [
              { icon: Leaf, text: "Spa Retreats", href: "#" },
              { icon: Heart, text: "Yoga Classes", href: "#" },
              { icon: Mountain, text: "Meditation Retreats", href: "#" },
            ],
          },
        },
        specials: {
          style: "simple",
          heading: `${formattedCityName} Specials`,
          navigationItems: [
            {
              id: "discount-deals",
              label: "Discount Deals",
              icon: BadgePercent,
              color: "purple",
            },
            {
              id: "vip-experiences",
              label: "VIP Experiences",
              icon: Star,
              color: "purple",
            },
            {
              id: "package-deals",
              label: "Package Deals",
              icon: Gift,
              color: "purple",
            },
            {
              id: "seasonal-offers",
              label: "Seasonal Offers",
              icon: Calendar,
              color: "purple",
            },
            {
              id: "last-minute",
              label: "Last Minute Deals",
              icon: Clock,
              color: "purple",
            },
            {
              id: "group-discounts",
              label: "Group Discounts",
              icon: Users,
              color: "purple",
            },
          ],
          components: {
            guides: null,
            transport: null,
            popular: false,
            stack: false,
            testimonials: true,
            themes: [
              { icon: BadgePercent, text: "Discount Deals", href: "#" },
              { icon: Star, text: "VIP Experiences", href: "#" },
              { icon: Gift, text: "Package Deals", href: "#" },
            ],
          },
        },
        default: {
          style: "simple",
          heading: "Attractions",
          navigationItems: [
            { id: "museums", label: "Museums", icon: Tv, color: "purple" },
            {
              id: "landmarks",
              label: "Landmarks",
              icon: Landmark,
              color: "purple",
            },
            { id: "zoos", label: "Zoos", icon: SunMedium, color: "purple" },
            {
              id: "religious-sites",
              label: "Religious Sites",
              icon: BadgePercent,
              color: "purple",
            },
            {
              id: "city-cards",
              label: "City Cards",
              icon: Ship,
              color: "purple",
            },
            {
              id: "theme-parks",
              label: "Theme Parks",
              icon: Leaf,
              color: "purple",
            },
          ],
          components: {
            guides: null,
            transport: null,
            popular: true,
            stack: false,
            testimonials: false,
            themes: [
              { icon: MapPin, text: "City Tours", href: "#" },
              { icon: Globe, text: "Day Trips", href: "#" },
              { icon: ChefHat, text: "Food Tours", href: "#" },
            ],
          },
        },
      };

  const currentCategory =
    categoryConfig[configKey as keyof typeof categoryConfig] ||
    categoryConfig.default;

  if (!currentCategory) {
    return <div>Category not found</div>;
  }

  const getIconForSubcategory = (subcategoryName: string) => {
    const name = subcategoryName.toLowerCase();

    if (name.includes("museum") || name.includes("art")) return Tv;
    if (name.includes("landmark") || name.includes("monument")) return Landmark;
    if (name.includes("zoo") || name.includes("animal")) return SunMedium;
    if (
      name.includes("religious") ||
      name.includes("temple") ||
      name.includes("church")
    )
      return BadgePercent;
    if (name.includes("park") || name.includes("theme")) return Leaf;
    if (
      name.includes("show") ||
      name.includes("live") ||
      name.includes("performance")
    )
      return Music;
    if (name.includes("theater") || name.includes("theatre")) return Tv;
    if (name.includes("concert") || name.includes("music")) return Headphones;
    if (name.includes("comedy") || name.includes("stand-up")) return Smile;
    if (
      name.includes("nightlife") ||
      name.includes("club") ||
      name.includes("bar")
    )
      return Moon;
    if (
      name.includes("tour") ||
      name.includes("walking") ||
      name.includes("guided")
    )
      return Footprints;
    if (name.includes("city") || name.includes("sightseeing")) return MapPin;
    if (name.includes("day trip") || name.includes("excursion")) return Globe;
    if (
      name.includes("food") ||
      name.includes("dining") ||
      name.includes("restaurant")
    )
      return Utensils;
    if (name.includes("cooking") || name.includes("culinary")) return ChefHat;
    if (name.includes("wine") || name.includes("tasting")) return Wine;
    if (name.includes("market") || name.includes("shopping"))
      return ShoppingBag;
    if (
      name.includes("transport") ||
      name.includes("bus") ||
      name.includes("metro")
    )
      return Bus;
    if (name.includes("ferry") || name.includes("boat")) return Ship;
    if (name.includes("car") || name.includes("rental")) return Car;
    if (name.includes("airport") || name.includes("transfer")) return BusFront;
    if (name.includes("bike") || name.includes("cycling")) return Bike;
    if (name.includes("train") || name.includes("rail")) return Train;
    if (name.includes("adventure") || name.includes("hiking")) return Mountain;
    if (
      name.includes("water") ||
      name.includes("swimming") ||
      name.includes("pool")
    )
      return Droplets;
    if (
      name.includes("spa") ||
      name.includes("wellness") ||
      name.includes("massage")
    )
      return Leaf;
    if (name.includes("fitness") || name.includes("gym")) return Dumbbell;
    if (name.includes("yoga") || name.includes("meditation")) return Heart;
    if (name.includes("cruise") || name.includes("sailing")) return Ship;
    if (
      name.includes("discount") ||
      name.includes("deal") ||
      name.includes("offer")
    )
      return BadgePercent;
    if (name.includes("vip") || name.includes("premium")) return Star;
    if (name.includes("package") || name.includes("combo")) return Gift;
    if (name.includes("seasonal") || name.includes("holiday")) return Calendar;
    if (name.includes("group") || name.includes("family")) return Users;

    return Ticket; // Default fallback icon
  };

  const dynamicNavigationItems =
    categoryPageData?.categories?.flatMap((category) =>
      category.subcategories.map((subcategory) => {
        const subcategorySlug = subcategory.subcategoryName
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[&]/g, "");
        return {
          id: subcategorySlug,
          label: subcategory.subcategoryName,
          icon: getIconForSubcategory(subcategory.subcategoryName),
          color: "purple" as const,
        };
      })
    ) || [];

  const getButtonStyles = (item: any, isActive: boolean) => {
    const baseClasses =
      "font-halyard-text hover:cursor-pointer flex items-center text-sm sm:text-base gap-2 md:py-[25px] md:px-[15px] py-[0px] px-[11px] whitespace-nowrap transition-all duration-200";

    // Override style to "bordered" if category is "ticket" or "Ticket"
    const effectiveStyle =
      formattedCategoryName.toLowerCase() === "ticket" ||
      formattedCategoryName.toLowerCase() === "tickets"
        ? "bordered"
        : currentCategory.style;

    switch (effectiveStyle) {
      case "bordered":
        return `${baseClasses} border rounded-[4px] ${
          isActive
            ? "bg-purple-600/10 text-purple-600 border-purple-600/20 hover:bg-purple-600/10 hover:text-purple-600 hover:border-purple-600/20"
            : "text-[#444444] border-gray-200 bg-transparent hover:bg-purple-600/10 hover:text-purple-600"
        }`;

      case "simple":
        return `${baseClasses} relative ${
          isActive
            ? "bg-transparent text-purple-600 border-purple-600/20 hover:bg-transparent hover:text-purple-600 hover:border-purple-600/20"
            : "text-[#444444] border-gray-200 bg-transparent hover:bg-transparent hover:text-purple-600"
        }`;
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const stickyNav = document.querySelector("[data-navigation]");
      const fixedNav = document.querySelector(".fixed.md\\:top-19");

      let totalOffset = 0;

      if (fixedNav) {
        const fixedNavRect = fixedNav.getBoundingClientRect();
        totalOffset += fixedNavRect.height;
      }

      if (stickyNav) {
        const stickyNavRect = stickyNav.getBoundingClientRect();
        totalOffset += stickyNavRect.height;
      }

      totalOffset += 20;

      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - totalOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleNavigation = (item: any) => {
    // Special case for "All" button - always scroll to top for both routes
    if (item.id === "all" || item.label === "All") {
      scrollToSection("all");
      return;
    }

    if (isWorldwideRoute) {
      // For worldwide routes, redirect to new URL
      const subcategorySlug = item.label
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[&]/g, "");
      const categorySlug = formattedCategoryName.toLowerCase();
      router.push(`/things-to-do/worldwide/${categorySlug}/${subcategorySlug}`);
    } else {
      const subcategorySlug = item.label
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[&]/g, "");
      const categorySlug = formattedCategoryName.toLowerCase();
      // For regular routes, scroll to section
      router.push(`/things-to-do/${city}/${categorySlug}/${subcategorySlug}`);
    }
  };

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const navigationItems =
      dynamicNavigationItems.length > 0
        ? dynamicNavigationItems
        : currentCategory.navigationItems;
    const sections = navigationItems.map((item) => item.id);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (sections.includes(entry.target.id)) {
              setActiveSection(entry.target.id);
            }
          }
        });
      },
      {
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0.3,
      }
    );

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [
    setActiveSection,
    dynamicNavigationItems,
    currentCategory.navigationItems,
  ]);

  useEffect(() => {
    const handleResize = () => checkScrollButtons();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => checkScrollButtons();
    const scrollElement = scrollContainerRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      return () => scrollElement.removeEventListener("scroll", handleScroll);
    }
  }, []);

  useEffect(() => {
    checkScrollButtons();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const lastSectionElement = document.getElementById(
        "hop-on-hop-off-tours"
      );
      const activitiesElement = document.getElementById("activities");

      if (lastSectionElement && activitiesElement) {
        const lastSectionRect = lastSectionElement.getBoundingClientRect();

        if (lastSectionRect.bottom < 0) {
          setIsCarouselVisible(false);
        } else {
          setIsCarouselVisible(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchCategoryPageData = async () => {
      if (!categoryName || !city) return;

      setLoading(true);
      setError(null);
      setCategoryPageData(null);

      try {
        if (!isWorldwideRoute) {
          const cityData = await fetchCityBycityName(city);
          const categoryData = await fetchCategoryBycategoryName(categoryName);
          const categoryPageResponse = await fetchCategoryPageById(
            cityData._id,
            categoryData._id
          );

          if (categoryPageResponse.success && categoryPageResponse.data) {
            setCategoryPageData(categoryPageResponse.data);
          } else {
            setError(
              categoryPageResponse.message ||
                "Failed to fetch category page data"
            );
          }
        } else {
          const categoryData = await fetchCategoryBycategoryName(categoryName);
          setCurrentCategoryId(categoryData._id);
          const categoryPageResponse = await fetchWorldwideCategoryPage(
            categoryData._id
          );

          if (categoryPageResponse.success && categoryPageResponse.data) {
            setCategoryPageData(categoryPageResponse.data);
          } else {
            setError(categoryPageResponse.message || "Failed to fetch category page data");
          }
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryPageData();
  }, [city, categoryName]);

  return (
    <>
      <div className="hidden md:block fixed md:top-19 bg-[#fff] w-full py-3 z-40 border-b">
        <div className="max-w-[1200px] mx-auto px-[24px] xl:px-0">
          <CategoriesDropdown
            showCategoriesDropdown={showCategoriesDropdown}
            setShowCategoriesDropdown={setShowCategoriesDropdown}
            setShowBanner={setShowBanner}
            categories={
              categoryPageData?.allCategories?.map((category) => ({
                categoryName: category.categoryName,
                subcategories: category.subcategories.map((sub) => ({
                  subcategoryName: sub.subcategoryName,
                })),
              })) || []
            }
            topExperiences={categoryPageData?.topExperiences || []}
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
      <div className="max-w-[1200px] mx-auto xl:px-0 md:mt-20 ">
        <div className="pt-[76px]">
          {loading ? (
            <CategoryPageHeaderSkeleton />
          ) : (
            <div className="px-[24px] xl:px-0">
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
                          <BreadcrumbPage className="text-[14px] font-halyard-text-light text-[#666666]">
                            {formattedCategoryName}
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
                          {categoryPageData?.reviews
                            ? (
                                categoryPageData.reviews.reduce(
                                  (acc, review) => acc + review.stars,
                                  0
                                ) / categoryPageData.reviews.length
                              ).toFixed(1)
                            : "4.3"}
                        </span>
                        <span className="text-[#e5006e] text-[17px] font-halyard-text">
                          (
                          {categoryPageData?.reviews
                            ? categoryPageData.reviews.length.toLocaleString()
                            : "151,002"}
                          )
                        </span>
                      </div>
                    </div>
                    <h1 className="text-[21px] md:text-[30px] font-bold text-[#444444] font-halyard-text">
                      {currentCategory.heading}
                    </h1>
                  </div>
                </>
              ) : (
                <div>
                  <div className="mb-[24px]">
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
                          <BreadcrumbPage className="text-[14px] font-halyard-text-light text-[#666666]">
                            {formattedCategoryName}
                          </BreadcrumbPage>
                        </BreadcrumbItem>
                      </BreadcrumbList>
                    </Breadcrumb>
                  </div>
                  <div className="flex items-center gap-2">
                    <div>
                      <h1 className="text-[21px] font-halyard-text text-[#444444] font-semibold">
                        {formattedCategoryName} Worldwide
                      </h1>
                    </div>
                    <div className="flex items-center pt-[6px]">
                      <Drawer
                        open={isMobileDrawerOpen}
                        onOpenChange={setIsMobileDrawerOpen}
                      >
                        <DrawerTrigger asChild>
                          <button>
                            <ChevronDown size={26} className="text-gray-600" />
                          </button>
                        </DrawerTrigger>
                      </Drawer>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="md:hidden flex justify-center mb-4">
            <Drawer
              open={isMobileDrawerOpen}
              onOpenChange={setIsMobileDrawerOpen}
            >
              <DrawerContent className="max-h-[85vh]">
                <DrawerHeader className="text-start">
                  <DrawerTitle className="text-[18px] border-b-[1px] pb-4 font-medium font-halyard-text text-[#444444]">
                    Categories Worldwide
                  </DrawerTitle>
                </DrawerHeader>
                <div className="px-4 pb-6">
                  <div className="grid grid-cols-2 gap-3">
                    {categoryPageData?.allCategories?.map((item) => {
                      return (
                        <button
                          key={item.categoryName}
                          onClick={() => {
                            scrollToSection(item.categoryName);
                            setIsMobileDrawerOpen(false);
                          }}
                          className="py-[8px] rounded-[4px] px-[12px] border-[1px] border-[#e2e2e2] transition-all duration-200 text-start"
                        >
                          <a
                            href={`/things-to-do/${formattedCityName}/${item.categoryName.toLowerCase().replace(/\s+/g, '-')}`}
                            className="text-sm font-halyard-text-light text-[#444444] leading-tight"
                          >
                            {item.categoryName}
                          </a>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
          {loading ? (
            <CategoryNavigationSkeleton />
          ) : (
            <div
              ref={navigationRef}
              data-navigation
              className={`${
                (formattedCategoryName.toLowerCase() === "ticket" ||
                formattedCategoryName.toLowerCase() === "tickets"
                  ? "bordered"
                  : currentCategory.style) === "simple"
                  ? "relative"
                  : "sticky md:top-30 top-15"
              } w-full bg-white z-30 py-4 transition-all duration-500 transform ${
                isCarouselVisible ? "translate-y-0" : "-translate-y-full"
              }`}
            >
              <div className="relative">
                <div
                  ref={scrollContainerRef}
                  className="flex relative gap-2 overflow-x-auto scrollbar-hide z-10 max-w-[1200px] mx-auto px-[24px] xl:px-0"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {showLeftButton && (
                    <div className="absolute left-3.5 top-0 z-10 bottom-0 items-center md:flex hidden">
                      <div className="bg-gradient-to-r from-white via-white/50 to-transparent w-20 h-full flex items-center justify-start">
                        <div className="bg-white shadow-sm shadow-white border border-gray-200 rounded-full p-1.5 cursor-pointer hover:border-gray-400">
                          <ChevronLeft
                            size={16}
                            className="text-[#444444]"
                            onClick={scrollLeft}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {(formattedCategoryName.toLowerCase() === "ticket" ||
                  formattedCategoryName.toLowerCase() === "tickets"
                    ? "bordered"
                    : currentCategory.style) === "simple" && (
                    <div className="relative">
                      <Button
                        variant="default"
                        onClick={() => scrollToSection("all")}
                        className={getButtonStyles(
                          { id: "all", label: "All" },
                          activeSection === "all" || !activeSection
                        )}
                      >
                        All
                      </Button>
                      {(activeSection === "all" || !activeSection) && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full"></div>
                      )}
                    </div>
                  )}
                  {(dynamicNavigationItems.length > 0
                    ? dynamicNavigationItems
                    : currentCategory.navigationItems
                  ).map((item) => {
                    const IconComponent = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <div key={item.id} className="relative">
                        <Button
                          variant="default"
                          onClick={() => handleNavigation(item)}
                          className={getButtonStyles(item, isActive)}
                        >
                          {(formattedCategoryName.toLowerCase() === "ticket" ||
                          formattedCategoryName.toLowerCase() === "tickets"
                            ? "bordered"
                            : currentCategory.style) === "simple" &&
                          isActive ? null : (
                            <IconComponent
                              strokeWidth={1}
                              className=" md:w-5 md:h-5 w-5 h-5"
                            />
                          )}
                          {item.label}
                        </Button>
                      </div>
                    );
                  })}

                  {showRightButton && (
                    <div className="absolute right-0 top-0 bottom-0 z-10 md:flex hidden items-center">
                      <div className="bg-gradient-to-l from-white via-white to-transparent w-20 h-full flex items-center justify-end">
                        <div className="bg-white shadow-2xl shadow-white border border-gray-200 rounded-full p-1.5 cursor-pointer hover:border-gray-400">
                          <ChevronRight
                            size={16}
                            className="text-[#444444]"
                            onClick={scrollRight}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {(formattedCategoryName.toLowerCase() === "ticket" ||
                formattedCategoryName.toLowerCase() === "tickets"
                  ? "bordered"
                  : currentCategory.style) === "simple" && (
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200"></div>
                )}
              </div>
            </div>
          )}
          <div className="md:mt-10 mt-0">
            {!isWorldwideRoute &&
              (loading ? (
                <CategoryPopularThingsSkeleton />
              ) : (
                categoryPageData?.popularExperiences &&
                categoryPageData.popularExperiences.length > 0 && (
                  <PopularThings
                    attractions={mapExperiencesToAttractions(
                      categoryPageData.popularExperiences
                    )}
                  />
                )
              ))}
          </div>
          <div className="">
            {currentCategory.components.popular && isWorldwideRoute && categoryPageData?.popularExperiences && categoryPageData.popularExperiences.length > 0 && (
              <MobPopularThings
                title="Popular things to do"
                recommendations={categoryPageData.popularExperiences.map((exp, index) => ({
                  id: exp._id,
                  imageUrls: exp.basicInfo.mainImage[0] || exp.basicInfo.images[0] || "",
                  description: exp.basicInfo.title,
                  city: exp.relationships.cityName,
                  place: exp.relationships.categoryName,
                }))}
              />
            )}
          </div>
          <div>
            {loading ? (
              <CategoryCarouselGridSkeleton title="Top experiences" />
            ) : isWorldwideRoute ? (
              categoryPageData?.topExperiences &&
              categoryPageData.topExperiences.length > 0 && (
                <div className="border-b-[1px]  pb-10 mb-10 px-[24px] xl:px-0">
                  <CarouselGrid
                    title={`Top experiences`}
                    variant="pills"
                    isWorldwideRoute={true}
                    isSubcategoryPage={false}
                    pills={false}
                    categoryId={currentCategoryId}
                    subcategoryName={categoryName}
                    recommendations={mapTopExperiencesToRecommendations(
                      categoryPageData.topExperiences
                    )}
                  />
                </div>
              )
            ) : (
              categoryPageData?.topExperiences &&
              categoryPageData.topExperiences.length > 0 && (
                <div className="px-[24px] xl:px-0">
                  <CarouselGrid
                    title={`Top experiences in ${formattedCityName}`}
                    variant="pills"
                    recommendations={mapTopExperiencesToRecommendations(
                      categoryPageData.topExperiences
                    )}
                  />
                </div>
              )
            )}
            {currentCategory.components.stack &&
              (dynamicNavigationItems.length > 0
                ? dynamicNavigationItems
                : currentCategory.navigationItems
              ).map((item) => (
                <div
                  key={item.id}
                  className="mb-5 md:mb-10 px-[24px] xl:px-0"
                  id={item.id}
                >
                  <CarouselGrid
                    title={item.label}
                    variant="museums"
                    recommendations={(() => {
                      const filtered = allUniqueExperiences.filter(
                        (exp) =>
                          exp.relationships?.subcategoryName === item.label
                      );

                      const mapped = filtered.map((experience, index) => ({
                        id: experience._id,
                        name:
                          experience.basicInfo?.title ||
                          `Experience ${index + 1}`,
                        image:
                          experience.basicInfo?.images?.[0] ||
                          experience.basicInfo?.mainImage?.[0] ||
                          "/images/default.jpg",
                        place: experience.basicInfo?.title || item.label,
                        description:
                          experience.basicInfo?.description ||
                          `Discover ${experience.basicInfo?.title}`,
                        price: experience.basicInfo?.price || 0,
                        city: experience.relationships?.cityName,
                        category: experience.relationships?.categoryName,
                        subcategory: experience.relationships?.subcategoryName,
                      }));

                      return mapped.length > 0 ? mapped : [];
                    })()}
                  />
                </div>
              ))}
          </div>
          {currentCategory?.components?.guides && getRandomBlogSlugs.length > 0 && (
            <div className="mb-10 px-[24px] xl:px-0">
              <CarouselGrid
                title={currentCategory.components.guides.title}
                variant={
                  currentCategory.components.guides.variant as
                    | "tours"
                    | "transport"
                }
                recommendations={getRandomBlogSlugs as any[]}
              />
            </div>
          )}

          {currentCategory?.components?.transport && getRandomBlogSlugs.length > 0 && (
            <div className="mb-10 px-[24px] xl:px-0">
              <CarouselGrid
                title={(currentCategory.components.transport as any).title}
                variant={
                  (currentCategory.components.transport as any).variant as
                    | "tours"
                    | "transport"
                }
                recommendations={getRandomBlogSlugs as any[]}
              />
            </div>
          )}

          <div className="mb-10 px-[24px] xl:px-0">
            {loading ? (
              <CategoryBrowseThemesSkeleton />
            ) : (
              <BrowseThemes
                title="Browse by themes"
                themes={
                  categoryPageData?.categories
                    ? categoryPageData.categories.flatMap((category) =>
                        category.subcategories.map((subcategory) => ({
                          icon: getIconForSubcategory(
                            subcategory.subcategoryName
                          ),
                          text: subcategory.subcategoryName,
                          href: `/things-to-do/${formattedCityName}/${formattedCategoryName}/${subcategory.subcategoryName.toLowerCase().replace(/\s+/g, "-").replace(/[&]/g, "")}`,
                        }))
                      )
                    : currentCategory.components.themes || []
                }
              />
            )}
          </div>
          {!isWorldwideRoute && (
            <div className="mb-10 px-[24px] xl:px-0 md:mb-20">
              <Destinations />
            </div>
          )}

          <div className="mb-10 px-[24px] xl:px-0">
            <Banner />
          </div>
          {currentCategory.components.testimonials && !isWorldwideRoute && (
            <div className="mb-10 px-[24px] xl:px-0">
              {loading ? (
                <CategoryTestimonialsSkeleton />
              ) : (
                categoryPageData?.reviews && (
                  <Testimonials
                    variant="default"
                    reviewsData={categoryPageData.reviews}
                  />
                )
              )}
            </div>
          )}
          <div className="mb-10 px-[24px] xl:px-0">
            <Stats />
          </div>
        </div>
      </div>
    </>
  );
}
