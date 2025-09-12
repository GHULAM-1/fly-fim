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

const ExperienceDetails: React.FC = () => {
  const [isOperatingHoursOpen, setIsOperatingHoursOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

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

  const details = [
    { icon: Clock, title: 'Duration', description: '2 hr', color: 'text-blue-600', bg: 'bg-blue-100' },
    {
      icon: Calendar,
      title: 'Open today',
      description: '9:30am - 7:00pm',
      color: 'text-green-600',
      bg: 'bg-green-100',
      clickable: true,
      onClick: () => setIsOperatingHoursOpen(true),
    },
    {
      icon: BadgeCheck,
      title: 'Free cancellation',
      description: 'Free cancellation up to 7 days before the start of your experience',
      color: 'text-red-600',
      bg: 'bg-red-100',
    },
    {
      icon: CreditCard,
      title: 'Book now, pay later',
      description: 'Book now without paying anything. Cancel for free if your plans change',
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
    { icon: Users, title: 'Guided tour', color: 'text-teal-600', bg: 'bg-teal-100' },
  ];

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
                <div className="text-[13px] text-gray-500 font-halyard-text">Alcazar of Seville</div>
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
                  ['Mon', '9:30am - 7:00pm'],
                  ['Tue', '9:30am - 7:00pm'],
                  ['Wed', '9:30am - 7:00pm'],
                  ['Thu', '9:30am - 7:00pm'], // highlighted
                  ['Fri', '9:30am - 7:00pm'],
                  ['Sat', '9:30am - 7:00pm'],
                  ['Sun', '9:30am - 7:00pm'],
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
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-500"></span>
                    <span className="font-halyard-text">Closed on 25th Dec 2025, 1st Jan 2026 and 6th Jan 2026.</span>
                  </li>
                </ul>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      )}

      {/* ===== DESKTOP / WEB MODAL (unchanged) ===== */}
      {isOperatingHoursOpen && (
        <div className="hidden md:block fixed inset-0 bg-[rgba(0,0,0,0.2)] z-50 animate-fade-in">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div
              ref={modalRef}
              className="calendar-modal bg-white w-full max-w-3xl rounded-2xl shadow-2xl animate-slide-up max-h-[80vh] overflow-y-auto"
            >
            <div className="p-6">
              <OperatingHoursCard
                title="Alcazar of Seville"
                operatingHours={[
                  {
                    hours: [
                      { day: 'Monday', time: '09:30am - 07:00pm', lastEntry: '06:00pm' },
                      { day: 'Tuesday', time: '09:30am - 07:00pm', lastEntry: '06:00pm' },
                      { day: 'Wednesday', time: '09:30am - 07:00pm', lastEntry: '06:00pm' },
                      { day: 'Thursday', time: '09:30am - 07:00pm', lastEntry: '06:00pm' },
                      { day: 'Friday', time: '09:30am - 07:00pm', lastEntry: '06:00pm' },
                      { day: 'Saturday', time: '09:30am - 07:00pm', lastEntry: '06:00pm' },
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
