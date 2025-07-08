import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerClose,
  DrawerTrigger,
} from "../ui/drawer";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { ArrowLeft } from "lucide-react";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
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

  const filteredDestinations = topDestinations.filter(
    (dest) =>
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredActivities = topActivities.filter(
    (activity) =>
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <div className="relative pt-20 md:pt-36 pb-4 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-28 max-w-screen-2xl mx-auto 2xl:px-0">
      <Swiper
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        modules={[Autoplay, Navigation, Pagination]}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        pagination={{
          clickable: true,
        }}
        className="mySwiper w-full rounded-2xl overflow-hidden mb-4"
      >
        <SwiperSlide className="rounded-2xl">
          <img
            src="https://cdn-imgix.headout.com/media/images/8515c147e2627c8da9f48f62c9bf254a-Harry%20Potter-Dweb.png?w=1800&h=750&crop=faces&auto=compress%2Cformat&fit=min"
            className="w-full h-[50vh] md:h-auto object-cover rounded-2xl"
          />
        </SwiperSlide>
        <SwiperSlide className="rounded-2xl">
          <img
            src="https://cdn-imgix.headout.com/media/images/d8700da23f2d351a6f107c1f67da371b-Mean%20Girls%20London%20promo%20banner%20desktop.png?w=1800&h=750&crop=faces&auto=compress%2Cformat&fit=min"
            className="w-full h-[50vh] md:h-auto object-cover rounded-2xl"
          />
        </SwiperSlide>
        <SwiperSlide className="rounded-2xl">
          <img
            src="https://cdn-imgix.headout.com/media/images/0a8f6ede9e1b32f3277c4e49bb6aba93-MocoMuseum-Desktop%20Banner-min.png?w=1800&h=750&crop=faces&auto=compress%2Cformat&fit=min"
            className="w-full h-[50vh] md:h-auto object-cover rounded-2xl"
          />
        </SwiperSlide>
        <div className="!hidden md:!block swiper-button-next after:text-black after:!text-xs after:w-8 after:h-8 after:absolute after:bg-white after:flex after:items-center after:justify-center after:rounded-full after:shadow-lg mr-5" />
        <div className="!hidden md:!block swiper-button-prev after:text-black after:!text-xs after:w-8 after:h-8 after:absolute after:bg-white after:flex after:items-center after:justify-center after:rounded-full after:shadow-lg ml-5" />
      </Swiper>
      <Drawer open={isSearchDrawerOpen} onOpenChange={setIsSearchDrawerOpen}>
        <DrawerTrigger className="absolute bottom-2 z-10 left-1/2 -translate-x-1/2 w-full max-w-[80%] flex md:hidden items-center bg-white gap-2 rounded-md p-1 shadow text-sm cursor-pointer">
          <Input
            className="bg-transparent border-none focus-visible:ring-0 shadow-none cursor-pointer text-[13px]"
            placeholder="Search for experiences and cities"
            onFocus={() => setIsSearchDrawerOpen(true)}
          />
          <div className="bg-[#8000FF] rounded p-2">
            <Search strokeWidth={1} className="text-white" />
          </div>
        </DrawerTrigger>
        <SearchDrawerContent />
      </Drawer>
    </div>
  );
};

export default Hero;
