import React from "react";
import { Diamond, Calendar, Clock, MapPin } from "lucide-react";

const TravelGuide = () => {
  return (
    <div className="py-10 max-w-screen-2xl mx-auto 2xl:px-0">
      <h2 className="text-lg sm:text-2xl font-semibold md:font-bold text-gray-700">
        Get inspired for your London visit
      </h2>

      <div className="flex flex-col md:flex-row gap-6 mt-4">
        {/* Large Purple Card */}
        <div className="w-full md:w-1/2 h-[80%] bg-[#330066] rounded-xl overflow-hidden relative p-3 group">
          <img
            src="https://cdn-imgix.headout.com/blog-guide/Map.svg?w=325.5&h=306.6&fm=svg&crop=faces&auto=compress%2Cformat&fit=min"
            alt=""
            className="absolute bottom-0 right-0 w-36 group-hover:translate-5 transition-all duration-300"
          />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[#330066]/60"></div>
          <div className="flex flex-col md:flex-row h-full">
            {/* Image Section */}
            <div className="w-full md:w-1/2 h-full rounded-lg overflow-hidden z-10">
              <img
                src="/images/d1.jpg.avif"
                alt="London Eye"
                className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-all duration-300"
              />
            </div>

            {/* Content Section */}
            <div className="w-full md:w-1/2 p-3 md:p-6 text-white relative z-10">
              <h3 className="text-xl font-bold mb-3">London Travel Guide</h3>

              <p className="text-purple-100 text-sm leading-relaxed">
                Top things to do, budget hacks, public transportation, best
                restaurants & hotels, culture tips & more inside!
              </p>
              <div className="my-3 h-[0.5px] w-full bg-gray-300" />
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-xs">
                  <Diamond className="w-4 h-4" />
                  <span>Top attractions & hidden gems</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Clock className="w-4 h-4" />
                  <span>Tips on tickets and timings</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Calendar className="w-4 h-4" />
                  <span>Best of food, shopping & fun</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <MapPin className="w-4 h-4" />
                  <span>Seasonal and local events</span>
                </div>
              </div>

              <button className="text-sm bg-white text-purple-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Get Inspired
              </button>
            </div>
          </div>
        </div>

        {/* Middle Card - Detailed London Itineraries */}
        <div className="w-full md:w-1/4 hover:translate-y-[-7px] hover:cursor-pointer transition-all duration-300 bg-white overflow-hidden flex flex-row md:flex-col gap-3">
          <img
            src="/images/d5.jpg.avif"
            alt="London street with UK flags"
            className="w-1/2 md:w-full h-40 md:h-60 object-cover rounded-xl"
          />
          <div>
            <h3 className="text-sm md:text-base font-halyard-text text-gray-800 mb-3">
              Detailed London Itineraries
            </h3>
            <p className="text-xs text-gray-600 md:text-sm font-halyard-text-light">
              Planning a trip to London? From iconic landmarks like Big Ben and
              the Tower Bridge to hidden gems in charming neighborhoods...
            </p>
          </div>
        </div>

        {/* Right Card - Best Time To Visit London */}
        <div className="w-full md:w-1/4 hover:translate-y-[-7px] hover:cursor-pointer transition-all duration-300 bg-white overflow-hidden flex flex-row md:flex-col gap-3">
          <img
            src="/images/d4.jpg.avif"
            alt="Tower Bridge at sunset"
            className="w-1/2 md:w-full h-40 md:h-60 object-cover rounded-xl"
          />
          <div>
            <h3 className="text-sm md:text-base font-halyard-text text-gray-800 mb-3">
              Best Time To Visit London
            </h3>
            <p className="text-xs text-gray-600 md:text-sm font-halyard-text-light">
              "Visit London in the summer," they said. "The weather will be
              perfect," they said. As any local will tell you, planning a London
              trip isn...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelGuide;
