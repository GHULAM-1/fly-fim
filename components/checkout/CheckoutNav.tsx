"use client";
import React, { useEffect, useRef, useState } from "react";

const CheckoutNav: React.FC = () => {
  const [active, setActive] = useState(false);
  const [activeFaq, setActiveFaq] = useState<string>("highlights");
  const [barPosition, setBarPosition] = useState({ left: 0, width: 0 });
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const userScrollTimeout = useRef<NodeJS.Timeout | null>(null);

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

  // Initialize desktop check
  useEffect(() => {
    const checkDesktop = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);
      if (!desktop) {
        setActive(false);
      }
    };
    
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Handle scroll events - only on desktop
  useEffect(() => {
    console.log("isDesktop", isDesktop);
    if (!isDesktop) return;

    const headerHeight = 76;
    const navHeight = 56;
    const totalFixedHeight = headerHeight + navHeight;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      setIsUserScrolling(true);
      
      if (userScrollTimeout.current) {
        clearTimeout(userScrollTimeout.current);
      }
      
      userScrollTimeout.current = setTimeout(() => {
        setIsUserScrolling(false);
      }, 150);

      clearTimeout(scrollTimeout);
      
      scrollTimeout = setTimeout(() => {
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

        if (isCheckoutVisible && !isPastCheckout && !isUserScrolling) {
          const faqElements = document.querySelectorAll(".faq-item");
          let activeFaqId = "highlights";
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
      }, 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(scrollTimeout);
      if (userScrollTimeout.current) {
        clearTimeout(userScrollTimeout.current);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isDesktop]);

  // Update active bar position
  useEffect(() => {
    if (!isDesktop) return;
    
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
  }, [activeFaq, isDesktop]);

  const scrollToFaq = (faqId: string) => {
    if (!isDesktop) return;
    
    const element = document.getElementById(faqId);
    if (element) {
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const headerHeight = 76;
      const navHeight = 56;
      const buffer = 20;
      const totalOffset = headerHeight + navHeight + buffer;
      const targetPosition = rect.top + scrollTop - totalOffset;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  };

  // Only render on desktop
  if (!isDesktop) {
    return null;
  }

  return (
    <nav
      className={`fixed left-0 w-full z-40 transition-all duration-300 ${
        active
          ? "bg-white shadow-md transform translate-y-0"
          : "bg-transparent pointer-events-none transform -translate-y-full"
      }`}
      style={{ top: "76px" }}
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
