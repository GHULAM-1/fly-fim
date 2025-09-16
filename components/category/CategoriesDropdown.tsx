"use client";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { ChevronRight, Menu, Smartphone } from "lucide-react";
import { useParams } from "next/navigation";
import { Category as APICategory } from "@/types/things-to-do/things-to-do-types";

interface DisplayCategory {
  id: number;
  name: string;
  color: string;
  url?: string;
  subcategories?: { name: string; experiences: any[] }[];
}

interface CategoriesDropdownProps {
  showCategoriesDropdown: boolean;
  setShowCategoriesDropdown: (show: boolean) => void;
  setShowBanner: (show: boolean) => void;
  categories: { categoryName: string; subcategories: { subcategoryName: string }[] }[];
  topExperiences: any[];
}

const CategoriesDropdown: React.FC<CategoriesDropdownProps> = ({
  showCategoriesDropdown,
  setShowCategoriesDropdown,
  setShowBanner,
  categories,
  topExperiences,
}) => {
  const [hoveredCategory, setHoveredCategory] = useState(1);
  const categoriesScrollRef = useRef<HTMLDivElement>(null);
  const customScrollbarRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  
  var city = params.city as string | undefined;

  // Check if city is undefined or the string "undefined"
  if (!city || city === "undefined") {
    console.log("city is undefined, setting to worldwide");
    city = "worldwide";
  }

  const decodedCity = city ? decodeURIComponent(city) : "worldwide";

  console.log("Final city value:", city);
  console.log("Decoded city:", decodedCity);
  
  const formattedCityName = decodedCity
  ? decodedCity.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  : "Worldwide";

  // Transform API data to display categories
  const displayCategories: DisplayCategory[] = useMemo(() => {
    const transformed: DisplayCategory[] = [
      { id: 1, name: `Top things to do in ${formattedCityName}`, color: "purple", url: `/things-to-do/${city}` }
    ];

    // Add API categories starting from id 2
    categories.forEach((apiCategory, index) => {
      const categorySlug = apiCategory.categoryName.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '');
      transformed.push({
        id: index + 2,
        name: apiCategory.categoryName,
        color: "gray",
        url: `/things-to-do/${city}/${categorySlug}`,
        subcategories: apiCategory.subcategories.map(sub => ({
          name: sub.subcategoryName,
          experiences: []
        }))
      });
    });

    return transformed;
  }, [categories, city, formattedCityName]);


  useEffect(() => {
    const handleCategoriesScroll = () => {
      if (categoriesScrollRef.current && customScrollbarRef.current) {
        const scrollElement = categoriesScrollRef.current;
        const scrollbarThumb = customScrollbarRef.current;
        
        const scrollTop = scrollElement.scrollTop;
        const scrollHeight = scrollElement.scrollHeight;
        const clientHeight = scrollElement.clientHeight;
        
        if (scrollHeight > clientHeight) {
          const maxScroll = scrollHeight - clientHeight;
          const scrollPercentage = Math.min(scrollTop / maxScroll, 1);
          const thumbHeight = Math.max((clientHeight / scrollHeight) * clientHeight, 30);
          const maxThumbTop = clientHeight - thumbHeight;
          const thumbTop = scrollPercentage * maxThumbTop;
          
          const finalThumbTop = scrollTop >= maxScroll - 1 ? maxThumbTop : thumbTop;
          
          scrollbarThumb.style.height = `${thumbHeight}px`;
          scrollbarThumb.style.top = `${finalThumbTop}px`;
          scrollbarThumb.style.display = 'block';
        } else {
          scrollbarThumb.style.display = 'none';
        }
      }
    };

    const scrollElement = categoriesScrollRef.current;
    if (scrollElement) {
      handleCategoriesScroll();
      
      scrollElement.addEventListener("scroll", handleCategoriesScroll);
      scrollElement.addEventListener("wheel", handleCategoriesScroll);
      scrollElement.addEventListener("touchmove", handleCategoriesScroll);
      
      return () => {
        scrollElement.removeEventListener("scroll", handleCategoriesScroll);
        scrollElement.removeEventListener("wheel", handleCategoriesScroll);
        scrollElement.removeEventListener("touchmove", handleCategoriesScroll);
      };
    }
  }, [showCategoriesDropdown]);



  return (
    <div className="flex justify-between items-center max-w-[1200px] mx-auto  px-[24px] xl:px-0">
    <ul className="flex gap-3 lg:gap-8 text-xs lg:text-[15px] font-halyard-text-light text-[#444444] font-light">
      <li 
        className="relative flex hover:cursor-pointer items-center group gap-1 hover:text-[#8000ff] transition-colors duration-200"
        onMouseEnter={() => setShowCategoriesDropdown(true)}
        onMouseLeave={() => {
          setShowCategoriesDropdown(false);
          setHoveredCategory(0);
        }}
      >
        <Menu size={16} className="text-[#444444] group-hover:text-[#8000ff]" />
        All Categories
        
        <div
          className={`fixed top-28 left-1/2 transform -translate-x-1/2 mt-2 bg-white  overflow-hidden transition-all duration-300 origin-top ${
            showCategoriesDropdown 
              ? "scale-y-100 opacity-100" 
              : "scale-y-0 opacity-0"
          }`}
          style={{ zIndex: 1000, width: '1200px', maxWidth: 'calc(100vw - 48px)' }}
        >
          <div className="flex">
            <div className="w-[25%] p-4 relative">
              <div className="border-r border-gray-200 h-full absolute right-0 top-0 bottom-0"></div>
              <div 
                ref={categoriesScrollRef}
                className="max-h-[400px] overflow-y-auto pr-0 scrollbar-hide" 
                id="categories-scroll"
              >
                <div className="space-y-2">
                  {displayCategories.map((category) => (
                                         <a 
                       key={category.id}
                       href={category.url || `/things-to-do/${city}`}
                       className={`text-[15px] font-halyard-text cursor-pointer py-2 flex items-center justify-between ${
                         hoveredCategory === category.id
                           ? 'text-[#8000ff]' 
                           : hoveredCategory === 0 && category.color === 'purple'
                           ? 'text-[#8000ff]' 
                           : 'text-[#666666]'
                       } hover:text-[#8000ff]`}
                       onMouseEnter={() => setHoveredCategory(category.id)}
                     >
                       {category.name} <ChevronRight size={20} />
                     </a>
                  ))}
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
              
              <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gray-100 pointer-events-none">
                <div 
                  ref={customScrollbarRef}
                  className="w-[1px] bg-black rounded-full transition-all duration-200 absolute"
                  style={{ 
                    height: '20%',
                    top: '0%'
                  }}
                ></div>
              </div>
            </div>
            
            <div className="w-[75%] p-4">
              <div className="grid grid-cols-3 gap-6">
                {(() => {
                  const hoveredCategoryObj = displayCategories.find(c => c.id === hoveredCategory);

                  if (hoveredCategory && hoveredCategory !== 1 && hoveredCategoryObj?.subcategories) {
                    return (
                      <div className="col-span-3">
                        <div className="space-y-3">
                          <div className="flex flex-col space-y-3">
                            {hoveredCategoryObj.subcategories.map((subcategory, index) => {
                              const categoryRoute = hoveredCategoryObj?.url?.split('/').pop();
                              const subcategorySlug = subcategory.name.replace(/\s+/g, '-').toLowerCase();
                              const subcategoryUrl = (city && city !== 'undefined') ? `/things-to-do/${city}/${categoryRoute}/${subcategorySlug}` : "/";

                              return (
                                <a
                                  key={index}
                                  href={subcategoryUrl}
                                  className="block text-[15px] font-halyard-text text-[#444444] hover:text-[#8000ff] cursor-pointer py-1"
                                >
                                  {subcategory.name}
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Show top experiences for "Top things to do" category (id: 1)
                  if (hoveredCategory === 1) {
                    // Get top 15 experiences from topExperiences prop
                    const topExperiencesToShow = topExperiences.slice(0, 15);

                    // Split into 3 columns
                    const col1 = topExperiencesToShow.slice(0, 5);
                    const col2 = topExperiencesToShow.slice(5, 10);
                    const col3 = topExperiencesToShow.slice(10, 15);

                    return (
                      <>
                        <div className="space-y-4">
                          {col1.map((experience) => (
                            <div key={experience._id} className="flex items-center space-x-3">
                              <img
                                src={experience.basicInfo.mainImage[0] || "/images/a1.jpg.avif"}
                                alt={experience.basicInfo.title}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div>
                                <div className="font-halyard-text text-[16px] text-[#444444]">
                                  {experience.basicInfo.title}
                                </div>
                                <div className="text-[12px] font-halyard-text-light text-[#666666]">
                                  from ${experience.basicInfo.price.toFixed(2)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Column 2 */}
                        <div className="space-y-4">
                          {col2.map((experience) => (
                            <div key={experience._id} className="flex items-center space-x-3">
                              <img
                                src={experience.basicInfo.mainImage[0] || "/images/a2.jpg.avif"}
                                alt={experience.basicInfo.title}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div>
                                <div className="font-halyard-text text-[16px] text-[#444444]">
                                  {experience.basicInfo.title}
                                </div>
                                <div className="text-[12px] font-halyard-text-light text-[#666666]">
                                  from ${experience.basicInfo.price.toFixed(2)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Column 3 */}
                        <div className="space-y-4">
                          {col3.map((experience) => (
                            <div key={experience._id} className="flex items-center space-x-3">
                              <img
                                src={experience.basicInfo.mainImage[0] || "/images/a3.jpg.avif"}
                                alt={experience.basicInfo.title}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div>
                                <div className="font-halyard-text text-[16px] text-[#444444]">
                                  {experience.basicInfo.title}
                                </div>
                                <div className="text-[12px] font-halyard-text-light text-[#666666]">
                                  from ${experience.basicInfo.price.toFixed(2)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    );
                  }

                  // Default fallback
                  return null;
                })()}
              </div>
            </div>
        </div>
        </div>
      </li>
      <li className="hover:cursor-pointer hover:text-[#8000ff] transition-colors duration-200">Best Sellers</li>
      <li className="hover:cursor-pointer hover:text-[#8000ff] transition-colors duration-200">London theatre tickets</li>
      <li className="hover:cursor-pointer hover:text-[#8000ff] transition-colors duration-200">London Eye</li>
      <li className="hover:cursor-pointer hover:text-[#8000ff] transition-colors duration-200">Tower of London</li>
    </ul>
    <button
      className="text-[15px] text-[#444444] hover:cursor-pointer font-halyard-text-light flex items-center gap-1"
      onMouseEnter={() => setShowBanner(true)}
      onMouseLeave={() => setShowBanner(false)}
    >
      <Smartphone size={16} />
      Get Offer{" "}
    </button>
  </div>
  );
};

export default CategoriesDropdown; 