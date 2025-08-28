import React, { useState, useEffect } from 'react';

const AvailabilityChecker = () => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 7)); // August 2025
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  const openCalendar = () => {
    setIsCalendarOpen(true);
  };
  
  const closeCalendar = () => {
    setIsCalendarOpen(false);
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };
  
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };
  
  const selectDate = (date: Date) => {
    setSelectedDate(date);
    closeCalendar();
  };
  
  const formatDate = (date: Date | null) => {
    if (!date) return "Select a date";
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days: (Date | null)[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };
  
  const getCurrentMonthDays = () => getDaysInMonth(currentMonth);
  const getNextMonthDays = () => getDaysInMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  
  // Handle click outside calendar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isCalendarOpen && !(event.target as Element).closest('.calendar-modal')) {
        closeCalendar();
      }
    };
    
    if (isCalendarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isCalendarOpen]);
  
interface CalendarGridProps {
  days: (Date | null)[];
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ days }) => (
  <div className="mb-4"> {/* Reduced margin from mb-6 to mb-4 */}
    <div className="grid grid-cols-7 gap-2 mb-2"> {/* Reduced margin from mb-3 to mb-2 */}
      {dayNames.map(day => (
        <div key={day} className="text-center text-sm font-medium text-gray-500 py-2 font-halyard-text">
          {day}
        </div>
      ))}
    </div>
    
    <div className="grid grid-cols-7 gap-2">
      {days.map((date, index) => {
        if (!date) {
          return <div key={index} className="h-12"></div>;
        }
        
        const isToday = date.toDateString() === new Date().toDateString();
        const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
        const isPastAugust = date < new Date(2025, 7, 29);
        
        return (
          <button
            key={index}
            onClick={() => !isPastAugust && selectDate(date)}
            disabled={isPastAugust}
            className={`h-12 rounded-lg text-sm font-medium relative transition-colors duration-150 font-halyard-text
              ${isPastAugust 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'hover:bg-gray-100 cursor-pointer text-gray-700'
              }
              ${isSelected ? 'bg-purple-600 text-white hover:bg-purple-700' : ''}
              ${isToday && !isSelected ? 'bg-gray-100 font-bold' : ''}
            `}
          >
            <div className="flex flex-col items-center justify-center h-full">
              <span>{date.getDate()}</span>
              {!isPastAugust && (
                <span className="text-xs text-green-600 font-medium">€49.5</span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  </div>
);
  
  return (
    <div className="relative">
      {/* Main Card */}
      <div className="w-full max-w-sm bg-white rounded-lg p-4 border border-gray-200">
        <div className="mb-4">
          <div className="text-gray-500 text-sm font-halyard-text">
            from <span className="line-through">€55</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-3xl font-halyard-text font-bold text-gray-900">€49.50</span>
            <span className="bg-green-600 text-white text-xs font-semibold font-halyard-text rounded px-2 py-1">
              10% off
            </span>
          </div>
        </div>
        
        <div className="mb-4">
          <button
            onClick={openCalendar}
            className="w-full rounded-lg border border-gray-300 text-left flex items-center overflow-hidden hover:border-gray-400 transition-colors duration-150"
          >
            <span className="text-sm text-gray-600 font-halyard-text py-3 px-4 flex-1">
              {formatDate(selectedDate)}
            </span>
            <div className="bg-gray-100 h-12 flex items-center justify-center px-3">
              <svg 
                className="w-4 h-4 text-gray-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 9l-7 7-7-7" 
                />
              </svg>
            </div>
          </button>
        </div>
        
        <button 
          onClick={openCalendar}
          className="w-full py-3 bg-purple-600 text-white font-semibold font-halyard-text rounded-xl text-base hover:bg-purple-700 transition-colors duration-200"
        >
          Check availability
        </button>
      </div>
      
      {/* Calendar Modal */}
{isCalendarOpen && (
  <div className="fixed inset-0 bg-[rgba(0,0,0,0.2)] flex items-end justify-center z-50 animate-fade-in">
    <div className="calendar-modal bg-white w-full max-w-4xl mx-4 mb-4 rounded-2xl shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        {/* Navigation Buttons and Month Names in Same Row */}
        <div className="grid md:grid-cols-2 gap-8 mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={prevMonth}
              className={`p-2 rounded-full transition-colors duration-150 ${
                currentMonth.getMonth() === 6 && currentMonth.getFullYear() === 2025
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              disabled={currentMonth.getMonth() === 6 && currentMonth.getFullYear() === 2025}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h3 className="text-lg font-semibold text-gray-800 font-halyard-text">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <div className="w-7"></div> {/* Spacer for alignment */}
          </div>
          <div className="flex items-center justify-between">
            <div className="w-7"></div> {/* Spacer for alignment */}
            <h3 className="text-lg font-semibold text-gray-800 font-halyard-text">
              {monthNames[new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1).getMonth()]} {new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1).getFullYear()}
            </h3>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-150 text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Calendar Grids */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <CalendarGrid days={getCurrentMonthDays()} />
          </div>
          <div>
            <CalendarGrid days={getNextMonthDays()} />
          </div>
        </div>

        {/* Visual Separator and Footer Text */}
        <div className="mt-6">
          <div className="border-t border-gray-200 border-solid w-full"></div>
          <p className="text-xs text-gray-500 font-halyard-text text-left mt-3">All prices are in EUR (€)</p>
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
    </div>
  );
};

export default AvailabilityChecker;