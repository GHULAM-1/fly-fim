import React from 'react'
import GuestsBanner from './guests-banner'
import GuestSnapshots from './guest-snapshots'
import ReviewsList from './reviews-list';

interface ReviewData {
  totalRatings: number;
  averageRating: number;
  ratingBreakdown: {
    stars: number;
    count: number;
    percentage: number;
  }[];
}

interface ReviewsSectionProps {
  data?: ReviewData;
}

const defaultData: ReviewData = {
  totalRatings: 19408,
  averageRating: 4.4,
  ratingBreakdown: [
    { stars: 5, count: 12900, percentage: 66.5 },
    { stars: 4, count: 3700, percentage: 19.1 },
    { stars: 3, count: 1200, percentage: 6.2 },
    { stars: 2, count: 663, percentage: 3.4 },
    { stars: 1, count: 945, percentage: 4.9 }
  ]
}

export default function ReviewsSection({ data = defaultData }: ReviewsSectionProps) {
  const formatCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const renderStars = (rating: number, filled: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${index < filled ? 'text-[#e5006e]' : 'text-transparent'}`}
        fill="currentColor"
        stroke={index < filled ? 'none' : '#e5006e'}
        strokeWidth="1.5"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="bg-white pt-2 rounded-lg w-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
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
            <span className="text-[36px] font-bold text-[#e5006e] font-halyard-text">{data.averageRating}</span>
          </div>
          <span className="text-gray-600 md:block hidden text-sm font-halyard-text">{data.totalRatings.toLocaleString()} ratings</span>
        </div>

        {/* Rating Breakdown */}
        <div className="flex-1 space-y-3 w-full md:w-[30%]">
          {data.ratingBreakdown.map((rating) => (
            <div key={rating.stars} className="flex items-center gap-3">
              {/* Stars */}
              <div className="flex items-center gap-0">
                {renderStars(rating.stars, rating.stars)}
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
                  {formatCount(rating.count)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guests Banner - Full width on mobile */}
      <div className="md:mx-0 -mx-4 md:mt-0 mt-4">
        <GuestsBanner />
      </div>

      {/* Guest Snapshots */}
      <GuestSnapshots />

      {/* Reviews List */}
      <ReviewsList />
    </div>
  )
}
