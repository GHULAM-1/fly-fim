import React, { useState, useRef, useEffect } from 'react';
import { Clock, Calendar, BadgeCheck, CreditCard, Users, ChevronRight } from 'lucide-react';
import OperatingHoursCard from './operating-hours';

const ExperienceDetails: React.FC = () => {
  const [isOperatingHoursOpen, setIsOperatingHoursOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle click outside modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOperatingHoursOpen(false);
      }
    };

    if (isOperatingHoursOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOperatingHoursOpen]);

  const details = [
    { icon: Clock, title: "Duration", description: "2 hr", color: "text-blue-600", bg: "bg-blue-100" },
    { 
      icon: Calendar, 
      title: "Open today", 
      description: "9:30am - 7:00pm", 
      color: "text-green-600", 
      bg: "bg-green-100",
      clickable: true,
      onClick: () => setIsOperatingHoursOpen(true)
    },
    { icon: BadgeCheck, title: "Free cancellation", description: "Free cancellation up to 7 days before the start of your experience", color: "text-red-600", bg: "bg-red-100" },
    { icon: CreditCard, title: "Book now, pay later", description: "Book now without paying anything. Cancel for free if your plans change", color: "text-purple-600", bg: "bg-purple-100" },
    { icon: Users, title: "Guided tour", color: "text-teal-600", bg: "bg-teal-100" },
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
                className={`flex items-start min-h-[32px] sm:min-h-[44px] gap-2 sm:gap-3 text-xs sm:text-sm text-gray-700 w-full max-w-[280px] ${
                  item.clickable ? 'cursor-pointer hover:opacity-80 transition-opacity duration-150' : ''
                }`}
                onClick={item.onClick}
              >
                <span
                  className={`flex items-center justify-center w-9 h-9 sm:w-9 sm:h-9 rounded-lg ${item.bg}`}
                  style={{ padding: '8px' }}
                >
                  <IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 ${item.color}`} />
                </span>
                <div className="font-halyard-text text-xs sm:text-sm">
                  {item.title && (
                    <span className={`font-semibold font-halyard-text text-xs sm:text-sm ${item.title === 'Open today' ? 'text-green-600' : ''}`}>
                      {item.title}
                      {item.title === 'Open today' && (
                        <ChevronRight className="inline w-4 h-4 ml-1 text-green-600" />
                      )}
                    </span>
                  )}
                  {item.title && item.description && <br />}
                  {item.description && (
                    <span className="font-halyard-text-light text-[11px] sm:text-xs">{item.description}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isOperatingHoursOpen && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.2)] flex items-end justify-center z-50 animate-fade-in">
          <div 
            ref={modalRef}
            className="calendar-modal bg-white w-full max-w-4xl mx-4 mb-4 rounded-2xl shadow-2xl animate-slide-up max-h-[80vh] overflow-y-auto" 
            style={{ marginBottom: '20vh' }}
          >
            <div className="p-6">
              {/* Operating Hours Card with close button and no period selector */}
              <OperatingHoursCard
                title="Alcazar of Seville"
                operatingHours={[
                  {
                    hours: [
                      { day: "Monday", time: "09:30am - 07:00pm" },
                      { day: "Tuesday", time: "09:30am - 07:00pm" },
                      { day: "Wednesday", time: "09:30am - 07:00pm" },
                      { day: "Thursday", time: "09:30am - 07:00pm" },
                      { day: "Friday", time: "09:30am - 07:00pm" },
                      { day: "Saturday", time: "09:30am - 07:00pm" },
                      { day: "Sunday", time: "09:30am - 07:00pm" }
                    ]
                  }
                ]}
                showPeriodSelector={false}
                onClose={() => setIsOperatingHoursOpen(false)}
              />
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