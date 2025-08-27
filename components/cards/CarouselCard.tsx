import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { StarIcon } from "lucide-react";
import PriceDisplay from "../PriceDisplay";
import { useTranslation } from "react-i18next";
import Link from "next/link";  // Importing Next.js Link component

interface CarouselCardProps {
  image: string;
  place: string;
  rating: number;
  reviews: number;
  description: string;
  price: number;
  badge?: string;     // overlay on image (keeps working)
  banner?: string;    // NEW: small pink label on the right (replaces rating row)
  off?: number;       // Discount percentage (keeps working)
  oldPrice?: number;  // NEW: strikethrough price shown next to "from"
  variant?: "default" | "full" | "recommendation"; // NEW variant
  city?: string;
  category?: string;
  subcategory?: string;
  itemId: string;     // Ensure `itemId` is passed in props
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
  city,
  category,
  subcategory,
  itemId, // NEW: we need this for dynamic routing
}: CarouselCardProps) => {
  const { t } = useTranslation();
  
  // Calculate discounted price if off is provided
  const discountedPrice = off ? price * (1 - off / 100) : price;

  const generateLink = () => {
    return `/things-to-do/${city}/${category}/${subcategory}/${itemId}`;
  };

  if (variant === "recommendation") {
    return (
      <Link href={`/things-to-do/${city}/${category}/${subcategory}/${itemId}`}>
        <div className="w-full pt-2 hover:-translate-y-2 transition-all duration-300 group cursor-pointer">
          <div className="relative pointer-events-none md:pointer-events-auto">
            {/* Vignette effect overlay */}
            <div className="absolute top-0 left-0 w-full h-full z-10 group-hover:shadow-[inset_0_-15px_30px_rgba(0,0,0,0.7)] transition-shadow duration-300 pointer-events-none rounded-[4px]" />
            {badge && (
              <span className="absolute top-2 left-2 z-10 text-[#444444] bg-white text-[12px] font-text px-2 py-1 rounded">
                {badge}
              </span>
            )}
            <div className="relative w-full aspect-[16/10] rounded-[4px] overflow-hidden mb-4">
              <Swiper
                loop
                allowTouchMove={false}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                modules={[Autoplay, Navigation, Pagination]}
                navigation={{ nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }}
                pagination={{
                  clickable: true,
                  renderBullet: (_idx: number, className: string) =>
                    `<span class="${className} !h-1.5 !mx-0.5 !rounded-full custom-bullet loading"></span>`,
                }}
                className="absolute inset-0 w-full h-full pagination-on-hover"
              >
                <SwiperSlide>
                  <img src={image} className="w-full h-full object-cover" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src={image} className="w-full h-full object-cover" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src={image} className="w-full h-full object-cover" />
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
          <div className="flex justify-between items-center -mt-2">
            <span className="text-[#666666] text-xs">{place}</span>
            {banner ? (
              <span className="text-[#e5006e] text-xs font-halyard-text">{banner}</span>
            ) : null}
          </div>
          <p className="font-halyard-text-regular text-lg text-[#444444] mt-0">{description}</p>
          <div className="font-heading text-[#444444] mt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-text text-[#666666]">{t("recommendations.from")}</span>
              {typeof oldPrice === "number" && oldPrice > discountedPrice && (
                <span className="text-xs line-through text-[#666666]">${oldPrice.toFixed(2)}</span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <PriceDisplay className="text-[#444444]" amount={discountedPrice} />
              {off && (
                <span className="bg-[#088229] text-white text-[11px] font-halyard-text px-2 py-[2px] rounded">
                  {off}% off
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }
    if (variant === "full") {
      return (
    <div className="w-full hover:-translate-y-2 transition-all duration-300 group cursor-pointer">
    <div className="relative pointer-events-none md:pointer-events-auto">
      <div className="absolute top-0 left-0 w-[99%] h-full z-10 group-hover:shadow-[inset_0_-15px_30px_rgba(0,0,0,0.7)] transition-shadow duration-300 pointer-events-none" />
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
        <SwiperSlide>
          <img src={image} className="w-full object-cover rounded-[4px]" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={image} className="w-full object-cover rounded-[4px]" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={image} className="w-full object-cover rounded-[4px]" />
        </SwiperSlide>
        <div className="hidden group-hover:block">
          <div className="swiper-button-next after:text-black after:!text-xs after:w-6 after:h-6 after:absolute after:bg-white after:flex after:items-center after:justify-center after:rounded-full after:shadow-sm" />
          <div className="swiper-button-prev after:text-black after:!text-xs after:w-6 after:h-6 after:absolute after:bg-white after:flex after:items-center after:justify-center after:rounded-full after:shadow-sm" />
        </div>
      </Swiper>
    </div>
    <div className="flex justify-between items-center -mt-2">
      <span className="text-[#666666] text-xs">{place}</span>
      <span className="flex items-center gap-1">
        <StarIcon className="text-pink-600" fill="currentColor" size={12} />
        <span className="text-pink-600 text-xs font-semibold">{rating}</span>
        <span className="text-pink-600 text-xs">({reviews})</span>
      </span>
    </div>
    <p className="font-halyard-text-regular text-lg text-[#444444] mt-0">{description}</p>
    <div className="font-heading text-[#444444] mt-2 max-w-32">
      {off ? (
        <>
          <div className="flex items-center gap-2">
            <span className="text-xs font-text text-[#666666]">{t("recommendations.from")}</span>
            <span className="text-xs line-through text-[#666666]">${price.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#444444]">${discountedPrice.toFixed(2)}</span>
            <span className="bg-[#088229] text-white text-[11px] font-halyard-text px-1 py-0 rounded">
              {off}% off
            </span>
          </div>
        </>
      ) : (
        <>
          <span className="text-xs font-text">{t("recommendations.from")}</span>{" "}
          <br /> <PriceDisplay className="text-[#444444]" amount={price} />
        </>
      )}
    </div>
  </div>
  )
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
            <SwiperSlide>
              <img src={image} className="w-full object-cover rounded-[4px]" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={image} className="w-full object-cover rounded-[4px]" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={image} className="w-full object-cover rounded-[4px]" />
            </SwiperSlide>
          </Swiper>
        </div>
        <div className="flex justify-between items-center -mt-2">
          <span className="text-[#666666] text-xs">{place}</span>
          <span className="flex items-center gap-1">
            <StarIcon className="text-pink-600" fill="currentColor" size={12} />
            <span className="text-pink-600 text-xs font-semibold">{rating}</span>
            <span className="text-pink-600 text-xs">({reviews})</span>
          </span>
        </div>
        <p className="font-halyard-text-regular text-lg text-[#444444] mt-0">{description}</p>
        <div className="font-heading text-[#444444] mt-2 max-w-32">
          {off ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-xs font-text text-[#666666]">{t("recommendations.from")}</span>
                <span className="text-xs line-through text-[#666666]">${price.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#444444]">${discountedPrice.toFixed(2)}</span>
                <span className="bg-[#088229] text-white text-[11px] font-halyard-text px-1 py-0 rounded">
                  {off}% off
                </span>
              </div>
            </>
          ) : (
            <>
              <span className="text-xs font-text">{t("recommendations.from")}</span>{" "}
              <br /> <PriceDisplay className="text-[#444444]" amount={price} />
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CarouselCard;
