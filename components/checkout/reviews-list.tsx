"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Reviews } from '@/types/reviews/review-types';

interface ReviewsListProps {
  reviews?: any[];
}

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric'
  });
};

const ReviewsList = ({ reviews = [] }: ReviewsListProps) => {
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Extract actual reviews from nested structure
  const actualReviews = Array.isArray(reviews?.[0]?.data) ? reviews[0].data : [];
  const displayedReviews = showAll ? actualReviews : actualReviews.slice(0, 5);

  const toggleExpanded = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  const openGallery = (images: string[], startIndex: number = 0) => {
    setSelectedImages(images);
    setCurrentImageIndex(startIndex);
    setIsGalleryOpen(true);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${index < rating ? 'text-[#e5006e]' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  if (actualReviews.length === 0) {
    return null;
  }

  return (
    <div className="reviews-list">
      <div className="space-y-6">
        {displayedReviews.map((review: any) => {
          const isExpanded = expandedReviews.has(review._id);
          const reviewImages = review.imageUrls?.length > 0 ? review.imageUrls : review.images || [];
          const reviewText = review.text || '';
          const shouldTruncate = reviewText.length > 200;
          const displayText = isExpanded || !shouldTruncate
            ? reviewText
            : `${reviewText.slice(0, 200)}...`;

          return (
            <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0">
              <div className="flex items-start gap-4">
                {/* User Avatar */}
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold text-sm">
                  {(review.userId || 'A').charAt(0).toUpperCase()}
                </div>

                <div className="flex-1">
                  {/* User Info and Rating */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm font-halyard-text">
                        {review.userId || 'Anonymous'}
                      </span>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs text-green-600 font-halyard-text">Verified</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 font-halyard-text">
                      {formatDate(review._creationTime)}
                    </span>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {renderStars(review.stars || 0)}
                    </div>
                    <span className="text-sm text-gray-600 font-halyard-text">
                      {review.stars || 0}/5
                    </span>
                  </div>

                  {/* Review Text */}
                  <div className="mb-4">
                    <p className="text-gray-700 text-sm leading-relaxed font-halyard-text">
                      {displayText}
                    </p>
                    {shouldTruncate && (
                      <button
                        onClick={() => toggleExpanded(review._id)}
                        className="text-purple-600 text-sm font-medium hover:text-purple-700 mt-1 font-halyard-text"
                      >
                        {isExpanded ? "Show less" : "Show more"}
                      </button>
                    )}
                  </div>

                  {/* Review Images */}
                  {reviewImages.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {reviewImages.slice(0, 4).map((image: any, index: any) => (
                        <div
                          key={index}
                          className="relative w-16 h-16 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => openGallery(reviewImages, index)}
                        >
                          <img
                            src={image}
                            alt={`Review image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {index === 3 && reviewImages.length > 4 && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <span className="text-white text-xs font-semibold">
                                +{reviewImages.length - 4}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show More/Less Button */}
      {actualReviews.length > 5 && (
        <div className="text-center mt-8">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-halyard-text text-sm"
          >
            {showAll ? "Show less reviews" : `Show all ${actualReviews.length} reviews`}
          </button>
        </div>
      )}

      {/* Simple Image Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={() => setIsGalleryOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={selectedImages[currentImageIndex]}
              alt={`Review image ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            {selectedImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {selectedImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
            {currentImageIndex > 0 && (
              <button
                onClick={() => setCurrentImageIndex(currentImageIndex - 1)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            {currentImageIndex < selectedImages.length - 1 && (
              <button
                onClick={() => setCurrentImageIndex(currentImageIndex + 1)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsList;