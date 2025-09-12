"use client";
import React from "react";
import { Check } from "lucide-react";

const WhyHeadout: React.FC = () => {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <h2 className="text-[18px] font-halyard-text font-medium text-gray-900 mb-2">
        Why Fly Fim?
      </h2>
      <hr className="border-gray-200 mb-3 -mx-4" style={{ width: 'calc(100% + 2rem)' }} />
      <ul className="space-y-2">
        <li className="flex items-center gap-2">
          <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
          <span className="text-[14px]  font-halyard-text-light text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
            Trusted platform used by 100K+ people, each month
          </span>
        </li>
        <li className="flex items-center gap-2">
          <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
          <span className="text-[14px] t font-halyard-text-light text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
            Get the lowest prices and last minute availability
          </span>
        </li>
        <li className="flex items-center gap-2">
          <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
          <span className="text-[14px]  font-halyard-text-light text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
            Discover and connect with 10,000+ experiences
          </span>
        </li>
        <li className="flex items-center gap-2">
          <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
          <span className="text-[14px]  font-halyard-text-light text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
            Browse verified reviews and professional photographs
          </span>
        </li>
        <li className="flex items-center gap-2">
          <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
          <span className="text-[14px]  font-halyard-text-light text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
            Have a question? Live chat with our experts 24/7
          </span>
        </li>
      </ul>
    </div>
  );
};

export default WhyHeadout;