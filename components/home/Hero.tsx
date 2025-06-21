"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

const Hero = () => {
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 1000], [1, 1.5]);
  const { t } = useTranslation();
  return (
    <div className="h-[78vh] relative overflow-hidden">
      <motion.video
        src="/videos/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover absolute top-0 left-0 -z-20"
        style={{ scale }}
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black/30 -z-10" />
      <div className="w-full h-full px-8 md:px-16 lg:px-24 xl:px-28 py-20 flex flex-col justify-end gap-10">
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold max-w-2xl leading-tight">
          {t("hero.title")}
        </h1>
        <div className="flex items-center bg-white  max-w-sm gap-2 rounded-md py-3 px-4 shadow">
          <Input
            className="bg-transparent border-none focus-visible:ring-0 shadow-none"
            placeholder={t("hero.subtitle")}
          />
          <Search strokeWidth={1} />
        </div>
      </div>
    </div>
  );
};

export default Hero;
