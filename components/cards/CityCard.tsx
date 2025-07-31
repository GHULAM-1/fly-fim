import Link from "next/link";
import React from "react";

interface CityCardProps {
  image: string;
  description: string;
  place: string;
  city: string;
}

const CityCard = ({ image, description, place, city }: CityCardProps) => {
  return (
    <Link
      href={`/things-to-do/${city}`}
      className="basis-2/5 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-2 group"
    >
      <div className="flex flex-row md:flex-col gap-2 transition-all duration-500 ease-out transform hover:-translate-y-1 rounded-lg p-2">
        <div>
          <img src={image} alt={description} className="rounded md:w-full w-[41px]" />
        </div>
        <div>
          <p className="font-text text-[#444444] md:mt-2 leading-tight md:max-w-32">
            {description} {" "}
            <span className="font-text md:hidden inline-block text-[#444444] md:mt-2 leading-tight md:max-w-32">
            {city}
          </span>
          </p>
          <p className="font-text md:block hidden text-[#444444] md:mt-2 leading-tight md:max-w-32">
            {city}
          </p>

          <p className="text-[#666666] font-halyard-text-light text-sm mt-1">
            {place}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CityCard;
