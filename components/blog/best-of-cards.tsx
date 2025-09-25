import { ArrowRight } from "lucide-react";
import React from "react";
import Link from "next/link";

interface BestOfCardsProps {
  title: string;
  blogCards:any[];
}
export default function BestOfCards({ blogCards, title }: BestOfCardsProps) {
  return (
    <div className="mb-10">
      <div className="font-halyard-text font-semibold mt-[20px] mb-[40px] text-center ">
        <h1 className="text-[24px] text-[#080808]">
            {title}
        </h1>
        <div className="border-b-[3px] border-[#8000FF] m-[20px] max-w-[100px] mx-auto"></div>
      </div>
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-x-0 gap-y-8">
        {blogCards.map((card, index) => (
          <Link key={index} href={`/blog/${card.slug?.current || card.slug || '#'}`} className="block">
            <div className="shadow-sm group hover:cursor-pointer bg-white lg:max-w-[369px] rounded-[12px] hover:rounded-[4px] hover:shadow-md transition-all duration-300">
            <div className="max-h-[326px]  transition-all duration-300 relative overflow-hidden rounded-t-[12px] group-hover:rounded-t-[4px]">
              <img
                src={card.cardImage?.asset?.url || card.image || '/placeholder.jpg'}
                alt={card.title || ''}
                className="object-center max-h-[190px] w-full"
              />
            </div>
            <div>
              <p className="text-[20px] text-[#4a4a4a] line-clamp-3 p-[15px]">{card.title}</p>
            </div>
          </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
