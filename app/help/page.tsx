"use client";
import React, { useState } from "react";
import { Search, X } from "lucide-react";
import CategoriesDropdown from "@/components/category/CategoriesDropdown";

export default function Help() {
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Mock search data
  const mockSearchData = [
    "Flyfim in different languages & currencies",
    "Changing tour options",
    "Rescheduling a reservation",
    "Payment methods",
    "How to cancel a booking",
    "Refund policy",
    "Booking confirmation",
    "Mobile app download",
    "Customer support contact",
    "Group bookings",
    "Travel insurance",
    "Voucher redemption",
    "Last minute bookings",
    "Weather policy",
    "Age restrictions"
  ];

  const filteredResults = mockSearchData.filter(item =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSearchResults(value.length > 0);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const handleResultClick = (result: string) => {
    setSearchQuery(result);
    setShowSearchResults(false);
  };
  return (
    <div className="">
      <div className="hidden md:block fixed md:top-19 bg-[#fff] w-full py-3 z-40 border-b">
          <CategoriesDropdown
            showCategoriesDropdown={showCategoriesDropdown}
            setShowCategoriesDropdown={setShowCategoriesDropdown}
            setShowBanner={setShowBanner}
          />
      </div>

      {/* Hero Section - Mobile: Full width, Desktop: Container */}
      <div className="md:hidden mt-[75px]">
        <div className="relative font-halyard-text overflow-hidden">
          <div
            className="relative md:px-[24px] px-[16px] py-[16px] md:py-[32px]"
            style={{
              background:
                "radial-gradient(616.17% 161.3% at 50.13% 0, #f9f1ff00 0, #f9f1ff 100%)",
            }}
          >
            <div className="flex flex-col items-start justify-between gap-12">
              {/* Left Content */}
              <div className="flex-1 max-w-2xl">
                <h1 className="text-[18px] font-bold text-[#444444] mb-[2px] leading-tight">
                  Have an existing booking?
                </h1>
                <p className="text-[12px] text-[#444444] mb-4 leading-relaxed">
                  Sign in to view ticket, modify booking,<br /> or get help from our
                  team.
                </p>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-[7px] rounded-md  text-[14px] transition-colors duration-200">
                  Sign in
                </button>
              </div>

              {/* Right Image */}
              <div className="flex absolute -bottom-0 md:-bottom-5 right-3 md:right-5">
                <div className="relative">
                  <img
                    src="/help-2.png"
                    alt="Help illustration"
                    className="w-[145px] h-[118px] rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="font-halyard-text max-w-[1200px] mx-auto xl:px-0 px-[24px] bg-white md:mt-[102px]">

      {/* Hero Section - Desktop */}
      <div className="hidden md:block relative overflow-hidden">
        <div
          className="relative border rounded-[12px] mt-[50px] px-[24px] py-[32px]"
          style={{
            background:
              "radial-gradient(616.17% 161.3% at 50.13% 0, #f9f1ff00 0, #f9f1ff 100%)",
          }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center  justify-between gap-12">
            {/* Left Content */}
            <div className="flex-1 max-w-2xl">
              <h1 className="text-[28px] font-bold text-[#444444] mb-[2px] leading-tight">
                Have an existing booking?
              </h1>
              <p className="text-[15px] text-[#444444] mb-4 leading-relaxed">
                Sign in to view ticket, modify booking, or get help from our
                team.
              </p>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-[7px] rounded-md  text-[14px] transition-colors duration-200">
                Sign in
              </button>
            </div>

            {/* Right Image */}
            <div className="flex absolute -bottom-5 right-5">
              <div className="relative">
                <img
                  src="/help-image.png"
                  alt="Help illustration"
                  className="w-[280px] h-[176px] rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/** Faq Section */}
      <div>
        <div className="">
          <h2 className="md:text-[28px] md:block hidden mt-[32px] font-bold text-[#444444] mb-[22px]">
            Frequently asked questions
          </h2>
          <h2 className="md:hidden block text-[24px] mt-[32px] font-bold text-[#444444] mb-[22px]">
            FAQs
          </h2>
          
          {/* Search Section - positioned under FAQ title */}
          <div className="mb-8 md:w-[40%]">
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="What can we help you with?"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => {
                    setTimeout(() => setIsSearchFocused(false), 200);
                  }}
                  className="w-full pl-10 pr-13 py-3 border border-gray-200 rounded-[3px] text-[#444444] placeholder-[#666666] focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-transparent transition-all duration-200 placeholder:text-[15px]"
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400  transition-colors"
                  >
                    <X className="w-5 h-5" size={14}/>
                  </button>
                )}
              </div>
              
              {/* Search Results Dropdown */}
              {showSearchResults && filteredResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-0 bg-white border border-gray-200 rounded-b-[3px] shadow-lg z-50 max-h-44 overflow-y-auto">
                  {filteredResults.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => handleResultClick(result)}
                      className="w-full text-[15px] py-[12px] px-[16px] text-left text-[#444444] hover:cursor-pointer"
                    >
                      {result}
                    </button>
                  ))}
                </div>
              )}
              
              {/* No results message */}
              {showSearchResults && filteredResults.length === 0 && searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-0 bg-white border border-gray-200 rounded-b-[3px] shadow-lg z-50 p-4">
                  <p className="text-gray-500 text-center">No results found for "{searchQuery}"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/** Need help */}
      <div className="md:mt-24 mt-16 mb-[164px]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <h3 className="md:text-[28px] text-[22px] md:w-[30%] font-bold text-[#444444]">
            Still need help?
          </h3>
          
          <div className="flex flex-col w-full sm:flex-row md:gap-8 gap-2">
            <button className="px-[29px] w-full mt-2 py-[9px] md:py-[8px] border border-[#9f9f9f] rounded-md text-[#666666] text-[16px] md:text-[20px] font-medium hover:cursor-pointer min-w-[120px]">
              Email us
            </button>
            <button className="px-[29px] w-full mt-2 py-[9px] md:py-[8px] border border-[#9f9f9f] rounded-md text-[#666666] text-[16px] md:text-[20px] font-medium hover:cursor-pointer min-w-[120px]">
              Chat with us
            </button>
            <button className="px-[29px] w-full mt-2 py-[9px] md:py-[8px] border border-[#9f9f9f] rounded-md text-[#666666] text-[16px] md:text-[20px] font-medium hover:cursor-pointer min-w-[120px]">
              Call us
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
