import React from "react";

const Banner = () => {
  return (
    <div className="px-28 py-10">
      <div className="relative">
        <img src="/images/banner.png" alt="" className="w-full" />
        <div className="absolute top-1/2 -translate-y-1/2 left-16">
          <h2 className="text-3xl font-bold">
            Get the Headout app, save up to 80%
          </h2>
          <p className="text-gray-500 text-lg mt-2 max-w-xl">
            Enjoy exclusive deals, offline access to your tickets & live booking
            updates
          </p>
        </div>
      </div>
    </div>
  );
};

export default Banner;
