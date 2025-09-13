"use client";
import React, { useEffect } from 'react';

interface SplashScreenProps {
  isVisible: boolean;
  onComplete?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ 
  isVisible, 
  onComplete
}) => {
  useEffect(() => {
    if (isVisible) {
      // Prevent scrolling when splash is visible
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed'; // Prevent background glitches
      document.body.style.width = '100%';
      document.body.style.height = '100%';
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
          className="w-48 h-48 md:w-72 md:h-72 object-contain"
          loading="eager"
          decoding="async"
          style={{
            imageRendering: 'crisp-edges',
          }}
        />
      </div>
      
      {/* Prevent any flashing by ensuring solid background */}
      <div className="absolute inset-0 bg-white -z-10"></div>
    </div>
  );
};

export default SplashScreen;