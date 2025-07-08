"use client";
import React from "react";

const Highlights = () => {
  const highlights = [
    "Soar above on the London Eye and enjoy a relaxing one-way cruise along the River Thames – the perfect budget-friendly combo to see London from every angle.",
    "Just a 0.1 km stroll from the Waterloo Pier to the London Eye! Start with a relaxing Thames cruise or head straight up for city views—up to you!",
    "Step into a climate-controlled capsule on a 30-min ride 135m high for views of the Houses of Parliament, Big Ben, Buckingham Palace, and more.",
    "Glide past landmarks like Tower Bridge on your cruise with onboard commentary and flexible boarding from Westminster, Tower, or London Eye piers.",
    "Don't let queues steal your time and upgrade to fast-track access in the next step and save 30 mins for soaking up the views instead!",
  ];

  return (
    <div className="my-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Highlights</h2>

      <ul className="space-y-4">
        {highlights.map((highlight, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <span className="text-gray-700 leading-relaxed">{highlight}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Highlights;
