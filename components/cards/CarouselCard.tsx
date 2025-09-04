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
  city,
  category,
  subcategory,
  itemId,
}: CarouselCardProps) => {
  const { t } = useTranslation();

  const discountedPrice = off ? price * (1 - off / 100) : price;

  const generateLink = () => {
    const params = new URLSearchParams({
      itemName: description,
      city: city || "",
      category: category || "",
      subcategory: subcategory || "",
      itemId: itemId,
      image: image,
    });
    return `/booking?${params.toString()}`;
  };

  const cardContent = (
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
  );

  return (
    <Link href={generateLink()} passHref>
      {cardContent}
    </Link>
  );
};

export default CarouselCard;
