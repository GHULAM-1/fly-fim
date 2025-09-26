"use client";
import React, { useEffect, useState } from "react";
import BlogNavbar from "./blog-navbar";
import Hero from "./hero";
import MainCard from "./main-card";
import SimpleBlogCards from "./simple-blog-cards";
import CarouselCard from "./carousel-card";
import GuideCard from "./guide-card";
import BestOfCards from "./best-of-cards";
import EmailCard from "./email-card";
import Stats from "../home/Stats";
import { getMainPageConfig } from "@/lib/sanity/queries";
import type { MainPageConfig, MainPageSection } from "@/lib/sanity/types";

export default function BlogPage() {
  const [mainPageConfig, setMainPageConfig] = useState<MainPageConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCity, setSearchCity] = useState<string | undefined>();
  const [clearTrigger, setClearTrigger] = useState(0);

  useEffect(() => {
    const fetchMainPageData = async () => {
      try {
        const config = await getMainPageConfig();
        setMainPageConfig(config);
      } catch (error) {
        console.error("Error fetching main page data:", error);
        // Will fallback to static sections if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchMainPageData();
  }, []);

  // Handle search results from Hero component
  const handleSearchResults = (results: any[], query: string, cityName?: string) => {
    setSearchResults(results || []);
    setSearchQuery(query);
    setSearchCity(cityName);
    setIsSearchMode(true);
  };

  // Clear search and return to main page
  const clearSearch = () => {
    setSearchResults([]);
    setSearchQuery("");
    setSearchCity(undefined);
    setIsSearchMode(false);
    // Trigger clear in Hero component
    setClearTrigger(prev => prev + 1);
  };

  // Function to render each section based on its type
  const renderSection = (section: MainPageSection, index: number) => {
    switch (section._type) {
      case 'mainCardSection':
        return (
          <div key={section._key} className="max-w-[1200px] w-full px-[14px] lg:px-0 mx-auto relative z-10">
            <MainCard blogData={section.mainCard} />
          </div>
        );

      case 'simpleCardsSection':
        return (
          <div key={section._key} className="max-w-[1200px] w-full px-[14px] lg:px-0 mx-auto relative z-10">
            <SimpleBlogCards
              blogCards={section.cards}
              title={section.sectionTitle}
            />
          </div>
        );

      case 'carouselCardsSection':
        return (
          <div key={section._key} className="max-w-[1200px] w-full px-[14px] lg:px-0 mx-auto relative z-10">
            <CarouselCard
              blogCards={section.cards}
              title={section.sectionTitle}
            />
          </div>
        );

      case 'guideCardsSection':
        return (
          <div key={section._key} className="max-w-[1200px] w-full px-[14px] lg:px-0 mx-auto relative z-10">
            <GuideCard
              blogCards={section.cards}
              title={section.sectionTitle}
            />
          </div>
        );

      case 'bestOfCardsSection':
        return (
          <div key={section._key} className="max-w-[1200px] w-full px-[14px] lg:px-0 mx-auto relative z-10">
            <BestOfCards
              blogCards={section.cards}
              title={section.sectionTitle}
            />
          </div>
        );

      default:
        return null;
    }
  };

    return (
      <div className="bg-white mb-10">
        {/* Navbar - Fixed on mobile, relative on desktop */}
        <div className="bg-white fixed md:relative top-0 left-0 right-0 z-[9998]">
          <div className="max-w-[1200px] w-full px-[14px] lg:px-0 mx-auto relative z-[9998]">
            <BlogNavbar />
          </div>
        </div>
        <div className="w-full lg:h-[450px] h-[230px] mx-auto pt-16 md:pt-0 md:-mt-6 relative z-10 mb-16">
          <Hero onSearchResults={handleSearchResults} clearTrigger={clearTrigger} />
        </div>

        {/* Search Results or Dynamic sections from MainPage API */}
        {isSearchMode ? (
          <div className="max-w-[1200px] w-full px-[14px] lg:px-0 mx-auto relative z-0">
            {/* Search Results Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[#080808] mb-2">
                    Search Results
                  </h2>
                  <p className="text-gray-600">
                    Found {searchResults?.length || 0} results for "{searchQuery}"
                    {searchCity && ` in ${searchCity}`}
                  </p>
                </div>
                <button
                  onClick={clearSearch}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Clear Search
                </button>
              </div>
              <div className="border-b-[3px] border-[#8000FF] mt-4 max-w-[100px]"></div>
            </div>

            {/* Search Results */}
            {searchResults && searchResults.length > 0 ? (
              <div className="grid lg:grid-cols-3 grid-cols-1 gap-x-4 xl:gap-x-0 gap-y-4 mb-10">
                {searchResults.map((post, index) => (
                  <a
                    key={post._id}
                    href={`/blog/${post.slug?.current || post.slug || '#'}`}
                    className="shadow-sm group hover:cursor-pointer bg-white max-w-[385px] rounded-[4px] hover:shadow-md transition-shadow duration-300 block"
                  >
                    <div className="max-h-[210px] transition-all duration-300 relative overflow-hidden rounded-t-[4px]">
                      <img
                        src={post.cardImage?.asset?.url || post.heroImage?.asset?.url || '/placeholder.jpg'}
                        alt={post.title}
                        className="object-center group-hover:opacity-70 w-full"
                      />
                      <div className="absolute opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-300 bg-black text-[#b6aead] p-[5px] right-0 bottom-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="text-[18px] text-[#4a4a4a] line-clamp-2 p-[15px]">
                        {post.cardTitle || post.title}
                      </p>
                      <div className="px-[15px] pb-[10px]">
                        <p className="text-sm text-gray-500 mb-2">
                          {post.city?.name} • {new Date(post.publishDate).toLocaleDateString()}
                        </p>
                        <p className="text-[16px] hover:underline hover:cursor-pointer text-[#8000FF]">
                          Read more
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl text-gray-600 mb-2">No results found</h3>
                <p className="text-gray-500">
                  Try searching with different keywords or select a different city
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Default MainPage sections */
          <>
            {mainPageConfig?.sections ? (
              <>
                {mainPageConfig.sections.map((section, index) => renderSection(section, index))}
              </>
            ) : (
              /* Fallback to static sections if no config */
              <>
                <div className="max-w-[1200px] w-full px-[14px] lg:px-0 mx-auto relative z-10">
                  <SimpleBlogCards blogCards={[]} title={""} />
                  <CarouselCard blogCards={[]} title={""} />
                  <GuideCard blogCards={[]} title={""} />
                  <BestOfCards blogCards={[]} title={""} />
                </div>
              </>
            )}
          </>
        )}

        <div className="max-w-[1200px] w-full px-[14px] lg:px-0 mx-auto relative z-10">
          <EmailCard />
          <Stats />
        </div>
      </div>
    );
  };