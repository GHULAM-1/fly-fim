"use client";
import React from "react";
import { useTranslation } from "react-i18next";

const Info = () => {
  const { t } = useTranslation();

  return (
    <div className="py-10 px-8 md:px-16 lg:px-24 xl:px-28 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
      <div className="relative">
        <img
          src="/images/info1.png"
          alt=""
          className="absolute top-0 left-0 w-full h-full -z-20"
        />
        <div className="absolute top-0 left-0 w-full h-full backdrop-blur-xl bg-white/80 -z-10"></div>
        <img src="/images/info1.png" alt="" className="w-16" />
        <h2 className="text-lg font-bold text-gray-700 mt-3">
          {t("info.card1.title")}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {t("info.card1.description")}
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
          {t("info.card2.title")}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {t("info.card2.description")}
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
          {t("info.card3.title")}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {t("info.card3.description")}
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
