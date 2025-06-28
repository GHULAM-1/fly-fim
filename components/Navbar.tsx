"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { CircleHelp, Search, ArrowLeft } from "lucide-react";
import { Input } from "./ui/input";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerClose,
  DrawerTrigger,
} from "./ui/drawer";
import LanguageCurrencyDropdown from "./LanguageCurrencyDropdown";
import { AuthDialog } from "./auth/AuthDialog";
import { UserDropdown } from "./UserDropdown";
import { useAuth } from "@/lib/hooks/useAuth";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, loading } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Top destinations data
  const topDestinations = [
    {
      id: 1,
      name: "Dubai",
      country: "United Arab Emirates",
      image: "/images/d4.jpg.avif",
    },
    {
      id: 2,
      name: "Abu Dhabi",
      country: "United Arab Emirates",
      image: "/images/d4.jpg.avif",
    },
    {
      id: 3,
      name: "Chiang Mai",
      country: "Thailand",
      image: "/images/d3.jpg.avif",
    },
  ];

  // Top activities data
  const topActivities = [
    {
      id: 1,
      title: "London Theatre Tickets",
      location: "London, United Kingdom",
      image: "/images/a1.jpg.avif",
    },
    {
      id: 2,
      title: "Dubai Desert Safari Tours",
      location: "Dubai, United Arab Emirates",
      image: "/images/a2.jpg.avif",
    },
    {
      id: 3,
      title: "Vatican Museums",
      location: "Rome, Italy",
      image: "/images/a3.png.avif",
    },
    {
      id: 4,
      title: "Disneyland® Paris Tickets",
      location: "Paris, France",
      image: "/images/a4.jpg.avif",
    },
  ];

  // Filter function for search
  const filterResults = (items: any[], query: string) => {
    if (!query) return items;
    return items.filter(
      (item) =>
        (item.name && item.name.toLowerCase().includes(query.toLowerCase())) ||
        (item.title &&
          item.title.toLowerCase().includes(query.toLowerCase())) ||
        (item.country &&
          item.country.toLowerCase().includes(query.toLowerCase())) ||
        (item.location &&
          item.location.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const filteredDestinations = filterResults(topDestinations, searchQuery);
  const filteredActivities = filterResults(topActivities, searchQuery);

  // Mobile search drawer content
  const SearchDrawerContent = () => (
    <DrawerContent className="h-full max-h-[90vh]">
      <DrawerTitle className="bg-white p-4">
        <div className="flex items-center border border-black rounded-md">
          <DrawerClose asChild>
            <button className="p-2">
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
          </DrawerClose>
          <div className="flex-1">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 border-none px-2 text-base focus:border-gray-400 focus-visible:ring-0"
              autoFocus
            />
          </div>
        </div>
      </DrawerTitle>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {!searchQuery ? (
          <>
            {/* Top destinations near you */}
            <div className="mb-4">
              <h3 className="text-xs font-medium text-gray-600 mb-2 px-2">
                Top destinations near you
              </h3>
              <div className="space-y-0">
                {topDestinations.map((dest, index) => (
                  <div key={dest.id}>
                    <div className="flex items-center gap-2 py-3 px-2 cursor-pointer">
                      <div className="w-10 h-10 rounded overflow-hidden">
                        <img
                          src={dest.image}
                          alt={dest.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">
                          {dest.name}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {dest.country}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top things to do worldwide */}
            <div className="mb-4">
              <h3 className="text-xs font-medium text-gray-600 mb-2 px-2">
                Top things to do worldwide
              </h3>
              <div className="space-y-0">
                {topActivities.map((activity, index) => (
                  <div key={activity.id}>
                    <div className="flex items-center gap-2 py-3 px-2 cursor-pointer">
                      <div className="w-10 h-10 rounded overflow-hidden">
                        <img
                          src={activity.image}
                          alt={activity.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">
                          {activity.title}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {activity.location}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Search Results */}
            {filteredDestinations.length > 0 && (
              <div className="mb-4">
                <h3 className="text-xs font-medium text-gray-600 mb-2 px-2">
                  Destinations ({filteredDestinations.length})
                </h3>
                <div className="space-y-0">
                  {filteredDestinations.map((dest) => (
                    <div key={dest.id}>
                      <div className="flex items-center gap-2 py-3 px-2 cursor-pointer">
                        <div className="w-10 h-10 rounded overflow-hidden">
                          <img
                            src={dest.image}
                            alt={dest.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">
                            {dest.name}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {dest.country}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filteredActivities.length > 0 && (
              <div className="mb-4">
                <h3 className="text-xs font-medium text-gray-600 mb-2 px-2">
                  Activities ({filteredActivities.length})
                </h3>
                <div className="space-y-0">
                  {filteredActivities.map((activity) => (
                    <div key={activity.id}>
                      <div className="flex items-center gap-2 py-3 px-2 cursor-pointer">
                        <div className="w-10 h-10 rounded overflow-hidden">
                          <img
                            src={activity.image}
                            alt={activity.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">
                            {activity.title}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {activity.location}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filteredDestinations.length === 0 &&
              filteredActivities.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-500">
                    No results found for "{searchQuery}"
                  </div>
                </div>
              )}
          </>
        )}
      </div>
    </DrawerContent>
  );

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full z-50 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-28 py-5 transition-all duration-300 ${
          scrolled
            ? "bg-white border-b border-gray-200 text-black"
            : "text-white"
        }`}
      >
        <div className="flex justify-between items-center max-w-screen-2xl mx-auto">
          <img
            src="/images/logo.png"
            alt="logo"
            className={`w-24 sm:w-32 ${scrolled ? "" : "invert"}`}
          />
          {scrolled && (
            <div
              ref={searchRef}
              className="relative hidden lg:flex items-center bg-zinc-100 border min-w-xs xl:min-w-sm border-gray-200 gap-2 rounded-md py-2 px-4"
            >
              <Input
                className="bg-transparent border-none focus-visible:ring-0 shadow-none"
                placeholder={searchQuery || "Search for experiences and cities"}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
              />
              <Search strokeWidth={1} />
              {isSearchOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto">
                  {/* Top destinations */}
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-600 mb-3">
                      Top destinations near you
                    </h3>
                    <div className="space-y-0">
                      {(searchQuery
                        ? filteredDestinations
                        : topDestinations
                      ).map((dest) => (
                        <div
                          key={dest.id}
                          className="flex items-center gap-3 py-3 hover:bg-gray-50 cursor-pointer rounded-lg px-2"
                          onClick={() => {
                            setSearchQuery(dest.name);
                            setIsSearchOpen(false);
                          }}
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={dest.image}
                              alt={dest.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 text-sm">
                              {dest.name}
                            </div>
                            <div className="text-gray-500 text-sm">
                              {dest.country}
                            </div>
                          </div>
                        </div>
                      ))}

                      {searchQuery && filteredDestinations.length === 0 && (
                        <div className="py-3 px-2 text-gray-500 text-sm text-center">
                          No destinations found for "{searchQuery}"
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="hidden md:flex items-center gap-6">
            <LanguageCurrencyDropdown scrolled={scrolled} />
            <Link
              href="/help"
              className="text-sm font-medium flex items-center gap-1"
            >
              <CircleHelp strokeWidth={1} size={16} />
              Help
            </Link>

            {loading ? (
              // Loading state
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            ) : user ? (
              // Authenticated state - show user dropdown
              <UserDropdown user={user} scrolled={scrolled} />
            ) : (
              // Unauthenticated state - show sign in button
              <button
                onClick={() => setAuthDialogOpen(true)}
                className={`border ${
                  scrolled ? "" : "border-white"
                } rounded-md py-1.5 px-3 text-sm font-medium`}
              >
                Sign in
              </button>
            )}
          </div>
          <div className="md:hidden flex items-center gap-4">
            {/* Mobile Search Drawer */}
            <Drawer
              open={isSearchDrawerOpen}
              onOpenChange={setIsSearchDrawerOpen}
            >
              <DrawerTrigger asChild>
                <button>
                  <Search size={16} />
                </button>
              </DrawerTrigger>
              <SearchDrawerContent />
            </Drawer>

            <LanguageCurrencyDropdown scrolled={scrolled} />
          </div>
        </div>
      </div>

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  );
};

export default Navbar;
