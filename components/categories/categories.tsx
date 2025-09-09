"use client";
import React, { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";

export default function CategoriesCards({
    title,
    recommendations,
}: {
    title: string;
    recommendations: any[];
}) {
    const [currentPage, setCurrentPage] = useState(0);

    const simpleScrollLeft = () => {
      if (currentPage > 0) {
        console.log(
          "Scrolling left from card",
          currentPage,
          "to",
          currentPage - 1
        );
        setCurrentPage((prev) => prev - 1);
      }
    };

    const simpleScrollRight = () => {
      const maxCards = Math.max(0, recommendations.length); // Show 3 cards at once
      if (currentPage < maxCards) {
        console.log(
          "Scrolling right from card",
          currentPage,
          "to",
          currentPage + 1
        );
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
      <div className="py-4 max-w-screen-2xl mx-auto  2xl:px-0">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-2xl font-halyard-text md:font-bold text-[#444444]">
            {title}
          </h2>
          <div className="flex items-center gap-1">
            <Link
              href="/museums"
              className="text-sm text-gray-500 whitespace-nowrap"
            >
              See all
            </Link>
            <ChevronRightIcon className="w-4 h-4" />
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
            {recommendations.map((recommendation) => (
              <Link
                key={recommendation.id}
                href={`/things-to-do/${recommendation.city}`}
                className="flex-shrink-0 cursor-pointer group w-[156px]  md:w-[190px]"
              >
                <div className="flex flex-col pr-1 gap-2 transition-all duration-500 ease-out transform hover:-translate-y-1 rounded-lg">
                  <div>
                    <img
                      src={recommendation.image}
                      alt={recommendation.description}
                      className="rounded md:w-full w-full h-[210px]"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-text text-[#444444] md:mt-2 leading-tight text-[17px] md:text-base break-words">
                      {recommendation.place}{" "}
                    </p>
                    <p className="text-[#666666] font-halyard-text-light text-[14px] md:text-sm mt-1 break-words">
                      {recommendation.price}
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
