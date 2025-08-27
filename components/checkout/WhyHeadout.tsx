import React from 'react';
import { Check } from 'lucide-react';

const WhyHeadout: React.FC = () => (
  <div className="bg-white rounded-2xl border border-gray-200 mt-4 p-0 shadow-sm w-full">
    <div className="px-6 pt-6 pb-0">
      <h3 className="font-semibold text-lg mb-4">Why Headout?</h3>
    </div>
    <div className="border-t border-gray-200 px-6 pt-4 pb-4">
      <ul className="space-y-3 text-[15px] text-gray-800">
        <li className="flex items-start gap-2">
          <Check className="text-green-500 w-5 h-5 mt-1" />
          Trusted platform used by <span className="font-semibold">100K+ people</span>, each month
        </li>
        <li className="flex items-start gap-2">
          <Check className="text-green-500 w-5 h-5 mt-1" />
          Get the lowest prices and last minute availability
        </li>
        <li className="flex items-start gap-2">
          <Check className="text-green-500 w-5 h-5 mt-1" />
          Discover and connect with <span className="font-semibold">10,000+ experiences</span>
        </li>
        <li className="flex items-start gap-2">
          <Check className="text-green-500 w-5 h-5 mt-1" />
          Browse verified reviews and professional photographs
        </li>
        <li className="flex items-start gap-2">
          <Check className="text-green-500 w-5 h-5 mt-1" />
          Have a question? Live chat with our experts 24/7
        </li>
      </ul>
    </div>
  </div>
);

export default WhyHeadout;
