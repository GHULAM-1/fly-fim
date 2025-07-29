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
      className="basis-2/5 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-4"
    >
      <div className="flex flex-row md:flex-col gap-2">
        <div>
          <img src={image} alt={description} className="rounded md:w-full w-[41px]" />
        </div>
        <div>
          <p className="font-halyard-text text-[#444444] md:mt-2 leading-tight md:max-w-32">
            {description}
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
