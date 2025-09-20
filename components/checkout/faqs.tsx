"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  MapPin,
  Clock,
  Info,
  Ticket,
  Users,
  Shield,
  FileText,
  Navigation,
  Check,
  X,
  Map,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import OperatingHoursCard from "./operating-hours";
import ItinerarySection from "./ItinerarySection";
import { Circle } from "lucide-react";
import ReviewsSection from "./reviews-section";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ExperienceResponse } from "@/types/experience/experience-types";
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

interface FaqItemProps {
  title: string;
  description?: string;
  isOpenByDefault?: boolean;
  children?: React.ReactNode;
  id: string;
  icon?: React.ComponentType<any>;
  onAnimationStateChange?: (isAnimating: boolean) => void;
}

const FaqItem: React.FC<FaqItemProps> = ({
  title,
  description,
  isOpenByDefault = false,
  children,
  id,
  icon: Icon,
  onAnimationStateChange,
}) => {
  const [isOpen, setIsOpen] = useState(isOpenByDefault);
  const [isAnimating, setIsAnimating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setIsAnimating(true);
      onAnimationStateChange?.(true);
      
      // Use requestAnimationFrame to ensure smooth animation without scroll interference
      requestAnimationFrame(() => {
        if (contentRef.current) {
          if (isOpen) {
            // For opening, set a very large maxHeight to allow content to expand naturally
            contentRef.current.style.maxHeight = "2000px";
            // After animation completes, remove the height restriction
            setTimeout(() => {
              if (contentRef.current) {
                contentRef.current.style.maxHeight = "none";
              }
            }, 300);
          } else {
            contentRef.current.style.maxHeight = "0px";
          }
        }
      });
      
      // Reset animation state after transition completes
      const timer = setTimeout(() => {
        setIsAnimating(false);
        onAnimationStateChange?.(false);
      }, 300); // Match the transition duration
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, onAnimationStateChange]);

  return (
    <div className="faq-item mb-12 border-b border-gray-200 pb-6" id={id}>
      <div
        className="flex justify-between items-center cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <h3
            className="font-semibold font-halyard-text text-[#444444]"
            style={{ fontSize: "21px" }}
          >
            {title}
          </h3>
        </div>
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
      {description && (
        <p
          className="font-halyard-text text-[15px] md:text-[17px] text-[#444444] mt-2"
          style={{
            fontWeight: 300,
            lineHeight: "1.75rem",
            marginBottom: 0,
            listStyle: "none",
            boxSizing: "border-box",
            border: "0 solid",
            textDecoration: "none",
          }}
        >
          {description}
        </p>
      )}
      <div
        ref={contentRef}
        className="faq-content mt-4 text-[#444444] overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: 0,
          fontFamily: "halyard-text",
          fontSize: "1.0625rem",
          fontWeight: 300,
          lineHeight: "1.75rem",
          marginBottom: 0,
          listStyle: "none",
          boxSizing: "border-box",
          border: "0 solid",
          textDecoration: "none",
        }}
      >
        {children}
      </div>
    </div>
  );
};

interface FaqSectionProps {
  experience?: ExperienceResponse | null;
}

// Reusable HTML content component with proper styling for WYSIWYG content
const HtmlContent: React.FC<{ html: string }> = ({ html }) => (
  <div
    className="font-halyard-text text-[15px] md:text-[17px] leading-relaxed text-[#444444] [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>li]:mb-2 [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:mb-3 [&>h3]:text-gray-900 [&>p]:mb-4 [&>strong]:font-semibold [&>em]:italic"
    dangerouslySetInnerHTML={{ __html: html }}
  />
);

// Special HTML content component for inclusions with tick icons instead of bullets
const InclusionsContent: React.FC<{ html: string }> = ({ html }) => {
  // Parse the HTML to extract list items
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const listItems = Array.from(doc.querySelectorAll('li')).map(li => li.textContent || '');

  return (
    <div className="font-halyard-text text-[15px] md:text-[17px] leading-relaxed text-[#444444]">
      {listItems.map((item, index) => (
        <div key={index} className="flex items-start gap-3 mb-2">
          <div className="w-5 h-5 rounded-full flex items-center justify-center mt-0.5">
            <Check className="w-5 h-5 text-green-600" />
          </div>
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
};

// Special HTML content component for exclusions with cross icons instead of bullets
const ExclusionsContent: React.FC<{ html: string }> = ({ html }) => {
  // Parse the HTML to extract list items
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const listItems = Array.from(doc.querySelectorAll('li')).map(li => li.textContent || '');

  return (
    <div className="font-halyard-text text-[15px] md:text-[17px] leading-relaxed text-[#444444]">
      {listItems.map((item, index) => (
        <div key={index} className="flex items-start gap-3 mb-2">
          <div className="w-5 h-5 rounded-full flex items-center justify-center mt-0.5">
            <X className="w-5 h-5 text-red-600" />
          </div>
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
};

const FaqSection: React.FC<FaqSectionProps> = ({ experience }) => {
  // Set first four FAQ sections open by default, rest closed
  const defaultOpenFaqs = [""];
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Get FAQ sections from API data
  const faqData = experience?.data?.faqSections;

  // Mobile map states
  const [showMobileMapDrawer, setShowMobileMapDrawer] = useState(false);
  const mobileMapRef = useRef<L.Map | null>(null);
  const mobileMapContainerRef = useRef<HTMLDivElement>(null);

  // Track if any FAQ is currently animating to prevent scroll interference
  const [isAnyFaqAnimating, setIsAnyFaqAnimating] = useState(false);

  // Initialize mobile map drawer
  const initializeMobileMap = () => {
    if (!mobileMapContainerRef.current) return;

    // Clean up existing map
    if (mobileMapRef.current) {
      mobileMapRef.current.remove();
      mobileMapRef.current = null;
    }

    // Get coordinates from API or use fallback
    const coordinates: [number, number] = experience?.data?.whereTo
      ? [experience.data.whereTo.lat, experience.data.whereTo.lng]
      : [37.3857231, -5.9922638]; // Fallback coordinates

    const address = experience?.data?.whereTo?.address || "Meeting Point";

    // Fix default markers in Leaflet
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });

    const map = L.map(mobileMapContainerRef.current, {
      center: coordinates,
      zoom: 16,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // Add marker for meeting point
    const marker = L.marker(coordinates).addTo(map);
    marker.bindPopup(`
      <div class="p-2">
        <h3 class="font-semibold text-sm">Meeting Point</h3>
        <p class="text-xs text-gray-600">${address}</p>
      </div>
    `);

    mobileMapRef.current = map;

    // Force map to invalidate size after initialization
    setTimeout(() => {
      if (mobileMapRef.current) {
        mobileMapRef.current.invalidateSize();
      }
    }, 200);
  };

  // Initialize mobile map when drawer opens
  useEffect(() => {
    if (showMobileMapDrawer && mobileMapContainerRef.current) {
      setTimeout(() => {
        initializeMobileMap();
      }, 100);
    }
  }, [showMobileMapDrawer, experience]); // Add experience as dependency

  // Initialize OpenStreetMap
  useEffect(() => {
    const initializeMap = () => {
      if (!mapContainerRef.current || mapRef.current) return;

      // Fix default markers in Leaflet
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });

      // Get coordinates from API or use fallback
      const coordinates: [number, number] = experience?.data?.whereTo
        ? [experience.data.whereTo.lat, experience.data.whereTo.lng]
        : [37.3857231, -5.9922638]; // Fallback coordinates

      const address = experience?.data?.whereTo?.address || "Meeting Point";

      // Create map with lazy initialization to prevent layout shifts
      const map = L.map(mapContainerRef.current, {
        center: coordinates,
        zoom: 15,
        zoomControl: true,
        attributionControl: true,
        preferCanvas: true, // Use canvas renderer for better performance
      });

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 18,
      }).addTo(map);

      // Add marker for meeting point
      const marker = L.marker(coordinates).addTo(map);
      marker.bindPopup(`
        <div class="p-2">
          <h3 class="font-semibold text-sm">Meeting Point</h3>
          <p class="text-xs text-gray-600">${address}</p>
        </div>
      `);

      mapRef.current = map;

      // Force map to invalidate size after initialization to prevent display issues
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
      }, 200);
    };

    // Only initialize if the Where section is visible to prevent layout shifts on page load
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            mapContainerRef.current &&
            !mapRef.current
          ) {
            // Delay initialization slightly to prevent scroll jumping
            setTimeout(initializeMap, 50);
            observer.disconnect(); // Only initialize once
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "50px 0px", // Start loading when element is close to viewport
      }
    );

    if (mapContainerRef.current) {
      observer.observe(mapContainerRef.current);
    }

    return () => {
      observer.disconnect();
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (mobileMapRef.current) {
        mobileMapRef.current.remove();
        mobileMapRef.current = null;
      }
    };
  }, [experience]); // Add experience as dependency to reinitialize when data loads

  return (
    <div className="faq-section max-w-4xl font-halyard-text">
      {/* Highlights */}
      {faqData?.highlights && (
        <FaqItem
          title="Highlights"
          isOpenByDefault={defaultOpenFaqs.includes("highlights")}
          id="highlights"
          onAnimationStateChange={setIsAnyFaqAnimating}
        >
          <HtmlContent html={faqData.highlights} />
        </FaqItem>
      )}

      {/* Inclusions */}
      {faqData?.inclusions && (
        <FaqItem
          title="Inclusions"
          id="inclusions"
          onAnimationStateChange={setIsAnyFaqAnimating}
        >
          <InclusionsContent html={faqData.inclusions} />
        </FaqItem>
      )}

      {/* Itinerary */}
      {experience?.data?.itinerary && (
        <FaqItem title="Itinerary" id="itinerary">
          <ItinerarySection experience={experience}/>
        </FaqItem>
      )}

      {/* Exclusions */}
      {faqData?.exclusions && (
        <FaqItem
          title="Exclusions"
          id="exclusions"
          isOpenByDefault={defaultOpenFaqs.includes("exclusions")}
        >
          <ExclusionsContent html={faqData.exclusions} />
        </FaqItem>
      )}

      {/* Cancellation Policy */}
      {faqData?.cancellationPolicy && (
        <FaqItem
          title="Cancellation Policy"
          id="cancellation-policy"
          isOpenByDefault={defaultOpenFaqs.includes("cancellation-policy")}
        >
          <HtmlContent html={faqData.cancellationPolicy} />
        </FaqItem>
      )}

      {/* Your Experience */}
      {faqData?.yourExperience && (
        <FaqItem title="Your Experience" id="your-experience">
          <HtmlContent html={faqData.yourExperience} />
        </FaqItem>
      )}

      {/* Operating Hours */}
      {experience?.data?.operatingHours && (
        <FaqItem title="Operating Hours" id="operating-hours">
          <OperatingHoursCard
            title={experience.data.title || "Experience"}
            operatingHours={experience.data.operatingHours.map(opHours => {
              // Format the period from startDate and endDate for dropdown to match original UI
              const startDate = new Date(opHours.startDate);
              const endDate = new Date(opHours.endDate);

              // Format like "1st Apr - 30th Sep" to match the original design
              const formatDateForPeriod = (date: Date) => {
                const day = date.getDate();
                const month = date.toLocaleDateString('en-US', { month: 'short' });
                const suffix = day === 1 || day === 21 || day === 31 ? 'st' :
                              day === 2 || day === 22 ? 'nd' :
                              day === 3 || day === 23 ? 'rd' : 'th';
                return `${day}${suffix} ${month}`;
              };

              const period = `${formatDateForPeriod(startDate)} - ${formatDateForPeriod(endDate)}`;

              // Convert 24-hour time to 12-hour AM/PM format
              const formatTime = (time24: string) => {
                const [hours, minutes] = time24.split(':');
                const hour = parseInt(hours);
                const ampm = hour >= 12 ? 'pm' : 'am';
                const hour12 = hour % 12 || 12;
                return `${hour12}:${minutes}${ampm}`;
              };

              const openTimeFormatted = formatTime(opHours.openTime);
              const closeTimeFormatted = formatTime(opHours.closeTime);
              const lastEntryFormatted = formatTime(opHours.lastEntryTime);

              return {
                period: period,
                hours: [
                  {
                    day: "Monday",
                    time: `${openTimeFormatted} - ${closeTimeFormatted}`,
                    lastEntry: lastEntryFormatted,
                  },
                  {
                    day: "Tuesday",
                    time: `${openTimeFormatted} - ${closeTimeFormatted}`,
                    lastEntry: lastEntryFormatted,
                  },
                  {
                    day: "Wednesday",
                    time: `${openTimeFormatted} - ${closeTimeFormatted}`,
                    lastEntry: lastEntryFormatted,
                  },
                  {
                    day: "Thursday",
                    time: `${openTimeFormatted} - ${closeTimeFormatted}`,
                    lastEntry: lastEntryFormatted,
                  },
                  {
                    day: "Friday",
                    time: `${openTimeFormatted} - ${closeTimeFormatted}`,
                    lastEntry: lastEntryFormatted,
                  },
                  {
                    day: "Saturday",
                    time: `${openTimeFormatted} - ${closeTimeFormatted}`,
                    lastEntry: lastEntryFormatted,
                  },
                  {
                    day: "Sunday",
                    time: `${openTimeFormatted} - ${closeTimeFormatted}`,
                    lastEntry: lastEntryFormatted,
                  },
                ],
              };
            })}
          />
        </FaqItem>
      )}

      {/* Reviews */}
      <FaqItem title="Reviews" id="reviews">
        <ReviewsSection reviews={experience?.data?.reviews} />
      </FaqItem>

      {/* Know Before You Go */}
      {faqData?.knowBeforeYouGo && (
        <FaqItem title="Know Before You Go" id="know-before-you-go">
          <HtmlContent html={faqData.knowBeforeYouGo} />
        </FaqItem>
      )}

      {/* My Tickets */}
      {faqData?.myTickets && (
        <FaqItem title="My Tickets" id="my-tickets">
          <HtmlContent html={faqData.myTickets} />
        </FaqItem>
      )}

      {/* Where */}
      <FaqItem title="Where" id="where">
        <div className="space-y-4 font-halyard-text">
          {/* Meeting Point */}
          <div className="flex items-center gap-2 group">
            <Map className="w-4 h-4 text-[#02819c] hover:cursor-pointer inline-block group-hover:text-[#444444]" />
            <p
              className="text-[15px] md:block hidden font-halyard-text md:text-[17px] text-[#02819c] hover:cursor-pointer hover:text-[#444444] group-hover:text-[#444444]"
              onClick={() => {
                if (mapRef.current && experience?.data?.whereTo) {
                  mapRef.current.setView([experience.data.whereTo.lat, experience.data.whereTo.lng], 18, {
                    animate: true,
                    duration: 1.0,
                  });
                }
              }}
            >
              {experience?.data?.whereTo?.address}
            </p>
            <p
              className="text-[15px] md:hidden font-halyard-text md:text-[17px] text-[#02819c] hover:cursor-pointer hover:text-[#444444] group-hover:text-[#444444]"
              onClick={() => {
                setShowMobileMapDrawer(true);
              }}
            >
              {experience?.data?.whereTo?.address}
            </p>
          </div>

          {/* Desktop Map Integration */}
          <div className="mt-4 md:block hidden">
            <div className="rounded-lg overflow-hidden">
              <div
                ref={mapContainerRef}
                className="w-full h-[300px] md:h-auto rounded-lg relative z-0"
                style={{
                  minHeight: "300px",
                  aspectRatio: "unset",
                }}
              ></div>
              <style jsx>{`
                @media (min-width: 768px) {
                  div[ref="${mapContainerRef}"] {
                    aspect-ratio: 1.98;
                  }
                }
              `}</style>
            </div>
          </div>
        </div>
      </FaqItem>

      {showMobileMapDrawer && (
        <div className="md:hidden fixed inset-0 bg-white z-[9999]">
          {/* Header */}
          <div className="flex relative items-center justify-center p-4 border-b border-gray-200 bg-white">
            <div className="absolute left-2">
              <button
                onClick={() => setShowMobileMapDrawer(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-gray-700" />
              </button>
            </div>
            <div className="justify-center">
              <h3 className="font-semibold text-gray-900 text-base font-halyard-text">
                Where?
              </h3>
            </div>
          </div>

          {/* Map Container */}
          <div className="flex-1 relative h-full">
            <div ref={mobileMapContainerRef} className="w-full h-full" />

            {/* Location Info Overlay */}
            <div
              className="absolute bottom-31 left-0 right-0  p-[24px]"
              style={{ zIndex: 1000 }}
            >
              <div className="flex bg-white items-start gap-3 p-[20px] shadow-2xl">
                <div className=" mt-[2px]">
                  {" "}
                  <MapPin size={16} className="text-[#444444]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-[#444444] text-sm font-halyard-text mb-1">
                    {experience?.data?.whereTo?.address || "Meeting Point"}
                  </h4>
                  <button
                    onClick={() => {
                      if (experience?.data?.whereTo) {
                        const { lat, lng } = experience.data.whereTo;
                        window.open(
                          `https://maps.google.com/?q=${lat},${lng}`,
                          "_blank"
                        );
                      }
                    }}
                    className="flex items-center justify-end w-full  gap-2 text-[#037b95] text-sm font-medium hover:text-blue-700 transition-colors"
                  >
                    <Map size={16} className="text-[#037b95]" />
                    <span className="font-halyard-text">
                      View in Google Maps
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaqSection;
