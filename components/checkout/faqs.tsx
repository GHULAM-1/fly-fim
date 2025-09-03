"use client";
import React, { useState, useRef, useEffect } from "react";
import { Check, X } from "lucide-react";
import OperatingHoursCard from "./operating-hours";
import { Circle } from "lucide-react";

function Bullet() {
  return (
    <Circle
      className="h-2 w-2 text-black"
      fill="currentColor"
      stroke="none"
      aria-hidden="true"
    />
  );
}

interface Experience {
  highlights: string;
  inclusions: string;
  exclusions: string;
  cancellationPolicy: string;
  knowBeforeYouGo: string;
  myTickets: string;
  operatingHours: any[];
  whereTo: { address: string; lat: number; lng: number };
}

interface Faq {
  _id: string;
  question: string;
  answer: string;
}

interface FaqSectionProps {
  experience: Experience;
  faqs: Faq[];
}

interface FaqItemProps {
  title: string;
  isOpenByDefault?: boolean;
  children?: React.ReactNode;
  id: string;
}

const FaqItem: React.FC<FaqItemProps> = ({
  title,
  isOpenByDefault = false,
  children,
  id,
}) => {
  const [isOpen, setIsOpen] = useState(isOpenByDefault);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.maxHeight = isOpen
        ? `${contentRef.current.scrollHeight}px`
        : "0px";
    }
  }, [isOpen]);

  return (
    <div className="faq-item mb-12 border-b border-gray-200 pb-6" id={id}>
      <div
        className="flex justify-between items-center cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3
          className="font-semibold font-halyard-text text-gray-700"
          style={{ fontSize: "21px" }}
        >
          {title}
        </h3>
        <span
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="text-gray-500"
          >
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
      <div
        ref={contentRef}
        className="faq-content mt-4 text-[#444444] overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: isOpenByDefault ? "1000px" : "0px",
          fontFamily: "halyard-text",
          fontSize: "1.0625rem",
          fontWeight: 300,
          lineHeight: "1.75rem",
        }}
      >
        {children}
      </div>
    </div>
  );
};

const FaqSection: React.FC<FaqSectionProps> = ({ experience, faqs }) => {
  const defaultOpenFaqs = [
    "highlights",
    "inclusions",
    "exclusions",
    "cancellation-policy",
  ];

  const renderList = (content: string, icon: React.ReactNode) => (
    <ul className="space-y-3 font-halyard-text">
      {content.split(",").map((item, index) => (
        <li key={index} className="flex items-start gap-3">
          {icon}
          <span className="leading-relaxed">{item.trim()}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="faq-section max-w-4xl font-halyard-text">
      <FaqItem
        title="Highlights"
        isOpenByDefault={defaultOpenFaqs.includes("highlights")}
        id="highlights"
      >
        {renderList(
          experience.highlights,
          <div className="pt-2">
            <Bullet />
          </div>
        )}
      </FaqItem>

      <FaqItem
        title="Inclusions"
        id="inclusions"
        isOpenByDefault={defaultOpenFaqs.includes("inclusions")}
      >
        {renderList(
          experience.inclusions,
          <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
        )}
      </FaqItem>

      <FaqItem
        title="Exclusions"
        id="exclusions"
        isOpenByDefault={defaultOpenFaqs.includes("exclusions")}
      >
        {renderList(
          experience.exclusions,
          <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
        )}
      </FaqItem>

      <FaqItem
        title="Cancellation Policy"
        id="cancellation-policy"
        isOpenByDefault={defaultOpenFaqs.includes("cancellation-policy")}
      >
        <p className="mb-3 font-halyard-text">
          {experience.cancellationPolicy}
        </p>
      </FaqItem>

      <FaqItem title="Know Before You Go" id="know-before-you-go">
        <p className="font-halyard-text">{experience.knowBeforeYouGo}</p>
      </FaqItem>

      <FaqItem title="My Tickets" id="my-tickets">
        <p className="font-halyard-text">{experience.myTickets}</p>
      </FaqItem>

      {faqs && faqs.length > 0 && (
        <FaqItem title="Frequently Asked Questions" id="faqs">
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq._id}>
                <h4 className="font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h4>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </FaqItem>
      )}

      {experience.operatingHours && experience.operatingHours.length > 0 && (
        <FaqItem title="Operating Hours" id="operating-hours">
          <OperatingHoursCard
            title="Operating Hours"
            operatingHours={experience.operatingHours}
          />
        </FaqItem>
      )}

      <FaqItem title="Where" id="where">
        <div className="space-y-4 font-halyard-text">
          <p className="text-[#444444] mb-3">{experience.whereTo.address}</p>
          <div className="mt-4">
            <div className="rounded-lg p-4">
              <iframe
                src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodeURIComponent(experience.whereTo.address)}`}
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg"
              ></iframe>
            </div>
          </div>
        </div>
      </FaqItem>
    </div>
  );
};

export default FaqSection;
