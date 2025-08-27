// components/checkout/CheckoutNav.tsx
import React, { useEffect, useState } from 'react';

const CheckoutNav: React.FC = () => {
  const [active, setActive] = useState(false);
  const [activeFaq, setActiveFaq] = useState<string>('faq-1');  // Track active FAQ

  useEffect(() => {
    const checkoutSection = document.getElementById('checkout-section');
    if (!checkoutSection) return;

    const handleScroll = () => {
      const faqElements = document.querySelectorAll('.faq-item');
      let activeFaqId = 'faq-1'; // Default first FAQ

      // Loop through all FAQ items and find the active one based on scroll position
      faqElements.forEach((faq: any) => {
        const rect = faq.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
          activeFaqId = faq.id;  // Set the active FAQ based on scroll
        }
      });

      setActiveFaq(activeFaqId);
      const sectionRect = checkoutSection.getBoundingClientRect();
      setActive(sectionRect.top <= 0 && sectionRect.bottom > 0);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();  // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${active ? 'bg-white shadow-md' : 'bg-transparent pointer-events-none'} h-14 flex items-center justify-center`}
      style={{ opacity: active ? 1 : 0 }}
    >
      <div className="font-halyard-text font-semibold text-lg text-gray-900">
        {/* Active Nav Item */}
        <div className="flex gap-6">
          {['faq-1', 'faq-2', 'faq-3', 'faq-4', 'faq-5'].map((faqId) => (
            <div
              key={faqId}
              className={`cursor-pointer ${activeFaq === faqId ? 'text-purple-600' : 'text-gray-500'}`}
            >
              FAQ {faqId.split('-')[1]}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default CheckoutNav;
