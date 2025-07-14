"use client";
import React from "react";
import { useTranslation } from "react-i18next";

const Banner = () => {
  const { t } = useTranslation();

  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-28 py-4 sm:py-10 2xl:max-w-screen-xl mx-auto 2xl:px-0">
      <div className="relative">
        <img
          src="/images/banner.jpg"
          alt=""
          className="w-full h-60 hidden object-cover md:block rounded-lg"
        />
        <img
          src="/images/banner-mobile.jpg"
          alt=""
          className="w-full h-60 object-cover block md:hidden rounded-lg"
        />
        <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-10 xl:left-16">
          <h2 className="text-xl xl:text-3xl font-heading">
            {t("banner.title")}
          </h2>
          <p className="text-sm xl:text-lg mt-2 max-w-sm xl:max-w-xl">
            {t("banner.subtitle")}
          </p>
        </div>
        <div className="block md:hidden absolute top-10 px-5">
          <h2 className="text-lg sm:text-xl xl:text-3xl font-heading">
            {t("banner.title")}
          </h2>
          <p className="text-gray-500 text-sm xl:text-lg mt-2 max-w-sm xl:max-w-xl">
            {t("banner.subtitle")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Banner;
