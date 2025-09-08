"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import "flag-icons/css/flag-icons.min.css";

const countries = [
  { name: "Pakistan", code: "PK", dial_code: "+92" },
  { name: "South Africa", code: "ZA", dial_code: "+27" },
  { name: "United States", code: "US", dial_code: "+1" },
  { name: "United Kingdom", code: "GB", dial_code: "+44" },
  { name: "Italy", code: "IT", dial_code: "+39" },
  { name: "Afghanistan", code: "AF", dial_code: "+93" },
  { name: "Albania", code: "AL", dial_code: "+355" },
  { name: "Algeria", code: "DZ", dial_code: "+213" },
  { name: "American Samoa", code: "AS", dial_code: "+1684" },
  { name: "Andorra", code: "AD", dial_code: "+376" },
  { name: "Angola", code: "AO", dial_code: "+244" },
  { name: "Argentina", code: "AR", dial_code: "+54" },
  { name: "Australia", code: "AU", dial_code: "+61" },
];

const CountryCodeSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-28" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full h-full px-3 py-2 border-r text-sm"
      >
        <span className={`fi fi-${selectedCountry.code.toLowerCase()}`}></span>
        <span className="font-mono">{selectedCountry.dial_code}</span>
        <ChevronDown
          size={16}
          className={`text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto custom-scrollbar">
          <ul>
            {countries.map((country) => (
              <li
                key={country.code}
                onClick={() => {
                  setSelectedCountry(country);
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                <span className={`fi fi-${country.code.toLowerCase()}`}></span>
                <span>{country.name}</span>
                <span className="ml-auto font-mono text-gray-500">
                  {country.dial_code}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CountryCodeSelector;
