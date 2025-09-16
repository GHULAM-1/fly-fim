"use client";
import Link from "next/link";
import React, { useRef, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Star, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import TestimonialsViewer from "./testimonials-viewer";

import { Review } from "@/types/things-to-do/things-to-do-types";

interface TestimonialsProps {
  variant: "things-to-do" | "default";
  reviewsData?: Review[]; // API reviews data with proper typing
}

const Testimonials = ({ variant, reviewsData }: TestimonialsProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState<any>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Debug logging
  console.log('Testimonials - reviewsData:', reviewsData);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -scrollContainerRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollContainerRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  };

  // Transform API reviews data to testimonials format
  const transformedTestimonials = reviewsData?.map((review) => ({
    id: review._id,
    name: review.userId, // Use userId as name
    country: "United States", // Hardcoded for now
    date: new Date(review._creationTime).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    avatar: "/images/t1.jpeg", // Fallback avatar as API doesn't have user avatars
    images: review.imageUrls, // Use actual review imageUrls from API
    rating: review.stars,
    review: review.text,
    originalLanguage: "English", // API doesn't have language, using default
    experience: "Popular Experience Location", // Hardcoded location for now
  }));

  // Use only API data - NO FALLBACK
  const testimonials = transformedTestimonials || [];

  console.log('Testimonials - final testimonials:', testimonials);

  const renderStars = (
    rating: number,
    width: string = "w-3.5",
    height: string = "h-3.1"
  ) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={` w-[14px] h-[14px] ${
          i < rating
            ? `text-pink-500 ${i < 4 ? "mr-[2px]" : ""} fill-pink-500`
            : "text-gray-300"
        }`}
      />
    ));
  };

  const handleViewGallery = (testimonial: any) => {
    setSelectedTestimonial(testimonial);
    setIsGalleryOpen(true);
  };
  return (
    <>
      <div className="py-4 sm:py-10 max-w-screen-2xl mx-auto 2xl:px-0">
        <div className="md:flex hidden justify-between items-center mb-6">
          <h2 className="text-lg sm:text-2xl font-heading text-[#444444] flex items-center gap-2">
            Millions love flying out with us
            <img src="/images/info3.gif" alt="" className="w-10" />
          </h2>
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-2">
              <button
                className="text-sm hover:cursor-pointer text-gray-500 underline underline-offset-4 whitespace-nowrap border p-2 rounded-full"
                onClick={scrollLeft}
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <button
                className="text-sm hover:cursor-pointer text-gray-500 underline underline-offset-4 whitespace-nowrap border p-2 rounded-full"
                onClick={scrollRight}
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex md:hidden justify-between items-center mb-6">
          <h2 className="text-lg sm:text-2xl font-heading text-[#444444]">
            Millions love flying out with us
          </h2>
          <div>
            <img src="/images/info3.gif" alt="" className="w-10" />
          </div>
        </div>
        <div
          className="flex gap-4 overflow-x-scroll scrollbar-hide"
          ref={scrollContainerRef}
        >
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className=" bg-white border  rounded-xl flex-col flex-shrink-0 w-[287px] flex h-full min-h-[369.59px]"
            >
              {/* Header with avatar, name, country and rating */}
              <div className="flex justify-between px-4 py-2 gap-1 flex-col items-start mb-0">
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-[16px] font-halyard-text text-[#444444]">
                      {testimonial.name}
                    </h3>
                    <p className="text-[#666666] font-halyard-text-light text-xs">
                      {testimonial.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex text-sm items-center">
                    {renderStars(testimonial.rating, "w-3 h-3")}
                  </div>
                  <span className="text-pink-500 font-semibold ml-1">
                    {testimonial.rating}/5
                  </span>
                </div>
              </div>

              {/* Images */}
              <div className="flex px-4 gap-2 mb-2 relative">
                {testimonial.images.slice(0, 3).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Experience image ${index + 1}`}
                    className="w-[30%] h-[108px] object-cover rounded-md"
                  />
                ))}
                {testimonial.images.length > 3 && (
                  <button
                    onClick={() => handleViewGallery(testimonial)}
                    className="absolute hover:cursor-pointer right-6 top-0 w-[27%] h-[108px] bg-black/50  flex items-center justify-center rounded-md hover:bg-opacity-70 transition-all duration-200"
                  >
                    <div className="text-white text-center">
                      <div className="text-[13px] ">see more</div>
                    </div>
                  </button>
                )}
              </div>

              {/* Review text */}
              <p className="text-[#444444] px-4 text-sm font-halyard-text-light mb-3 line-clamp-4">
                {testimonial.review}
              </p>

              {/* View original review link */}
              <Link
                href="#"
                className="text-[#0f43bd] px-4 text-sm font-halyard-text hover:underline block mb-4"
              >
                View original review in {testimonial.originalLanguage}
              </Link>

              {/* Experience name */}
              <div className="pt-3 px-4 pb-2 bg-gray-50 mt-auto">
                <p className="text-[#444444] w-[70%] text-xs line-clamp-2 font-halyard-text">
                  {testimonial.experience}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gallery Modal */}
      {selectedTestimonial && (
        <TestimonialsViewer
          images={selectedTestimonial.images}
          itemName={`${selectedTestimonial.name}'s Photos`}
          isOpen={isGalleryOpen}
          onClose={() => setIsGalleryOpen(false)}
        />
      )}
    </>
  );
};

export default Testimonials;
