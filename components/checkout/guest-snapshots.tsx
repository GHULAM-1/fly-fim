"use client";
import React, { useRef, useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Reviews } from '@/types/reviews/review-types';

interface GuestSnapshot {
  id: string;
  image: string;
  alt: string;
}

interface GuestSnapshotsProps {
  reviews?: any[];
}

const GuestSnapshots = ({ reviews = [] }: GuestSnapshotsProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [snapshots, setSnapshots] = useState<GuestSnapshot[]>([]);
  const [loading, setLoading] = useState(true);

  // Convert review images to snapshots format
  const generateSnapshots = (reviews: Reviews[]): GuestSnapshot[] => {
    const allImages: GuestSnapshot[] = [];

    reviews.forEach((review, reviewIndex) => {
      // Use imageUrls if available, otherwise fall back to images array
      const reviewImages = review.imageUrls?.length > 0 ? review.imageUrls : review.images || [];

      reviewImages.forEach((imageUrl, imageIndex) => {
        allImages.push({
          id: `${review._id}-${imageIndex}`,
          image: imageUrl,
          alt: `Guest photo from review ${reviewIndex + 1}`
        });
      });
    });

    return allImages;
  };

  useEffect(() => {
    // Generate snapshots from review images
    const timer = setTimeout(() => {
      // Extract actual reviews from nested structure
      const actualReviews = Array.isArray(reviews?.[0]?.data) ? reviews[0].data : [];
      const reviewSnapshots = generateSnapshots(actualReviews);
      setSnapshots(reviewSnapshots);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [reviews]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = window.innerWidth >= 768 ? 200 : 160;
      const gap = 16; // gap-4 = 16px
      const scrollAmount = (cardWidth + gap) * 4; // Scroll 4 cards at a time
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = window.innerWidth >= 768 ? 200 : 160;
      const gap = 16; // gap-4 = 16px
      const scrollAmount = (cardWidth + gap) * 4; // Scroll 4 cards at a time
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="py-4 sm:py-6 mb-2 max-w-[1200px] mx-auto">
        <div className="px-[24px] xl:px-0">
          <h2 className="text-lg sm:text-2xl font-heading text-[#444444] max-w-2/3">
            Snapshots from our guests
          </h2>
        </div>
        <div className="mt-4 pl-[24px] xl:pl-0 sm:mt-4 flex gap-4 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="snap-start flex-shrink-0 w-[160px] h-[160px] md:w-[200px] md:h-[200px]"
            >
              <div className="w-full h-full bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="md:py-4 py-2 mb-2 max-w-[1200px] mx-auto border-b border-dashed border-gray-200 pb-6">
      <div className="flex justify-between items-start">
        <h2 className="text-lg sm:text-[18px] font-heading text-[#444444] max-w-2/3">
          Snapshots from our guests
        </h2>
        <div className="hidden md:flex items-center gap-2">
          <button
            className="cursor-pointer hover:border-gray-400 text-sm text-[#666666] border p-2 rounded-full"
            onClick={scrollLeft}
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          <button
            className="cursor-pointer hover:border-gray-400 text-sm text-[#666666] border p-2 rounded-full"
            onClick={scrollRight}
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div
        className="mt-4 sm:mt-4 flex md:gap-4 gap-4 overflow-x-scroll sm:ml-0 -ml-4 scrollbar-hide"
        ref={scrollContainerRef}
      >
        {snapshots.map((snapshot, index) => (
          <div
            key={snapshot.id}
            className={`shrink-0 flex  w-[98px] h-[130px] md:w-[180px] md:h-[240px] ${index === 0 ? "ml-4 md:ml-0" : "ml-0"}`}
          >
            <div className="w-full h-full">
              <img
                src={snapshot.image}
                alt={snapshot.alt}
                className="rounded-sm w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuestSnapshots;
