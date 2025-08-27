// components/checkout/FaqSection.tsx
import React, { useState } from 'react';

interface FaqItemProps {
  title: string;
  description: string;
  isOpenByDefault?: boolean;
  children?: React.ReactNode;
  id: string;  // Add unique id for each FAQ
}

const FaqItem: React.FC<FaqItemProps> = ({ title, description, isOpenByDefault = false, children, id }) => {
  const [isOpen, setIsOpen] = useState(isOpenByDefault);

  return (
    <div className="faq-item mb-4" id={id}>
      <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <h3 className="font-semibold text-lg">{title}</h3>
        <span>{isOpen ? '▲' : '▼'}</span>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
      {isOpen && <div className="faq-content mt-2">{children}</div>}
    </div>
  );
};

const FaqSection: React.FC = () => {
  return (
    <div className="faq-section">
      <FaqItem title="What is included in the tour?" description="Details of the inclusions..." id="faq-1">
        <p>Additional content like maps can be inserted here.</p>
      </FaqItem>
      <FaqItem title="Where is the meeting point?" description="The location of the meeting point..." id="faq-2">
        <p>Details with map...</p>
      </FaqItem>
      <FaqItem title="What is the cancellation policy?" description="Information on cancellations..." id="faq-3">
        <p>Details on how to cancel...</p>
      </FaqItem>
      <FaqItem title="What should I bring?" description="Items to bring along..." id="faq-4">
        <p>Details on what to bring...</p>
      </FaqItem>
      <FaqItem title="Is transportation included?" description="Information about transportation..." id="faq-5">
        <p>Details on transport inclusion...</p>
      </FaqItem>
    </div>
  );
};

export default FaqSection;
