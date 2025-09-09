"use client";
import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, ThumbsUp } from "lucide-react";

interface PopularAttraction {
  id: number;
  title: string;
  description: string;
  category: string;
  price: string;
  image: string;
  audience: string[];
  rating?: number;
}

interface PopularThingsProps {
  attractions?: PopularAttraction[];
  title?: string;
}

const PopularThings: React.FC<PopularThingsProps> = ({
  attractions = [
    {
      id: 1,
      title: "Colosseum",
      description:
        "Rome's iconic amphitheater, where gladiators battled and 2,000 years of history come alive.",
      category: "Landmarks",
      price: "from $ 20.99",
      image: "/popular/card1.avif",
      audience: ["First-timers", "Couples"],
      rating: 4.8,
    },
    {
      id: 2,
      title: "Vatican Museums",
      description:
        "Discover art, history, and treasures spanning millennia in the Vatican's world-renowned galleries.",
      category: "Museums",
      price: "from $ 29.15",
      image: "/popular/card2.avif",
      audience: ["History Geeks", "Art & Culture Lovers"],
      rating: 4.7,
    },
    {
      id: 3,
      title: "Roman Forum",
      description:
        "The Forum is Ancient Rome's bustling heart. Temples, markets, and courts meld amid faded grandeur.",
      category: "Landmarks",
      price: "from $ 20.99",
      image: "/popular/card3.avif",
      audience: ["History Buffs", "Photography Enthusiasts"],
      rating: 4.6,
    },
    {
      id: 4,
      title: "St. Peter's Basilica",
      description:
        "The world's largest church and a masterpiece of Renaissance architecture.",
      category: "Landmarks",
      price: "from $ 7.01",
      image: "/popular/card2.avif",
      audience: ["Religious Visitors", "Architecture Lovers"],
      rating: 4.9,
    },
    {
      id: 5,
      title: "Pantheon",
      description:
        "Ancient Rome's best-preserved building, a marvel of engineering and architecture.",
      category: "Landmarks",
      price: "from $ 5.73",
      image: "/popular/card1.avif",
      audience: ["Architecture Enthusiasts", "History Lovers"],
      rating: 4.7,
    },
  ],
  title = "Popular things to do",
}) => {
  // ===== State =====
  const VISIBLE_DESKTOP = 3;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Touch (mobile)
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Refs (kept in case you need measurements later)
  const desktopWrapRef = useRef<HTMLDivElement>(null);
  const mobileWrapRef = useRef<HTMLDivElement>(null);

  // ===== Derived =====
  const total = attractions.length;
  const visibleCount = Math.min(VISIBLE_DESKTOP, total);
  const desktopTranslate = `translateX(-${
    (currentIndex * 100) / (visibleCount || 1)
  }%)`;
  const desktopCardWidth = `${100 / (visibleCount || 1)}%`;

  // Map absolute index to visible slot 0..(VISIBLE_DESKTOP-1); -1 if not visible
  const relPos = (i: number) => {
    if (total === 0) return -1;
    const d = (i - currentIndex + total) % total;
    return d < VISIBLE_DESKTOP ? d : -1;
  };

  // ===== Navigation =====
  const go = (dir: -1 | 1) => {
    if (!total) return;
    const maxStart = Math.max(0, total - visibleCount);
    setCurrentIndex((prev) => {
      const next = prev + dir;
      if (next < 0) return maxStart; // wrap
      if (next > maxStart) return 0; // wrap
      return next;
    });
  };
  const nextSlide = () => go(1);
  const prevSlide = () => go(-1);

  // ===== Touch (mobile) =====
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (touchStart == null || touchEnd == null) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) go(1);
    if (distance < -50) go(-1);
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div className="max-w-[1200px] mx-auto md:px-[24px] xl:px-0 mb-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="md:text-[24px] text-[18px] font-halyard-text  text-[#444444]">
          {title}
        </h2>
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={prevSlide}
            aria-label="Previous"
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-gray-400 transition-colors"
          >
            <ChevronLeft size={20} className="text-[#444444]" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next"
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-gray-400 transition-colors"
          >
            <ChevronRight size={20} className="text-[#444444]" />
          </button>
        </div>
      </div>

             {/* ===== DESKTOP: Original hover effects without sliding ===== */}
       <div className="hidden md:block">
         <div className="flex gap-6 h-[340px]">
           {attractions.slice(currentIndex, currentIndex + 3).map((attraction, index) => {
             const isHovered = hoveredCard === index;
             
             // Calculate card visibility and width based on hover state
             const getCardVisibility = () => {
               if (hoveredCard === null) {
                 return { isVisible: true, width: "flex-1" }; // All cards equal width
               }
               
               if (hoveredCard === index) {
                 return { isVisible: true, width: "flex-[2]" }; // Expanded card takes double width
               }
               
               // Hide the adjacent card based on hovered card position
               let adjacentIndex = -1;
               if (hoveredCard === 0) {
                 adjacentIndex = 2; // If first card is hovered, hide last card
               } else if (hoveredCard === 2) {
                 adjacentIndex = 0; // If last card is hovered, hide first card
               } else {
                 adjacentIndex = hoveredCard + 1; // Otherwise hide next card
               }
               
               if (index === adjacentIndex) {
                 return { isVisible: false, width: "flex-0" }; // Hidden card
               }
               
               return { isVisible: true, width: "flex-1" }; // Visible non-hovered card
             };
             
             const { isVisible, width } = getCardVisibility();
             
             return (
               <div
                 key={attraction.id}
                 className={`relative bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-700 ease-out cursor-pointer ${width} ${
                   !isVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'
                 }`}
                 onMouseEnter={() => setHoveredCard(index)}
                 onMouseLeave={() => setHoveredCard(null)}
                 style={{ 
                   transform: !isVisible ? 'scale(0.8)' : 'scale(1)',
                 }}
               >
                 {/* Numbered Ribbon */}
                 <div className="absolute top-0 left-4 z-20">
                   <div className="card-rank-tag bg-[rgb(229,0,110)] text-white px-[14px] py-1 font-bold text-sm relative flex items-center justify-center">
                     <p className="card-rank-tag-text">{attraction.id}</p>
                     <style jsx>{`
                       .card-rank-tag {
                         position: relative;
                       }
                       .card-rank-tag::before {
                         content: "";
                         position: absolute;
                         top: 1.5rem;
                         left: 0px;
                         border-left: 1rem solid rgb(229, 0, 110);
                         border-bottom: 0.625rem solid transparent;
                         border-top: 0.625rem solid rgb(229, 0, 110);
                       }
                       .card-rank-tag::after {
                         content: "";
                         position: absolute;
                         top: 1.5rem;
                         right: 0px;
                         border-right: 1rem solid rgb(229, 0, 110);
                         border-bottom: 0.625rem solid transparent;
                         border-top: 0.625rem solid rgb(229, 0, 110);
                       }
                       @media only screen and (min-width: 768px), print {
                         .card-rank-tag::before {
                           top: 1.75rem;
                           border-left: 1.25rem solid rgb(229, 0, 110);
                           border-bottom: 0.75rem solid transparent;
                           border-top: 0.75rem solid rgb(229, 0, 110);
                         }
                         .card-rank-tag::after {
                           top: 1.75rem;
                           border-right: 1.25rem solid rgb(229, 0, 110);
                           border-bottom: 0.75rem solid transparent;
                           border-top: 0.75rem solid rgb(229, 0, 110);
                         }
                       }
                     `}</style>
                   </div>
                 </div>

                 {/* Background Image */}
                 <div 
                   className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
                   style={{ 
                     backgroundImage: `url(${attraction.image})`,
                     transform: isHovered ? 'scale(1.05)' : 'scale(1)'
                   }}
                 />

                 {/* Dark Gradient Overlay - using exact gradient from image */}
                 <div 
                   className="absolute inset-0"
                   style={{
                     background: isHovered 
                       ? 'linear-gradient(90deg, rgb(21, 1, 42) 41.53%, rgba(21, 1, 42, 0) 87.24%)'
                       : 'linear-gradient(188.04deg, rgba(21, 1, 42, 0) 12.76%, rgb(21, 1, 42) 58.47%)'
                   }}
                 />

                 {/* Content */}
                 <div className="absolute bottom-0 left-0 p-4 text-white" style={{ width: '400px', maxWidth: '400px' }}>
                   {/* Audience Tags */}
                   <div className="flex font-halyard-text items-center gap-2 mb-1">
                     <ThumbsUp size={14} className="text-white" />
                     <span className="text-sm opacity-90">
                       {attraction.audience.join(", ")}
                     </span>
                   </div>

                   {/* Title */}
                   <h3 className="text-lg font-halyard-text mb-3 leading-tight">
                     {attraction.title}
                   </h3>

                   {/* Category Tag */}
                   <div className="inline-block bg-[#ffffff33] border-[1px] border-[#ffffff33] text-white px-[11px] py-[3px] rounded-full text-[11px] font-halyard-text mb-3">
                     {attraction.category}
                   </div>

                   {/* Description - Always 2 lines, no expansion */}
                   <div className="h-[3rem] mb-4">
                     <p className="text-white/90 text-sm font-halyard-text line-clamp-2">
                       {attraction.description}
                     </p>
                   </div>

                   {/* Price */}
                   <div className="text-white font-bold text-[16px] font-halyard-text">
                     {attraction.price}
                   </div>
                 </div>
               </div>
             );
           })}
         </div>
       </div>

      {/* ===== MOBILE: full-width slides + slide-up text ===== */}
      <div className="md:hidden">
        <div className="relative overflow-hidden w-full max-w-[370px] mx-auto">
          <div
            ref={mobileWrapRef}
            className="flex transition-transform duration-500 ease-out"
            style={{ 
              transform: `translateX(-${currentIndex * 80}%)`
            }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {attractions.map((card, i) => {
              const active = i === currentIndex;
              return (
                <div key={card.id} className="w-[85%] shrink-0 px-2">
                  <div className="relative h-[354px] rounded-lg overflow-hidden shadow-lg">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover"
                    />

                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Bottom gradient pad */}
                    <div
                      className="absolute bottom-0 left-0 right-0 pointer-events-none transition-all duration-500"
                      style={{
                        height: "50%",
                        background:
                          "linear-gradient(180deg, rgba(21, 1, 42, 0) 0%, rgba(21, 1, 42, 0.3) 20%, rgba(21, 1, 42, 0.7) 60%, rgb(21, 1, 42) 100%)",
                      }}
                    />

                    {/* Text: slide-up + fade for active */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <div
                        className={`transform transition-all duration-500 ${
                          active
                            ? "translate-y-0 opacity-100"
                            : "translate-y-4 opacity-0"
                        }`}
                      >
                        <h3 className="text-lg mb-1">{card.title}</h3>
                        <p className="text-sm text-gray-200 mb-2 line-clamp-2">
                          {card.description}
                        </p>
                        <div className="text-lg font-bold">{card.price}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};

export default PopularThings;
