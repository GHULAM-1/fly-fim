"use client";
import React, { useState } from "react";
import { Check } from "lucide-react";

const TicketPreference = () => {
  const [selectedOption, setSelectedOption] = useState("standard");

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        What do you prefer?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Standard Entry Option */}
        <div className="border border-gray-200 rounded-lg p-6 relative">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            London Eye Standard Entry + Thames River Cruise
          </h3>

          <div className="mb-4">
            <div className="text-gray-500 line-through text-lg">£53.18</div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">£45.16</span>
              <span className="bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded">
                15% off
              </span>
            </div>
          </div>

          <button
            onClick={() => setSelectedOption("standard")}
            className={`w-full py-3 rounded-lg mb-6 font-medium ${
              selectedOption === "standard"
                ? "bg-purple-100 text-purple-700 border border-purple-200"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
          >
            {selectedOption === "standard" ? (
              <div className="flex items-center justify-center gap-2">
                <Check size={20} />
                Selected
              </div>
            ) : (
              "Select"
            )}
          </button>

          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
              <span>
                Get the best city views from the London Eye and Thames!
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
              <span>30-min ride on the London Eye</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
              <span>40-min one-way Thames River Cruise</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
              <span>Live English commentary</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
              <span>
                Audio guide in English, Arabic, Chinese, French, German, Hindi,
                Indonesian, Italian, Japanese, Korean, Russian, Vietnamese, and
                Spanish
              </span>
            </li>
          </ul>
        </div>

        {/* Fast-Track Entry Option */}
        <div className="border border-gray-200 rounded-lg p-6 relative">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            London Eye Fast-Track Entry + Thames River Cruise
          </h3>

          <div className="mb-4">
            <div className="text-gray-500 line-through text-lg">£76.34</div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">£65.98</span>
              <span className="bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded">
                14% off
              </span>
            </div>
          </div>

          <button
            onClick={() => setSelectedOption("fasttrack")}
            className={`w-full py-3 rounded-lg mb-6 font-medium ${
              selectedOption === "fasttrack"
                ? "bg-purple-100 text-purple-700 border border-purple-200"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
          >
            {selectedOption === "fasttrack" ? (
              <div className="flex items-center justify-center gap-2">
                <Check size={20} />
                Selected
              </div>
            ) : (
              "Select"
            )}
          </button>

          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
              <span>
                Fast-track London Eye access, plus a Thames River cruise
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
              <span>
                Priority boarding to the London Eye through a fast-track
                entrance
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
              <span>30-min ride on the London Eye</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
              <span>40-min one-way Thames River Cruise</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
              <span>Live English commentary</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
              <span>
                Audio guide in English, Arabic, Chinese, French, German, Hindi,
                Indonesian, Italian, Japanese, Korean, Russian, Vietnamese, and
                Spanish
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TicketPreference;
