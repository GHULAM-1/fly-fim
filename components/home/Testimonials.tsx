"use client";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";

const Testimonials = () => {
  const { t } = useTranslation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -400,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 400,
        behavior: "smooth",
      });
    }
  };

  const testimonials = [
    {
      id: 1,
      name: "Danish Amjad",
      country: "United Kingdom",
      avatar: "D",
      avatarColor: "bg-purple-500",
      image: "/images/t1.jpeg",
      rating: 5,
      review:
        "Amazing experience! The tour was well organized and our guide was incredibly knowledgeable. Highly recommend this to anyone visiting the city.",
      experience: "Back to the future",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      country: "United States",
      avatar: "S",
      avatarColor: "bg-blue-500",
      image: "/images/t2.jpeg",
      rating: 5,
      review:
        "Absolutely fantastic trip! Everything was perfectly planned and executed. The attention to detail was remarkable and exceeded all expectations.",
      experience: "Museum of Natural History",
    },
    {
      id: 3,
      name: "Marco Rodriguez",
      country: "Spain",
      avatar: "M",
      avatarColor: "bg-green-500",
      image: "/images/t3.jpeg",
      rating: 4,
      review:
        "Great value for money! The booking process was smooth and the experience was memorable. Would definitely book again for my next trip.",
      experience: "City Walking Tour",
    },
    {
      id: 4,
      name: "Emma Chen",
      country: "Australia",
      avatar: "E",
      avatarColor: "bg-pink-500",
      image: "/images/t1.jpeg",
      rating: 5,
      review:
        "Outstanding service from start to finish. The team was professional, friendly, and made sure we had an unforgettable experience.",
      experience: "Harbor Cruise",
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={`${index < rating ? "text-pink-600" : "text-gray-400"}`}
        fill="currentColor"
      />
    ));
  };

  return (
    <div className="py-10 bg-gradient-to-r from-[#130D1A] via-[#2F1025] to-[#130D1A] text-white flex flex-col sm:flex-row gap-6">
      <div className="w-full sm:w-2/5 px-8 md:px-16 lg:px-24 xl:px-28 flex flex-col gap-4 justify-center">
        <h2 className="text-2xl sm:text-5xl font-semibold md:font-bold mb-2 max-w-[70%] xl:max-w-[271px] leading-tight">
          {t("testimonials.title")}
        </h2>
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={scrollLeft}
            className="bg-white/10 rounded-full p-2 hover:bg-white/20 transition-colors"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={scrollRight}
            className="bg-white/10 rounded-full p-2 hover:bg-white/20 transition-colors"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      </div>
      <div
        ref={scrollContainerRef}
        className="w-full sm:w-3/5 flex gap-6 overflow-scroll scrollbar-none px-8 sm:px-0 sm:pr-28"
      >
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-black/30 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 max-w-sm flex-shrink-0 w-full sm:w-auto"
          >
            <img
              src={testimonial.image}
              alt={testimonial.experience}
              className="w-full h-80 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div
                    className={`${testimonial.avatarColor} rounded-full w-12 shrink-0 h-12 flex items-center justify-center text-lg font-bold`}
                  >
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h2 className="text-white text-base sm:text-lg font-semibold md:font-bold">
                      {testimonial.name}
                    </h2>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      {testimonial.country}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {renderStars(testimonial.rating)}
                  </div>
                  <p>{testimonial.rating}/5</p>
                </div>
              </div>
              <p className="mt-4 mb-10 h-24 text-sm sm:text-base text-gray-300">
                {testimonial.review}
              </p>
              <hr className="my-2 border-gray-600" />
              <button className="text-xs text-gray-400 underline underline-offset-4">
                {testimonial.experience}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
