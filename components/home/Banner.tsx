"use client";
import React from "react";
import { useTranslation } from "react-i18next";

const Banner = () => {
  const { t } = useTranslation();

  return (
    <div className="px-8 md:px-16 lg:px-24 xl:px-28 py-10">
      <div className="relative">
        <img src="/images/banner.png" alt="" className="w-full" />
        <div className="absolute top-1/2 -translate-y-1/2 left-10 xl:left-16">
          <h2 className="text-xl xl:text-3xl font-bold">{t("banner.title")}</h2>
          <p className="text-gray-500 text-sm xl:text-lg mt-2 max-w-sm xl:max-w-xl">
            {t("banner.subtitle")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Banner;
