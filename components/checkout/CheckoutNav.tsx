"use client";
import React, { useEffect, useRef, useState } from "react";

const CheckoutNav: React.FC = () => {
  const [active, setActive] = useState(false);
  const [activeFaq, setActiveFaq] = useState<string>("highlights");
  const [barPosition, setBarPosition] = useState({ left: 0, width: 0 });
  const [navTop, setNavTop] = useState("72px");
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const userScrollTimeout = useRef<NodeJS.Timeout>();

  // Define all FAQ sections in order
  const faqSections = [
    { id: "highlights", label: "Highlights" },
    { id: "inclusions", label: "Inclusions" },
    { id: "itinerary", label: "Itinerary" },
    { id: "exclusions", label: "Exclusions" },
    { id: "cancellation-policy", label: "Cancellation Policy" },
    { id: "your-experience", label: "Your Experience" },
    { id: "operating-hours", label: "Operating Hours" },
    { id: "reviews", label: "Reviews" },
    { id: "know-before-you-go", label: "Know Before You Go" },
    { id: "my-tickets", label: "My Tickets" },
    { id: "where", label: "Where?" },
  ];

  useEffect(() => {
    // Only run on desktop (md and up) - completely disable on mobile
    const isDesktop = window.innerWidth >= 768;
    if (!isDesktop) {
      setActive(false);
      return;
    }

    // Assume the main header height is 72px (adjust this value based on your actual header height)
    const headerHeight = 72;
    const navHeight = 56;
    const totalFixedHeight = headerHeight + navHeight;
    
    // Debounce scroll handler to prevent excessive calls
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      // Track that user is actively scrolling
      setIsUserScrolling(true);
      clearTimeout(userScrollTimeout.current);
      
      // Reset user scrolling flag after they stop
      userScrollTimeout.current = setTimeout(() => {
        setIsUserScrolling(false);
      }, 150);

      // Clear previous timeout
      clearTimeout(scrollTimeout);
      
      // Debounce the scroll handling to avoid interference with natural scrolling
      scrollTimeout = setTimeout(() => {
        // Skip tracking if user is actively scrolling
        if (isUserScrolling) return;
        
        const checkoutSection = document.getElementById("checkout-section");
        if (!checkoutSection) return;

        const sectionRect = checkoutSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Check if checkout section is in view (when features section becomes visible)
        const isCheckoutVisible =
          sectionRect.top <= totalFixedHeight && sectionRect.bottom > 0;

        // Check if we've scrolled past the checkout section
        const isPastCheckout = sectionRect.top > windowHeight;

        setActive(isCheckoutVisible && !isPastCheckout);

        if (isCheckoutVisible && !isPastCheckout) {
          // Find which FAQ section is currently most visible (with debouncing)
          const faqElements = document.querySelectorAll(".faq-item");
          let activeFaqId = "highlights"; // Default to first FAQ
          let maxVisibility = 0;

          faqElements.forEach((faq: any) => {
            const rect = faq.getBoundingClientRect();
            const elementHeight = rect.height;
            const visibleTop = Math.max(rect.top, totalFixedHeight);
            const visibleHeight =
              Math.min(rect.bottom, windowHeight) - visibleTop;

            if (visibleHeight > 0) {
              const visibility = visibleHeight / elementHeight;
              if (visibility > maxVisibility) {
                maxVisibility = visibility;
                activeFaqId = faq.id;
              }
            }
          });

          setActiveFaq(activeFaqId);
        }
      }, 200); // Increased debounce delay to 200ms for smoother experience
    };

    // Only add event listeners on desktop with passive scrolling
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Handle resize to disable on mobile
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setActive(false);
        clearTimeout(scrollTimeout);
        // Remove event listeners on mobile
        window.removeEventListener("scroll", handleScroll);
      } else {
        // Add event listeners back on desktop
        window.addEventListener("scroll", handleScroll, { passive: true });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(scrollTimeout);
      clearTimeout(userScrollTimeout.current);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const updateBar = () => {
      if (navRef.current) {
        const activeButton = navRef.current.querySelector(
          `button[data-id="${activeFaq}"]`
        );
        if (activeButton) {
          const left = (activeButton as HTMLElement).offsetLeft;
          const width = (activeButton as HTMLElement).offsetWidth;
          setBarPosition({ left, width });
        }
      }
    };

    updateBar();
    window.addEventListener("resize", updateBar);
    return () => window.removeEventListener("resize", updateBar);
  }, [activeFaq]);

  useEffect(() => {
    const updateNavTop = () => {
      if (window.innerWidth <= 640) {
        setNavTop("64px");
      } else {
        setNavTop("72px");
      }
    };
    updateNavTop();
    window.addEventListener("resize", updateNavTop);
    return () => window.removeEventListener("resize", updateNavTop);
  }, []);

  const scrollToFaq = (faqId: string) => {
    const element = document.getElementById(faqId);
    if (element) {
      // Get the position of the element relative to the document
      const rect = element.getBoundingClientRect();
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const headerHeight = 72; // Main header height
      const navHeight = 56; // Height of the fixed nav (h-14 in Tailwind = 56px)
      const buffer = 20; // Additional buffer for spacing

      // Calculate the target scroll position
      const totalOffset = headerHeight + navHeight + buffer;
      const targetPosition = rect.top + scrollTop - totalOffset;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav
      className={`fixed left-0 w-full md:block hidden z-40 transition-all duration-300 ${
        active
          ? "bg-white shadow-md transform translate-y-0"
          : "bg-transparent pointer-events-none transform -translate-y-full"
      }`}
      // Adjust this value to match your main header height
      style={{ top: navTop }}
    >
      <div className="max-w-[1200px]  mx-auto xl:px-0 px-[24px]">
        <div className="flex items-center  justify-start h-12 relative">
          <div
            ref={navRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide"
          >
            {faqSections.map((section) => (
              <button
                key={section.id}
                data-id={section.id}
                onClick={() => scrollToFaq(section.id)}
                className={`relative hover:cursor-pointer flex items-center justify-center whitespace-nowrap py-2 text-sm font-halyard-text font-medium transition-colors duration-200 h-full ${
                  activeFaq === section.id
                    ? "text-gray-900" // Active text color
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
          {/* Active Bar under the active FAQ */}
          <div
            className="absolute bottom-0 h-0.5 bg-gray-900 transition-all duration-300"
            style={{
              left: `${barPosition.left}px`,
              width: `${barPosition.width}px`,
            }}
          />
        </div>
      </div>
    </nav>
  );
};

export default CheckoutNav;
