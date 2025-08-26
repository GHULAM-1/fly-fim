import React, { useState, useEffect, useRef } from "react";

interface ImageGalleryProps {
  images: string[];
  itemName: string;
  city: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, itemName, city }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
    // Start animation after a small delay to allow DOM to update
    setTimeout(() => setIsAnimating(true), 10);
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

  // Handle click outside modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isModalOpen]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      {/* Initial Grid Layout - Main image on left, thumbnails on right */}
      <div className="flex gap-2 mb-6 relative">
        {/* Main large image */}
        <div 
          className={`flex-1 relative group cursor-pointer transition-all duration-300 ${isModalOpen ? 'w-1/2' : 'w-1/2'}`}
          onClick={() => handleImageClick(0)}
        >
          <img
            src={images[0]}
            alt={`${itemName} main image`}
            className="w-full h-[400px] object-cover rounded-lg transition-all duration-300 group-hover:brightness-95"
          />
          {/* View all images button */}
          <div className="absolute top-4 right-4 bg-white bg-opacity-90 text-gray-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            View all images
          </div>
        </div>

        {/* Thumbnail grid on right */}
        <div className="w-1/2">
          <div className="grid grid-cols-2 gap-2 h-[400px]">
            {images.slice(1, 5).map((image, index) => (
              <div 
                key={index + 1} 
                className="relative group cursor-pointer overflow-hidden rounded-lg"
                onClick={() => handleImageClick(index + 1)}
              >
                <img
                  src={image}
                  alt={`${itemName} image ${index + 2}`}
                  className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-95 group-hover:scale-105"
                />
                {/* Show +X more on last thumbnail if there are more images */}
                {index === 3 && images.length > 5 && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-white font-medium text-lg">
                    +{images.length - 5} more
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div 
          className={`fixed inset-0 z-50 flex justify-center items-end md:items-center transition-all duration-300 ${
            isAnimating 
              ? 'bg-black bg-opacity-70' 
              : 'bg-black bg-opacity-0'
          }`}
          onClick={closeModal}
        >
          <div 
            ref={modalRef}
            className={`relative bg-transparent w-full max-w-6xl mx-4 transition-all duration-300 ease-out ${
              isAnimating 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-full opacity-0 md:translate-y-4 md:scale-95'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with title and close button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-xl font-medium">{itemName}</h2>
              <button
                className="bg-gray-800 bg-opacity-70 text-white w-8 h-8 flex items-center justify-center hover:bg-opacity-100 transition-all rounded-full"
                onClick={closeModal}
                aria-label="Close modal"
              >
                <span className="text-lg">×</span>
              </button>
            </div>

            {/* Main content area */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Main image area - made slightly larger */}
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
                      className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-white hover:bg-opacity-20 transition-all"
                      onClick={nextImage}
                      aria-label="Next image"
                    >
                      <span className="text-2xl">›</span>
                    </button>
                    
                    <button
                      className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-white hover:bg-opacity-20 transition-all"
                      onClick={prevImage}
                      aria-label="Previous image"
                    >
                      <span className="text-2xl">‹</span>
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