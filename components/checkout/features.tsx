import React, { useState, useRef, useEffect } from 'react';
import { Clock, Calendar, BadgeCheck, CreditCard, Users, ChevronRight, X } from 'lucide-react';
import OperatingHoursCard from './operating-hours';
import { 
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerTrigger,
    DrawerOverlay,
    DrawerPortal,  
} from "@/components/ui/drawer";
import { ExperienceResponse } from '@/types/experience/experience-types';

const ExperienceDetails: React.FC<{ experience: ExperienceResponse }> = ({ experience }) => {
  const [isOperatingHoursOpen, setIsOperatingHoursOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Helper function to calculate last entry time (1 hour before closing)
  const calculateLastEntry = (timeString: string): string => {
    try {
      if (!timeString || timeString.toLowerCase().includes('closed')) {
        return 'N/A';
      }

      // Extract closing time from string like "9:30am - 7:00pm"
      const parts = timeString.split(' - ');
      if (parts.length !== 2) return '06:00pm'; // fallback

      const closingTime = parts[1].trim();

      // Parse time like "7:00pm"
      const timeMatch = closingTime.match(/(\d{1,2}):(\d{2})(am|pm)/i);
      if (!timeMatch) return '06:00pm'; // fallback

      let hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2]);
      const period = timeMatch[3].toLowerCase();

      // Convert to 24-hour format
      if (period === 'pm' && hours !== 12) hours += 12;
      if (period === 'am' && hours === 12) hours = 0;

      // Subtract 1 hour
      hours -= 1;

      // Handle edge case (if it goes below 0)
      if (hours < 0) hours = 23;

      // Convert back to 12-hour format
      let displayHours = hours;
      let displayPeriod = 'am';

      if (hours === 0) {
        displayHours = 12;
      } else if (hours >= 12) {
        displayPeriod = 'pm';
        if (hours > 12) displayHours = hours - 12;
      }

      // Format the result
      const formattedMinutes = minutes.toString().padStart(2, '0');
      return `${displayHours}:${formattedMinutes}${displayPeriod}`;
    } catch (error) {
      return '06:00pm'; // fallback on any error
    }
  };

  // Handle click outside modal (desktop/web only)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOperatingHoursOpen(false);
      }
    };

    if (isOperatingHoursOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOperatingHoursOpen]);

  // Generate details array based on features array from API
  const getDetails = () => {
    const details: any[] = [];
    const features = experience?.data?.features || [];

    // Define the mapping for each index
    const featureMapping = [
      { icon: Clock, title: 'Duration', color: 'text-blue-600', bg: 'bg-blue-100' },
      {
        icon: Calendar,
        title: 'Open today',
        color: 'text-green-600',
        bg: 'bg-green-100',
        clickable: true,
        onClick: () => setIsOperatingHoursOpen(true),
      },
      { icon: BadgeCheck, title: 'Free cancellation', color: 'text-red-600', bg: 'bg-red-100' },
      { icon: CreditCard, title: 'Book now, pay later', color: 'text-purple-600', bg: 'bg-purple-100' },
      { icon: Users, title: 'Guided tour', color: 'text-teal-600', bg: 'bg-teal-100' },
    ];

    // Only show features that exist in the API response
    features.forEach((feature, index) => {
      if (index < featureMapping.length && feature) {
        details.push({
          ...featureMapping[index],
          description: feature as any
        });
      }
    });

    return details as any[];
  };

  const details = getDetails();

  return (
    <>
      <div className="experience-details max-w-4xl font-halyard-text text-left">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6 pb-4">
          {details.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className={`flex items-start min-h-[32px] sm:minh-[44px] gap-2 sm:gap-3 text-xs sm:text-sm text-gray-700 w-full max-w-[280px] ${
                  (item as any).clickable ? 'cursor-pointer hover:opacity-80 transition-opacity duration-150' : ''
                }`}
                onClick={(item as any).onClick}
              >
                <span className={`flex items-center justify-center w-9 h-9 rounded-lg ${item.bg}`} style={{ padding: '8px' }}>
                  <IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 ${item.color}`} />
                </span>
                <div className="font-halyard-text text-[#444444] text-xs sm:text-sm">
                  {item.title && (
                    <span
                      className={`font-halyard-text font-semibold text-xs sm:text-sm ${
                        item.title === 'Open today' ? 'text-green-600' : ''
                      }`}
                    >
                      {item.title}
                      {item.title === 'Open today' && <ChevronRight className="inline w-4 h-4 ml-1 text-green-600" />}
                    </span>
                  )}
                  {item.title && item.description && <br />}
                  {item.description && <span className="font-halyard-text-light text-[#666666] text-[11px] sm:text-xs">{item.description}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== MOBILE DRAWER (matches screenshot) ===== */}
      {isOperatingHoursOpen && typeof window !== 'undefined' && window.innerWidth < 768 && (
        <div className="md:hidden">
          <Drawer open={isOperatingHoursOpen} onOpenChange={setIsOperatingHoursOpen} shouldScaleBackground>
            <DrawerContent bgClass="bg-white" className="rounded-t-2xl border-0 shadow-2xl max-h-[75vh]">
              {/* Handle
              <div className="mx-auto mt-3 mb-1 h-1.5 w-[72px] rounded-full bg-gray-300" /> */}

              {/* Header */}
              <div className="relative px-4 pt-1 pb-3">
                <div className="text-[13px] text-gray-500 font-halyard-text">{experience?.data?.title}</div>
                <div className="flex items-center">
                  <DrawerTitle asChild>
                    <h3 className="text-[16px] font-semibold text-gray-900 font-halyard-text">Operating hours</h3>
                  </DrawerTitle>
                </div>
                <DrawerClose
                  aria-label="Close operating hours"
                  className="absolute right-3 top-2 rounded-full p-1 text-gray-500 hover:bg-gray-100 active:scale-95"
                >
                  <X className="h-5 w-5" />
                </DrawerClose>
              </div>

              {/* Separator */}
              <div className="h-px bg-gray-200" />

              {/* Hours list */}
              <div className="overflow-y-auto">
                {[
                  ['Mon', experience?.data?.features?.[1] || '9:30am - 7:00pm'],
                  ['Tue', experience?.data?.features?.[1] || '9:30am - 7:00pm'],
                  ['Wed', experience?.data?.features?.[1] || '9:30am - 7:00pm'],
                  ['Thu', experience?.data?.features?.[1] || '9:30am - 7:00pm'], // highlighted
                  ['Fri', experience?.data?.features?.[1] || '9:30am - 7:00pm'],
                  ['Sat', experience?.data?.features?.[1] || '9:30am - 7:00pm'],
                  ['Sun', 'Closed'],
                ].map(([day, time], i) => {
                  const isThu = day === 'Thu';
                  return (
                    <div
                      key={day}
                      className={`flex items-center justify-between px-4 py-3 ${i < 6 ? 'border-b border-gray-200' : ''}`}
                    >
                      <span className={`text-[14px] ${isThu ? 'text-[#7a3aed] font-semibold' : 'text-gray-600'} font-halyard-text`}>{day}</span>
                      <span className={`text-[14px] ${isThu ? 'text-[#7a3aed] font-semibold' : 'text-gray-900'} font-halyard-text`}>{time}</span>
                    </div>
                  );
                })}
              </div>

              {/* Notes box */}
              <div className="border-t border-gray-200 bg-gray-50 px-4 py-4">
                <ul className="space-y-2 text-[12px] text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-500"></span>
                    <span className="font-halyard-text">Timings are displayed in the venue&apos;s time zone.</span>
                  </li>
                  {/* <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-500"></span>
                    <span className="font-halyard-text">Closed on 25th Dec 2025, 1st Jan 2026 and 6th Jan 2026.</span>
                  </li> */}
                </ul>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      )}

      {/* ===== DESKTOP / WEB MODAL ===== */}
      {isOperatingHoursOpen && (
        <div className="hidden md:block fixed inset-0 bg-[rgba(0,0,0,0.2)] z-50 animate-fade-in">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div
              ref={modalRef}
              className="calendar-modal bg-white w-full max-w-3xl rounded-2xl shadow-2xl animate-slide-up max-h-[80vh] overflow-y-auto"
            >
            <div className="p-6">
              <OperatingHoursCard
                title={experience?.data?.title || "Experience"}
                operatingHours={[
                  {
                    hours: [
                      { day: 'Monday', time: experience?.data?.features?.[1] || '09:30am - 07:00pm', lastEntry: calculateLastEntry(experience?.data?.features?.[1] || '09:30am - 07:00pm') },
                      { day: 'Tuesday', time: experience?.data?.features?.[1] || '09:30am - 07:00pm', lastEntry: calculateLastEntry(experience?.data?.features?.[1] || '09:30am - 07:00pm') },
                      { day: 'Wednesday', time: experience?.data?.features?.[1] || '09:30am - 07:00pm', lastEntry: calculateLastEntry(experience?.data?.features?.[1] || '09:30am - 07:00pm') },
                      { day: 'Thursday', time: experience?.data?.features?.[1] || '09:30am - 07:00pm', lastEntry: calculateLastEntry(experience?.data?.features?.[1] || '09:30am - 07:00pm') },
                      { day: 'Friday', time: experience?.data?.features?.[1] || '09:30am - 07:00pm', lastEntry: calculateLastEntry(experience?.data?.features?.[1] || '09:30am - 07:00pm') },
                      { day: 'Saturday', time: experience?.data?.features?.[1] || '09:30am - 07:00pm', lastEntry: calculateLastEntry(experience?.data?.features?.[1] || '09:30am - 07:00pm') },
                      { day: 'Sunday', time: 'Closed', lastEntry: 'N/A' },
                    ],
                  },
                ]}
                showPeriodSelector={false}
                onClose={() => setIsOperatingHoursOpen(false)}
              />
            </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default ExperienceDetails;
