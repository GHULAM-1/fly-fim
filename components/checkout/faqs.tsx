"use client";
import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Clock, Info, Ticket, Users, Shield, FileText, Navigation, Check, X } from 'lucide-react';
import OperatingHoursCard from './operating-hours';
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


interface FaqItemProps {
  title: string;
  description?: string;
  isOpenByDefault?: boolean;
  children?: React.ReactNode;
  id: string;
  icon?: React.ComponentType<any>;
}

const FaqItem: React.FC<FaqItemProps> = ({ title, description, isOpenByDefault = false, children, id, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(isOpenByDefault);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.maxHeight = isOpen ? `${contentRef.current.scrollHeight}px` : '0px';
    }
  }, [isOpen]);

  return (
    <div className="faq-item mb-12 border-b border-gray-200 pb-6" id={id}>
      <div 
        className="flex justify-between items-center cursor-pointer group" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <h3 className="font-semibold font-halyard-text text-gray-700" style={{ fontSize: '21px' }}>
            {title}
          </h3>
        </div>
        <span className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gray-500">
            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
      {description && (
        <p 
          className="font-halyard-text text-[#444444] mt-2"
          style={{ 
            fontSize: '1.0625rem',
            fontWeight: 300,
            lineHeight: '1.75rem',
            marginBottom: 0,
            listStyle: 'none',
            boxSizing: 'border-box',
            border: '0 solid',
            textDecoration: 'none'
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
          fontFamily: 'halyard-text',
          fontSize: '1.0625rem',
          fontWeight: 300,
          lineHeight: '1.75rem',
          marginBottom: 0,
          listStyle: 'none',
          boxSizing: 'border-box',
          border: '0 solid',
          textDecoration: 'none'
        }}
      >
        {children}
      </div>
    </div>
  );
};

const FaqSection: React.FC = () => {
  const defaultOpenFaqs = ["highlights", "inclusions", "exclusions", "cancellation-policy"];

  return (
    <div className="faq-section max-w-4xl font-halyard-text">
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
               <span className="leading-relaxed">
                 No queues, just pure discovery step into the magic of the Alcázar
                 in a small group for an intimate, more insightful experience.
               </span>
          </li>
          <li className="flex items-start gap-3">
           <div className="pt-2">
              <Bullet />
             </div>
            <span className="leading-relaxed">
              Explore some of the key highlights of the Alcazar, including the
              different sites that backdrop the dreamy Kingdom of Dorne in HBO's
              Game of Thrones.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <div className="pt-2">
               <Bullet />
               </div>
            <span className="leading-relaxed">
              Your expert English-speaking guide will offer fascinating insights
              into the Alcazar's rich history and details about its
              architectural evolution.
            </span>
          </li>
          <li className="flex items-start gap-3">
           <div className="pt-2">
              <Bullet />
             </div>
            <span className="leading-relaxed">
              Stroll through seven hectares of lush gardens with peacocks,
              fountains, and unforgettable gems like the Garden of the Poets and
              the Fountain of Fame.
            </span>
          </li>
        </ul>
      </FaqItem>

      <FaqItem
        title="Inclusions"
        id="inclusions"
        isOpenByDefault={defaultOpenFaqs.includes("inclusions")}
      >
        <ul className="space-y-3 font-halyard-text">
          <li className="flex items-start gap-3">
            <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Entry to the Alcázar of Seville</span>
          </li>
          <li className="flex items-start gap-3">
            <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Expert English-speaking guide</span>
          </li>
          <li className="flex items-start gap-3">
            <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Small group tour (no more than 10 participants)</span>
          </li>
          <li className="flex items-start gap-3">
            <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Radio device system (if needed)</span>
          </li>
        </ul>
      </FaqItem>

      <FaqItem
        title="Exclusions"
        id="exclusions"
        isOpenByDefault={defaultOpenFaqs.includes("exclusions")}
      >
        <ul className="space-y-3 font-halyard-text">
          <li className="flex items-start gap-3">
            <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <span>Hotel transfers & transportation</span>
          </li>
          <li className="flex items-start gap-3">
            <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <span>Personal expenses</span>
          </li>
        </ul>
      </FaqItem>

      <FaqItem
        title="Cancellation Policy"
        id="cancellation-policy"
        isOpenByDefault={defaultOpenFaqs.includes("cancellation-policy")}
      >
        <p className="mb-3 font-halyard-text">
          You can cancel these tickets up to 7 days before the experience begins
          and get a full refund.
        </p>
      </FaqItem>

      <FaqItem title="Your Experience" id="your-experience">
        <div className="space-y-4 font-halyard-text">
          <p className="font-semibold text-gray-900">
            Skip the lines and step back in time on a small-group guided tour of
            the Royal Alcázar of Seville, one of Europe's oldest royal palaces
            still in use. Explore its many highlights with an expert
            English-speaking guide leading the way.
          </p>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Getting started
              </h4>
              <p className="text-gray-700">
                Meet your guide at the Plaza del Triunfo in Seville to have your
                tickets validated. Make sure you carry your original passport or
                ID, and that the name on it matches the name on your ticket.
                Once your tickets are checked, you'll be escorted into the
                Alcazar.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                What to expect
              </h4>
              <p className="text-gray-700 mb-3">
                Wander through the majestic Alcazar of Seville, where Islamic
                and Christian styles intertwine harmoniously. From Game of
                Thrones filming locations to the lavish meeting rooms of Spanish
                royalty and seven hectares of lush gardens, the Alcázar offers a
                visual and historical feast at every turn.
              </p>

              <div className="space-y-3">
                <div>
                  <h5 className="font-medium text-gray-900 mb-1">
                    Architectural splendor:
                  </h5>
                  <p className="text-gray-700">
                    Marvel at the Alcázar's signature mix of Mudéjar, Gothic,
                    Renaissance, and Baroque elements. Intricate tilework,
                    carved wooden ceilings, and elegant arches highlight the
                    confluence of multicultural influences visible today.
                  </p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 mb-1">
                    Legendary courtyards:
                  </h5>
                  <p className="text-gray-700">
                    Explore the Courtyard of the Maidens (Patio de las
                    Doncellas), an emblem of Islamic design with its reflective
                    pool and colonnades, as well as the charming and
                    lesser-known Courtyard of the Dolls (Patio de las Muñecas),
                    famed for its delicate columns and symbolic details.
                  </p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 mb-1">
                    The Hall of Ambassadors:
                  </h5>
                  <p className="text-gray-700">
                    Step inside the Alcázar's most iconic chamber, known for its
                    magnificent domed ceiling, gilded decoration, and historic
                    importance as the throne room of King Pedro I. This is where
                    history was shaped and diplomacy reigned.
                  </p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 mb-1">
                    Treasures of the past:
                  </h5>
                  <p className="text-gray-700">
                    View priceless works of art including The Virgin of the
                    Navigators, a tribute to Spain's Age of Exploration, along
                    with other paintings, furnishings, and tapestries that
                    chronicle Seville's rich maritime heritage.
                  </p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 mb-1">
                    Lush palace gardens:
                  </h5>
                  <p className="text-gray-700">
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

      <FaqItem title="Operating Hours" id="operating-hours">
        <OperatingHoursCard
          title="Alcazar of Seville"
          operatingHours={[
            {
              period: "1st Apr - 30th Sep",
              hours: [
                { day: "Monday", time: "09:30am - 07:00pm" },
                { day: "Tuesday", time: "09:30am - 07:00pm" },
                { day: "Wednesday", time: "09:30am - 07:00pm" },
                { day: "Thursday", time: "09:30am - 07:00pm" },
                { day: "Friday", time: "09:30am - 07:00pm" },
                { day: "Saturday", time: "09:30am - 07:00pm" },
                { day: "Sunday", time: "09:30am - 07:00pm" },
              ],
            },
            {
              period: "1st Oct - 31st Mar",
              hours: [
                { day: "Monday", time: "09:30am - 05:00pm" },
                { day: "Tuesday", time: "09:30am - 05:00pm" },
                { day: "Wednesday", time: "09:30am - 05:00pm" },
                { day: "Thursday", time: "09:30am - 05:00pm" },
                { day: "Friday", time: "09:30am - 05:00pm" },
                { day: "Saturday", time: "09:30am - 05:00pm" },
                { day: "Sunday", time: "09:30am - 05:00pm" },
              ],
            },
          ]}
        />
      </FaqItem>

      <FaqItem title="Know Before You Go" id="know-before-you-go">
        <div className="space-y-6 font-halyard-text">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">What to bring</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  Bring a valid passport or ID card for entry along with your
                  ticket.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  You can present your ticket printed or on your mobile.
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">
              What's not allowed
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  Food and drinks are not permitted inside the monument (except
                  for water and food for babies).
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  Alcohol, drugs, and intoxicated behavior are strictly
                  prohibited.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  Weapons, sharp objects, and large bags or luggage are not
                  allowed.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  Pets are not permitted, except for guide dogs or emotional
                  support dogs with valid documentation.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  Selfie sticks, flash photography, and tripods are not allowed.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  Entering barefoot and bachelor or bachelorette party groups
                  are not permitted.
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Accessibility</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  The Alcázar of Seville is wheelchair and pram/stroller
                  accessible.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  Guide dogs and emotional support animals are allowed within
                  the Alcázar, subject to producing the official documentation.
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">
              Additional information
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  You must arrive at the designated entry point 15 minutes
                  before your scheduled time to complete check-in.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  Your guide will only speak English throughout the tour.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  Your ticket does not include a visit to the Royal High Room.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  In the event of heavy rain or winds, the management holds the
                  sole discretion to restrict access to the gardens for security
                  reasons.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  The monument is vacated at 17:45 from October to March and at
                  19:45 from April to September.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  You will have to go through airport-style security screening
                  while entering the Alcazar (bags included).
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-black-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>
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
              <span>Your voucher will be emailed to you instantly.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-black-600 rounded-full mt-2 flex-shrink-0"></div>
              <span>
                Display the voucher on your mobile phone with a valid photo ID
                at the meeting point.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-black-600 rounded-full mt-2 flex-shrink-0"></div>
              <span>
                Please arrive at the meeting point 5 minutes before the
                scheduled time of your visit to avoid any delays.
              </span>
            </li>
          </ul>
        </div>
      </FaqItem>

      <FaqItem title="Where" id="where">
        <div className="space-y-4 font-halyard-text">
          <div>
            <p
              className="text-[#444444] mb-3 cursor-pointer hover:text-purple-600 transition-colors duration-150"
              style={{
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
              onMouseEnter={() => {
                const iframe = document.querySelector("iframe");
                if (iframe) {
                  iframe.src =
                    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d792.5831348826104!2d-5.9922638!3d37.3857231!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDIzJzA4LjYiTiA1wrA1OSczMi4yIlc!5e0!3m2!1sen!2sus!4v1624456789012!5m2!1sen!2sus";
                }
              }}
              onMouseLeave={() => {
                const iframe = document.querySelector("iframe");
                if (iframe) {
                  iframe.src =
                    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3172.3325395304414!2d-5.9922638!3d37.3857231!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDIzJzA4LjYiTiA1wrA1OSczMi4yIlc!5e0!3m2!1sen!2sus!4v1624456789012!5m2!1sen!2sus";
                }
              }}
            >
              Plaza del Triunfo, Big statue, Seville
            </p>
          </div>

          <div className="mt-4">
            <div className="rounded-lg p-4">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3172.3325395304414!2d-5.9922638!3d37.3857231!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDIzJzA4LjYiTiA1wrA1OSczMi4yIlc!5e0!3m2!1sen!2sus!4v1624456789012!5m2!1sen!2sus"
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