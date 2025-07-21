"use client";
import React from "react";
import { useTranslation } from "react-i18next";

const Stats = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-[1200px] mx-auto px-[24px] my-[44px] py-[32px] xl:px-0">
      <h2 className="text-lg sm:text-[30px] font-heading text-[#444444]">
        {t("stats.title")}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-10 mt-4 md:mt-[51px]">
        <a href="https://www.trustpilot.com/review/flyfim.com">
          <div>
            <img src="/images/stat1.png" alt="" className="w-40 md:w-60" />
            <p className="mt-2 ml-[4px] font-halyard-text-light text-[#666666]  text-[14px] ">
              {t("stats.reviews")}
            </p>
          </div>
        </a>
        <div>
          <img src="/images/stat2-new.png" alt="" className="w-14 md:w-20" />
          <h3 className="text-base sm:text-xl font-heading text-[#444444] my-2">
            {t("stats.customers.count")}
          </h3>
          <p className=" text-[#666666] font-halyard-text-light text-[14px] ">
            {t("stats.customers.description")}
          </p>
        </div>
        <div>
          <img src="/images/stat3.png" alt="" className="w-32 md:w-38 p-2" />
          <h3 className="text-base sm:text-xl font-heading text-[#444444] my-2">
            {t("stats.media.title")}
          </h3>
          <p className=" text-[#666666] font-halyard-text-light text-[14px]">
            {t("stats.media.description")}
          </p>
        </div>
        <div>
          <img src="/images/stat4.png" alt="" className="w-14 md:w-18" />
          <h3 className="text-base sm:text-xl font-heading text-[#444444] my-2">
            {t("stats.support.title")}
          </h3>
          <p className=" text-[#666666] font-halyard-text-light text-[14px]">
            {t("stats.support.description")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Stats;
