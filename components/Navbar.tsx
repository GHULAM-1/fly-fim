"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CircleHelp, Search } from "lucide-react";
import { Input } from "./ui/input";
import LanguageCurrencyDropdown from "./LanguageCurrencyDropdown";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <div
      className={`fixed top-0 left-0 flex justify-between items-center w-full z-50 px-8 md:px-16 lg:px-24 xl:px-28 py-5 transition-all duration-300 ${
        scrolled ? "bg-white border-b border-gray-200 text-black" : "text-white"
      }`}
    >
      <img
        src={scrolled ? "/images/logo.png" : "/images/logo-white.png"}
        alt="logo"
        className="w-36 sm:w-42"
      />
      {scrolled && (
        <div className="hidden lg:flex items-center bg-zinc-100 border min-w-xs xl:min-w-sm border-gray-200 gap-2 rounded-md py-2 px-4">
          <Input
            className="bg-transparent border-none focus-visible:ring-0 shadow-none"
            placeholder="Search for experiences and cities"
          />
          <Search strokeWidth={1} />
        </div>
      )}
      <div className="hidden md:flex items-center gap-6">
        <LanguageCurrencyDropdown scrolled={scrolled} />
        <Link
          href="/sign-in"
          className="text-sm font-medium flex items-center gap-1"
        >
          <CircleHelp strokeWidth={1} size={16} />
          Help
        </Link>
        <Link
          href="/sign-in"
          className={`border ${
            scrolled ? "" : "border-white"
          } rounded-md py-1.5 px-3 text-sm font-medium`}
        >
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
