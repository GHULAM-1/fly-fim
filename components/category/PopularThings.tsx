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
  const [mobileCurrentIndex, setMobileCurrentIndex] = useState(0);

  // Touch (mobile)
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Refs (kept in case you need measurements later)
  const desktopWrapRef = useRef<HTMLDivElement>(null);
  const mobileWrapRef = useRef<HTMLDivElement>(null);

  // ===== Derived =====
  const total = attractions.length;

  // Track mobile scroll position for text animation
  React.useEffect(() => {
    const handleScroll = () => {
      if (mobileWrapRef.current) {
        const container = mobileWrapRef.current;
        const scrollLeft = container.scrollLeft;
        const containerWidth = container.offsetWidth;
        
        // Simple calculation: each card takes 65% + 8px padding
        const cardWidth = containerWidth * 0.65 + 8;
        const currentIndex = Math.round(scrollLeft / cardWidth);

        
        setMobileCurrentIndex(Math.min(Math.max(currentIndex, 0), total - 1));
      }
    };

    const container = mobileWrapRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [total]);
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
    if (distance > 50) {
      go(1);
      setMobileCurrentIndex((prev) => Math.min(prev + 1, total - 1));
    }
    if (distance < -50) {
      go(-1);
      setMobileCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div className="max-w-[1200px] mx-auto md:px-[24px] xl:px-0 mb-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8  md:px-0 px-[24px]">
        <h2 className="md:text-[24px] text-[18px] font-heading  text-[#444444]">
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
          {attractions
            .slice(currentIndex, currentIndex + 3)
            .map((attraction, index) => {
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
                    !isVisible ? "opacity-0 pointer-events-none" : "opacity-100"
                  }`}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    transform: !isVisible ? "scale(0.8)" : "scale(1)",
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
                      transform: isHovered ? "scale(1.05)" : "scale(1)",
                    }}
                  />

                  {/* Dark Gradient Overlay - using exact gradient from image */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: isHovered
                        ? "linear-gradient(90deg, rgb(21, 1, 42) 41.53%, rgba(21, 1, 42, 0) 87.24%)"
                        : "linear-gradient(188.04deg, rgba(21, 1, 42, 0) 12.76%, rgb(21, 1, 42) 58.47%)",
                    }}
                  />

                  {/* Content */}
                  <div
                    className="absolute bottom-0 left-0 p-4 text-white"
                    style={{ width: "400px", maxWidth: "400px" }}
                  >
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

      {/* ===== MOBILE: Converted to native horizontal scroll ===== */}
      <div className="md:hidden">
        <div
          ref={mobileWrapRef}
          className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {attractions.map((card, i) => {
            const isActive = i === mobileCurrentIndex;
            return (
              <div
                key={card.id}
                data-card-index={i}
                className="w-[65%] relative shrink-0 snap-center pr-2 first:ml-[24px] last:mr-[24px]"
              >
                <div className="absolute top-0 left-4 z-20">
                  <div className="card-rank-tag bg-[rgb(229,0,110)] text-white px-[14px] py-1 font-bold text-sm relative flex items-center justify-center">
                    <p className="card-rank-tag-text">{card.id}</p>
                    <style jsx>{`
                      .card-rank-tag {
                        position: relative;
                      }
                      .card-rank-tag::before {
                        content: "";
                        position: absolute;
                        top: 100%;
                        left: 0px;
                        border-left: 1.2rem solid rgb(229, 0, 110);
                        border-bottom: 0.625rem solid transparent;
                        border-top: 0.625rem solid rgb(229, 0, 110);
                      }
                      .card-rank-tag::after {
                        content: "";
                        position: absolute;
                        top: 100%;
                        right: 0px;
                        border-right: 1.2rem solid rgb(229, 0, 110);
                        border-bottom: 0.625rem solid transparent;
                        border-top: 0.625rem solid rgb(229, 0, 110);
                      }
                      @media only screen and (min-width: 768px), print {
                        .card-rank-tag::before {
                          top: 100%;
                          border-left: 1.25rem solid rgb(229, 0, 110);
                          border-bottom: 0.75rem solid transparent;
                          border-top: 0.75rem solid rgb(229, 0, 110);
                        }
                        .card-rank-tag::after {
                          top: 100%;
                          border-right: 1.25rem solid rgb(229, 0, 110);
                          border-bottom: 0.75rem solid transparent;
                          border-top: 0.75rem solid rgb(229, 0, 110);
                        }
                      }
                    `}</style>
                  </div>
                </div>
                <div className="relative h-[322px] rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Bottom gradient pad */}
                  <div
                    className="absolute bottom-0 left-0 right-0 pointer-events-none"
                    style={{
                      height: "50%",
                      background:
                        "linear-gradient(180deg, rgba(21, 1, 42, 0) 0%, rgba(21, 1, 42, 0.3) 20%, rgba(21, 1, 42, 0.7) 60%, rgb(21, 1, 42) 100%)",
                    }}
                  />

                  {/* Price - fixed at bottom with background to mask content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-10 text-white">
                    <div className="text-lg font-bold bg-gradient-to-t from-[rgb(21,1,42)] via-[rgb(21,1,42)] to-transparent -mx-4 px-4 pt-2 pb-4 -mb-4">
                      {card.price}
                    </div>
                  </div>

                  {/* Content above price with slide-up animation */}
                  <div
                    className={`absolute bottom-12 left-0 right-0 p-4 text-white transition-transform duration-300 ease-out ${
                      isActive
                        ? "transform translate-y-5"
                        : "transform translate-y-18"
                    }`}
                  >
                    {/* Title - always visible */}
                    <h3 className="text-lg mb-1">{card.title}</h3>

                    {/* Category - always visible */}
                    <span className="text-xs font-halyard-text px-2 py-[1px] text-white border bg-[#ffffff33] rounded-full">
                      {card.category}
                    </span>

                    {/* Description - always present, slides up with the content */}
                    <div className="mt-2 mb-2 z-0">
                      <p className="text-sm text-white line-clamp-2">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PopularThings;
