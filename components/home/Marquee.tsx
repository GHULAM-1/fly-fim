"use client";
import React from "react";
import Marquee from "react-fast-marquee";
import { useTranslation } from "react-i18next";

const MarqueeComp = () => {
  const { t } = useTranslation();

  const partners = [
    "/images/1.png",
    "/images/2.svg",
    "/images/3.webp",
    "/images/4.svg.png",
    "/images/5.png",
    "/images/6.jpg",
    "/images/7.png",
    "/images/8.png",
    "/images/9.png",
    "/images/10.png",
  ];

  const hotels = [
    "/images/h1.png",
    "/images/h2.png",
    "/images/h3.svg.png",
    "/images/h4.png",
    "/images/h5.png",
    "/images/h6.svg.png",
    "/images/h7.svg.png",
    "/images/h8.png",
    "/images/h9.png",
    "/images/h10.png",
    "/images/h11.svg.png",
  ];

  return (
    <div className="py-10">
      <h2 className="text-lg sm:text-[30px] font-heading text-[#444444] max-w-[1200px] mx-auto px-[24px] xl:px-0 mb-10">
        {t("marquee.title")}
      </h2>
      <div dir="ltr">
        <Marquee pauseOnHover>
          {partners.map((partner) => (
            <img
              key={partner}
              src={partner}
              alt=""
              className="w-24 sm:w-36 h-16 object-contain mx-6"
            />
          ))}
        </Marquee>
        <Marquee direction="right" pauseOnHover className="mt-10">
          {hotels.map((hotel) => (
            <img
              key={hotel}
              src={hotel}
              alt=""
              className="w-24 sm:w-36 h-16 object-contain mx-6"
            />
          ))}
        </Marquee>
      </div>
    </div>
  );
};

export default MarqueeComp;
