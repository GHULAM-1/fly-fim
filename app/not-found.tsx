"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import CategoriesDropdown from "@/components/category/CategoriesDropdown";
import NotFoundCards from "@/components/not-found-cards";

export default function NotFound() {
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const { t } = useTranslation();
  return (
    <div className=" flex items-center justify-center px-4">
      <div className="hidden md:block fixed md:top-19 bg-[#fff] w-full py-3 z-40 border-b">
        <CategoriesDropdown
          showCategoriesDropdown={showCategoriesDropdown}
          setShowCategoriesDropdown={setShowCategoriesDropdown}
          setShowBanner={setShowBanner}
        />
      </div>
      <div className="max-w-[1200px] w-full md:mt-74 mt-24"> 
        {/* 404 Number */}
        <div className="mb-8 flex md:flex-row flex-col justify-center md:gap-10 items-end md:mr-10 mr-8">
          <div className="flex mb-2">
            <img src="/not-found.png" alt="" className="w-[323px] md:w-[200px]" />
          </div>
          <div className="font-halyard-text text-center md:mt-0 mt-[-10px]">
            <h1 className="md:text-[184px] text-[46px] mb-5 md:mb-0 font-bold text-[#cbcbcb]">404</h1>
            <p className="text-[#9a9a9a] md:mt-[-60px] text-[16px] leading-relaxed">
              The page you are looking for cannot be found{" "}
            </p>
          </div>
        </div>
        <div className="mb-[120px] md:block hidden mt-[80px]">
          <NotFoundCards />
        </div>
      </div>
    </div>
  );
}
