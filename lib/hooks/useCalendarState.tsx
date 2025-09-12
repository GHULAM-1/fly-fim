"use client";
import { createContext, useContext, useState, ReactNode } from 'react';

interface CalendarContextType {
  isCalendarOpen: boolean;
  setCalendarOpen: (open: boolean) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider = ({ children }: { children: ReactNode }) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const setCalendarOpen = (open: boolean) => {
    setIsCalendarOpen(open);
  };

  return (
    <CalendarContext.Provider value={{ isCalendarOpen, setCalendarOpen }}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendarState = () => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendarState must be used within a CalendarProvider');
  }
  return context;
};
