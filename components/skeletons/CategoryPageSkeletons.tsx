import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const CategoryPageHeaderSkeleton = () => {
  return (
    <div className="px-[24px] xl:px-0">
      <div className="mb-[34px] md:block hidden">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-1" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-1" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="block mt-0">
        <div className="flex items-center gap-2 mb-0">
          <div className="flex items-center gap-1">
            <Skeleton className="w-5 h-5 rounded" />
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <Skeleton className="h-8 w-80 mt-2" />
      </div>
    </div>
  );
};

export const CategoryNavigationSkeleton = () => {
  return (
    <div className="w-full bg-white py-4">
      <div className="flex gap-2 max-w-[1200px] mx-auto px-[24px] xl:px-0">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-32 rounded-md" />
        ))}
      </div>
    </div>
  );
};

export const CategoryPopularThingsSkeleton = () => {
  return (
    <div className="px-[24px] xl:px-0 mb-10">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="h-48 w-full rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CategoryCarouselGridSkeleton = ({ title }: { title?: string }) => {
  return (
    <div className="mb-10 px-[24px] xl:px-0">
      {title ? (
        <Skeleton className="h-7 w-64 mb-6" />
      ) : (
        <Skeleton className="h-7 w-48 mb-6" />
      )}
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="min-w-[280px] space-y-3">
            <Skeleton className="h-48 w-full rounded-md" />
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Skeleton className="h-3 w-20" />
                <div className="flex items-center gap-1">
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-3 w-8" />
                </div>
              </div>
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CategoryBrowseThemesSkeleton = () => {
  return (
    <div className="mb-10 px-[24px] xl:px-0">
      <Skeleton className="h-7 w-40 mb-6" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3 p-4 border rounded-md">
            <Skeleton className="h-6 w-6 rounded" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const CategoryTestimonialsSkeleton = () => {
  return (
    <div className="mb-10 px-[24px] xl:px-0">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="border rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, starIndex) => (
                <Skeleton key={starIndex} className="h-4 w-4 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <div className="flex items-center gap-3 pt-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};