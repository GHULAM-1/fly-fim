"use client";
import React, { useEffect, useState } from 'react';

const CheckoutNav: React.FC = () => {
  const [active, setActive] = useState(false);
  const [activeFaq, setActiveFaq] = useState<string>('highlights');

  // Define all FAQ sections in order
  const faqSections = [
    { id: 'highlights', label: 'Highlights' },
    { id: 'inclusions', label: 'Inclusions' },
    { id: 'exclusions', label: 'Exclusions' },
    { id: 'cancellation-policy', label: 'Cancellation Policy' },
    { id: 'your-experience', label: 'Your Experience' },
    { id: 'operating-hours', label: 'Operating Hours' },
    { id: 'know-before-you-go', label: 'Know Before You Go' },
    { id: 'my-tickets', label: 'My Tickets' },
    { id: 'where', label: 'Where' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const checkoutSection = document.getElementById('checkout-section');
      if (!checkoutSection) return;

      const sectionRect = checkoutSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Check if checkout section is in view (when features section becomes visible)
      const isCheckoutVisible = sectionRect.top <= 100 && sectionRect.bottom > 0;
      
      // Check if we've scrolled past the checkout section
      const isPastCheckout = sectionRect.top > windowHeight;
      
      setActive(isCheckoutVisible && !isPastCheckout);

      if (isCheckoutVisible && !isPastCheckout) {
        // Find which FAQ section is currently most visible
        const faqElements = document.querySelectorAll('.faq-item');
        let activeFaqId = 'highlights'; // Default to first FAQ
        let maxVisibility = 0;

        faqElements.forEach((faq: any) => {
          const rect = faq.getBoundingClientRect();
          const elementHeight = rect.height;
          const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
          
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

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToFaq = (faqId: string) => {
    const element = document.getElementById(faqId);
    if (element) {
      const checkoutSection = document.getElementById('checkout-section');
      const offset = checkoutSection ? checkoutSection.offsetTop + 100 : 100;
      
      window.scrollTo({
        top: element.offsetTop + offset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        active 
          ? 'bg-white shadow-md transform translate-y-0' 
          : 'bg-transparent pointer-events-none transform -translate-y-full'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-center h-14">
          <div className="flex gap-6 overflow-x-auto scrollbar-hide">
            {faqSections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToFaq(section.id)}
                className={`whitespace-nowrap px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  activeFaq === section.id
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default CheckoutNav;
