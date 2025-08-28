"use client";
import React, { useEffect, useRef, useState } from "react";

const CheckoutNav: React.FC = () => {
  const [active, setActive] = useState(false);
  const [activeFaq, setActiveFaq] = useState<string>("highlights");
  const [barPosition, setBarPosition] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLDivElement>(null);

  // Define all FAQ sections in order
  const faqSections = [
    { id: "highlights", label: "Highlights" },
    { id: "inclusions", label: "Inclusions" },
    { id: "exclusions", label: "Exclusions" },
    { id: "cancellation-policy", label: "Cancellation Policy" },
    { id: "your-experience", label: "Your Experience" },
    { id: "operating-hours", label: "Operating Hours" },
    { id: "know-before-you-go", label: "Know Before You Go" },
    { id: "my-tickets", label: "My Tickets" },
    { id: "where", label: "Where" },
  ];

  useEffect(() => {
    // Assume the main header height is 72px (adjust this value based on your actual header height)
    const headerHeight = 72;
    const navHeight = 56;
    const totalFixedHeight = headerHeight + navHeight;

    const handleScroll = () => {
      const checkoutSection = document.getElementById("checkout-section");
      if (!checkoutSection) return;

      const sectionRect = checkoutSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Check if checkout section is in view (when features section becomes visible)
      const isCheckoutVisible = sectionRect.top <= totalFixedHeight && sectionRect.bottom > 0;

      // Check if we've scrolled past the checkout section
      const isPastCheckout = sectionRect.top > windowHeight;

      setActive(isCheckoutVisible && !isPastCheckout);

      if (isCheckoutVisible && !isPastCheckout) {
        // Find which FAQ section is currently most visible
        const faqElements = document.querySelectorAll(".faq-item");
        let activeFaqId = "highlights"; // Default to first FAQ
        let maxVisibility = 0;

        faqElements.forEach((faq: any) => {
          const rect = faq.getBoundingClientRect();
          const elementHeight = rect.height;
          const visibleTop = Math.max(rect.top, totalFixedHeight);
          const visibleHeight = Math.min(rect.bottom, windowHeight) - visibleTop;

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
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateBar = () => {
      if (navRef.current) {
        const activeButton = navRef.current.querySelector(`button[data-id="${activeFaq}"]`);
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

  const scrollToFaq = (faqId: string) => {
    const element = document.getElementById(faqId);
    if (element) {
      // Get the position of the element relative to the document
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
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
      className={`fixed left-0 w-full z-40 transition-all duration-300 ${
        active
          ? "bg-white shadow-md transform translate-y-0"
          : "bg-transparent pointer-events-none transform -translate-y-full"
      }`}
       // Adjust this value to match your main header height
       style={{
        top: typeof window !== "undefined" && window.innerWidth <= 640 ? "64px" : "72px",
       }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-center h-14 relative">
          <div ref={navRef} className="flex gap-4 overflow-x-auto scrollbar-hide">
            {faqSections.map((section) => (
              <button
                key={section.id}
                data-id={section.id}
                onClick={() => scrollToFaq(section.id)}
                className={`relative flex items-center justify-center whitespace-nowrap px-3 py-2 text-sm font-halyard-text font-medium transition-colors duration-200 h-full ${
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