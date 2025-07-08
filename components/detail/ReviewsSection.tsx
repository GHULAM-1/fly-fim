"use client";
import React from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const ReviewsSection = () => {
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${
              star <= rating
                ? "fill-pink-500 text-pink-500"
                : "fill-transparent text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Star size={20} className="fill-pink-500 text-pink-500" />
          <span className="text-2xl font-bold text-gray-900">4.3/5</span>
          <span className="text-xl text-pink-500 font-medium">(1,085)</span>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-gray-700 underline font-medium">
            Show all 1K reviews
          </button>
          <div className="flex gap-2">
            <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-50">
              <ChevronLeft size={16} className="text-gray-600" />
            </button>
            <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-50">
              <ChevronRight size={16} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Review Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Marius Review */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
              <span className="text-purple-700 font-semibold text-lg">M</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-gray-900">Marius</h4>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <span>Apr 2025</span>
                <span>•</span>
                <span>Verified booking</span>
              </div>
              {renderStars(4)}
            </div>
          </div>

          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            Good price and timing for the combo package. We liked the offer of
            free cancellation 24h before the event in case of bad weather. Lucky
            for was it was not the case. The 10:00 boat was very nice as we had
            live presentation of...
          </p>

          <button className="text-gray-700 text-sm font-medium flex items-center gap-1 hover:text-gray-900">
            Read more
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Urbas Review */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
              <span className="text-green-700 font-semibold text-lg">U</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-gray-900">Urbas</h4>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <span>Apr 2025</span>
                <span>•</span>
                <span>Verified booking</span>
              </div>
              {renderStars(4)}
            </div>
          </div>

          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            The ticket's name was "flexible" and I expected to be able to go off
            the vessel at any pier and go on at another at a later time on that
            day. But it was only a simple trip and we could stay on the boat for
            only 30 minutes as we had ot...
          </p>

          <button className="text-gray-700 text-sm font-medium flex items-center gap-1 hover:text-gray-900">
            Read more
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewsSection;
