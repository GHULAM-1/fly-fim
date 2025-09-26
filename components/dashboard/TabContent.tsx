"use client";
import React from "react";

interface TabContentProps {
  activeTab: string;
}

// Import individual tab components
import Experiences from "./Experiences";
import Cities from "./Cities";
import Subcategories from "./Subcategories";
import Users from "./Users";
import Bookings from "./Bookings";

const TabContent = ({ activeTab }: TabContentProps) => {
  const renderContent = () => {
    switch (activeTab) {
      case "experiences":
        return <Experiences />;
      case "cities":
        return <Cities />;
      case "subcategories":
        return <Subcategories />;
      case "users":
        return <Users />;
      case "bookings":
        return <Bookings />;
      // Add more cases as you create more tab components
      // case "analytics":
      //   return <Analytics />;
      // case "settings":
      //   return <Settings />;
      default:
        return <Experiences />;
    }
  };

  return (
    <div className="flex-1 overflow-hidden">
      {renderContent()}
    </div>
  );
};

export default TabContent;