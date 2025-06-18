import React from "react";

const Info = () => {
  return (
    <div className="py-10 px-28 grid grid-cols-4 gap-10">
      <div className="relative">
        <img
          src="/images/info1.png"
          alt=""
          className="absolute top-0 left-0 w-full h-full -z-20"
        />
        <div className="absolute top-0 left-0 w-full h-full backdrop-blur-xl bg-white/80 -z-10"></div>
        <img src="/images/info1.png" alt="" className="w-16" />
        <h2 className="text-lg font-bold text-gray-700 mt-3">
          Only the finest
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          At Headout, you only find the best. We do the hard work so you don’t
          have to.
        </p>
      </div>
      <div className="relative">
        <img
          src="/images/info2.png"
          alt=""
          className="absolute top-0 left-0 w-full h-full -z-20"
        />
        <div className="absolute top-0 left-0 w-full h-full backdrop-blur-xl bg-white/80 -z-10"></div>
        <img src="/images/info2.png" alt="" className="w-16" />
        <h2 className="text-lg font-bold text-gray-700 mt-3">
          Only the finest
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          At Headout, you only find the best. We do the hard work so you don’t
          have to.
        </p>
      </div>
      <div className="relative">
        <img
          src="/images/info3.png"
          alt=""
          className="absolute top-0 left-0 w-full h-full -z-20"
        />
        <div className="absolute top-0 left-0 w-full h-full backdrop-blur-xl bg-white/90 -z-10"></div>
        <img src="/images/info3.png" alt="" className="w-16" />
        <h2 className="text-lg font-bold text-gray-700 mt-3">
          Only the finest
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          At Headout, you only find the best. We do the hard work so you don’t
          have to.
        </p>
      </div>
      <div className="relative">
        <img
          src="/images/info4.png"
          alt=""
          className="absolute top-0 left-0 w-full h-full -z-20"
        />
        <div className="absolute top-0 left-0 w-full h-full backdrop-blur-xl bg-white/90 -z-10"></div>
        <img src="/images/info4.png" alt="" className="w-16" />
        <h2 className="text-lg font-bold text-gray-700 mt-3">
          Only the finest
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          At Headout, you only find the best. We do the hard work so you don’t
          have to.
        </p>
      </div>
    </div>
  );
};

export default Info;
