import React from "react";

const PopularThings = () => {
  const popularTours = [
    {
      id: 1,
      badge: "1",
      title: "Harry Potter Walking Tours",
      description:
        "Step into the enchanting world of Harry Potter and discover the real-world inspirations behind the beloved stories. These captivating walking tours invite you to ...",
      price: "from £ 21",
      image: "/images/r1.jpg.avif",
    },
    {
      id: 2,
      badge: "2",
      title: "London Transport Museum",
      description:
        "Take a ride through history & step into the story of London's transportation evolution. Explore vintage vehicles and interactive exhibits with our London ...",
      price: "from £ 22.05",
      image: "/images/r2.jpg.avif",
    },
  ];

  return (
    <div className="py-4 sm:py-10 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-28 max-w-screen-2xl mx-auto 2xl:px-0">
      <h2 className="text-xl sm:text-2xl font-heading  text-[#444444] mb-6">
        Popular things to do
      </h2>

      {/* Mobile - Horizontal Scroll */}
      <div className="md:hidden overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 pb-2">
          {popularTours.map((tour) => (
            <div key={tour.id} className="group block flex-shrink-0">
              <div className="relative rounded-2xl overflow-hidden w-72 h-48 bg-black">
                {/* Background Image */}
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

                {/* Flag-style Number Badge */}
                <div className="absolute top-0 left-0 z-10">
                  <div className="relative">
                    <div className="bg-pink-600 text-white font-bold text-sm px-3 py-1.5 relative">
                      {tour.badge}
                      {/* Flag tail */}
                      <div className="absolute top-full left-0 w-0 h-0 border-l-[12px] border-l-pink-600 border-b-[6px] border-b-transparent"></div>
                    </div>
                  </div>
                </div>

                {/* Content at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10">
                  {/* Title */}
                  <h3 className="text-lg font-bold mb-2 text-white leading-tight line-clamp-2">
                    {tour.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-white/90 mb-2 leading-relaxed line-clamp-2">
                    {tour.description}
                  </p>

                  {/* Price */}
                  <div className="text-base font-bold text-white">
                    {tour.price}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop - Grid Layout */}
      <div className="hidden md:grid grid-cols-2 gap-6">
        {popularTours.map((tour) => (
          <div key={tour.id} className="group block">
            <div className="relative rounded-2xl overflow-hidden aspect-[3/2] bg-black">
              {/* Background Image */}
              <img
                src={tour.image}
                alt={tour.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

              {/* Flag-style Number Badge */}
              <div className="absolute top-0 left-0 z-10">
                <div className="relative">
                  <div className="bg-pink-600 text-white font-bold text-lg px-4 py-2 relative">
                    {tour.badge}
                    {/* Flag tail */}
                    <div className="absolute top-full left-0 w-0 h-0 border-l-[16px] border-l-pink-600 border-b-[8px] border-b-transparent"></div>
                  </div>
                </div>
              </div>

              {/* Content at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                {/* Title */}
                <h3 className="text-2xl font-bold mb-3 text-white leading-tight">
                  {tour.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-white/90 mb-4 leading-relaxed">
                  {tour.description}
                </p>

                {/* Price */}
                <div className="text-xl font-bold text-white">{tour.price}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularThings;
