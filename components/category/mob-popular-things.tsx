"use client";
import React, { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";

export default function MobPopularThings({
  title,
  recommendations,
}: {
  title: string;
  recommendations: any[];
}) {
  // Local state for simple variant pagination
  const [currentPage, setCurrentPage] = useState(0);

  const simpleScrollLeft = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const simpleScrollRight = () => {
    const maxCards = Math.max(0, recommendations.length); // Show 3 cards at once
    if (currentPage < maxCards) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Touch/swipe functionality for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      simpleScrollRight(); // Swipe left = go to next card
    }
    if (isRightSwipe) {
      simpleScrollLeft(); // Swipe right = go to previous card
    }
  };

  return (
    <div className="py-4 max-w-screen-2xl mx-auto px-[24px]  2xl:px-0">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-lg sm:text-2xl font-halyard-text md:font-bold text-[#444444]">
          {title}
        </h2>
        <div className="md:flex hidden items-center gap-4">
          <Link
            href="/museums"
            className="text-sm text-gray-500 underline underline-offset-4 whitespace-nowrap"
          >
            See all
          </Link>
          <div className="flex items-center gap-2">
            <button
              className="text-sm hover:cursor-pointer text-gray-500 underline underline-offset-4 whitespace-nowrap border p-2 rounded-full"
              onClick={simpleScrollLeft}
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button
              className="text-sm hover:cursor-pointer text-gray-500 underline underline-offset-4 whitespace-nowrap border p-2 rounded-full"
              onClick={simpleScrollRight}
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="mt-6 relative overflow-hidden">
        <div
          className="flex gap-3 md:gap-2 transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${currentPage * 200}px)`,
            width: `${recommendations.length * 200}px`,
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {recommendations.map((recommendation, i) => (
            <Link
              key={recommendation.id}
              href={`/things-to-do/${recommendation.city}`}
              className="flex-shrink-0 cursor-pointer group w-[165px] md:w-[190px]"
            >
              <div className=" relative flex flex-col gap-2 transition-all duration-500 ease-out transform hover:-translate-y-1 pr-2 rounded-lg">
                <div>
                  <img
                    src={recommendation.image}
                    alt={recommendation.description}
                    className="rounded h-[200px] md:w-full w-full"
                  />
                </div>
                <div className="text-[#444444] font-halyard-text text-[14px] absolute top-2 left-2 bg-[#f8f8f8] rounded-full px-2 py-[1px]">{i + 1}</div>
                <div className="min-w-0">
                  <p className="font-text text-[#444444] md:mt-2 leading-tight text-[17px] md:text-base break-words">
                    {recommendation.description}{" "}
                    <span className="font-text md:hidden inline-block text-[#444444] md:mt-2 leading-tight break-words">
                      {recommendation.city}
                    </span>
                  </p>
                  <p className="font-text md:block hidden text-[#444444] md:mt-2 leading-tight md:max-w-32">
                    {recommendation.city}
                  </p>

                  <p className="text-[#666666] font-halyard-text-light text-[14px] md:text-sm mt-1 break-words">
                    {recommendation.place}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
