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
      description: "Rome's iconic amphitheater, where gladiators battled and 2,000 years of history come alive.",
      category: "Landmarks",
      price: "from $ 20.99",
      image: "/popular/card1.avif",
      audience: ["First-timers", "Couples"],
      rating: 4.8
    },
    {
      id: 2,
      title: "Vatican Museums",
      description: "Discover art, history, and treasures spanning millennia in the Vatican's world-renowned galleries.",
      category: "Museums",
      price: "from $ 29.15",
      image: "/popular/card2.avif",
      audience: ["History Geeks", "Art & Culture Lovers"],
      rating: 4.7
    },
    {
      id: 3,
      title: "Roman Forum",
      description: "The Forum is Ancient Rome's bustling heart. Temples, markets, and courts meld amid faded grandeur.",
      category: "Landmarks",
      price: "from $ 20.99",
      image: "/popular/card3.avif",
      audience: ["History Buffs", "Photography Enthusiasts"],
      rating: 4.6
    },
    {
      id: 4,
      title: "St. Peter's Basilica",
      description: "The world's largest church and a masterpiece of Renaissance architecture.",
      category: "Landmarks",
      price: "from $ 7.01",
      image: "/popular/card2.avif",
      audience: ["Religious Visitors", "Architecture Lovers"],
      rating: 4.9
    },
    {
      id: 5,
      title: "Pantheon",
      description: "Ancient Rome's best-preserved building, a marvel of engineering and architecture.",
      category: "Landmarks",
      price: "from $ 5.73",
      image: "/popular/card1.avif",
      audience: ["Architecture Enthusiasts", "History Lovers"],
      rating: 4.7
    }
  ],
  title = "Popular things to do"
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => 
      prevIndex >= attractions.length - 3 ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsAnimating(false), 300);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? Math.max(0, attractions.length - 3) : prevIndex - 1
    );
    setTimeout(() => setIsAnimating(false), 300);
  };

  const visibleAttractions = attractions.slice(currentIndex, currentIndex + 3);
  // Calculate the total slide offset
const slideOffset = currentIndex * (100 / 3); // Assuming 3 cards visible


  const getCardVisibility = (index: number) => {
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

  return (
    <div className="max-w-[1200px] mx-auto md:px-[24px] xl:px-0 mb-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="md:text-[24px] text-[18px] font-halyard-text text-[#444444]">
          {title}
        </h2>
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={prevSlide}
            className="w-10 h-10 rounded-full hover:cursor-pointer bg-white border border-gray-200 flex items-center justify-center hover:border-gray-400 transition-colors"
            disabled={currentIndex === 0}
          >
            <ChevronLeft size={20} className="text-[#444444]" />
          </button>
          <button
            onClick={nextSlide}
            className="w-10 h-10 rounded-full hover:cursor-pointer bg-white border border-gray-200 flex items-center justify-center hover:border-gray-400 transition-colors"
            disabled={currentIndex >= attractions.length - 3}
          >
            <ChevronRight size={20} className="text-[#444444]" />
          </button>
        </div>
      </div>

      <div 
        ref={carouselRef}
        className=" hidden md:flex gap-6 h-[340px] transition-transform duration-300 ease-out"
                  style={{
            width: '100%'
          }}
      >
        {attractions.slice(currentIndex, currentIndex + 3).map((attraction, index) => {
          const { isVisible, width } = getCardVisibility(index);
          
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
              {/* Numbered Ribbon using the exact CSS approach */}
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
                  transform: hoveredCard === index ? 'scale(1.05)' : 'scale(1)'
                }}
              />

              {/* Dark Gradient Overlay - using exact gradient from image */}
              <div 
                className="absolute inset-0"
                style={{
                  background: hoveredCard === index 
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
  );
};

export default PopularThings;