import { useState, useRef, useEffect } from "react";

interface OperatingHoursCardProps {
  title: string;
  operatingHours: {
    period?: string;
    hours: {
      day: string;
      time: string;
      lastEntry?: string;
      isToday?: boolean;
    }[];
  }[];
  showPeriodSelector?: boolean;
  onClose?: () => void;
}

const OperatingHoursCard: React.FC<OperatingHoursCardProps> = ({ 
  title, 
  operatingHours, 
  showPeriodSelector = true,
  onClose 
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState(operatingHours[0]?.period || '');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentDate = new Date();
  const currentDay = currentDate.toLocaleDateString('en-US', { weekday: 'long' });

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // If not showing period selector, just use the first period
  const currentPeriod = showPeriodSelector 
    ? operatingHours.find(op => op.period === selectedPeriod) || operatingHours[0]
    : operatingHours[0];

  return (
    <div className="rounded-xl p-2 font-halyard-text">
      {/* Header with close button or dropdown */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-[#222222] font-halyard-text">{title}: Operating hours</h4>
        
        {showPeriodSelector ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between bg-white hover:cursor-pointer border-gray-300 rounded-lg px-3 py-2 text-sm text-[#444444] hover:bg-gray-50 cursor-pointer transition-colors duration-150 min-w-[200px]"
            >
              <span className="font-halyard-text">{selectedPeriod}</span>
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                {operatingHours.map((op) => (
                  <button
                    key={op.period}
                    onClick={() => {
                      setSelectedPeriod(op.period || '');
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm font-halyard-text hover:bg-gray-50 transition-colors duration-150 ${
                      selectedPeriod === op.period 
                        ? 'bg-purple-100 text-purple-700 font-medium' 
                        : 'text-[#444444]'
                    }`}
                  >
                    {op.period}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-150"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )
        )}
      </div>

      {/* Separator line */}
      <div className="border-t border-gray-200 mb-4"></div>

      {/* Operating hours table */}
      <div className="space-y-1 text-sm font-halyard-text-light text-[#444444]">
        {currentPeriod?.hours
          .filter(hour => hour.time !== 'Closed' && hour.time !== 'N/A' && hour.time)
          .map((hour, index) => (
            <div
              key={index}
              className={`grid grid-cols-3 gap-4 py-2 ${
                hour.day === currentDay ? 'text-purple-600 font-medium' : 'text-gray-900'
              }`}
            >
              <span>{hour.day}</span>
              <span>{hour.time}</span>
              <span>last entry {hour.lastEntry || 'N/A'}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default OperatingHoursCard;