"use client";
import React, { useState, useRef, useEffect } from 'react';

interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  date: string;
  rating: number;
  reviewText: string;
  isVerified: boolean;
  images?: string[];
  originalLanguage?: string;
}

interface ReviewsListProps {
  reviews?: Review[];
}

const defaultReviews: Review[] = [
  {
    id: "1",
    userName: "Andrea",
    userAvatar: "/user.svg",
    date: "Aug, 2025",
    rating: 5,
    reviewText: "The visit is excellently organized, both in terms of time and the support of the guide, special mention to the very kind and knowledgeable Ms. Antonella. i would extend the stop in the Sistine Chapel by a few minutes, but i understand that the time constraints are necessary to accommodate all visitors. Overall, a fantastic experience that i would highly recommend to anyone interested in art and history.",
    isVerified: true,
    images: ["/images/d1.jpg.avif", "/images/d2.jpg.avif"],
    originalLanguage: "Italian"
  },
  {
    id: "2",
    userName: "Michael",
    userAvatar: "/user.svg",
    date: "Jul, 2025",
    rating: 4,
    reviewText: "Great experience overall! The guide was very knowledgeable and the tour was well-paced. The only downside was that some areas were quite crowded, but that's expected during peak season.",
    isVerified: true,
    images: ["/images/d3.jpg.avif"]
  },
  {
    id: "3",
    userName: "Sarah",
    userAvatar: "/user.svg",
    date: "Jun, 2025",
    rating: 5,
    reviewText: "Absolutely amazing! The art collection is breathtaking and the guide made everything so interesting. I learned so much about the history and significance of each piece. Highly recommend this tour!",
    isVerified: true,
    images: ["/images/d4.jpg.avif", "/images/d5.jpg.avif", "/images/d6.jpeg.avif"]
  },
  {
    id: "4",
    userName: "David",
    userAvatar: "/user.svg",
    date: "May, 2025",
    rating: 3,
    reviewText: "The tour was okay, but I expected more detailed explanations. The guide seemed a bit rushed and didn't have time to answer all questions. The venue itself is beautiful though.",
    isVerified: false
  },
  {
    id: "5",
    userName: "Emma",
    userAvatar: "/user.svg",
    date: "Apr, 2025",
    rating: 5,
    reviewText: "Perfect tour! Everything was well organized and the guide was fantastic. The skip-the-line access was definitely worth it. Will definitely book again for future visits.",
    isVerified: true,
    images: ["/images/d1.jpg.avif"]
  },
  {
    id: "6",
    userName: "James",
    userAvatar: "/user.svg",
    date: "Mar, 2025",
    rating: 4,
    reviewText: "Great experience overall! The guide was knowledgeable and friendly. The only minor issue was that some areas were quite crowded, but that's expected during peak season. Would recommend to others.",
    isVerified: true,
    images: ["/images/d2.jpg.avif", "/images/d3.jpg.avif"]
  },
  {
    id: "7",
    userName: "Lisa",
    userAvatar: "/user.svg",
    date: "Feb, 2025",
    rating: 5,
    reviewText: "Absolutely incredible! The art collection is breathtaking and the guide made everything so interesting. I learned so much about the history and significance of each piece. The skip-the-line access was definitely worth it.",
    isVerified: true,
    images: ["/images/d4.jpg.avif"]
  },
  {
    id: "8",
    userName: "Robert",
    userAvatar: "/user.svg",
    date: "Jan, 2025",
    rating: 3,
    reviewText: "The tour was okay, but I expected more detailed explanations. The guide seemed a bit rushed and didn't have time to answer all questions. The venue itself is beautiful though.",
    isVerified: false
  },
  {
    id: "9",
    userName: "Maria",
    userAvatar: "/user.svg",
    date: "Dec, 2024",
    rating: 5,
    reviewText: "Fantastic experience! The guide was excellent and very knowledgeable. The skip-the-line access saved us so much time. The art collection is amazing and the guide explained everything perfectly.",
    isVerified: true,
    images: ["/images/d5.jpg.avif", "/images/d6.jpeg.avif", "/images/d1.jpg.avif"]
  },
  {
    id: "10",
    userName: "John",
    userAvatar: "/user.svg",
    date: "Nov, 2024",
    rating: 4,
    reviewText: "Very good tour! The guide was professional and the skip-the-line access was definitely worth it. The only downside was that some areas were quite crowded, but that's expected during peak season.",
    isVerified: true,
    images: ["/images/d2.jpg.avif"]
  },
  {
    id: "11",
    userName: "Anna",
    userAvatar: "/user.svg",
    date: "Oct, 2024",
    rating: 5,
    reviewText: "Perfect tour! Everything was well organized and the guide was fantastic. The skip-the-line access was definitely worth it. Will definitely book again for future visits. Highly recommend!",
    isVerified: true,
    images: ["/images/d3.jpg.avif", "/images/d4.jpg.avif"]
  },
  {
    id: "12",
    userName: "Carlos",
    userAvatar: "/user.svg",
    date: "Sep, 2024",
    rating: 4,
    reviewText: "Great experience! The guide was knowledgeable and friendly. The art collection is amazing and the guide explained everything perfectly. The skip-the-line access saved us so much time.",
    isVerified: true,
    images: ["/images/d5.jpg.avif"]
  },
  {
    id: "13",
    userName: "Sophie",
    userAvatar: "/user.svg",
    date: "Aug, 2024",
    rating: 5,
    reviewText: "Absolutely amazing! The art collection is breathtaking and the guide made everything so interesting. I learned so much about the history and significance of each piece. Highly recommend this tour!",
    isVerified: true,
    images: ["/images/d6.jpeg.avif", "/images/d1.jpg.avif", "/images/d2.jpg.avif"]
  },
  {
    id: "14",
    userName: "Thomas",
    userAvatar: "/user.svg",
    date: "Jul, 2024",
    rating: 3,
    reviewText: "The tour was okay, but I expected more detailed explanations. The guide seemed a bit rushed and didn't have time to answer all questions. The venue itself is beautiful though.",
    isVerified: false
  },
  {
    id: "15",
    userName: "Elena",
    userAvatar: "/user.svg",
    date: "Jun, 2024",
    rating: 5,
    reviewText: "Perfect tour! Everything was well organized and the guide was fantastic. The skip-the-line access was definitely worth it. Will definitely book again for future visits. Highly recommend!",
    isVerified: true,
    images: ["/images/d3.jpg.avif"]
  }
];

const ReviewsList = ({ reviews = defaultReviews }: ReviewsListProps) => {
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set());
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sortBy, setSortBy] = useState('most-relevant');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [displayedReviews, setDisplayedReviews] = useState(5);
  const [isSortDrawerOpen, setIsSortDrawerOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Handle click outside to close dialog
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDialogOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest('.dialog-content')) {
          setIsDialogOpen(false);
        }
      }
    };

    if (isDialogOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isDialogOpen]);

  const sortOptions = [
    { id: 'most-relevant', label: 'Most relevant' },
    { id: 'most-recent', label: 'Most recent' }
  ];

  const filterOptions = [
    { id: 'with-images', label: 'With images', icon: '🖼️' },
    { id: '4-plus-stars', label: '4+ stars' },
    { id: '3-stars', label: '3 stars' },
    { id: 'under-3-stars', label: '<3 stars' }
  ];

  const toggleFilter = (filterId: string) => {
    const newFilters = new Set(selectedFilters);
    if (newFilters.has(filterId)) {
      newFilters.delete(filterId);
    } else {
      newFilters.add(filterId);
    }
    setSelectedFilters(newFilters);
  };

  const removeFilter = (filterId: string) => {
    const newFilters = new Set(selectedFilters);
    newFilters.delete(filterId);
    setSelectedFilters(newFilters);
  };

  const toggleReviewExpansion = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  const getFilteredReviews = () => {
    if (selectedFilters.size === 0) {
      return reviews;
    }

    return reviews.filter(review => {
      return Array.from(selectedFilters).every(filterId => {
        switch (filterId) {
          case 'with-images':
            return review.images && review.images.length > 0;
          case '4-plus-stars':
            return review.rating >= 4;
          case '3-stars':
            return review.rating === 3;
          case 'under-3-stars':
            return review.rating < 3;
          default:
            return true;
        }
      });
    });
  };

  const loadMoreReviews = () => {
    setDisplayedReviews(prev => Math.min(prev + 5, reviews.length));
  };

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

  const getSortedReviews = (filteredReviews: Review[]) => {
    switch (sortBy) {
      case 'most-recent':
        return [...filteredReviews].sort((a, b) => {
          // Simple date sorting - in real app you'd parse dates properly
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateB - dateA; // Most recent first
        });
      case 'most-relevant':
      default:
        return filteredReviews; // Keep original order for relevance
    }
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

  const filteredReviews = getFilteredReviews();
  const sortedReviews = getSortedReviews(filteredReviews);
  const limitedReviews = sortedReviews.slice(0, 3); // Show only 3 reviews initially
  const dialogReviews = sortedReviews.slice(0, displayedReviews);

  return (
    <div className="py-6 max-w-[1200px] font-halyard-text mx-auto">
      {/* Filter Pills */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
        {/* Sort Dropdown */}
        <div className="relative flex-shrink-0" ref={dropdownRef}>
          <button
            onClick={() => {
              if (window.innerWidth < 768) {
                setIsSortDrawerOpen(true);
              } else {
                setIsDropdownOpen(!isDropdownOpen);
              }
            }}
            className="inline-flex items-center gap-2 px-3 py-[5px] hover:cursor-pointer rounded-full text-sm  transition-colors duration-200 bg-white text-[#444444] border border-[#e2e2e2]"
          >
            <span>{sortBy === 'most-relevant' ? 'Most relevant' : 'Most recent'}</span>
            <svg className={`w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[220px]">
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setSortBy(option.id);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-[#444444] hover:bg-gray-50 flex items-center justify-between"
                >
                  <span>{option.label}</span>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    sortBy === option.id 
                      ? 'border-purple-500 bg-purple-500' 
                      : 'border-gray-300 bg-white'
                  }`}>
                    {sortBy === option.id && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filter Pills */}
        {filterOptions.map((option) => (
          <div
            key={option.id}
            className={`inline-flex items-center gap-2 px-3 py-[5px] hover:cursor-pointer rounded-full text-sm font-medium transition-colors duration-200 flex-shrink-0 ${
              selectedFilters.has(option.id)
                ? 'bg-gray-100 text-[#444444] border border-[#222]'
                : 'bg-white text-[#444444] hover:border-[#222] border'
            }`}
          >
            <button
              onClick={() => toggleFilter(option.id)}
              className="flex hover:cursor-pointer items-center gap-2"
            >
              <span>{option.label}</span>
            </button>
            {selectedFilters.has(option.id) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFilter(option.id);
                }}
                className="text-gray-500 hover:text-gray-700 ml-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {limitedReviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
            {/* User Info */}
            <div className="flex items-start gap-3 mb-1">
              <img
                src={review.userAvatar}
                alt={review.userName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1 font-halyard-text">
                <h4 className="text-[15px] md:text-lg font-bold text-[#444444]">{review.userName}</h4>
                <div className="flex items-center gap-1 text-[12px] md:text-sm text-[#666666]">
                  <span>{review.date}</span>
                  {review.isVerified && (
                    <>
                      <span>•</span>
                      <span>Verified booking</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-1">
              <div className="flex items-center gap-0">
                {renderStars(review.rating)}
              </div>
              <span className="text-[#e5006e] font-medium">{review.rating}/5</span>
            </div>

            {/* Review Text */}
            <div className="mb-4">
              <p className="text-[#444444] md:text-base text-[14px] font-halyard-text">
                {expandedReviews.has(review.id) 
                  ? review.reviewText 
                  : `${review.reviewText.substring(0, 200)}...`
                }
              </p>
              {review.reviewText.length > 200 && (
                <button
                  onClick={() => toggleReviewExpansion(review.id)}
                  className="text-[#444444] hover:cursor-pointer hover:text-[#6600cc] text-sm md:mt-2"
                >
                  {expandedReviews.has(review.id) ? 'Read less -' : 'Read more +'}
                </button>
              )}
              {review.originalLanguage && (
                <button className="text-[#0f43bd] text-[15px] hover:cursor-pointer hover:text-[#6600cc] text-sm md:mt-2 block">
                  View original review in {review.originalLanguage}
                </button>
              )}
            </div>

            {/* Review Images */}
            {review.images && review.images.length > 0 && (
              <div className="flex gap-3">
                {review.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Review image ${index + 1}`}
                    className="md:w-[180px] md:h-[240px] w-[98px] h-[132px] object-cover rounded-sm"
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="md:text-start text-center  mt-8">
        <button 
          onClick={() => setIsDialogOpen(true)}
          className="px-6 py-3 w-full md:w-auto bg-[#ffffff] border border-[#111] hover:bg-[#f8f8f8] hover:cursor-pointer text-[#444444] rounded-lg font-medium transition-colors duration-200"
        >
          Show all reviews
        </button>
      </div>

      {/* Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center md:p-4" style={{zIndex: 9999999}}>
          <div className="dialog-content bg-white rounded-lg md:max-w-4xl w-full h-screen md:max-h-[90vh] overflow-hidden">
            {/* Dialog Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-[#444444] font-halyard-text">Reviews (19,408)</h2>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Dialog Content */}
            <div className="px-6 pb-4 pt-4 overflow-y-auto h-[calc(100vh-120px)] md:max-h-[calc(90vh-120px)]">
              {/* Reviews Summary Section */}
              <div className="bg-white pt-2 rounded-lg w-full mb-6">
                {/* Header */}
                <div className="flex items-center gap-2 md:mb-6 mb-4">
                  <span className="text-gray-600 text-sm font-halyard-text">How do we collect reviews?</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>

                <div className="flex md:flex-row flex-col items-start justify-between md:gap-8 gap-4">
                  {/* Overall Rating */}
                  <div className="flex flex-col items-start md:w-[45%]">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-8 h-8 text-[#e5006e]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-[36px] font-bold text-[#e5006e] font-halyard-text">4.4</span>
                    </div>
                    <span className="text-gray-600 text-sm font-halyard-text">19,408 ratings</span>
                  </div>

                  {/* Rating Breakdown */}
                  <div className="flex-1 space-y-3 w-full md:w-[30%]">
                    {[
                      { stars: 5, count: 12900, percentage: 66.5 },
                      { stars: 4, count: 3700, percentage: 19.1 },
                      { stars: 3, count: 1200, percentage: 6.2 },
                      { stars: 2, count: 663, percentage: 3.4 },
                      { stars: 1, count: 945, percentage: 4.9 }
                    ].map((rating) => (
                      <div key={rating.stars} className="flex items-center gap-3">
                        {/* Stars */}
                        <div className="flex items-center gap-0">
                          {Array.from({ length: 5 }, (_, index) => (
                            <svg
                              key={index}
                              className={`w-4 h-4 ${index < rating.stars ? 'text-[#e5006e]' : 'text-transparent'}`}
                              fill="currentColor"
                              stroke={index < rating.stars ? 'none' : '#e5006e'}
                              strokeWidth="1.5"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="text-sm text-gray-600 font-halyard-text ml-1">{rating.stars}/5</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="flex-1 flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-[#e5006e] h-2 rounded-full transition-all duration-300"
                              style={{ width: `${rating.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 font-halyard-text min-w-[3rem] text-right">
                            {rating.count >= 1000 ? `${(rating.count / 1000).toFixed(1)}K` : rating.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Guests Banner - Full width on mobile */}
                <div className="md:mx-0 -mx-6 md:mt-8 mt-8">
                  <div className="bg-gradient-to-r from-[#f3e6ff66] to-[#f3e6ff66] rounded-lg my-6 w-full">
                  <div className="flex items-center gap-4 md:h-20 h-17 px-6">
                    {/* Moving Flags - Vertical Marquee */}
                    <div className="flex-shrink-0 w-12 h-full overflow-hidden">
                      <div className="flex flex-col gap-2 animate-vertical-scroll">
                        {[
                          { src: '/flags/flag1.svg', alt: 'Argentina' },
                          { src: '/flags/flag2.svg', alt: 'Romania' },
                          { src: '/flags/flag3.svg', alt: 'United States' },
                          { src: '/flags/flag4.svg', alt: 'United Kingdom' },
                          { src: '/flags/flag1.svg', alt: 'Argentina' },
                          { src: '/flags/flag2.svg', alt: 'Romania' },
                          { src: '/flags/flag3.svg', alt: 'United States' },
                          { src: '/flags/flag4.svg', alt: 'United Kingdom' }
                        ].map((flag, index) => (
                          <div key={index} className="flex-shrink-0 w-8 h-6">
                            <img
                              src={flag.src}
                              alt={flag.alt}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Text Content */}
                    <div className="flex-1">
                      <p className="text-[#444444] text-sm font-halyard-text">
                        Guests from{' '}
                        <strong className="font-semibold">United States</strong>,{' '}
                        <strong className="font-semibold">United Kingdom</strong>,{' '}
                        <strong className="font-semibold">France</strong>{' '}
                        and over{' '}
                        <strong className="font-semibold">94 countries</strong>{' '}
                        have loved this experience
                      </p>
                    </div>
                  </div>

                    <style jsx>{`
                      @keyframes vertical-scroll {
                        0% {
                          transform: translateY(0);
                        }
                        100% {
                          transform: translateY(-50%);
                        }
                      }
                      
                      .animate-vertical-scroll {
                        animation: vertical-scroll 8s linear infinite;
                      }
                    `}</style>
                  </div>
                </div>

                {/* Guest Snapshots */}
                <div className="py-4 max-w-[1200px] mx-auto">
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg sm:text-[18px] font-heading text-[#444444] max-w-2/3">
                      Snapshots from our guests
                    </h2>
                    <div className="hidden md:flex items-center gap-2">
                      <button 
                        onClick={scrollLeft}
                        className="cursor-pointer hover:border-gray-400 text-sm text-[#666666] border p-2 rounded-full"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button 
                        onClick={scrollRight}
                        className="cursor-pointer hover:border-gray-400 text-sm text-[#666666] border p-2 rounded-full"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div 
                    ref={scrollContainerRef}
                    className="mt-4 sm:mt-4 flex md:gap-4 gap-4 overflow-x-scroll sm:ml-0 -ml-4 scrollbar-hide"
                  >
                    {[
                      "/images/d1.jpg.avif",
                      "/images/d2.jpg.avif", 
                      "/images/d3.jpg.avif",
                      "/images/d4.jpg.avif",
                      "/images/d5.jpg.avif",
                      "/images/d6.jpeg.avif"
                    ].map((image, index) => (
                      <div
                        key={index}
                        className={`shrink-0 flex w-[98px] h-[130px] md:w-[180px] md:h-[240px] ${index === 0 ? "ml-4 md:ml-0" : "ml-0"}`}
                      >
                        <div className="w-full h-full">
                          <img
                            src={image}
                            alt={`Guest photo ${index + 1}`}
                            className="rounded-sm w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Filter Pills in Dialog */}
              <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
                {/* Sort Dropdown */}
                <div className="relative flex-shrink-0">
                  <button
                    onClick={() => {
                      if (window.innerWidth < 768) {
                        setIsSortDrawerOpen(true);
                      } else {
                        setIsDropdownOpen(!isDropdownOpen);
                      }
                    }}
                    className="inline-flex items-center gap-2 px-3 py-[5px] hover:cursor-pointer rounded-full text-sm transition-colors duration-200 bg-white text-[#444444] border border-[#e2e2e2]"
                  >
                    <span>{sortBy === 'most-relevant' ? 'Most relevant' : 'Most recent'}</span>
                    <svg className={`w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[220px]">
                      {sortOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => {
                            setSortBy(option.id);
                            setIsDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-[#444444] hover:bg-gray-50 flex items-center justify-between"
                        >
                          <span>{option.label}</span>
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            sortBy === option.id 
                              ? 'border-purple-500 bg-purple-500' 
                              : 'border-gray-300 bg-white'
                          }`}>
                            {sortBy === option.id && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Filter Pills */}
                {filterOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`inline-flex items-center gap-2 px-3 py-[5px] hover:cursor-pointer rounded-full text-sm font-medium transition-colors duration-200 flex-shrink-0 ${
                      selectedFilters.has(option.id)
                        ? 'bg-gray-100 text-[#444444] border border-[#222]'
                        : 'bg-white text-[#444444] hover:border-[#222] border'
                    }`}
                  >
                    <button
                      onClick={() => toggleFilter(option.id)}
                      className="flex hover:cursor-pointer items-center gap-2"
                    >
                      <span>{option.label}</span>
                    </button>
                    {selectedFilters.has(option.id) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFilter(option.id);
                        }}
                        className="text-gray-500 hover:text-gray-700 ml-1"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Reviews List in Dialog */}
              <div className="space-y-6">
                {dialogReviews.map((review) => (
                  <div key={review.id} className=" md:pb-6 pb-4 ">
                    {/* User Info */}
                    <div className="flex items-start gap-3 mb-1">
                      <img
                        src={review.userAvatar}
                        alt={review.userName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 font-halyard-text">
                        <h4 className="text-lg font-bold text-[#444444]">{review.userName}</h4>
                        <div className="flex items-center gap-1 text-sm text-[#666666]">
                          <span>{review.date}</span>
                          {review.isVerified && (
                            <>
                              <span>•</span>
                              <span>Verified booking</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex items-center gap-0">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-[#e5006e] font-medium">{review.rating}/5</span>
                    </div>

                    {/* Review Text */}
                    <div className="mb-4">
                      <p className="text-[#444444] font-halyard-text">
                        {expandedReviews.has(review.id) 
                          ? review.reviewText 
                          : `${review.reviewText.substring(0, 200)}...`
                        }
                      </p>
                      {review.reviewText.length > 200 && (
                        <button
                          onClick={() => toggleReviewExpansion(review.id)}
                          className="text-[#444444] hover:cursor-pointer hover:text-[#6600cc] text-sm mt-2"
                        >
                          {expandedReviews.has(review.id) ? 'Read less -' : 'Read more +'}
                        </button>
                      )}
                      {review.originalLanguage && (
                        <button className="text-[#0f43bd] text-[15px] hover:cursor-pointer hover:text-[#6600cc] text-sm mt-2 block">
                          View original review in {review.originalLanguage}
                        </button>
                      )}
                    </div>

                    {/* Review Images */}
                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-3">
                        {review.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Review image ${index + 1}`}
                            className="md:w-[180px] md:h-[240px] w-[98px] h-[132px] object-cover rounded-sm"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Load More Button in Dialog */}
              {displayedReviews < sortedReviews.length && (
                <div className="md:text-start text-center mt-8 mb-4">
                  <button 
                    onClick={loadMoreReviews}
                    className="px-5 py-3 w-full md:w-auto bg-[#ffffff] border border-[#111] hover:bg-[#f8f8f8] hover:cursor-pointer text-[#444444] rounded-lg font-medium transition-colors duration-200"
                  >
                    Show more reviews
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sort Drawer */}
      {isSortDrawerOpen && (
        <div className="fixed inset-0 bg-black/50 z-[9999999] md:hidden">
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6">
            {/* Drawer Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-[#444444]">Sort by</h2>
              <button 
                onClick={() => setIsSortDrawerOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Sort Options */}
            <div className="space-y-4">
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setSortBy(option.id);
                    setIsSortDrawerOpen(false);
                  }}
                  className="w-full text-left text-sm px-0 font-halyard-text py-3 text-[#444444] hover:bg-gray-50 flex items-center justify-between rounded-lg"
                >
                  <span>{option.label}</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    sortBy === option.id 
                      ? 'border-purple-500 bg-purple-500' 
                      : 'border-gray-300 bg-white'
                  }`}>
                    {sortBy === option.id && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
