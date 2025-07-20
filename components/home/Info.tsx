"use client";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const Info = () => {
  const { t } = useTranslation();
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const handleCardClick = (cardIndex: number) => {
    setActiveCard(activeCard === cardIndex ? null : cardIndex);
  };

  return (
    <div className="py-4 sm:py-10 pl-[16px] pr-[24px] max-w-[1220px] mx-auto xl:px-0 flex justify-between gap-4 sm:gap-8 md:gap-10 overflow-scroll md:overflow-visible scrollbar-hide">
      <div
        className="relative w-[65%] md:w-full shrink-0 md:shrink group cursor-pointer"
        onClick={() => handleCardClick(0)}
      >
        <img
          src="/images/info1.png"
          alt=""
          className="absolute top-0 left-0 w-full h-full -z-20"
        />
        <div className="absolute top-0 left-0 w-full h-full backdrop-blur-xl bg-white/80 -z-10"></div>
        <img
          src="/images/info1.png"
          alt=""
          className={`w-16 sm:w-18 h-16 sm:h-18 ${
            activeCard === 0 ? "hidden" : "group-hover:hidden"
          }`}
        />
        <img
          src="/images/info1.gif"
          alt=""
          className={`w-16 sm:w-18 h-16 sm:h-18 ${
            activeCard === 0 ? "block" : "hidden group-hover:block"
          }`}
        />
        <h2 className="text-base ml-3 sm:text-[21px] font-heading text-[#444444]">
          {t("info.card1.title")}
        </h2>
        <p className="text-[15px] ml-3 mt-1 font-halyard-text-light   text-[#666666]">{t("info.card1.description")}</p>
      </div>
      <div
        className="relative w-[65%] md:w-full shrink-0 md:shrink group cursor-pointer"
        onClick={() => handleCardClick(1)}
      >
        <img
          src="/images/info2.png"
          alt=""
          className="absolute top-0 left-0 w-full h-full -z-20 p-5"
        />
        <div className="absolute top-0 left-0 w-full h-full backdrop-blur-xl bg-white/80 -z-10"></div>
        <img
          src="/images/info2.png"
          alt=""
          className={`w-16 sm:w-18 h-16 sm:h-18 p-3 ${
            activeCard === 1 ? "hidden" : "group-hover:hidden"
          }`}
        />
        <img
          src="/images/info2.gif"
          alt=""
          className={`w-16 sm:w-18 h-16 sm:h-18 p-3 ${
            activeCard === 1 ? "block" : "hidden group-hover:block"
          }`}
        />
        <h2 className="text-base ml-3 sm:text-[21px] font-heading text-[#444444]">
          {t("info.card2.title")}
        </h2>
        <p className="text-[15px] ml-3 mt-1 font-halyard-text-light text-[#666666]">{t("info.card2.description")}</p>
      </div>
      <div
        className="relative w-[65%] md:w-full shrink-0 md:shrink group cursor-pointer"
        onClick={() => handleCardClick(2)}
      >
        <img
          src="/images/info3.png"
          alt=""
          className="absolute top-0 left-0 w-full h-full -z-20 p-5"
        />
        <div className="absolute top-0 left-0 w-full h-full backdrop-blur-xl bg-white/90 -z-10"></div>
        <img
          src="/images/info3.png"
          alt=""
          className={`w-16 sm:w-18 h-16 sm:h-18 p-3 ${
            activeCard === 2 ? "hidden" : "group-hover:hidden"
          }`}
        />
        <img
          src="/images/info3.gif"
          alt=""
          className={`w-16 sm:w-18 h-16 sm:h-18 p-3 ${
            activeCard === 2 ? "block" : "hidden group-hover:block"
          }`}
        />
        <h2 className="text-base ml-3 sm:text-[21px] font-heading text-[#444444]">
          {t("info.card3.title")}
        </h2>
        <p className="text-[15px] ml-3 mt-1 font-halyard-text-light text-[#666666]">{t("info.card3.description")}</p>
      </div>
      <div
        className="relative w-[65%] md:w-full shrink-0 md:shrink group cursor-pointer"
        onClick={() => handleCardClick(3)}
      >
        <img
          src="/images/info4.png"
          alt=""
          className="absolute top-0 left-0 mr-10 w-full h-full -z-20"
        />
        <div className="absolute top-0 left-0 w-full h-full backdrop-blur-xl bg-white/90 -z-10"></div>
        <img
          src="/images/info4.png"
          alt=""
          className={`w-16 sm:w-18 h-16 sm:h-18  ${
            activeCard === 3 ? "hidden" : "group-hover:hidden"
          }`}
        />
        <img
          src="/images/info4.gif"
          alt=""
          className={`w-16 sm:w-18 h-16 sm:h-18 ${
            activeCard === 3 ? "block" : "hidden group-hover:block"
          }`}
        />
        <h2 className="text-base ml-3 sm:text-[21px] font-heading text-[#444444]">
          {t("info.card4.title")}
        </h2>
        <p className="text-[15px] ml-3 mt-1 font-halyard-text-light text-[#666666]">{t("info.card4.description")}</p>
      </div>
    </div>
  );
};

export default Info;
