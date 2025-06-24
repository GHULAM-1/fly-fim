"use client";
import React from "react";
import Marquee from "react-fast-marquee";
import { useTranslation } from "react-i18next";

const MarqueeComp = () => {
  const { t } = useTranslation();

  const partners = [
    "/images/1.avif",
    "/images/2.avif",
    "/images/3.png.avif",
    "/images/4.png.avif",
    "/images/5.png.avif",
    "/images/6.png.avif",
    "/images/7.png.avif",
    "/images/8.png.avif",
    "/images/9.png.avif",
    "/images/10.png.avif",
    "/images/11.png.avif",
    "/images/12.png.avif",
    "/images/13.png.avif",
    "/images/14.png.avif",
    "/images/15.png.avif",
    "/images/16.png.avif",
    "/images/17.png.avif",
    "/images/18.png.avif",
    "/images/19.png.avif",
  ];

  return (
    <div className="py-10">
      <h2 className="text-lg sm:text-2xl font-semibold md:font-bold text-gray-700 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-28 mb-10">
        {t("marquee.title")}
      </h2>
      <div dir="ltr">
        <Marquee pauseOnHover>
          {partners.map((partner) => (
            <img
              key={partner}
              src={partner}
              alt=""
              className="w-24 sm:w-36 mx-6"
            />
          ))}
        </Marquee>
        <Marquee direction="right" pauseOnHover className="mt-10">
          {partners.map((partner) => (
            <img
              key={partner}
              src={partner}
              alt=""
              className="w-24 sm:w-36 mx-6"
            />
          ))}
        </Marquee>
      </div>
    </div>
  );
};

export default MarqueeComp;
