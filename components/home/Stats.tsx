"use client";
import React from "react";
import { useTranslation } from "react-i18next";

const Stats = () => {
  const { t } = useTranslation();

  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-28 py-10">
      <h2 className="text-lg sm:text-2xl font-semibold md:font-bold text-gray-700">
        {t("stats.title")}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-10 mt-4 md:mt-10">
        <div>
          <img src="/images/stat1.png" alt="" className="w-40 md:w-60" />
          <p className="mt-2 text-gray-500 text-xs md:text-sm">
            {t("stats.reviews")}
          </p>
        </div>
        <div>
          <img src="/images/stat2.png" alt="" className="w-14 md:w-20" />
          <h3 className="text-base sm:text-xl font-semibold text-gray-700 my-2">
            {t("stats.customers.count")}
          </h3>
          <p className="text-gray-500 text-xs sm:text-sm">
            {t("stats.customers.description")}
          </p>
        </div>
        <div>
          <img src="/images/stat3.png" alt="" className="w-32 md:w-36 p-2" />
          <h3 className="text-base sm:text-xl font-semibold text-gray-700 my-2">
            {t("stats.media.title")}
          </h3>
          <p className="text-gray-500 text-xs sm:text-sm">
            {t("stats.media.description")}
          </p>
        </div>
        <div>
          <img src="/images/stat4.png" alt="" className="w-14 md:w-20" />
          <h3 className="text-base sm:text-xl font-semibold text-gray-700 my-2">
            {t("stats.support.title")}
          </h3>
          <p className="text-gray-500 text-xs sm:text-sm">
            {t("stats.support.description")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Stats;
