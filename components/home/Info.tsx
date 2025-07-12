"use client";
import React from "react";
import { useTranslation } from "react-i18next";

const Info = () => {
  const { t } = useTranslation();

  return (
    <div className="py-4 sm:py-10 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-28 2xl:max-w-screen-xl mx-auto 2xl:px-0 flex justify-between gap-4 sm:gap-8 md:gap-10 overflow-scroll md:overflow-visible scrollbar-hide">
      <div className="relative w-[65%] md:w-full shrink-0 md:shrink group">
        <img
          src="/images/info1.png"
          alt=""
          className="absolute top-0 left-0 w-full h-full -z-20"
        />
        <div className="absolute top-0 left-0 w-full h-full backdrop-blur-xl bg-white/80 -z-10"></div>
        <img
          src="/images/info1.png"
          alt=""
          className="w-24 h-22 group-hover:hidden"
        />
        <img
          src="/images/info1.gif"
          alt=""
          className="w-22 h-22 hidden group-hover:block"
        />
        <h2 className="text-base sm:text-lg font-semibold sm:font-bold text-gray-700">
          {t("info.card1.title")}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {t("info.card1.description")}
        </p>
      </div>
      <div className="relative w-[65%] md:w-full shrink-0 md:shrink group">
        <img
          src="/images/info2.png"
          alt=""
          className="absolute top-0 left-0 w-full h-full -z-20 p-5"
        />
        <div className="absolute top-0 left-0 w-full h-full backdrop-blur-xl bg-white/80 -z-10"></div>
        <img
          src="/images/info2.png"
          alt=""
          className="w-22 h-22 group-hover:hidden p-3"
        />
        <img
          src="/images/info2.gif"
          alt=""
          className="w-22 h-22 hidden group-hover:block p-3"
        />
        <h2 className="text-base sm:text-lg font-semibold sm:font-bold text-gray-700">
          {t("info.card2.title")}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {t("info.card2.description")}
        </p>
      </div>
      <div className="relative w-[65%] md:w-full shrink-0 md:shrink group">
        <img
          src="/images/info3.png"
          alt=""
          className="absolute top-0 left-0 w-full h-full -z-20 p-5"
        />
        <div className="absolute top-0 left-0 w-full h-full backdrop-blur-xl bg-white/90 -z-10"></div>
        <img
          src="/images/info3.png"
          alt=""
          className="w-22 h-22 group-hover:hidden p-3"
        />
        <img
          src="/images/info3.gif"
          alt=""
          className="w-22 h-22 hidden group-hover:block p-3"
        />
        <h2 className="text-base sm:text-lg font-semibold sm:font-bold text-gray-700">
          {t("info.card3.title")}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {t("info.card3.description")}
        </p>
      </div>
      <div className="relative w-[65%] md:w-full shrink-0 md:shrink group">
        <img
          src="/images/info4.png"
          alt=""
          className="absolute top-0 left-0 w-full h-full -z-20"
        />
        <div className="absolute top-0 left-0 w-full h-full backdrop-blur-xl bg-white/90 -z-10"></div>
        <img
          src="/images/info4.png"
          alt=""
          className="w-22 h-22 group-hover:hidden p-3"
        />
        <img
          src="/images/info4.gif"
          alt=""
          className="w-22 h-22 hidden group-hover:block p-3"
        />
        <h2 className="text-base sm:text-lg font-semibold sm:font-bold text-gray-700">
          {t("info.card4.title")}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {t("info.card4.description")}
        </p>
      </div>
    </div>
  );
};

export default Info;
