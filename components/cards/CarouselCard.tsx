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

  const discountedPrice = off ? price * (1 - off / 100) : price;

  const generateLink = () => {
    
    const slugify = (text: string) =>
      text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");

    const citySlug = slugify(city);
    const categorySlug = slugify(category);
    const subcategorySlug = slugify(subcategory);
    const itemSlug = slugify(description); 

    return `/things-to-do/${citySlug}/${categorySlug}/${subcategorySlug}/${itemSlug}-${itemId}`;
  };

  if (variant === "full") {
    return (
      <Link href={generateLink()} passHref>
        <div className="w-full group cursor-pointer p-2">
          <div className="relative mb-2">
            <img
              src={image}
              alt={description}
              className="w-full h-40 object-cover rounded-lg"
            />
            {badge && (
              <span className="absolute top-2 left-2 z-10 text-[#444444] bg-white text-[12px] font-text px-2 py-1 rounded">
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
            <h3 className="font-semibold text-gray-800 mt-1 line-clamp-2 h-10">
              {description}
            </h3>
            <div className="mt-2">
              <span className="text-xs text-gray-500">from</span>
              <div className="flex items-baseline gap-2">
                <PriceDisplay
                  amount={price}
                  className="font-bold text-lg text-gray-800"
                />
                {oldPrice && (
                  <PriceDisplay
                    amount={oldPrice}
                    className="text-sm line-through text-gray-400"
                  />
                )}
                {off && (
                  <span className="bg-green-600 text-white text-xs font-semibold px-2 py-0.5 rounded-md">
                    {off}% off
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
            <div className="relative w-full aspect-[16/10] rounded-[4px] overflow-hidden mb-4">
              <Swiper
                loop
                allowTouchMove={false}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                modules={[Autoplay, Navigation, Pagination]}
                navigation={{
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                }}
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
              {typeof oldPrice === "number" && oldPrice > discountedPrice && (
                <span className="text-xs line-through text-[#666666]">
                  ${oldPrice.toFixed(2)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <PriceDisplay
                className="text-[#444444]"
                amount={discountedPrice}
              />
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
          {off ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-xs font-text text-[#666666]">
                  {t("recommendations.from")}
                </span>
                <span className="text-xs line-through text-[#666666]">
                  ${price.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#444444]">
                  ${discountedPrice.toFixed(2)}
                </span>
                <span className="bg-[#088229] text-white text-[11px] font-halyard-text px-1 py-0 rounded">
                  {off}% off
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
