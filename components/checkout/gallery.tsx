import React, { useState, useEffect, useRef } from "react";
import { 
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerTrigger,
    DrawerOverlay,
    DrawerPortal,  
} from "@/components/ui/drawer";

interface ImageGalleryProps {
  images: string[];
  itemName: string;
  city: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, itemName, city }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    
    if (isMobile) {
      setIsDrawerOpen(true);
    } else {
      setIsModalOpen(true);
      // Start animation after a small delay to allow DOM to update
      setTimeout(() => setIsAnimating(true), 10);
    }
  };

  const closeModal = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsModalOpen(false);
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

    if (isModalOpen && !isMobile) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, isMobile]);

  // Handle escape key (desktop only)
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    if (isModalOpen && !isMobile) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isModalOpen, isMobile]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      {/* Mobile Grid Layout */}
      <div className="md:hidden hidden">
        <div className="grid grid-cols-2 gap-1 mb-6">
          {images.slice(0, 4).map((image, index) => (
            <div 
              key={index} 
              className={`relative cursor-pointer ${
                index === 0 ? 'col-span-2 h-48' : 'h-24'
              } ${index === 1 ? 'rounded-tl-lg' : ''} ${
                index === 2 ? 'rounded-tr-lg' : ''
              }`}
              onClick={() => handleImageClick(index)}
            >
              <img
                src={image}
                alt={`${itemName} image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {index === 2 && images.length > 4 && (
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-lg font-medium">+{images.length - 4}</div>
                    <div className="text-sm">more photos</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Grid Layout - Main image on left, thumbnails on right */}
      <div className="hidden md:flex gap-2 mb-6 relative">
        {/* Main large image */}
        <div 
          className="flex-1 relative group cursor-pointer transition-all duration-300 w-1/2"
          onClick={() => handleImageClick(0)}
        >
          <div className="w-full" style={{ maxWidth: '592px', height: '370px' }}>
            <img
              src={images[0]}
              alt={`${itemName} main image`}
              className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-95 rounded-tl-2xl rounded-bl-2xl"
              style={{ width: '600px', height: '375px' }}
            />
          </div>
        </div>

        {/* Thumbnail grid on right */}
        <div className="w-1/2">
          <div className="grid grid-cols-2 gap-2" style={{ height: '375px' }}>
            {images.slice(1, 5).map((image, index) => (
              <div 
                key={index + 1} 
                className={`relative group cursor-pointer overflow-hidden ${index === 1 ? 'rounded-tr-2xl' : ''} ${index === 3 ? 'rounded-br-2xl' : ''}`}
                style={{ aspectRatio: '292/183.5', height: '183.5px' }}
                onClick={() => handleImageClick(index + 1)}
              >
                <img
                  src={image}
                  alt={`${itemName} image ${index + 2}`}
                  className="w-full h-full object-cover transition-all duration-300"
                  style={{ aspectRatio: '292/183.5' }}
                />
                {/* Black overlay on hover */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-30 bg-black transition-opacity duration-300 rounded-lg" />
                {index === 1 && (
                  <div className="absolute top-2 right-2 bg-white bg-opacity-90 font-halyard-text text-[#444444] text-gray-700 text-sm font-medium flex items-center gap-1" style={{ borderRadius: '8px', padding: '6px 12px' }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    View all images
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent 
          className="h-[75vh] rounded-t-2xl shadow-xl" 
          bgClass="bg-black" 
          showTopLine={false}
        >
          <DrawerHeader className="border-b border-gray-800 pb-4 pt-5 px-4">
            <div className="flex justify-betwen items-center">
              <DrawerTitle className="text-lg font-bold text-white text-center flex-1">
                Photo gallery
              </DrawerTitle>
              <DrawerClose className="p-2 bg-white bg-opacity-10 rounded-lg w-8 h-8 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4L12 12M12 4L4 12" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </DrawerClose>
            </div>
          </DrawerHeader>
          
          <div className="flex-1 overflow-hidden bg-black">
            {/* Main image area */}
            <div className="relative h-3/5 bg-black flex items-center justify-center">
              <img
                src={images[currentImageIndex]}
                alt={`${itemName} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-contain"
                style={{ borderRadius: 0 }}
              />
              
              {/* Image counter */}
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-80 text-white px-3 py-1 rounded-full text-xs">
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
            <div className="h-2/5 p-4 bg-black">
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
      {isModalOpen && !isMobile && (
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

export default ImageGallery;