import React from "react";
import { ChevronRight, Users, Palette, Baby } from "lucide-react";
import Link from "next/link";

const PopularThings = () => {
  const popularItems = [
    {
      id: 1,
      badge: "1",
      category: "Couples, Families",
      categoryIcon: Users,
      title: "Madame Tussauds London",
      description:
        "Meet celebrities at Madame Tussauds, London. Dive into lifelike wax figures and interactive experiences. Secure your tickets for a star-studded visit.",
      price: "from £ 29",
      image: "/images/r1.jpg.avif",
    },
    {
      id: 2,
      badge: "2",
      category: "Art & Culture Lovers",
      categoryIcon: Palette,
      title: "The British Museum",
      description:
        "Explore the British Museum's global cultures. Dive into traditions and enjoy British afternoon tea at the Great Court Restaurant. Sip tea, savor sandwiches, sweet ...",
      price: "from £ 4",
      image: "/images/r2.jpg.avif",
    },
    {
      id: 3,
      badge: "3",
      category: "Family Fun",
      categoryIcon: Baby,
      title: "Paddington Bear Experience",
      description:
        "Explore Paddington Bear's world in London, in this multi-room, immersive experience that takes you through familiar locations, stories, and gameplay. ...",
      price: "from £ 34",
      image: "/images/r3.jpg.avif",
    },
  ];

  return (
    <div className="py-4 sm:py-10 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-28 max-w-screen-2xl mx-auto 2xl:px-0">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-heading text-[#444444]">
          Popular things to do
        </h2>
        <div className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 cursor-pointer transition-colors">
          <ChevronRight size={20} className="text-gray-600" />
        </div>
      </div>

      {/* Mobile - Horizontal Scroll */}
      <div className="lg:hidden overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 pb-2">
          {popularItems.map((item) => {
            const CategoryIcon = item.categoryIcon;
            return (
              <Link
                key={item.id}
                href="#"
                className="group block flex-shrink-0"
              >
                <div className="relative rounded-2xl overflow-hidden w-72 h-48 bg-black">
                  {/* Background Image */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

                  {/* Flag-style Number Badge */}
                  <div className="absolute top-0 left-0 z-10">
                    <div className="relative">
                      <div className="bg-pink-600 text-white font-bold text-sm px-3 py-1.5 relative">
                        {item.badge}
                        {/* Flag tail */}
                        <div className="absolute top-full left-0 w-0 h-0 border-l-[12px] border-l-pink-600 border-b-[6px] border-b-transparent"></div>
                      </div>
                    </div>
                  </div>

                  {/* Content at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10">
                    {/* Category with icon */}
                    <div className="flex items-center gap-1.5 mb-2">
                      <CategoryIcon size={14} className="text-white" />
                      <span className="text-xs font-medium text-white">
                        {item.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold mb-2 text-white leading-tight line-clamp-2">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-white/90 mb-2 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>

                    {/* Price */}
                    <div className="text-base font-bold text-white">
                      {item.price}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Desktop - Grid Layout */}
      <div className="hidden lg:grid grid-cols-3 gap-6">
        {popularItems.map((item) => {
          const CategoryIcon = item.categoryIcon;
          return (
            <Link key={item.id} href="#" className="group block">
              <div className="relative rounded-2xl overflow-hidden aspect-[3/2] bg-black">
                {/* Background Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

                {/* Flag-style Number Badge */}
                <div className="absolute top-0 left-0 z-10">
                  <div className="relative">
                    <div className="bg-pink-600 text-white font-bold text-lg px-4 py-2 relative">
                      {item.badge}
                      {/* Flag tail */}
                      <div className="absolute top-full left-0 w-0 h-0 border-l-[16px] border-l-pink-600 border-b-[8px] border-b-transparent"></div>
                    </div>
                  </div>
                </div>

                {/* Content at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                  {/* Category with icon */}
                  <div className="flex items-center gap-2 mb-3">
                    <CategoryIcon size={16} className="text-white" />
                    <span className="text-sm font-medium text-white">
                      {item.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold mb-3 text-white leading-tight">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-white/90 mb-4 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>

                  {/* Price */}
                  <div className="text-xl font-bold text-white">
                    {item.price}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default PopularThings;
