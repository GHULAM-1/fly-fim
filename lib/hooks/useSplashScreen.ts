"use client";
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface UseSplashScreenOptions {
  minDuration?: number; // Minimum time to show splash
  showOnRouteChange?: boolean; // Show on every route change
}

export const useSplashScreen = ({
  minDuration = 4000, // Wait for animation to complete (frame #140+)
  showOnRouteChange = true
}: UseSplashScreenOptions = {}) => {
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Show splash on route change
    if (showOnRouteChange) {
      setIsVisible(true);
      
      // Hide splash after animation completes
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, minDuration);

      return () => clearTimeout(timer);
    }
  }, [pathname, minDuration, showOnRouteChange]);

  // Initial mount
  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, minDuration);

    return () => clearTimeout(timer);
  }, []);

  return {
    isVisible,
    hideSplash: () => setIsVisible(false)
  };
};