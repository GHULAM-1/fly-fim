import { ArrowRight } from "lucide-react";
import React from "react";
import Link from "next/link";

interface GuideCardProps {
  title: string;
  blogCards:any[];
}
export default function GuideCard({ blogCards, title }: GuideCardProps) {
  return (
    <div className="mb-10">
      <div className="font-halyard-text font-semibold mt-[20px] mb-[40px] text-center ">
        <h1 className="text-[24px] text-[#080808]">
            {title}
        </h1>
        <div className="border-b-[3px] border-[#8000FF] m-[20px] max-w-[100px] mx-auto"></div>
      </div>
      <div className="grid lg:grid-cols-4 grid-cols-1 gap-x-0 gap-y-4">
        {blogCards.map((card, index) => (
          <Link key={index} href={`/blog/${card.slug?.current || card.slug || '#'}`} className="block">
            <div className="shadow-sm group hover:cursor-pointer bg-white lg:max-w-[285px] rounded-[4px] hover:shadow-md transition-shadow duration-300">
            <div className="max-h-[220px]  transition-all duration-300 relative overflow-hidden rounded-t-[4px]">
              <img
                src={card.cardImage?.asset?.url || card.image || '/placeholder.jpg'}
                alt=""
                className="object-center group-hover:opacity-70 w-full"
              />
              <div className="absolute opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-300 bg-black text-[#b6aead] p-[5px] right-0 bottom-0">
                <ArrowRight/>
              </div>
            </div>
            <div>
              <p className="text-[18px] text-[#4a4a4a] line-clamp-2 p-[15px]">{card.title}</p>
              <p className="text-[16px] hover:underline hover:cursor-pointer text-[#8000FF] mx-[15px] pb-[15px]">Read more</p>
            </div>
          </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
