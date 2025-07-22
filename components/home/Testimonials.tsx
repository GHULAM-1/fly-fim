"use client";
import { t } from "i18next";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import "flag-icons/css/flag-icons.min.css";
import React, { useRef, useState, useEffect } from "react";

const Testimonials = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setIsAtStart(el.scrollLeft <= 0);
    setIsAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

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

  const renderStars = (rating: any) => {
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
    <div className="py-10 bg-gradient-to-r from-[#130D1A] via-[#2F1025] to-[#130D1A] text-white">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-2/5 ">
          <div className="mb-[25px] md:py-[48px] xl:py-[60px]">
            <div
              className="sm:pr-8 md:pr-0 lg:pr-0 xl:pr-0"
              style={{ marginLeft: "max(16px, calc((100vw - 1200px) / 2))" }}
            >
              <div className="flex md:hidden items-center justify-between">
                <div>
                  <h2 className="text-2xl md:text-5xl font-heading mb-2 max-w-[100%] sm:max-w-[100%] md:max-w-[70%] xl:max-w-[350px] leading-tight flex md:block items-center justify-between">
                    <span
                      className="w-full hidden md:block shrink-0"
                      dangerouslySetInnerHTML={{
                        __html: t("testimonials.title"),
                      }}
                    />
                    <span
                      className="w-full block md:hidden ml-2 shrink-0"
                      dangerouslySetInnerHTML={{
                        __html: t("testimonials.title2"),
                      }}
                    />
                  </h2>
                </div>
                <div>
                  <img
                    src="/images/info3.gif"
                    alt=""
                    className=" mr-3 w-12 h-12 inline"
                  />
                </div>
              </div>
              <h2 className="text-2xl md:text-5xl font-heading mb-2 max-w-[80%] sm:max-w-[90%] md:max-w-[70%] xl:max-w-[350px] leading-tight hidden md:flex items-center justify-between">
                <span className="w-full hidden md:block shrink-0">
                  <span
                  className="mr-2"
                    dangerouslySetInnerHTML={{ __html: t("testimonials.title") }}
                  />
                  <img
                    src="/images/info3.gif"
                    alt=""
                    className="mr-3 w-12 h-12 inline"
                  />
                </span>
              </h2>
              <div className="hidden md:flex items-center gap-[34px] mt-[42px]">
                <button
                  onClick={scrollLeft}
                  disabled={isAtStart}
                  className={`bg-white/10 hover:cursor-pointer rounded-full p-2 transition-colors active:opacity-60 `}
                >
                  <ChevronLeft size={40} style={{ color: isAtStart ? '#f8f8f833' : '#fff' }} />
                </button>
                <button
                  onClick={scrollRight}
                  disabled={isAtEnd}
                  className={`bg-white/10 hover:cursor-pointer rounded-full p-2 transition-colors active:opacity-60 `}
                >
                  <ChevronRight size={40} style={{ color: isAtEnd ? '#f8f8f833' : '#fff' }} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="md:w-3/5 flex gap-6 overflow-x-scroll scrollbar-hide px-[24px] md:px-0"
        >
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-black/30 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 max-w-sm flex-shrink-0 w-full sm:w-auto"
            >
              <img
                src={testimonial.image}
                alt={testimonial.experience}
                className="w-[384px] h-[364px] object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div
                      className={`${testimonial.avatarColor} rounded-full w-12 shrink-0 h-12 flex items-center justify-center text-lg font-heading`}
                    >
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h2 className="text-white text-[18px] md:text-[21px] font-heading">
                        {testimonial.name}
                      </h2>
                      <div className="flex items-center gap-1">
                        <img src="/flag.png" alt="" className="w-4 h-4" />
                        <p className="text-xs sm:text-sm text-[#C4C4C4] font-lightText">
                          {testimonial.country}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {renderStars(testimonial.rating)}
                    </div>
                    <p>{testimonial.rating}/5</p>
                  </div>
                </div>
                <p className="mt-4 mb-10 h-24 text-sm sm:text-base font-text text-[#F8F8F8]">
                  {testimonial.review}
                </p>
                <hr className="my-0 border-[#C4C4C4]" />
                <button className="text-[12px] md:text-[12px] text-[#C4C4C4] md:underline md:underline-offset-4">
                  {testimonial.experience}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
