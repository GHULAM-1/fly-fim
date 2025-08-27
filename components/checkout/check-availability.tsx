
import React from 'react';

const CheckAvailability: React.FC = () => {
  return (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 w-full">
      <div className="mb-4">
        <div className="text-gray-500 text-sm">from <span className="line-through">€55</span></div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-3xl font-bold text-gray-900">€49.50</span>
          <span className="bg-green-600 text-white text-xs font-semibold rounded px-2 py-1">10% off</span>
        </div>
      </div>
      <div className="mb-4">
        <select className="w-full rounded-lg border border-gray-300 py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
          <option>Select a date</option>
        </select>
      </div>
      <button className="w-full py-3 bg-purple-600 text-white font-semibold rounded-xl text-lg">Check availability</button>
    </div>
  );
};

export default CheckAvailability;
