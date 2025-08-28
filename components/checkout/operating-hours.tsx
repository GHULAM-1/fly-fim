import { useState } from "react";

interface OperatingHoursCardProps {
  title: string;
  operatingHours: {
    period?: string;
    hours: {
      day: string;
      time: string;
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
  const currentDate = new Date();
  const currentDay = currentDate.toLocaleDateString('en-US', { weekday: 'long' });

  // If not showing period selector, just use the first period
  const currentPeriod = showPeriodSelector 
    ? operatingHours.find(op => op.period === selectedPeriod) || operatingHours[0]
    : operatingHours[0];

  return (
    <div className="border border-gray-200 rounded-xl p-5 font-halyard-text">
      {/* Header with close button or dropdown */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-[#222222] font-halyard-text">{title}: Operating hours</h4>
        
        {showPeriodSelector ? (
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="font-halyard-text bg-white rounded-lg px-3 py-1.5 text-sm text-[#444444] hover:bg-gray-100 cursor-pointer transition-colors duration-150 focus:border-transparent"
          >
            {operatingHours.map((op) => (
              <option key={op.period} value={op.period} className="font-halyard-text">
                {op.period}
              </option>
            ))}
          </select>
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
        {currentPeriod?.hours.map((hour, index) => (
          <div
            key={index}
            className={`flex justify-between items-center py-1 ${
              hour.day === currentDay ? 'text-purple-600 font-medium' : 'text-gray-900'
            }`}
          >
            <span>{hour.day}</span>
            <span>{hour.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OperatingHoursCard;