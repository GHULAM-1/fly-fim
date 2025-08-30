"use client";
import React, { useState } from "react";
import { Calendar } from "lucide-react";

const DateSelection = () => {
  const [selectedDate, setSelectedDate] = useState("Sep 21");

  const dates = [
    { day: "Fri", date: "Sep 19", price: "$39.2" },
    { day: "Sat", date: "Sep 20", price: "$39.2" },
    { day: "Sun", date: "Sep 21", price: "$39.2" },
    { day: "Mon", date: "Sep 22", price: "$39.2" },
    { day: "Tue", date: "Sep 23", price: "$39.2" },
    { day: "Wed", date: "Sep 24", price: "$39.2" },
    { day: "Thu", date: "Sep 25", price: "$39.2" },
  ];

  return (
    <section className="mb-10">
      <div>
        <h2 className="text-2xl  text-gray-800 mb-1">Select a date</h2>
        <p className="text-sm text-gray-500">All prices are in USD ($)</p>
      </div>
      <div className="mt-4">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {dates.map((d) => (
            <button
              key={d.date}
              onClick={() => setSelectedDate(d.date)}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border w-24 flex-shrink-0 transition-colors duration-200 cursor-pointer ${
                selectedDate === d.date
                  ? "border-purple-600 bg-purple-50 text-purple-700"
                  : "border-gray-300 bg-white text-gray-700 hover:border-purple-300"
              }`}
            >
              <span className="text-xs ">{d.day}</span>
              <span
                className={` mt-1 ${
                  selectedDate === d.date ? "text-purple-700" : "text-gray-900"
                }`}
              >
                {d.date}
              </span>
              <span className="text-xs mt-1">{d.price}</span>
            </button>
          ))}
          <button className="flex flex-col items-center justify-center p-3 rounded-lg border border-gray-300 bg-white w-24 flex-shrink-0 hover:border-purple-300 transition-colors duration-200 h-[88px]">
            <Calendar size={20} className="text-purple-600" />
            <span className="text-xs  mt-2 text-purple-600">
              More dates
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default DateSelection;
