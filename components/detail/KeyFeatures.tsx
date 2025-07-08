import React from "react";
import { Clock, Shuffle, RefreshCw, Volume2 } from "lucide-react";

const KeyFeatures = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Clock size={16} className="text-green-600" />
        </div>
        <div>
          <div className="font-medium text-gray-900 text-sm">Open today</div>
          <div className="text-gray-600 text-xs">10:00am - 08:30pm</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Shuffle size={16} className="text-blue-600" />
        </div>
        <div>
          <div className="font-medium text-gray-900 text-sm">
            Explore at your pace
          </div>
          <div className="text-gray-600 text-xs">
            Choose your entry time, stay as long as you like
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
          <RefreshCw size={16} className="text-red-600" />
        </div>
        <div>
          <div className="font-medium text-gray-900 text-sm">
            Free cancellation
          </div>
          <div className="text-gray-600 text-xs">
            Free cancellation up to 24 hours before the start of your experience
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Volume2 size={16} className="text-orange-600" />
        </div>
        <div>
          <div className="font-medium text-gray-900 text-sm">Audio guide</div>
          <div className="text-gray-600 text-xs">
            Enhance your experience with multilingual audio guide
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyFeatures;
