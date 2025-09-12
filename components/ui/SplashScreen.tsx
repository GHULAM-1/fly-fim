"use client";
import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  isVisible: boolean;
  onComplete?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ 
  isVisible, 
  onComplete
}) => {
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Prevent scrolling when splash is visible
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed'; // Prevent background glitches
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      
      // Reset animation state
      setAnimationComplete(false);
      
      // Wait for animation to complete (assuming your GIF is around 3-4 seconds for full cycle)
      // Frame #140 would be roughly at 3.5-4 seconds if it's 30fps
      const animationTimer = setTimeout(() => {
        setAnimationComplete(true);
      }, 4000); // 4 seconds to ensure animation reaches frame #140+

      return () => clearTimeout(animationTimer);
    } else {
      // Re-enable scrolling when splash is hidden
      document.body.style.overflow = 'unset';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      onComplete?.();
    }

    return () => {
      // Cleanup on unmount
      document.body.style.overflow = 'unset';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-white flex items-center justify-center"
      style={{
        backdropFilter: 'blur(0px)',
        WebkitBackdropFilter: 'blur(0px)',
      }}
    >
      {/* Loader GIF */}
      <div className="flex flex-col items-center justify-center">
        <img 
          src="/loader.gif" 
          alt="Loading..." 
          className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain"
          loading="eager"
          decoding="async"
          style={{
            imageRendering: 'crisp-edges',
            imageRendering: '-webkit-crisp-edges',
          }}
        />
      </div>
      
      {/* Prevent any flashing by ensuring solid background */}
      <div className="absolute inset-0 bg-white -z-10"></div>
    </div>
  );
};

export default SplashScreen;