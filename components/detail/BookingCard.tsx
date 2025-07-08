"use client";
import React from "react";
import { Check } from "lucide-react";

const BookingCard = () => {
  return (
    <div className="space-y-6">
      {/* Pricing Card */}
      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <div className="mb-4">
          <div className="text-gray-500 text-sm mb-1">from</div>
          <div className="text-gray-500 line-through text-lg mb-1">£53.18</div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-bold text-gray-900">£45.16</span>
            <span className="bg-green-600 text-white text-sm font-medium px-3 py-1 rounded">
              15% off
            </span>
          </div>
        </div>

        <button className="w-full bg-purple-600 text-white font-semibold text-lg py-4 rounded-lg hover:bg-purple-700 transition-colors">
          Next
        </button>
      </div>

      {/* Why Headout Card */}
      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Why Headout?</h3>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Check
                size={20}
                className="text-green-600 mt-0.5 flex-shrink-0"
              />
              <span className="text-gray-700 text-sm leading-relaxed">
                Trusted platform used by 100K+ people, each month
              </span>
            </div>

            <div className="flex items-start gap-3">
              <Check
                size={20}
                className="text-green-600 mt-0.5 flex-shrink-0"
              />
              <span className="text-gray-700 text-sm leading-relaxed">
                Get the lowest prices and last minute availability
              </span>
            </div>

            <div className="flex items-start gap-3">
              <Check
                size={20}
                className="text-green-600 mt-0.5 flex-shrink-0"
              />
              <span className="text-gray-700 text-sm leading-relaxed">
                Discover and connect with 10,000+ experiences
              </span>
            </div>

            <div className="flex items-start gap-3">
              <Check
                size={20}
                className="text-green-600 mt-0.5 flex-shrink-0"
              />
              <span className="text-gray-700 text-sm leading-relaxed">
                Browse verified reviews and professional photographs
              </span>
            </div>

            <div className="flex items-start gap-3">
              <Check
                size={20}
                className="text-green-600 mt-0.5 flex-shrink-0"
              />
              <span className="text-gray-700 text-sm leading-relaxed">
                Have a question? Live chat with our experts 24/7
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
