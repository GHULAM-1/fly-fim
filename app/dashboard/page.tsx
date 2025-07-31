"use client";
import React, { useState } from "react";
import { Search, Plus, ChevronDown, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface Experience {
  id: string;
  name: string;
  experienceId?: string;
  referenceCode: string;
  status: "Available" | "Unavailable" | "Under Curation" | "Draft" | "Disabled";
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("All experiences");
  const [searchQuery, setSearchQuery] = useState("");

  const experiences: Experience[] = [
    {
      id: "1",
      name: "Test",
      experienceId: "13824",
      referenceCode: "test",
      status: "Unavailable",
    },
    { id: "2", name: "Manual", referenceCode: "test", status: "Unavailable" },
    { id: "3", name: "Freesale", referenceCode: "test", status: "Unavailable" },
    {
      id: "4",
      name: "Vendor request",
      referenceCode: "test",
      status: "Available",
    },
    {
      id: "5",
      name: "Vendor API",
      referenceCode: "test",
      status: "Unavailable",
    },
    { id: "6", name: "ASM", referenceCode: "ASM", status: "Unavailable" },
    {
      id: "7",
      name: "Test-Anas 123",
      experienceId: "16768",
      referenceCode: "Test-Anas-2nd",
      status: "Unavailable",
    },
    {
      id: "8",
      name: "English Group Tour",
      referenceCode: "Test-Anas-2nd",
      status: "Unavailable",
    },
    {
      id: "9",
      name: "Torre Glories",
      referenceCode: "Test-Anas-2nd",
      status: "Unavailable",
    },
    {
      id: "10",
      name: "Cloud Cities",
      referenceCode: "Cloud Cities",
      status: "Available",
    },
  ];

  const tabs = [
    { name: "All experiences", count: null },
    { name: "Available", count: 3 },
    { name: "Under Curation", count: 14 },
    { name: "Draft", count: 41 },
    { name: "Disabled", count: 3 },
    { name: "Unavailable", count: 36 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-500";
      case "Unavailable":
        return "bg-red-500";
      case "Under Curation":
        return "bg-yellow-500";
      case "Draft":
        return "bg-gray-500";
      case "Disabled":
        return "bg-gray-400";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto  xl:px-0 flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-purple-600 text-white">
        <div className="px-6">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img
              src="/images/white-logo-re.png"
              alt="logo"
              className="w-24 sm:w-32 py-2"
            />{" "}
            
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <div className="flex items-center space-x-3 px-4 py-3 bg-purple-700 rounded-lg">
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
              <span className="font-medium">EXPERIENCES</span>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white flex-1 flex flex-col pl-10">
        {/* Top Bar */}
        <div className=" border-b border-gray-200">
          <div className="max-w-[1200px] mx-auto px-[24px] xl:px-0 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search your experiences"
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  New Experience
                </Button>
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-[1200px] mx-auto px-[24px] xl:px-0">
            <div className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.name
                      ? "border-purple-600 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.name}
                  {tab.count !== null && (
                    <Badge
                      variant="secondary"
                      className="ml-2 bg-gray-100 text-gray-600"
                    >
                      {tab.count}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Experiences Table */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-[1200px] mx-auto px-[24px] xl:px-0 py-6">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        EXPERIENCES
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        YOUR REFERENCE CODE
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        STATUS
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ACTION
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {experiences.map((experience) => (
                      <tr key={experience.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {experience.name}
                              </div>
                              {experience.experienceId && (
                                <div className="text-sm text-gray-500">
                                  Experience ID: {experience.experienceId}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {experience.referenceCode}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(
                                experience.status
                              )}`}
                            ></div>
                            <span className="text-sm text-gray-900">
                              {experience.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center space-x-1"
                          >
                            <span>Manage</span>
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Button */}
      <div className="fixed bottom-6 right-6">
        <Button className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 p-0">
          <MessageCircle className="w-5 h-5 text-white" />
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
