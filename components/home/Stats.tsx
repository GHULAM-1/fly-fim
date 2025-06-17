import React from "react";

const Stats = () => {
  return (
    <div className="px-28 py-10">
      <h2 className="text-2xl font-bold text-gray-700">
        We've served 39 million+ guests and we are here for you
      </h2>
      <div className="grid grid-cols-4 gap-10 mt-10">
        <div>
          <img src="/images/stat1.png" alt="" className="w-60" />
          <p className="mt-2 text-gray-500 text-sm">
            Real reviews of real experiences. Trusted by explorers everywhere.
          </p>
        </div>
        <div>
          <img src="/images/stat2.png" alt="" className="w-20" />
          <h3 className="text-xl font-semibold text-gray-700 my-2">
            39 million+
          </h3>
          <p className="text-gray-500 text-sm">
            Happy customers across 10,000+ experiences
          </p>
        </div>
        <div>
          <img src="/images/stat3.png" alt="" className="w-36 p-2" />
          <h3 className="text-xl font-semibold text-gray-700 my-2">
            In the media
          </h3>
          <p className="text-gray-500 text-sm">
            Featured and recommended by the best brands
          </p>
        </div>
        <div>
          <img src="/images/stat4.png" alt="" className="w-20" />
          <h3 className="text-xl font-semibold text-gray-700 my-1">
            24 x 7 help center
          </h3>
          <p className="text-gray-500 text-sm">
            Have a question? Live chat with local experts anywhere, anytime
          </p>
        </div>
      </div>
    </div>
  );
};

export default Stats;
