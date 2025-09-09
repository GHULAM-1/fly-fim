"use client";
import React, { useEffect, useState, useRef } from "react";
import { ChevronRight, Menu, Smartphone } from "lucide-react";
import { useParams } from "next/navigation";

interface Category {
  id: number;
  name: string;
  color: string;
  url?: string;
}

interface TourListings {
  [key: number]: string[];
}

interface CategoriesDropdownProps {
  showCategoriesDropdown: boolean;
  setShowCategoriesDropdown: (show: boolean) => void;
  setShowBanner: (show: boolean) => void;
}

const CategoriesDropdown: React.FC<CategoriesDropdownProps> = ({
  showCategoriesDropdown,
  setShowCategoriesDropdown,
  setShowBanner,
}) => {
  const [hoveredCategory, setHoveredCategory] = useState(1);
  const categoriesScrollRef = useRef<HTMLDivElement>(null);
  const customScrollbarRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  
  const city = params.city as string;

  const decodedCity = decodeURIComponent(city);

  const formattedCityName = decodedCity
  ? decodedCity.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  : "City";

const categories: Category[] = [
    { id: 1, name: `Top things to do in ${formattedCityName}`, color: "purple", url: `/things-to-do/${city}` },
    { id: 2, name: "Tickets", color: "gray", url: `/things-to-do/${city}/tickets` },
    { id: 3, name: "Tours", color: "gray", url: `/things-to-do/${city}/tours` },
    { id: 4, name: "Transportation", color: "gray", url: `/things-to-do/${city}/transportation` },
    { id: 5, name: "Travel Services", color: "gray", url: `/things-to-do/${city}/travel-services` },
    { id: 6, name: "Cruises", color: "gray", url: `/things-to-do/${city}/cruises` },
    { id: 7, name: "Food & Drink", color: "gray", url: `/things-to-do/${city}/food-drink` },
    { id: 8, name: "Entertainment", color: "gray", url: `/things-to-do/${city}/entertainment` },
    { id: 9, name: "Adventure", color: "gray", url: `/things-to-do/${city}/adventure` },
    { id: 10, name: "Water Sports", color: "gray", url: `/things-to-do/${city}/water-sports` },
    { id: 11, name: "Wellness", color: "gray", url: `/things-to-do/${city}/wellness` },
    { id: 12, name: "Specials", color: "gray", url: `/things-to-do/${city}/specials` },
  ];

  const tourListings: TourListings = {
    1: [
      "Colosseum",
      "Vatican Museums", 
      "Rome To Pompeii Tours",
      "St. Peter's Basilica",
      "Rome Pantheon",
    ],
    2: [
      "Colosseum Tickets",
      "Vatican Museums Pass",
      "Roman Forum Access",
      "Pantheon Entry",
      "Castel Sant'Angelo"
    ],
    3: [
      "Rome Walking Tour",
      "Vatican City Tour",
      "Colosseum Guided Tour",
      "Food & Wine Tour",
      "Night Photography Tour",
      "Historical Rome Tour",
    ],
    4: [
      "Airport Transfers",
      "Public Transport",
      "Train Tickets",
      "Train Passes",
      "Private Airport Transfers",
      "Shared Airport Transfers"
    ],
    5: [
      "Wifi & SIM Cards",
      "Airport Services",
      "Luggage Storage",
      "Travel Insurance",
      "Visa Services",
    ],
    6: [
      "River Cruises",
      "Day Cruises",
      "Luxury Cruises",
      "Dinner Cruises",
    ],
    7: [
      "Cooking Classes",
      "Wine Tasting",
      "Restaurant Tours",
      "Food Markets",
      "Pizza Making",
      "Gelato Tours",
      "Coffee Tours",
      "Street Food Tours"
    ],
    8: [
      "Theater Shows",
      "Concerts",
      "Opera Tickets",
      "Comedy Shows",
      "Dance Performances",
      "Live Music",
      "Cinema Tickets"
    ],
    9: [
      "Hiking Tours",
      "Rock Climbing",
      "Zip Lining",
      "Paragliding",
      "Mountain Biking",
      "Caving Tours",
      "Rafting Adventures"
    ],
    10: [
      "Scuba Diving",
      "Snorkeling",
      "Jet Skiing",
      "Sailing",
      "Kayaking",
      "Paddleboarding",
      "Fishing Tours"
    ],
    11: [
      "Spa",
    ],
    12: [
      "Combos",
      "Valentine's Day",
      "Digital Experience",
    ],
  };

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
                  {categories.map((category) => (
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
                {hoveredCategory && hoveredCategory !== 1 && tourListings[hoveredCategory as keyof typeof tourListings] ? (
                  <div className="col-span-3">
                    <div className="space-y-3">
                      <div className="flex flex-col space-y-3">
                        {tourListings[hoveredCategory as keyof typeof tourListings].map((item, index) => {
                          const categoryObj = categories.find(c => c.id === hoveredCategory);
                          const categoryRoute = categoryObj?.url?.split('/').pop();
                          const getSubcategorySlug = (subcategoryName: string, categoryName: string) => {
                            const name = subcategoryName.toLowerCase();
                            switch (categoryName.toLowerCase()) {
                              case "tours":
                                if (name.includes("walking")) return "walking-tours";
                                if (name.includes("guided")) return "guided-tours";
                                if (name.includes("hop-on") || name.includes("hop off")) return `hop-on-hop-off-tours-${city}`;
                                if (name.includes("city")) return "city-tours";
                                if (name.includes("day")) return "day-trips";
                                if (name.includes("heritage")) return "heritage-experiences";
                                break;
                              case "tickets":
                                if (name.includes("museum")) return "museums";
                                if (name.includes("landmark")) return "landmarks";
                                if (name.includes("zoo")) return "zoos";
                                if (name.includes("religious")) return "religious-sites";
                                if (name.includes("city card")) return "city-cards";
                                if (name.includes("theme park")) return "theme-parks";
                                break;
                              case "transportation":
                                if (name.includes("public")) return "public-transport";
                                if (name.includes("car rental")) return "car-rentals";
                                if (name.includes("ferry")) return "ferry-services";
                                if (name.includes("airport")) return "airport-transfers";
                                if (name.includes("bike")) return "bike-rentals";
                                if (name.includes("metro")) return "metro-services";
                                break;
                              case "food-drink":
                                if (name.includes("cooking")) return "cooking-classes";
                                if (name.includes("food tour")) return "food-tours";
                                if (name.includes("wine")) return "wine-tastings";
                                if (name.includes("restaurant")) return "restaurant-reservations";
                                if (name.includes("market")) return "local-markets";
                                if (name.includes("dietary")) return "dietary-options";
                                break;
                              case "entertainment":
                                if (name.includes("live show")) return "live-shows";
                                if (name.includes("theater")) return "theater";
                                if (name.includes("theme park")) return "theme-parks";
                                if (name.includes("concert")) return "concerts";
                                if (name.includes("comedy")) return "comedy-clubs";
                                if (name.includes("nightlife")) return "nightlife";
                                break;
                              case "adventure":
                                if (name.includes("hiking")) return "hiking";
                                if (name.includes("rock climbing")) return "rock-climbing";
                                if (name.includes("off-road")) return "off-road-tours";
                                if (name.includes("zip")) return "zip-lining";
                                if (name.includes("caving")) return "caving";
                                if (name.includes("paragliding")) return "paragliding";
                                break;
                              case "water-sports":
                                if (name.includes("sailing")) return "sailing";
                                if (name.includes("scuba")) return "scuba-diving";
                                if (name.includes("surfing")) return "surfing";
                                if (name.includes("kayaking")) return "kayaking";
                                if (name.includes("jet ski")) return "jet-skiing";
                                if (name.includes("fishing")) return "fishing";
                                break;
                              case "wellness":
                                if (name.includes("spa")) return "spa-retreats";
                                if (name.includes("yoga")) return "yoga-classes";
                                if (name.includes("meditation")) return "meditation";
                                if (name.includes("fitness")) return "fitness-centers";
                                if (name.includes("thermal")) return "thermal-baths";
                                if (name.includes("mindfulness")) return "mindfulness";
                                break;
                              case "specials":
                                if (name.includes("discount")) return "discount-deals";
                                if (name.includes("vip")) return "vip-experiences";
                                if (name.includes("package")) return "package-deals";
                                if (name.includes("seasonal")) return "seasonal-offers";
                                if (name.includes("last minute")) return "last-minute";
                                if (name.includes("group")) return "group-discounts";
                                break;
                              case "cruises":
                                if (name.includes("port")) return "port-excursions";
                                if (name.includes("shore")) return "shore-tours";
                                if (name.includes("cruise package")) return "cruise-packages";
                                if (name.includes("onboard")) return "onboard-activities";
                                if (name.includes("dining")) return "dining-options";
                                if (name.includes("entertainment")) return "entertainment";
                                break;
                              case "travel-services":
                                if (name.includes("planning")) return "planning";
                                if (name.includes("concierge")) return "concierge";
                                if (name.includes("insurance")) return "insurance";
                                if (name.includes("visa")) return "visa-services";
                                if (name.includes("currency")) return "currency";
                                if (name.includes("translation")) return "translations";
                                break;
                            }
                            return item.replace(/\s+/g, '-').toLowerCase();
                          };
                          
                          const subcategorySlug = getSubcategorySlug(item, categoryObj?.name || "");
                          const subcategoryUrl = `/things-to-do/${city}/${categoryRoute}/${subcategorySlug}`;
                          return (
                            <a
                              key={index}
                              href={subcategoryUrl}
                              className="block text-[15px] font-halyard-text text-[#444444] hover:text-[#8000ff] cursor-pointer py-1"
                            >
                              {item}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <img src="/images/a1.jpg.avif" alt="Colosseum" className="w-12 h-12 object-cover rounded" />
                        <div>
                          <div className="font-halyard-text text-[16px] text-[#444444]">Colosseum</div>
                          <div className="text-[12px] font-halyard-text-light text-[#666666]">from $21.04</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <img src="/images/a2.jpg.avif" alt="Vatican Museums" className="w-12 h-12 object-cover rounded" />
                        <div>
                          <div className="font-halyard-text text-[16px] text-[#444444]">Vatican Museums</div>
                          <div className="text-[12px] font-halyard-text-light text-[#666666]">from $29.22</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <img src="/images/a3.png.avif" alt="Rome To Pompeii Tours" className="w-12 h-12 object-cover rounded" />
                        <div>
                          <div className="font-halyard-text text-[16px] text-[#444444]">Rome To Pompeii Tours</div>
                          <div className="text-[12px] font-halyard-text-light text-[#666666]">from $93.89</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <img src="/images/a4.jpg.avif" alt="St. Peter's Basilica" className="w-12 h-12 object-cover rounded" />
                        <div>
                          <div className="font-halyard-text text-[16px] text-[#444444]">St. Peter's Basilica</div>
                          <div className="text-[12px] font-halyard-text-light text-[#666666]">from $7.01</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <img src="/images/a5.jpg.avif" alt="Rome Pantheon" className="w-12 h-12 object-cover rounded" />
                        <div>
                          <div className="font-halyard-text text-[16px] text-[#444444]">Rome Pantheon</div>
                          <div className="text-[12px] font-halyard-text-light text-[#666666]">from $5.73</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Column 2 */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <img src="/images/a6.jpg.avif" alt="Castel Sant Angelo" className="w-12 h-12 object-cover rounded" />
                        <div>
                          <div className="font-halyard-text text-[16px] text-[#444444]">Castel Sant Angelo</div>
                          <div className="text-[12px] font-halyard-text-light text-[#666666]">from $18.70</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <img src="/images/d1.jpg.avif" alt="Sistine Chapel" className="w-12 h-12 object-cover rounded" />
                        <div>
                          <div className="font-halyard-text text-[16px] text-[#444444]">Sistine Chapel</div>
                          <div className="text-[12px] font-halyard-text-light text-[#666666]">from $29.22</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <img src="/images/d2.jpg.avif" alt="Musei Capitolini" className="w-12 h-12 object-cover rounded" />
                        <div>
                          <div className="font-halyard-text text-[16px] text-[#444444]">Musei Capitolini</div>
                          <div className="text-[12px] font-halyard-text-light text-[#666666]">from $32.61</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <img src="/images/d3.jpg.avif" alt="Roman Catacombs Tour" className="w-12 h-12 object-cover rounded" />
                        <div>
                          <div className="font-halyard-text text-[16px] text-[#444444]">Roman Catacombs Tour</div>
                          <div className="text-[12px] font-halyard-text-light text-[#666666]">from $14.03</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <img src="/images/d4.jpg.avif" alt="Borghese Gallery" className="w-12 h-12 object-cover rounded" />
                        <div>
                          <div className="font-halyard-text text-[16px] text-[#444444]">Borghese Gallery</div>
                          <div className="text-[12px] font-halyard-text-light text-[#666666]">from $26.89</div>
                        </div>
                      </div>
                    </div>
                    
                                              {/* Column 3 */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <img src="/images/d5.jpg.avif" alt="Altare della Patria" className="w-12 h-12 object-cover rounded" />
                        <div>
                          <div className="font-halyard-text text-[16px] text-[#444444]">Altare della Patria</div>
                          <div className="text-[12px] font-halyard-text-light text-[#666666]">from $38.58</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <img src="/images/d6.jpeg.avif" alt="Doria Pamphilj Gallery" className="w-12 h-12 object-cover rounded" />
                        <div>
                          <div className="font-halyard-text text-[16px] text-[#444444]">Doria Pamphilj Gallery</div>
                          <div className="text-[12px] font-halyard-text-light text-[#666666]">from $33.90</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <img src="/images/a1.jpg.avif" alt="Rome To Amalfi Coast Tours" className="w-12 h-12 object-cover rounded" />
                        <div>
                          <div className="font-halyard-text text-[16px] text-[#444444]">Rome To Amalfi Coast Tours</div>
                          <div className="text-[12px] font-halyard-text-light text-[#666666]">from $139.11</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <img src="/images/a2.jpg.avif" alt="Rome To Tuscany Tours" className="w-12 h-12 object-cover rounded" />
                        <div>
                          <div className="font-halyard-text text-[16px] text-[#444444]">Rome To Tuscany Tours</div>
                          <div className="text-[12px] font-halyard-text-light text-[#666666]">from $115.73</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <img src="/images/a4.jpg.avif" alt="Bioparco Rome" className="w-12 h-12 object-cover rounded" />
                        <div>
                          <div className="font-halyard-text text-[16px] text-[#444444]">Bioparco Rome</div>
                          <div className="text-[12px] font-halyard-text-light text-[#666666]">from $22.21</div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
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
      Download App{" "}
    </button>
  </div>
  );
};

export default CategoriesDropdown; 