"use client";
import Activities from "@/components/home/Activities";
import Banner from "@/components/home/Banner";
import BrowseThemes from "@/components/home/BrowseThemes";
import Faqs from "@/components/things-to-do/Faqs";
import CarouselGrid from "@/components/grids/CarouselGrid";
import Stats from "@/components/home/Stats";
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Destinations from "@/components/home/Destinations";
import MustDo from "@/components/things-to-do/MustDo";
import Hero from "@/components/things-to-do/Hero";
import TravelGuide from "@/components/things-to-do/TravelGuide";
import Testimonials from "@/components/things-to-do/Testimonials";
import CategoriesDropdown from "@/components/category/CategoriesDropdown";
import { fetchThingsToDoByCityId } from "@/api/things-to-do/things-to-do-api";
import { ThingsToDoPageData, StructuredExperience } from "@/types/things-to-do/things-to-do-types";
import { fetchFaqsByExperienceIds } from "@/api/faq/faq-api";
import { fetchCityBycityName } from "@/api/cities/cities-api";
import { Faq } from "@/types/faq/faq-types";
import {
  ArrowLeft,
  BadgePercent,
  BusFront,
  Landmark,
  Leaf,
  Music,
  Search,
  Ship,
  Tv,
  SunMedium,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useNavigationStore } from "@/lib/store/navigationStore";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Input } from "@/components/ui/input";
import { searchApi } from "@/api/search/search-api";
import { SearchResponse, SearchCity, SearchExperience } from "@/types/search/search-types";
import {
  ThingsToDoHeroSkeleton,
  ThingsToDoNavigationSkeleton,
  ThingsToDoCarouselSkeleton,
  ThingsToDoMustDoSkeleton,
  ThingsToDoBrowseThemesSkeleton,
  ThingsToDoTestimonialsSkeleton,
  ThingsToDoFaqsSkeleton,
} from "@/components/skeletons/ThingsToDoSkeletons";

const ThingsToDo = () => {
  const {
    showBanner,
    setShowBanner,
    setScroll,
    setIsSectionActive,
    setShowSectionNavigation,
    activeSection,
    setActiveSection,
    isSectionActive,
  } = useNavigationStore();

  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const [isCustomDrawerOpen, setIsCustomDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [previousPlaceholderIndex, setPreviousPlaceholderIndex] = useState(-1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const currentIndexRef = useRef(0);

  // API state
  const [thingsToDoData, setThingsToDoData] = useState<ThingsToDoPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [faqsData, setFaqsData] = useState<Faq[]>([]);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  const params = useParams();
  const router = useRouter();
  const city = params.city as string;

  // URL generation functions
  const generateDestinationUrl = (dest: SearchCity) => {
    const slugify = (text: string) =>
      text?.toLowerCase()?.replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const citySlug = slugify(dest.cityName || dest.slug);
    return `/things-to-do/${citySlug}`;
  };

  const generateActivityUrl = (activity: SearchExperience) => {
    const slugify = (text: string) =>
      text?.toLowerCase()?.replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const citySlug = slugify(activity.cityName);
    const categorySlug = slugify(activity.categoryName);
    const subcategorySlug = slugify(activity.subcategoryName);
    return `/things-to-do/${citySlug}/${categorySlug}/${subcategorySlug}/${activity._id}`;
  };

  // Create consolidated array of all unique experiences
  const allUniqueExperiences = useMemo(() => {
    if (!thingsToDoData) return [];

    const allArrays = [
      ...(thingsToDoData.topExperiences || []),
      ...(thingsToDoData.mustDoExperiences || []),
      ...(thingsToDoData.mainCards || []),
      ...(thingsToDoData.categories?.flatMap(cat =>
        cat.subcategories.flatMap(sub => sub.experiences)
      ) || []),
    ];

    // Remove duplicates by _id
    const uniqueExperiences = allArrays.filter((experience, index, self) =>
      index === self.findIndex(exp => exp._id === experience._id)
    );

    return uniqueExperiences;
  }, [thingsToDoData]);

  // Create categories structure from actual experiences
  const categoriesFromExperiences = useMemo(() => {
    const categoryMap = new Map<string, Set<string>>();

    allUniqueExperiences.forEach(exp => {
      const categoryName = exp.relationships?.categoryName;
      const subcategoryName = exp.relationships?.subcategoryName;

      if (categoryName && subcategoryName) {
        if (!categoryMap.has(categoryName)) {
          categoryMap.set(categoryName, new Set<string>());
        }
        categoryMap.get(categoryName)!.add(subcategoryName);
      }
    });

    return Array.from(categoryMap.entries()).map(([categoryName, subcategoriesSet]) => ({
      categoryName,
      subcategories: Array.from(subcategoriesSet).map(subcategoryName => ({
        subcategoryName
      }))
    }));
  }, [allUniqueExperiences]);

  // Create array of max 10 unique subcategories from allUniqueExperiences
  const uniqueSubcategories = useMemo(() => {
    const subcategorySet = new Set<string>();

    allUniqueExperiences.forEach(exp => {
      const subcategoryName = exp.relationships?.subcategoryName;
      if (subcategoryName) {
        subcategorySet.add(subcategoryName);
      }
    });

    return Array.from(subcategorySet).slice(0, 10).map(subcategoryName => ({
      subcategoryName,
      sectionId: subcategoryName.toLowerCase().replace(/\s+/g, '-').replace(/[&]/g, ''),
      experiences: allUniqueExperiences.filter(exp => exp.relationships?.subcategoryName === subcategoryName)
    }));
  }, [allUniqueExperiences]);

  // Get 3 random blog slugs from experiences data
  const getRandomBlogSlugs = useMemo(() => {
    if (!thingsToDoData) return [];

    const allBlogSlugs = allUniqueExperiences
      .map(exp => exp.flags?.blogSlug)
      .filter(slug => slug && slug.trim() !== ''); // Filter out empty/null slugs

    if (allBlogSlugs.length === 0) return [];

    // Shuffle and get 3 random slugs
    const shuffled = [...allBlogSlugs].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, [allUniqueExperiences, thingsToDoData]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // API call effect
  useEffect(() => {
    const loadThingsToDoData = async () => {
      if (!city) return;

      try {
        setLoading(true);
        setError(null);
        // First, get city ID by city name
        const cityData = await fetchCityBycityName(city);

        // Check if city data is empty or invalid
        if (!cityData || !cityData._id) {
          setIsRedirecting(true);
          router.push('/not-found');
          return;
        }

        // Then, fetch things to do data using city ID
        const data = await fetchThingsToDoByCityId(cityData._id);

        // Check if things to do data is empty
        if (!data || (data.categories?.length === 0 && data.topExperiences?.length === 0 && data.mainCards?.length === 0)) {
          setIsRedirecting(true);
          router.push('/not-found');
          return;
        }

        setThingsToDoData(data);
      } catch (err) {
        console.error('Error loading things to do data:', err);
        // Redirect to 404 on any error
        setIsRedirecting(true);
        router.push('/not-found');
      } finally {
        setLoading(false);
      }
    };

    loadThingsToDoData();
  }, [city]);

  // Fetch FAQs after things-to-do data is loaded
  useEffect(() => {
    const loadFaqsData = async () => {
      if (!thingsToDoData) return;

      try {
        // Extract all experience IDs from the things-to-do data
        const experienceIds = thingsToDoData.categories
          .flatMap(category => category.subcategories)
          .flatMap(subcategory => subcategory.experiences)
          .map(experience => experience._id);

        if (experienceIds.length > 0) {
          const faqs = await fetchFaqsByExperienceIds(experienceIds);
          setFaqsData(faqs);
        }
      } catch (err) {
        // Don't set error state for FAQs, just keep empty array
      }
    };

    loadFaqsData();
  }, [thingsToDoData]);

  const placeholderOptions = [
    "experiences and cities",
    "Burj Khalifa",
    "Dubai",
    "things to do",
    "attractions",
    "tours",
  ];

  // Get search results from API
  const displayDestinations = searchResults ? searchResults.data.cities : [];
  const displayActivities = searchResults ? searchResults.data.experiences : [];

  useEffect(() => {
    if (!isMounted) return;
    if (!searchQuery) {
      const interval = setInterval(() => {
        const nextIndex =
          (currentIndexRef.current + 1) % placeholderOptions.length;
        setPreviousPlaceholderIndex(currentIndexRef.current);
        setIsTransitioning(true);
        currentIndexRef.current = nextIndex;
        setCurrentPlaceholderIndex(nextIndex);
        setTimeout(() => {
          setIsTransitioning(false);
          setPreviousPlaceholderIndex(-1);
        }, 700);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [searchQuery, placeholderOptions.length, isMounted]);

  useEffect(() => {
    currentIndexRef.current = currentPlaceholderIndex;
  }, [currentPlaceholderIndex]);

  useEffect(() => {
    if (isCustomDrawerOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.position = "";
      document.body.style.width = "";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [isCustomDrawerOpen]);

  useEffect(() => {
    if (isCustomDrawerOpen && mobileInputRef.current) {
      setTimeout(() => {
        mobileInputRef.current?.focus();
      }, 300);
    }
  }, [isCustomDrawerOpen]);

  // Search API call effect
  useEffect(() => {
    const performSearch = async () => {
      setIsSearchLoading(true);
      try {
        const results = await searchApi(searchQuery.trim());
        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults(null);
      } finally {
        setIsSearchLoading(false);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Initial load with empty params
  useEffect(() => {
    const loadInitialData = async () => {
      setIsSearchLoading(true);
      try {
        const results = await searchApi('');
        setSearchResults(results);
      } catch (error) {
        console.error('Initial data load error:', error);
        setSearchResults(null);
      } finally {
        setIsSearchLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const AnimatedPlaceholder = ({ prefix = "Search for" }) => (
    <div className="absolute inset-0 flex items-center pointer-events-none text-[#666666]">
      <span className="mr-1 font-halyard-text-light md:text-base text-sm flex-shrink-0">
        {prefix}
      </span>
      <div className="relative overflow-hidden h-5 flex items-center flex-1 min-w-0">
        {isTransitioning && previousPlaceholderIndex >= 0 && (
          <span
            key={`prev-${previousPlaceholderIndex}`}
            className="absolute font-halyard-text-light md:text-base text-sm whitespace-nowrap"
            style={{
              animation: "slideOutUp 0.7s ease-out forwards",
              animationFillMode: "both",
            }}
          >
            {placeholderOptions[previousPlaceholderIndex]}
          </span>
        )}
        <span
          key={`current-${currentPlaceholderIndex}`}
          className="absolute font-halyard-text-light md:text-base text-sm whitespace-nowrap"
          style={{
            animation: isTransitioning
              ? "slideInUp 0.7s ease-out forwards"
              : "none",
            animationFillMode: "both",
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? "translateY(100%)" : "translateY(0)",
          }}
        >
          {placeholderOptions[currentPlaceholderIndex]}
        </span>
      </div>
    </div>
  );

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);

  // Icon mapping function for categories
  const getIconForCategory = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('music') || name.includes('concert') || name.includes('musical')) return Music;
    if (name.includes('landmark') || name.includes('monument') || name.includes('attraction')) return Landmark;
    if (name.includes('trip') || name.includes('tour') || name.includes('day')) return SunMedium;
    if (name.includes('combo') || name.includes('deal') || name.includes('package')) return BadgePercent;
    if (name.includes('cruise') || name.includes('boat') || name.includes('water')) return Ship;
    if (name.includes('play') || name.includes('theatre') || name.includes('theater')) return Leaf;
    if (name.includes('museum') || name.includes('gallery') || name.includes('exhibit')) return Tv;
    if (name.includes('hop') || name.includes('bus') || name.includes('transport')) return BusFront;
    // Additional mappings
    if (name.includes('food') || name.includes('dining') || name.includes('restaurant')) return Leaf;
    if (name.includes('adventure') || name.includes('outdoor') || name.includes('sport')) return SunMedium;
    if (name.includes('entertainment') || name.includes('show') || name.includes('performance')) return Music;
    // Default fallback icon
    return Music;
  };

  // Transform API experiences to recommendations format
  const transformExperiencesToRecommendations = (experiences: any[]) => {
    return experiences.map(exp => ({
      id: exp._id,
      description: exp.basicInfo.title,
      place: exp.basicInfo.tagOnCards || "",
      image: exp.basicInfo.images || "/images/default.jpg",
      price: exp.basicInfo.price,
      oldPrice: exp.basicInfo.oldPrice,
      off: exp.basicInfo.sale,
      rating: 4.5, // Default since not in API
      reviews: Math.floor(Math.random() * 5000) + 1000, // Random reviews for variety
      badge: exp.basicInfo.tagOnCards,
      city: exp.relationships?.cityName,
      category: exp.relationships?.categoryName,
      subcategory: exp.relationships?.subcategoryName,
      itemId: exp._id
    }));
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navigationElement = navigationRef.current;
      const navHeight = navigationElement ? navigationElement.offsetHeight : 0;

      const isMobile = window.innerWidth < 768;
      const mainHeaderHeight = isMobile ? 64 : 120;

      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navHeight - mainHeaderHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
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
    scrollContainerRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  // Scroll active button into view
  const scrollActiveButtonIntoView = useCallback(() => {
    if (!scrollContainerRef.current || !activeSection) return;

    const activeButton = scrollContainerRef.current.querySelector(
      `[data-section="${activeSection}"]`
    ) as HTMLElement;

    if (!activeButton) return;

    const container = scrollContainerRef.current;
    const containerRect = container.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();

    // Check if button is fully visible
    const isFullyVisible =
      buttonRect.left >= containerRect.left &&
      buttonRect.right <= containerRect.right;

    if (!isFullyVisible) {
      // Calculate scroll position to center the button
      const scrollLeft =
        activeButton.offsetLeft -
        container.clientWidth / 2 +
        activeButton.clientWidth / 2;

      // Use instant scrolling for maximum responsiveness
      container.scrollLeft = Math.max(0, scrollLeft);
    }
  }, [activeSection]);

  // Scroll active button into view when activeSection changes
  useEffect(() => {
    // Use requestAnimationFrame for immediate execution after DOM update
    requestAnimationFrame(() => {
      scrollActiveButtonIntoView();
    });
  }, [scrollActiveButtonIntoView]);

  useEffect(() => {
    const handleGlobalScroll = () => {
      const scrollTop = window.scrollY;

      const viewportHeight = window.innerHeight;
      const heroHeight = viewportHeight * 0.6;

      const isMobile = window.innerWidth < 768;
      const stickyThreshold = isMobile ? heroHeight - 100 : heroHeight - 200;

      setScroll(scrollTop > stickyThreshold);

      const navigationElement = document.querySelector("[data-navigation]");
      if (navigationElement) {
        const navigationRect = navigationElement.getBoundingClientRect();

        const mobileStickyPoint = 64;
        const desktopStickyPoint = 120;

        const shouldBeFixed = isMobile
          ? navigationRect.top <= mobileStickyPoint + 1
          : navigationRect.top <= desktopStickyPoint + 1;

        setIsSectionActive(shouldBeFixed);
      }
    };

    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleGlobalScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledHandleScroll);
    window.addEventListener("resize", throttledHandleScroll);
    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
      window.removeEventListener("resize", throttledHandleScroll);
    };
  }, [setScroll, setIsSectionActive, setShowSectionNavigation]);

  useEffect(() => {
    const sections = uniqueSubcategories.map(subcategory => subcategory.sectionId);

    const navigationElement = navigationRef.current;
    const navHeight = navigationElement ? navigationElement.offsetHeight : 0;
    const isMobile = window.innerWidth < 768;
    const mainHeaderHeight = isMobile ? 64 : 120;
    const topOffset = navHeight + mainHeaderHeight;

    // More responsive scroll detection
    const handleScrollDetection = () => {
      const scrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;

      let activeSectionId = "";
      let minDistance = Infinity;

      sections.forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + scrollTop;
          const distance = Math.abs(elementTop - (scrollTop + topOffset));

          if (distance < minDistance && rect.top <= topOffset + 50) {
            minDistance = distance;
            activeSectionId = sectionId;
          }
        }
      });

      if (activeSectionId && activeSectionId !== activeSection) {
        setActiveSection(activeSectionId);
      }
    };

    // Use both Intersection Observer and direct scroll detection
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: `-${topOffset}px 0px -${window.innerHeight - topOffset - 100}px 0px`,
        threshold: 0.01,
      }
    );

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) observer.observe(element);
    });

    // Add direct scroll listener for immediate response
    window.addEventListener("scroll", handleScrollDetection, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScrollDetection);
    };
  }, [setActiveSection, activeSection, uniqueSubcategories]);

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


  // Show loading or blank screen while checking data or redirecting
  if (loading || isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Don't render if there's an error or no data
  if (error || !thingsToDoData) {
    return null;
  }

  return (
    <div className="relative min-h-screen">
      <style jsx>{`
        @keyframes slideOutUp {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-100%);
            opacity: 0;
          }
        }
        @keyframes slideInUp {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .drawer-container {
          height: calc(var(--vh, 1vh) * 85);
          max-height: calc(var(--vh, 1vh) * 85);
        }
        @supports (padding: max(0px)) {
          .drawer-container {
            padding-bottom: max(1rem, env(safe-area-inset-bottom));
          }
        }
        /* Faster smooth scrolling for navigation */
        [data-navigation] {
          scroll-behavior: smooth;
          scroll-padding: 0;
        }
        [data-navigation] * {
          scroll-behavior: smooth;
        }
      `}</style>
      <section className="relative">
        <div className="hidden md:block fixed top-19 bg-white w-full py-3 z-30 border-b">
          <div className="hidden md:block">
            <CategoriesDropdown
              categories={categoriesFromExperiences}
              topExperiences={allUniqueExperiences}
              showCategoriesDropdown={showCategoriesDropdown}
              setShowCategoriesDropdown={setShowCategoriesDropdown}
              setShowBanner={setShowBanner}
            />
          </div>
          <div
            className={` transition-all duration-300 origin-top overflow-hidden ${
              showBanner ? "scale-y-100 h-auto" : "scale-y-0 h-0"
            }`}
          >
            <Banner />
          </div>
        </div>

        <div className="max-w-[1200px] relative mx-auto px-[24px] xl:px-0 ">
          {loading ? (
            <ThingsToDoHeroSkeleton />
          ) : (
            <Hero
              city={city}
              images={thingsToDoData?.mainCards
                ?.map((card) => card.basicInfo?.mainImage)
                .filter((img): img is string => typeof img === 'string' && img.length > 0) || []}
              experiences={thingsToDoData?.mainCards}
            />
          )}
          <div className="md:hidden px-3 mt-[-30px] pb-2  relative z-40">
            <button
              className="pl-2 w-full flex items-center bg-white gap-2 rounded-md p-1 shadow-lg text-sm cursor-pointer"
              onClick={() => setIsCustomDrawerOpen(true)}
            >
              <div className="flex-1 relative">
                <Input className="bg-transparent border-none focus-visible:ring-0 shadow-none cursor-pointer text-[13px] pointer-events-none h-auto" />
                <AnimatedPlaceholder />
              </div>
              <div className="bg-[#8000FF] rounded p-2">
                <Search strokeWidth={1} className="text-white" />
              </div>
            </button>
          </div>
        </div>

        {loading ? (
          <ThingsToDoNavigationSkeleton />
        ) : (
          <div
            ref={navigationRef}
            data-navigation
            className={`block sticky w-full bg-white z-20 py-4 md:top-30 top-16 ${
              isSectionActive ? "shadow-lg" : ""
            }`}
          >
            <div className="relative">
              <div
                ref={scrollContainerRef}
                className="flex relative gap-2 overflow-x-auto scrollbar-hide z-20 max-w-[1200px] mx-auto px-[24px] xl:px-0"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {showLeftButton && (
                  <div className="absolute left-3.5 top-0 z-10 bottom-0 items-center flex">
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

                {uniqueSubcategories.map((subcategory, index) => {
                  const sectionId = subcategory.sectionId;
                  const IconComponent = getIconForCategory(subcategory.subcategoryName);

                  return (
                    <button
                      key={index}
                      data-section={sectionId}
                      onClick={() => scrollToSection(sectionId)}
                      className={`font-halyard-text hover:cursor-pointer flex items-center text-sm sm:text-base gap-2 py-[11px] px-[15px] border rounded-[4px] whitespace-nowrap transition-all duration-200 ${
                        activeSection === sectionId
                          ? "bg-purple-600/10 text-purple-600 border-purple-600/20"
                          : "text-[#444444] border-gray-200 hover:bg-purple-600/10 hover:text-purple-600"
                      }`}
                    >
                      <IconComponent strokeWidth={1} />
                      {subcategory.subcategoryName}
                    </button>
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
            </div>
          </div>
        )}

        <div className="max-w-[1200px] px-[24px] xl:px-0 mx-auto pb-10">
          {loading ? (
            <ThingsToDoCarouselSkeleton title={`Top experiences in ${city?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`} />
          ) : thingsToDoData?.topExperiences && thingsToDoData.topExperiences.length > 0 ? (
            <CarouselGrid
              title={`Top experiences in ${city?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`}
              recommendations={transformExperiencesToRecommendations(thingsToDoData.topExperiences)}
              variant="subcategory"
            />
          ) : null}
        </div>
        <div className="  xl:px-0 pb-10">
          <Activities />
        </div>
        <div className="max-w-[1200px] px-[24px] xl:px-0 mx-auto pb-10">
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <ThingsToDoCarouselSkeleton key={index} />
            ))
          ) : (
            uniqueSubcategories.map((subcategory, index) => {
              const sectionId = subcategory.sectionId;
              const transformedRecommendations = transformExperiencesToRecommendations(subcategory.experiences);

              return transformedRecommendations.length > 0 ? (
                <div key={index} id={sectionId}>
                  <CarouselGrid
                    title={subcategory.subcategoryName}
                    recommendations={transformedRecommendations}
                    variant="subcategory"
                  />
                </div>
              ) : null;
            })
          )}
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto mt-10 pb-10 px-[24px] xl:px-0">
        {loading ? (
          <ThingsToDoMustDoSkeleton />
        ) : thingsToDoData?.mustDoExperiences && thingsToDoData.mustDoExperiences.length > 0 ? (
          <MustDo mustDoData={thingsToDoData.mustDoExperiences} city={city} />
        ) : null}

        <div className="mb-7">
          {getRandomBlogSlugs.length > 0 && (
          <TravelGuide blogSlugs={getRandomBlogSlugs as string[]} city={city} />
          )}
        </div>

        {loading ? (
          <ThingsToDoBrowseThemesSkeleton />
        ) : categoriesFromExperiences && categoriesFromExperiences.length > 0 ? (
          <div className="mb-10">
            <BrowseThemes categoriesData={categoriesFromExperiences} city={city} />
          </div>
        ) : null}

        {loading ? (
          <ThingsToDoTestimonialsSkeleton />
        ) : thingsToDoData?.reviews && thingsToDoData.reviews.length > 0 ? (
          <Testimonials variant="default" reviewsData={thingsToDoData.reviews} />
        ) : null}

        <Destinations />

        {loading ? (
          <ThingsToDoFaqsSkeleton />
        ) : faqsData && faqsData.length > 0 ? (
          <Faqs faqsData={faqsData} />
        ) : null}

        <Banner />
        <Stats />
      </div>

      <AnimatePresence>
        {isCustomDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 z-[9998]"
              onClick={() => setIsCustomDrawerOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 400,
                mass: 0.8,
              }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={(event, info) => {
                if (info.offset.y > 100) {
                  setIsCustomDrawerOpen(false);
                }
              }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-[9999] drawer-container flex flex-col"
            >
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
              </div>
              <div className="bg-white px-4 pb-4 border-gray-200 flex-shrink-0">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    className="p-2 flex-shrink-0"
                    onClick={() => setIsCustomDrawerOpen(false)}
                  >
                    <ArrowLeft size={20} className="text-[#444444]" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <Input
                      ref={mobileInputRef}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-12 border-none px-2 text-base focus:border-gray-400 focus-visible:ring-0"
                      placeholder="Search for experiences and cities"
                    />
                  </div>
                </div>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4">
                {isSearchLoading ? (
                  <div className="text-center py-8">
                    <div className="text-[#666666]">Loading...</div>
                  </div>
                ) : !searchQuery ? (
                  <>
                    {displayDestinations.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-xs font-medium text-[#444444] mb-2 px-2">
                          Top destinations near you
                        </h3>
                        <div className="space-y-0 max-h-40 overflow-y-auto">
                          {displayDestinations.map((dest: any) => (
                            <Link
                              key={dest.id}
                              href={generateDestinationUrl(dest)}
                              className="flex items-center gap-2 py-3 px-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              <div className="w-10 h-10 rounded overflow-hidden">
                                <img
                                  src={dest.imageUrl || dest.image}
                                  alt={dest.cityName || dest.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-semibold text-[#444444] text-sm">
                                  {dest.cityName || dest.name}
                                </div>
                                <div className="text-[#666666] text-xs">
                                  {dest.countryName || dest.country}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                    {displayActivities.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-xs font-medium text-[#444444] mb-2 px-2">
                          Top things to do worldwide
                        </h3>
                        <div className="space-y-0 max-h-48 overflow-y-auto">
                          {displayActivities.map((activity: any) => (
                            <Link
                              key={activity.id}
                              href={generateActivityUrl(activity)}
                              className="flex items-center gap-2 py-3 px-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              <div className="relative w-10 h-10">
                                <div className="relative border-white border w-10 h-10 rounded overflow-hidden">
                                  <img
                                    src={activity.imageUrls?.[0] || activity.imageUrl?.[0] || activity.image}
                                    alt={activity.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="font-semibold text-[#444444] text-sm">
                                  {activity.title}
                                </div>
                                <div className="text-[#666666] text-xs">
                                  {activity.cityName}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {isSearchLoading ? (
                      <div className="text-center py-8">
                        <div className="text-[#666666]">Searching...</div>
                      </div>
                    ) : (
                      <>
                        {displayDestinations.length > 0 && (
                          <div className="mb-4">
                            <h3 className="text-xs font-medium text-[#444444] mb-2 px-2">
                              Destinations ({displayDestinations.length})
                            </h3>
                            <div className="space-y-0 max-h-40 overflow-y-auto">
                              {displayDestinations.map((dest: any) => (
                                <Link
                                  key={dest.id}
                                  href={generateDestinationUrl(dest)}
                                  className="flex items-center gap-2 py-3 px-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                  <div className="w-10 h-10 rounded overflow-hidden">
                                    <img
                                      src={dest.imageUrl || dest.image}
                                      alt={dest.cityName || dest.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <div className="font-semibold text-[#444444] text-sm">
                                      {dest.cityName || dest.name}
                                    </div>
                                    <div className="text-[#666666] text-xs">
                                      {dest.countryName || dest.country}
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                        {displayActivities.length > 0 && (
                          <div className="mb-4">
                            <h3 className="text-xs font-medium text-[#444444] mb-2 px-2">
                              Activities ({displayActivities.length})
                            </h3>
                            <div className="space-y-0 max-h-48 overflow-y-auto">
                              {displayActivities.map((activity: any) => (
                                <Link
                                  key={activity.id}
                                  href={generateActivityUrl(activity)}
                                  className="flex items-center gap-2 py-3 px-2 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                  <div className="w-10 h-10 rounded overflow-hidden">
                                    <img
                                      src={activity.imageUrls?.[0] || activity.imageUrl?.[0] || activity.image}
                                      alt={activity.title}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <div className="font-semibold text-[#444444] text-sm">
                                      {activity.title}
                                    </div>
                                    <div className="text-[#666666] text-xs">
                                      {activity.cityName}
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                        {displayDestinations.length === 0 && displayActivities.length === 0 && (
                          <div className="text-center py-8">
                            <div className="text-[#666666]">
                              No results found for "{searchQuery}"
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThingsToDo;
