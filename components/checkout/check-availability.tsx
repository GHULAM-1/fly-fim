
import React from 'react';

const CheckAvailability: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 w-full">
      <div className="mb-4">
        <div className="text-gray-500 text-sm">from <span className="line-through">€63.79</span></div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-3xl font-bold text-gray-900">€57.41</span>
          <span className="bg-green-600 text-white text-xs font-semibold rounded px-2 py-1">10% off</span>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select a date</label>
        <select className="w-full rounded-lg border border-gray-300 py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
          <option>Choose your preferred date</option>
          <option>Today</option>
          <option>Tomorrow</option>
          <option>This weekend</option>
        </select>
      </div>
      
      <button className="w-full py-3 bg-purple-600 text-white font-semibold rounded-xl text-lg hover:bg-purple-700 transition-colors duration-200">
        Check availability
      </button>
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        Free cancellation up to 7 days before the start of your experience
      </div>
    </div>
  );
};

export default CheckAvailability;
