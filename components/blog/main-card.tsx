"use client";
import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";


export default function MainCard({ blogData }: { blogData: any }) {
  return (
    <Link href={`/blog/${blogData?.slug?.current || blogData?.slug || '#'}`} className="block">
      <div className="shadow-xl rounded-2xl hover:shadow-2xl transition-shadow duration-300">
      <div className="">
        <img
          src={blogData?.heroImage?.asset?.url || blogData?.image || '/placeholder.jpg'}
          alt={blogData?.heroImage?.alt || blogData?.title || ''}
          className="w-full h-[205px] object-cover rounded-t-2xl"
        />
      </div>
      <div className="bg-white mx-auto flex justify-center rounded-b-2xl pb-10 h-[100%] relative z-20">
        <div className="bg-white rounded-2xl px-2 font-halyard-text pt-2 mt-[-30px]  h-[100%]  text-center mx-auto w-[85%] min-w-[300px]">
          <p className="text-[#999999] lg:text-center text-left mb-[15px] text-[11px]">{blogData?.publishDate}</p>
          <h1 className="mb-[15px] lg:text-[20px] text-[18px] text-[#080808]">
            {blogData?.title}
          </h1>
          <p className="text-[14px] lg:text-center text-left font-halyard-text-light">
            {blogData?.subtitle}
          </p>
          <div className="flex justify-end mt-[20px]">
            <button className="bg-gray-400 hover:bg-black hover:cursor-pointer text-white w-8 h-8 flex items-center justify-center rounded-full shadow-lg transition-colors duration-300 group vibrate-button">
              <ArrowRight className="w-4 h-4 " />
              <style jsx>{`
                @keyframes stringVibrate {
                  0% { transform: translateX(0); }
                  10% { transform: translateX(10px); }
                  20% { transform: translateX(6px); }
                  30% { transform: translateX(-6px); }
                  40% { transform: translateX(3px); }
                  50% { transform: translateX(-3px); }
                  60% { transform: translateX(1.5px); }
                  70% { transform: translateX(-1.5px); }
                  80% { transform: translateX(0.7px); }
                  90% { transform: translateX(-0.7px); }
                  100% { transform: translateX(0); }
                }
                .vibrate-button:hover {
                  animation: stringVibrate 1.2s ease-out;
                }
              `}</style>
            </button>
          </div>
        </div>
      </div>
    </div>
    </Link>
  );
}
