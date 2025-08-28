import React from 'react';

const CheckAvailability: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 w-full"> 
      <div className="mb-3">
        <div className="text-gray-500 text-sm">from <span className="line-through">€63.79</span></div> 
        <div className="flex items-center gap-2 mt-1">
          <span className="text-2xl font-bold text-gray-900">€57.41</span> 
          <span className="bg-green-600 text-white text-xs font-semibold rounded px-1.5 py-0.5">10% off</span> 
        </div>
      </div>

<div className="mb-4 relative">
  <div 
    className="w-full rounded-lg border border-gray-300 text-gray-700 text-sm cursor-pointer flex items-center justify-between"
  >
    <span className="text-sm font-regular font-halyard-text text-gray-700 py-3 pl-4">
      Select a date
    </span>
    <div 
      className="h-full flex items-center justify-center px-3 rounded-r-lg"
    >
      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
</div>

      <button className="w-full py-3 bg-purple-600 text-white font-medium font-halyard-text rounded-xl text-base hover:bg-purple-700 transition-colors duration-200">
        Check availability
      </button>
    </div>
  );
};

export default CheckAvailability;