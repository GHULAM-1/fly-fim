import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { StarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import PriceDisplay from "../PriceDisplay";
import { useTranslation } from "react-i18next";
import Link from "next/link";

interface CarouselCardProps {
  image: string | string[];
  place: string;
  rating: number;
  reviews: number;
  description: string;
  price: number;
  badge?: string;
  banner?: string;
  off?: number;
  oldPrice?: number;
  variant?: "default" | "full" | "recommendation";
  city?: string;
  category?: string;
  subcategory?: string;
  itemId: string;
}

const CarouselCard = ({
  image,
  place,
  rating,
  reviews,
  description,
  price,
  badge,
  off,
  oldPrice,
  banner,
  variant,
  city = "london",
  category = "entertainment",
  subcategory = "studio-tours",
  itemId,
}: CarouselCardProps) => {
  const { t } = useTranslation();
  const swiperRef = useRef<any>(null);

  // Calculate discount percentage automatically
  const calculatedOff = oldPrice && price && oldPrice > price 
    ? Math.round(((oldPrice - price) / oldPrice) * 100) 
    : off || 0;

  const generateLink = () => {
    const slugify = (text: string) =>
      text
        ?.toLowerCase()
        ?.replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");

    const citySlug = slugify(city);
    const categorySlug = slugify(category);
    const subcategorySlug = slugify(subcategory);
    const itemSlug = slugify(description);

    return `/things-to-do/${citySlug}/${categorySlug}/${subcategorySlug}/${itemId}`;
  };

  if (variant === "full") {
    return (
      <Link href={generateLink()} passHref>
        <div className="w-full group cursor-pointer">
          <div className="relative mb-2">
            <img
              src={Array.isArray(image) ? image[0] : image}
              alt={description}
              className="w-full h-44 object-cover rounded-sm"
            />
            {badge && (
              <span className="absolute top-2 left-2 z-0 text-[#444444] bg-white text-[12px] font-text px-2 py-1 rounded">
                {badge}
              </span>
            )}
          </div>
          <div>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>{place}</span>
              <div className="flex items-center gap-1">
                <StarIcon className="text-pink-500 fill-current" size={14} />
                <span className="font-semibold text-pink-500">{rating}</span>
                <span className="text-gray-500">({reviews})</span>
              </div>
            </div>
            <h3 className="font-medium text-[#444444] text-[18px] line-clamp-2 h-auto">
              {description}
            </h3>
            <div className="mt-2">
              <div className="flex flex-row items-center  gap-2">
                {oldPrice && (
                <>
                <span className="text-xs text-[#444444]">from</span>
                  <PriceDisplay
                    amount={oldPrice}
                    className="text-[12px] line-through text-[#666666]"
                  />
                  </>
                )}
              </div>
              <div className="flex flex-row items-center  gap-2">
                <PriceDisplay
                  amount={price}
                  className="font-heading text-[16px] text-[#444444]"
                />
                {oldPrice && calculatedOff > 0 && (
                  <span className="bg-[#087F29] text-white text-[11px] font-halyard-text px-1 py-0 rounded">
                    {calculatedOff}% off
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "recommendation") {
    return (
      <Link href={generateLink()}>
        <div className="w-full pt-2 hover:-translate-y-2 transition-all duration-300 group cursor-pointer">
          <div className="relative pointer-events-none md:pointer-events-auto">
            <div className="absolute top-0 left-0 w-full h-full z-10 group-hover:shadow-[inset_0_-15px_30px_rgba(0,0,0,0.7)] transition-shadow duration-300 pointer-events-none rounded-[4px]" />
            {badge && (
              <span className="absolute top-2 left-2 z-10 text-[#444444] bg-white text-[12px] font-text px-2 py-1 rounded">
                {badge}
              </span>
            )}
            <div className="relative w-full aspect-[16/10] rounded-[4px] overflow-hidden mb-4 group">
              <Swiper
                ref={swiperRef}
                loop
                allowTouchMove={false}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                modules={[Autoplay, Pagination]}
                pagination={{
                  clickable: true,
                  renderBullet: (_idx: number, className: string) =>
                    `<span class="${className} !h-1.5 !mx-0.5 !rounded-full custom-bullet loading"></span>`,
                }}
                className="absolute inset-0 w-full h-full pagination-on-hover"
              >
                {Array.isArray(image) ? (
                  image.map((img, index) => (
                    <SwiperSlide key={index}>
                      <img src={img} className="w-full h-full object-cover" />
                    </SwiperSlide>
                  ))
                ) : (
                  <SwiperSlide>
                    <img src={image} className="w-full h-full object-cover" />
                  </SwiperSlide>
                )}
              </Swiper>
              
              {/* Navigation Buttons */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Left Navigation Button */}
                <button
                  className="absolute hover:cursor-pointer left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/90 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto z-20 shadow-lg"
                  aria-label="Previous image"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    swiperRef.current?.swiper.slidePrev();
                  }}
                >
                  <ChevronLeft size={16} className="text-gray-700" />
                </button>
                
                {/* Right Navigation Button */}
                <button
                  className="absolute hover:cursor-pointer right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/90 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto z-20 shadow-lg"
                  aria-label="Next image"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    swiperRef.current?.swiper.slideNext();
                  }}
                >
                  <ChevronRight size={16} className="text-gray-700" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center -mt-2">
            <span className="text-[#666666] text-xs">{place}</span>
            {banner ? (
              <span className="text-[#e5006e] text-xs font-halyard-text">
                {banner}
              </span>
            ) : null}
          </div>
          <p className="font-halyard-text-regular text-lg text-[#444444] mt-0">
            {description}
          </p>
          <div className="font-heading text-[#444444] mt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-text text-[#666666]">
                {t("recommendations.from")}
              </span>
              {typeof oldPrice === "number" && oldPrice > price && (
                <span className="text-xs line-through text-[#666666]">
                  <PriceDisplay amount={oldPrice} />
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <PriceDisplay
                className="text-[#444444]"
                amount={price}
              />
              {calculatedOff > 0 && (
                <span className="bg-[#088229] text-white text-[11px] font-halyard-text px-2 py-[2px] rounded">
                  {calculatedOff}% off
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={generateLink()} passHref>
      <div className="w-full hover:-translate-y-2 transition-all duration-300 group cursor-pointer">
        <div className="relative pointer-events-none md:pointer-events-auto">
          {badge && (
            <span className="absolute top-2 left-2 z-10 text-[#444444] bg-white text-[12px] font-text px-2 py-1 rounded">
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
            {Array.isArray(image) ? (
              image.map((img, index) => (
                <SwiperSlide key={index}>
                  <img src={img} className="w-full object-cover rounded-[4px]" />
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide>
                <img src={image} className="w-full object-cover rounded-[4px]" />
              </SwiperSlide>
            )}
          </Swiper>
        </div>
        <div className="flex justify-between items-center -mt-2">
          <span className="text-[#666666] text-xs">{place}</span>
          <span className="flex items-center gap-1">
            <StarIcon className="text-pink-600" fill="currentColor" size={12} />
            <span className="text-pink-600 text-xs font-semibold">
              {rating}
            </span>
            <span className="text-pink-600 text-xs">({reviews})</span>
          </span>
        </div>
        <p className="font-halyard-text-regular text-lg text-[#444444] mt-0">
          {description}
        </p>
        <div className="font-heading text-[#444444] mt-2 max-w-32">
          {calculatedOff > 0 ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-xs font-text text-[#666666]">
                  {t("recommendations.from")}
                </span>
                <span className="text-xs line-through text-[#666666]">
                  <PriceDisplay amount={oldPrice || 0} />
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#444444]">
                  <PriceDisplay amount={price} />
                </span>
                <span className="bg-[#088229] text-white text-[11px] font-halyard-text px-1 py-0 rounded">
                  {calculatedOff}% off
                </span>
              </div>
            </>
          ) : (
            <>
              <span className="text-xs font-text">
                {t("recommendations.from")}
              </span>{" "}
              <br /> <PriceDisplay className="text-[#444444]" amount={price} />
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CarouselCard;
