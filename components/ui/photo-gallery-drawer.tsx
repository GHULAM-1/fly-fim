"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";

interface PhotoGalleryDrawerProps {
  images: string[];
  itemName: string;
  city: string;
  initialIndex?: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
}

const PhotoGalleryDrawer: React.FC<PhotoGalleryDrawerProps> = ({
  images,
  itemName,
  city,
  initialIndex = 0,
  isOpen,
  onOpenChange,
  trigger
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isClient, setIsClient] = useState(false);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  // Auto-scroll to current thumbnail when drawer opens or index changes

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  // Prevent hydration issues by not rendering until client-side
  if (!isClient) {
    return null;
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
      <DrawerContent 
        fullScreen={true} 
        showCloseButton={true}
        className="bg-black rounded-t-2xl rounded-b-none"
      >
        {/* Header with white bottom border and close button */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-[#222222] rounded-t-2xl border-b border-white/20">
          <div className="px-4 pt-4 pb-6 flex items-center justify-between">
            <h2 className="text-white text-lg font-halyard-text font-medium text-center flex-1">Photo gallery</h2>
            <DrawerClose className="text-white p-1 hover:bg-white/10 rounded-full transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </DrawerClose>
          </div>
        </div>

        {/* Main image display - no navigation arrows, no rounded corners, no px-4 */}
        <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
          <div className="w-full pt-20 pb-32">
            <div className="w-full aspect-[16/9] flex items-center justify-center">
              <img
                src={images[currentIndex]}
                alt={`${itemName} ${currentIndex + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          {/* Add counter here - bottom right under main image */}
          <div className="absolute bottom-45 right-4 z-10 bg-black/50 rounded-full px-3 py-1 backdrop-blur-sm">
            <div className="text-white text-sm">
              {currentIndex + 1}/{images.length}
            </div>
          </div>
        </div>

        {/* Bottom thumbnail strip */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent">
          <div className="px-4 pt-8 pb-6">
            <div 
              ref={scrollContainerRef}
              className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none' 
              }}
            >
              {images.map((image, index) => (
                <button
                  key={index}
                  ref={(el) => { thumbnailRefs.current[index] = el; }}
                  onClick={() => goToImage(index)}
                  className={`flex-shrink-0 relative rounded-lg overflow-hidden transition-all ${
                    index === currentIndex
                      ? "ring-1 ring-white opacity-100"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <div className="w-16 h-12 aspect-[4/3]">
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Custom scrollbar hiding styles */}
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </DrawerContent>
    </Drawer>
  );
};

export default PhotoGalleryDrawer;