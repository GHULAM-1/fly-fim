import React from 'react';
import { Clock, Calendar, BadgeCheck, CreditCard, Users } from 'lucide-react';

const ExperienceDetails: React.FC = () => {
  const details = [
    { icon: Clock, title: "Duration", description: "2 hr", color: "text-blue-600", bg: "bg-blue-100" },
    { icon: Calendar, title: "Open today", description: "9:30am - 7:00pm", color: "text-green-600", bg: "bg-green-100" },
    { icon: BadgeCheck, title: "Free cancellation", description: "Free cancellation up to 7 days before the start of your experience", color: "text-red-600", bg: "bg-red-100" },
    { icon: CreditCard, title: "Book now, pay later", description: "Book now without paying anything. Cancel for free if your plans change", color: "text-purple-600", bg: "bg-purple-100" },
    { icon: Users, title: "Guided tour", color: "text-teal-600", bg: "bg-teal-100" },
  ];

  return (
    <div className="experience-details max-w-4xl font-halyard-text text-left">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6 pb-4">
        {details.map((item, index) => {
          return (
            <div
              key={index}
              className="flex items-start min-h-[32px] sm:min-h-[44px] gap-2 sm:gap-3 text-xs sm:text-sm text-gray-700 w-full max-w-[280px]"
            >
              <span
                className={`flex items-center justify-center w-9 h-9 sm:w-9 sm:h-9 rounded-lg ${item.bg}`}
                style={{ padding: '8px' }}
              >
                <item.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${item.color}`} />
              </span>
              <div className="font-halyard-text text-xs sm:text-sm">
                {item.title && (
                  <span className="font-semibold font-halyard-text text-xs sm:text-sm">{item.title}</span>
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
  );
};

export default ExperienceDetails;