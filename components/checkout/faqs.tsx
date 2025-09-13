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

  // useEffect(() => {
  //   if (contentRef.current) {
  //     setIsAnimating(true);
  //     onAnimationStateChange?.(true);
      
  //     // Use requestAnimationFrame to ensure smooth animation without scroll interference
  //     requestAnimationFrame(() => {
  //       if (contentRef.current) {
  //         contentRef.current.style.maxHeight = isOpen
  //           ? `${contentRef.current.scrollHeight}px`
  //           : "0px";
  //       }
  //     });
      
  //     // Reset animation state after transition completes
  //     const timer = setTimeout(() => {
  //       setIsAnimating(false);
  //       onAnimationStateChange?.(false);
  //     }, 300); // Match the transition duration
      
  //     return () => clearTimeout(timer);
  //   }
  // }, [isOpen, onAnimationStateChange]);

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

const FaqSection: React.FC = () => {
  // Set first four FAQ sections open by default, rest closed
  const defaultOpenFaqs = ["highlights", "inclusions"];
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

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
      center: [37.3857231, -5.9922638], // Seville coordinates
      zoom: 16,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // Add marker for meeting point
    const marker = L.marker([37.3857231, -5.9922638]).addTo(map);
    marker.bindPopup(`
      <div class="p-2">
        <h3 class="font-semibold text-sm">Meeting Point</h3>
        <p class="text-xs text-gray-600">Plaza del Triunfo, Big statue, Seville</p>
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
  }, [showMobileMapDrawer]);

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

      // Create map with lazy initialization to prevent layout shifts
      const map = L.map(mapContainerRef.current, {
        center: [37.3857231, -5.9922638], // Seville coordinates
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
      const marker = L.marker([37.3857231, -5.9922638]).addTo(map);
      marker.bindPopup(`
        <div class="p-2">
          <h3 class="font-semibold text-sm">Meeting Point</h3>
          <p class="text-xs text-gray-600">Plaza del Triunfo, Big statue, Seville</p>
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
  }, []);

  return (
    <div className="faq-section max-w-4xl font-halyard-text">
      {/* Highlights */}
      <FaqItem
        title="Highlights"
        isOpenByDefault={defaultOpenFaqs.includes("highlights")}
        id="highlights"
      >
        <ul className="space-y-3 font-halyard-text">
          <li className="flex items-start gap-3 ">
            <div className="pt-2">
              <Bullet />
            </div>
            <span className="text-[15px] md:text-[17px] leading-relaxed">
              No queues, just pure discovery step into the magic of the Alcázar
              in a small group for an intimate, more insightful experience.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <div className="pt-2">
              <Bullet />
            </div>
            <span className="text-[15px] md:text-[17px] leading-relaxed">
              Explore some of the key highlights of the Alcazar, including the
              different sites that backdrop the dreamy Kingdom of Dorne in HBO's
              Game of Thrones.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <div className="pt-2">
              <Bullet />
            </div>
            <span className="text-[15px] md:text-[17px] leading-relaxed">
              Your expert English-speaking guide will offer fascinating insights
              into the Alcazar's rich history and details about its
              architectural evolution.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <div className="pt-2">
              <Bullet />
            </div>
            <span className="text-[15px] md:text-[17px] leading-relaxed">
              Stroll through seven hectares of lush gardens with peacocks,
              fountains, and unforgettable gems like the Garden of the Poets and
              the Fountain of Fame.
            </span>
          </li>
        </ul>
      </FaqItem>

      {/* Inclusions */}
      <FaqItem
        title="Inclusions"
        id="inclusions"
        isOpenByDefault={defaultOpenFaqs.includes("inclusions")}
      >
        <ul className="space-y-3 font-halyard-text">
          <li className="flex items-start  gap-3">
            <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span className="text-[15px] md:text-[17px]">
              Entry to the Alcázar of Seville
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span className="text-[15px] md:text-[17px]">
              Expert English-speaking guide
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span className="text-[15px] md:text-[17px]">
              Small group tour (no more than 10 participants)
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span className="text-[15px] md:text-[17px]">
              Radio device system (if needed)
            </span>
          </li>
        </ul>
      </FaqItem>

      {/* Itinerary */}
      <FaqItem title="Itinerary" id="itinerary">
        <ItinerarySection />
      </FaqItem>

      {/* Exclusions */}
      <FaqItem
        title="Exclusions"
        id="exclusions"
        isOpenByDefault={defaultOpenFaqs.includes("exclusions")}
      >
        <ul className="space-y-3 font-halyard-text">
          <li className="flex items-start gap-3">
            <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <span className="text-[15px] md:text-[17px]">
              Hotel transfers & transportation
            </span>
          </li>
          <li className="flex items-start gap-3">
            <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <span className="text-[15px] md:text-[17px]">
              Personal expenses
            </span>
          </li>
        </ul>
      </FaqItem>

      {/* Cancellation Policy */}
      <FaqItem
        title="Cancellation Policy"
        id="cancellation-policy"
        isOpenByDefault={defaultOpenFaqs.includes("cancellation-policy")}
      >
        <p className="mb-3 font-halyard-text text-[15px] md:text-[17px]">
          You can cancel these tickets up to 7 days before the experience begins
          and get a full refund.
        </p>
      </FaqItem>

      {/* Your Experience */}
      <FaqItem title="Your Experience" id="your-experience" >
        <div className="space-y-4 font-halyard-text">
          <p className="font-semibold text-[15px] md:text-[17px] text-gray-900">
            Skip the lines and step back in time on a small-group guided tour of
            the Royal Alcázar of Seville, one of Europe's oldest royal palaces
            still in use. Explore its many highlights with an expert
            English-speaking guide leading the way.
          </p>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-[15px] md:text-[17px] text-gray-900 mb-2">
                Getting started
              </h4>
              <p className="text-[15px] md:text-[17px] text-gray-700">
                Meet your guide at the Plaza del Triunfo in Seville to have your
                tickets validated. Make sure you carry your original passport or
                ID, and that the name on it matches the name on your ticket.
                Once your tickets are checked, you'll be escorted into the
                Alcazar.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-[15px] md:text-[17px] text-gray-900 mb-2">
                What to expect
              </h4>
              <p className="text-[15px] md:text-[17px] text-gray-700 mb-3">
                Wander through the majestic Alcazar of Seville, where Islamic
                and Christian styles intertwine harmoniously. From Game of
                Thrones filming locations to the lavish meeting rooms of Spanish
                royalty and seven hectares of lush gardens, the Alcázar offers a
                visual and historical feast at every turn.
              </p>

              <div className="space-y-3">
                <div>
                  <h5 className="font-medium text-[15px] md:text-[17px] text-gray-900 mb-1">
                    Architectural splendor:
                  </h5>
                  <p className="text-[15px] md:text-[17px] text-gray-700">
                    Marvel at the Alcázar's signature mix of Mudéjar, Gothic,
                    Renaissance, and Baroque elements. Intricate tilework,
                    carved wooden ceilings, and elegant arches highlight the
                    confluence of multicultural influences visible today.
                  </p>
                </div>
                <div>
                  <h5 className="font-medium text-[15px] md:text-[17px] text-gray-900 mb-1">
                    Legendary courtyards:
                  </h5>
                  <p className="text-[15px] md:text-[17px] text-gray-700">
                    Explore the Courtyard of the Maidens (Patio de las
                    Doncellas), an emblem of Islamic design with its reflective
                    pool and colonnades, as well as the charming and
                    lesser-known Courtyard of the Dolls (Patio de las Muñecas),
                    famed for its delicate columns and symbolic details.
                  </p>
                </div>
                <div>
                  <h5 className="font-medium text-[15px] md:text-[17px] text-gray-900 mb-1">
                    The Hall of Ambassadors:
                  </h5>
                  <p className="text-[15px] md:text-[17px] text-gray-700">
                    Step inside the Alcázar's most iconic chamber, known for its
                    magnificent domed ceiling, gilded decoration, and historic
                    importance as the throne room of King Pedro I. This is where
                    history was shaped and diplomacy reigned.
                  </p>
                </div>
                <div>
                  <h5 className="font-medium text-[15px] md:text-[17px] text-gray-900 mb-1">
                    Treasures of the past:
                  </h5>
                  <p className="text-[15px] md:text-[17px] text-gray-700">
                    View priceless works of art including The Virgin of the
                    Navigators, a tribute to Spain's Age of Exploration, along
                    with other paintings, furnishings, and tapestries that
                    chronicle Seville's rich maritime heritage.
                  </p>
                </div>
                <div>
                  <h5 className="font-medium text-[15px] md:text-[17px] text-gray-900 mb-1">
                    Lush palace gardens:
                  </h5>
                  <p className="text-[15px] md:text-[17px] text-gray-700">
                    End your tour in serenity as you stroll through the vast
                    Alcazar Seville gardens. Discover trickling fountains,
                    exotic flora, maze-like hedges, and colorful peacocks—all
                    set against the backdrop of centuries-old pavilions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FaqItem>

      {/* Operating Hours */}
      <FaqItem title="Operating Hours" id="operating-hours">
        <OperatingHoursCard
          title="Alcazar of Seville"
          operatingHours={[
            {
              period: "1st Apr - 30th Sep",
              hours: [
                {
                  day: "Monday",
                  time: "09:30am - 07:00pm",
                  lastEntry: "06:00pm",
                },
                {
                  day: "Tuesday",
                  time: "09:30am - 07:00pm",
                  lastEntry: "06:00pm",
                },
                {
                  day: "Wednesday",
                  time: "09:30am - 07:00pm",
                  lastEntry: "06:00pm",
                },
                {
                  day: "Thursday",
                  time: "09:30am - 07:00pm",
                  lastEntry: "06:00pm",
                },
                {
                  day: "Friday",
                  time: "09:30am - 07:00pm",
                  lastEntry: "06:00pm",
                },
                {
                  day: "Saturday",
                  time: "09:30am - 07:00pm",
                  lastEntry: "06:00pm",
                },
                {
                  day: "Sunday",
                  time: "09:30am - 07:00pm",
                  lastEntry: "06:00pm",
                },
              ],
            },
            {
              period: "1st Oct - 31st Mar",
              hours: [
                {
                  day: "Monday",
                  time: "09:30am - 05:00pm",
                  lastEntry: "04:00pm",
                },
                {
                  day: "Tuesday",
                  time: "09:30am - 05:00pm",
                  lastEntry: "04:00pm",
                },
                {
                  day: "Wednesday",
                  time: "09:30am - 05:00pm",
                  lastEntry: "04:00pm",
                },
                {
                  day: "Thursday",
                  time: "09:30am - 05:00pm",
                  lastEntry: "04:00pm",
                },
                {
                  day: "Friday",
                  time: "09:30am - 05:00pm",
                  lastEntry: "04:00pm",
                },
                {
                  day: "Saturday",
                  time: "09:30am - 05:00pm",
                  lastEntry: "04:00pm",
                },
                {
                  day: "Sunday",
                  time: "09:30am - 05:00pm",
                  lastEntry: "04:00pm",
                },
              ],
            },
          ]}
        />
      </FaqItem>

      {/* Reviews */}
      <FaqItem title="Reviews" id="reviews">
        <ReviewsSection />
      </FaqItem>

      {/* Know Before You Go */}
      <FaqItem title="Know Before You Go" id="know-before-you-go" >
        <div className="space-y-6 font-halyard-text">
          <div>
            <h4 className="font-semibold text-[15px] md:text-[17px] text-gray-900 mb-3">
              What to bring
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-[15px] md:text-[17px]">
                  Bring a valid passport or ID card for entry along with your
                  ticket.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-[15px] md:text-[17px]">
                  You can present your ticket printed or on your mobile.
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[15px] md:text-[17px] text-gray-900 mb-3">
              What's not allowed
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-[15px] md:text-[17px]">
                  Food and drinks are not permitted inside the monument (except
                  for water and food for babies).
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-[15px] md:text-[17px]">
                  Alcohol, drugs, and intoxicated behavior are strictly
                  prohibited.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-[15px] md:text-[17px]">
                  Weapons, sharp objects, and large bags or luggage are not
                  allowed.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-[15px] md:text-[17px]">
                  Pets are not permitted, except for guide dogs or emotional
                  support dogs with valid documentation.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-[15px] md:text-[17px]">
                  Selfie sticks, flash photography, and tripods are not allowed.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-[15px] md:text-[17px]">
                  Entering barefoot and bachelor or bachelorette party groups
                  are not permitted.
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[15px] md:text-[17px] text-gray-900 mb-3">
              Accessibility
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-[15px] md:text-[17px]">
                  The Alcázar of Seville is wheelchair and pram/stroller
                  accessible.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-[15px] md:text-[17px]">
                  Guide dogs and emotional support animals are allowed within
                  the Alcázar, subject to producing the official documentation.
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[15px] md:text-[17px] text-gray-900 mb-3">
              Additional information
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-[15px] md:text-[17px]">
                  You must arrive at the designated entry point 15 minutes
                  before your scheduled time to complete check-in.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-[15px] md:text-[17px]">
                  Your guide will only speak English throughout the tour.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-[15px] md:text-[17px]">
                  Your ticket does not include a visit to the Royal High Room.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-[15px] md:text-[17px]">
                  In the event of heavy rain or winds, the management holds the
                  sole discretion to restrict access to the gardens for security
                  reasons.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-[15px] md:text-[17px]">
                  The monument is vacated at 17:45 from October to March and at
                  19:45 from April to September.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-[15px] md:text-[17px]">
                  You will have to go through airport-style security screening
                  while entering the Alcazar (bags included).
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black-600 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-[15px] md:text-[17px]">
                  Once you get your tickets validated and enter the Alcázar, you
                  cannot re-enter the complex.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </FaqItem>

      {/* My Tickets */}
      <FaqItem title="My Tickets" id="my-tickets">
        <div className="space-y-4 font-halyard-text">
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-black-600 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-[15px] md:text-[17px]">
                Your voucher will be emailed to you instantly.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-black-600 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-[15px] md:text-[17px]">
                Display the voucher on your mobile phone with a valid photo ID
                at the meeting point.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-black-600 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-[15px] md:text-[17px]">
                Please arrive at the meeting point 5 minutes before the
                scheduled time of your visit to avoid any delays.
              </span>
            </li>
          </ul>
        </div>
      </FaqItem>

      {/* Where */}
      <FaqItem title="Where" id="where">
        <div className="space-y-4 font-halyard-text">
          {/* Meeting Point */}
          <div className="flex items-center gap-2 group">
            <Map className="w-4 h-4 text-[#02819c] hover:cursor-pointer inline-block group-hover:text-[#444444]" />
            <p
              className="text-[15px] md:block hidden font-halyard-text md:text-[17px] text-[#02819c] hover:cursor-pointer hover:text-[#444444] group-hover:text-[#444444]"
              onClick={() => {
                if (mapRef.current) {
                  mapRef.current.setView([37.3857231, -5.9922638], 18, {
                    animate: true,
                    duration: 1.0,
                  });
                }
              }}
            >
              Plaza del Triunfo, Big statue, Seville
            </p>
            <p
              className="text-[15px] md:hidden font-halyard-text md:text-[17px] text-[#02819c] hover:cursor-pointer hover:text-[#444444] group-hover:text-[#444444]"
              onClick={() => {
                setShowMobileMapDrawer(true);
              }}
            >
              Plaza del Triunfo, Big statue, Seville
            </p>
          </div>

          {/* Desktop Map Integration */}
          <div className="mt-4 md:block hidden">
            <div className="rounded-lg overflow-hidden">
              <div
                ref={mapContainerRef}
                className="w-full h-[300px] md:h-auto rounded-lg relative z-20"
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
                    Plaza del Triunfo, Big statue
                  </h4>
                  <button
                    onClick={() =>
                      window.open(
                        "https://maps.google.com/?q=Plaza+del+Triunfo,+Seville,+Spain",
                        "_blank"
                      )
                    }
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
