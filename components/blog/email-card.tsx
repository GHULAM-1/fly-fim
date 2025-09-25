import React from "react";

export default function EmailCard() {
  return (
    <div className="relative w-full h-[300px] overflow-hidden rounded-sm">
      <img
        src="/email-banner.webp"
        alt="Newsletter background"
        className="w-full h-full object-cover"
      />
      <div className="absolute font-halyard-text inset-0 bg-black/40 flex items-center justify-center">
        <div className="text-center text-white max-w-2xl mx-auto px-6">
          <h1 className="text-[32px] font-bold mb-2">Be a smart traveler</h1>
          <p className="text-[16px] lg:mb-12 mb-10 text-white/90">
            The first to know about trending destinations, travel deals, tips
            and all things travel.
          </p>
          <div className="flex flex-row gap-4 justify-center items-center">
            <div className="flex flex-col md:flex-row lg:gap-4 gap-5 justify-center items-center w-full">
              <div className="lg:w-[65%] w-[100%]">
                <input
                  type="email"
                  placeholder="Enter email"
                  className="w-full px-4 py-4 rounded-[3px] bg-white border-0 text-gray-900 placeholder-gray-500 placeholder:text-[12px] lg:placeholder:text-[16px] focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="lg:w-[25%] w-[100%]">
                <button className="bg-purple-600 hover:cursor-pointer w-full hover:bg-purple-700 text-white px-8 py-3 lg:py-4 rounded-[3px] lg:font-semibold transition-colors whitespace-nowrap">
                  Get Inspired
                </button>
                
              </div>
            </div>
          </div>
            <p className="text-[12px] lg:text-end text-left text-white mr-6 mt-1">Unsubscribe anytime</p>
        </div>
      </div>
    </div>
  );
}
