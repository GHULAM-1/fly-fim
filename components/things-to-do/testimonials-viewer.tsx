import React, { useState, useEffect, useRef } from "react";
import { 
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";

interface TestimonialsViewerProps {
  images: string[];
  itemName: string;
  isOpen: boolean;
  onClose: () => void;
}

const TestimonialsViewer: React.FC<TestimonialsViewerProps> = ({ 
  images, 
  itemName, 
  isOpen, 
  onClose 
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Check if screen is mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Handle opening modal/drawer
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
      if (isMobile) {
        setIsDrawerOpen(true);
      } else {
        // Start animation after a small delay to allow DOM to update
        setTimeout(() => setIsAnimating(true), 10);
      }
    } else {
      setIsDrawerOpen(false);
      setIsAnimating(false);
    }
  }, [isOpen, isMobile]);

  const closeModal = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex < images.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  };

  // Handle click outside modal (desktop only)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
    };

    if (isOpen && !isMobile) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isMobile]);

  // Handle escape key (desktop only)
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    if (isOpen && !isMobile) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, isMobile]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}>
        <DrawerContent 
          className="h-[75vh] rounded-t-2xl shadow-xl" 
          bgClass="bg-white" 
          showTopLine={false}
        >
          <DrawerHeader className=" pb-4 pt-5 px-4">
            <div className="flex justify-between items-center">
              <DrawerTitle className="text-lg font-halyard-text text-[#444444] text-center flex-1">
                {itemName}
              </DrawerTitle>
              <DrawerClose className="p-2 bg-white bg-opacity-10 rounded-lg w-8 h-8 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4L12 12M12 4L4 12" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </DrawerClose>
            </div>
          </DrawerHeader>
          
          <div className="flex-1 overflow-hidden bg-white">
            {/* Main image area */}
            <div className="relative h-3/5 bg-white flex items-center justify-center">
              <img
                src={images[currentImageIndex]}
                alt={`${itemName} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-contain"
                style={{ borderRadius: 0 }}
              />
              
              {/* Image counter */}
              <div className="absolute bottom-4 right-4 bg-white bg-opacity-80 text-white px-3 py-1 rounded-full text-xs">
                {currentImageIndex + 1}/{images.length}
              </div>
              
              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg disabled:opacity-50"
                    onClick={nextImage}
                    disabled={currentImageIndex >= images.length - 1}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 4L10 8L6 12" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg disabled:opacity-50"
                    onClick={prevImage}
                    disabled={currentImageIndex <= 0}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 4L6 8L10 12" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail grid */}
            <div className="h-2/5 p-4 bg-white">
              <div className="flex overflow-x-auto space-x-3 mt-2">
                {images.map((image, index) => (
                  <div 
                    key={index} 
                    className="flex-shrink-0 w-20 h-20 relative cursor-pointer"
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className={`w-full h-full object-cover rounded transition-all ${
                        currentImageIndex === index 
                          ? "border-2 border-white shadow-md" 
                          : "opacity-70"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Desktop Modal */}
      {isOpen && !isMobile && (
        <div 
          className={`fixed inset-0 z-50 flex justify-center transition-all duration-300 ease-out`} 
          style={{ 
            background: isAnimating ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0)',
            backdropFilter: isAnimating ? 'blur(4px)' : 'blur(0px)'
          }}
          onClick={closeModal}
        >
          <div 
            ref={modalRef}
            className={`relative bg-transparent w-full max-w-6xl mx-4 transition-all duration-300 ease-out pb-8 ${
              isAnimating 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-full opacity-0'
            }`}
            style={{ 
              marginTop: 'auto', 
              marginBottom: '2rem'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with title and close button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-xl font-medium">{itemName}</h2>
              <button
                className="w-8 h-8 p-2 flex items-center justify-center rounded-1px transition-all" 
                style={{ width: 32, height: 32, padding: 8, background: '#FFFFFF4d' }}
                onClick={closeModal}
                aria-label="Close modal"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4L12 12M12 4L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Main content area */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Main image area */}
              <div className="relative flex-1">
                <img
                  src={images[currentImageIndex]}
                  alt={`${itemName} - Image ${currentImageIndex + 1}`}
                  className="w-full h-[300px] md:h-[450px] lg:h-[500px] object-cover rounded-lg"
                />
                
                {/* Image counter */}
                <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1}/{images.length}
                </div>
                
                {/* Navigation arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      className="absolute top-1/2 right-4 transform -translate-y-1/2 flex items-center justify-center rounded-full transition-all"
                      style={{ width: 32, height: 32, padding: 8, background: '#FFFFFF', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
                      onClick={nextImage}
                      aria-label="Next image"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 4L10 8L6 12" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button
                      className="absolute top-1/2 left-4 transform -translate-y-1/2 flex items-center justify-center rounded-full transition-all"
                      style={{ width: 32, height: 32, padding: 8, background: '#FFFFFF', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
                      onClick={prevImage}
                      aria-label="Previous image"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 4L6 8L10 12" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {/* Vertical separator line - only on desktop */}
              <div className="hidden lg:block w-px bg-gray-500 my-2"></div>

              {/* Thumbnail grid - 16:10 ratio with responsive sizing */}
              <div className="w-full lg:w-72 xl:w-80 mt-4 lg:mt-0">
                <div className="grid grid-cols-4 md:grid-cols-3 lg:grid-cols-2 gap-3 max-h-[200px] md:max-h-[300px] lg:max-h-[500px] overflow-y-auto pr-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-[16/10]">
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className={`w-full h-full object-cover cursor-pointer rounded transition-all ${
                          currentImageIndex === index 
                            ? "border-2 border-white" 
                            : "opacity-70 hover:opacity-100"
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TestimonialsViewer;
