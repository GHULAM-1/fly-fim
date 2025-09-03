"use client";
import React, { useState } from "react";
import { Star } from "lucide-react";

interface Review {
  _id: string;
  userId: string;
  stars: number;
  text: string;
  _creationTime: number;
}

interface ReviewsSectionProps {
  reviews: Review[];
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews }) => {
  const [selectedFilter, setSelectedFilter] = useState("Most relevant");

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((acc, review) => acc + review.stars, 0) / totalReviews
      : 0;

  const ratingBreakdown = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.stars === stars).length;
    return {
      stars,
      count,
      percentage: totalReviews > 0 ? (count / totalReviews) * 100 : 0,
    };
  });

  const filterOptions = [
    "Most relevant",
    "With images",
    "4+ stars",
    "3 stars",
    "<3 stars",
  ];

  const StarRating = ({
    rating,
    size = 16,
  }: {
    rating: number;
    size?: number;
  }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={`${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="my-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Reviews</h2>

      {totalReviews > 0 ? (
        <>
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="text-center mb-6">
              <div className="text-sm text-gray-600 mb-2">
                How do we collect reviews?
              </div>
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="text-gray-600 mb-2">{totalReviews} ratings</div>
              <StarRating rating={Math.round(averageRating)} size={20} />
            </div>

            <div className="space-y-3 mb-6">
              {ratingBreakdown.map((item) => (
                <div key={item.stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-8">
                    <span className="text-sm font-medium">{item.stars}</span>
                    <Star size={12} className="text-yellow-400 fill-current" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <div className="flex flex-wrap gap-2 mb-6">
              {filterOptions.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedFilter === filter
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="space-y-6">
              {reviews.slice(0, 5).map((review) => (
                <div key={review._id} className="border-b border-gray-100 pb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {review.userId.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {review.userId}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {new Date(review._creationTime).toLocaleDateString(
                            "en-US",
                            { month: "short", year: "numeric" }
                          )}
                        </span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          Verified booking
                        </span>
                      </div>
                      <div className="mb-3">
                        <StarRating rating={review.stars} />
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-3">
                        {review.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {reviews.length > 5 && (
              <div className="text-center mt-8">
                <button className="text-blue-600 font-semibold hover:underline">
                  Show all reviews
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No reviews yet for this experience.</p>
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
