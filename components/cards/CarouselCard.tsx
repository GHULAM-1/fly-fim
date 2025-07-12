import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { StarIcon } from "lucide-react";
import PriceDisplay from "../PriceDisplay";
import { useTranslation } from "react-i18next";
import Link from "next/link";

interface CarouselCardProps {
  image: string;
  place: string;
  rating: number;
  reviews: number;
  description: string;
  price: number;
  badge?: string;
}

const CarouselCard = ({
  image,
  place,
  rating,
  reviews,
  description,
  price,
  badge,
}: CarouselCardProps) => {
  const { t } = useTranslation();

  return (
    <div className="w-3/4 sm:w-1/2 pt-2 md:w-1/3 lg:w-1/4 hover:-translate-y-2 transition-all duration-300 group pl-4 cursor-pointer">
      <div className="relative pointer-events-none md:pointer-events-auto">
        <div className="absolute top-0 left-0 w-full h-full z-10 group-hover:shadow-[inset_0_0_30px_rgba(0,0,0,0.5)] transition-shadow duration-300 pointer-events-none" />
        {badge && (
          <span className="absolute top-2 left-2 z-10 bg-white text-[11px] font-medium px-2 py-1 rounded">
            {badge}
          </span>
        )}
        <Swiper
          loop={true}
          allowTouchMove={false}
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
            renderBullet: (index: number, className: string) => {
              return `<span class="${className} !h-1.5 !mx-0.5 !rounded-full custom-bullet loading"></span>`;
            },
          }}
          className="mySwiper w-full rounded overflow-hidden mb-4 relative pagination-on-hover"
        >
          <SwiperSlide>
            <img src={image} className="w-full object-cover" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={image} className="w-full object-cover" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={image} className="w-full object-cover" />
          </SwiperSlide>
          <div className="hidden group-hover:block">
            <div className="swiper-button-next after:text-black after:!text-xs after:w-6 after:h-6 after:absolute after:bg-white after:flex after:items-center after:justify-center after:rounded-full after:shadow-lg" />
            <div className="swiper-button-prev after:text-black after:!text-xs after:w-6 after:h-6 after:absolute after:bg-white after:flex after:items-center after:justify-center after:rounded-full after:shadow-lg" />
          </div>
        </Swiper>
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="text-gray-500 text-xs">{place}</span>
        <span className="flex items-center gap-1">
          <StarIcon className="text-pink-600" fill="currentColor" size={12} />
          <span className="text-pink-600 text-xs font-semibold">{rating}</span>
          <span className="text-pink-600 text-xs">({reviews})</span>
        </span>
      </div>
      <p className="font-semibold text-gray-700 mt-2">{description}</p>
      <p className="font-semibold text-gray-700 mt-2 max-w-32">
        <span className="text-gray-500 text-xs">
          {t("recommendations.from")}
        </span>{" "}
        <br /> <PriceDisplay amount={price} />
      </p>
    </div>
  );
};

export default CarouselCard;
