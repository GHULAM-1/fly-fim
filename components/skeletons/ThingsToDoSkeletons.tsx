import { Skeleton } from "@/components/ui/skeleton";

export const ThingsToDoHeroSkeleton = () => (
  <div className="relative pt-20 md:pt-34 pb-4 mx-auto">
    <div className="relative mx-auto">
      <Skeleton className="w-full h-[45vh] md:h-[60vh] lg:max-h-[500px] lg:h-full rounded-2xl" />
      <div className="md:hidden px-3 mt-[-30px] pb-2 relative z-40">
        <Skeleton className="w-full h-12 rounded-md" />
      </div>
    </div>
  </div>
);

export const ThingsToDoNavigationSkeleton = () => (
  <div className="block sticky w-full bg-white z-20 py-4 md:top-30 top-16">
    <div className="flex gap-2 overflow-x-auto scrollbar-hide z-20 max-w-[1200px] mx-auto px-[24px] xl:px-0">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="h-12 w-32 rounded-[4px] flex-shrink-0" />
      ))}
    </div>
  </div>
);

export const ThingsToDoCarouselSkeleton = ({ title }: { title?: string }) => (
  <div className="mb-10">
    {title ? (
      <Skeleton className="h-8 w-64 mb-6" />
    ) : (
      <Skeleton className="h-8 w-48 mb-6" />
    )}
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex-shrink-0 w-72">
          <Skeleton className="w-full h-48 rounded-lg mb-3" />
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-6 w-20" />
        </div>
      ))}
    </div>
  </div>
);

export const ThingsToDoMustDoSkeleton = () => (
  <div className="mb-10">
    <Skeleton className="h-8 w-48 mb-6" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index}>
          <Skeleton className="w-full h-48 rounded-lg mb-3" />
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  </div>
);

export const ThingsToDoBrowseThemesSkeleton = () => (
  <div className="mb-10">
    <Skeleton className="h-8 w-56 mb-6" />
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="text-center">
          <Skeleton className="w-full h-32 rounded-lg mb-3" />
          <Skeleton className="h-4 w-3/4 mx-auto" />
        </div>
      ))}
    </div>
  </div>
);

export const ThingsToDoTestimonialsSkeleton = () => (
  <div className="mb-10">
    <Skeleton className="h-8 w-40 mb-6" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="p-6 border rounded-lg">
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-4" />
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const ThingsToDoFaqsSkeleton = () => (
  <div className="mb-10">
    <Skeleton className="h-8 w-48 mb-6" />
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="border rounded-lg p-4">
          <Skeleton className="h-5 w-3/4" />
        </div>
      ))}
    </div>
  </div>
);