import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const TravelGuides = () => {
  const guides = [
    {
      id: 1,
      image: "/images/d3.jpg.avif",
      title:
        "Discover 8 Million Works of Art & History With These British Museum Tours in London",
      description:
        "It is commonly said that when you are in London, you are never too far away from a museum. With over 150 museums, galleries...",
      href: "#",
    },
    {
      id: 2,
      image: "/images/r1.jpg.avif",
      title: "Madame Tussauds London: Where legends come to life",
      description:
        "Madame Tussauds London will take you on an immersive journey, that you can only find in London. Having recently gone under major...",
      href: "#",
    },
    {
      id: 3,
      image: "/images/d4.jpg.avif",
      title:
        "Churchill's hidden headquarters: A must-visit London historical site",
      description:
        "London's packed with museums, but there's one hidden gem that played a crucial role in Britain's WWII victory. Tucked away in central...",
      href: "#",
    },
    {
      id: 4,
      image: "/images/d2.jpg.avif",
      title: "Best museums in London that should be on your itinerary",
      description:
        "There's no shortage of museums in London – from world-famous institutions like the British Museum to more niche offerings like...",
      href: "#",
    },
  ];

  return (
    <div className="py-10 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-28 max-w-screen-2xl mx-auto 2xl:px-0">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-[#444444]">
          Travel guides and tips
        </h2>
        <div className="hidden sm:flex items-center gap-2">
          <div className="border rounded-full p-2 cursor-pointer transition-colors">
            <ChevronLeft size={20} className="text-gray-600" />
          </div>
          <div className="border rounded-full p-2 cursor-pointer transition-colors">
            <ChevronRight size={20} className="text-gray-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {guides.map((guide) => (
          <Link key={guide.id} href={guide.href} className="group w-full">
            {/* Mobile Layout - Horizontal */}
            <div className="flex sm:hidden gap-4 border-b pb-4">
              <img
                src={guide.image}
                alt={guide.title}
                className="w-32 h-20 rounded-xl object-cover group-hover:scale-105 transition-transform duration-300 flex-shrink-0"
              />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-2 leading-tight line-clamp-2">
                  {guide.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                  {guide.description}
                </p>
              </div>
            </div>

            {/* Desktop Layout - Vertical */}
            <div className="hidden sm:block">
              <img
                src={guide.image}
                alt={guide.title}
                className="w-full rounded-xl h-60 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="mt-3">
                <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight line-clamp-2">
                  {guide.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                  {guide.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TravelGuides;
