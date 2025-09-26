"use client";
import React from "react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const menuItems = [
    {
      id: "experiences",
      name: "EXPERIENCES",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      ),
    },
    {
      id: "cities",
      name: "CITIES",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
    {
      id: "subcategories",
      name: "SUBCATEGORIES",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
      ),
    },
    {
      id: "users",
      name: "USERS",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m9 5.197v1M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    {
      id: "bookings",
      name: "BOOKINGS",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
    },
    // Add more menu items as needed
  ];

  return (
    <div className="w-64 bg-purple-600 text-white flex flex-col h-full">
      <div className="px-6 py-4 flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img
            src="/images/white-logo-re.png"
            alt="logo"
            className="w-24 sm:w-32 py-2"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-6 pb-4 bg-purple-600 overflow-y-auto">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer ${
                activeTab === item.id ? "bg-purple-700" : "hover:bg-purple-500"
              }`}
              onClick={() => onTabChange(item.id)}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;