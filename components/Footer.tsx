import React from "react";
import {
  TbBrandLinkedinFilled,
  TbBrandInstagramFilled,
  TbBrandYoutubeFilled,
  TbBrandFacebookFilled,
  TbBrandTwitterFilled,
  TbBrandX,
} from "react-icons/tb";
import { HelpCircle, MessageCircle, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <div className="border-t">
      <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-28 mb-12 md:mb-0">
        <div className="2xl:max-w-screen-xl mx-auto">
          <div className="py-6 sm:py-10 border-b">
            <img src="/images/logo.png" alt="logo" className="w-24 sm:w-32" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 text-xs text-gray-500 gap-10 md:gap-20 mt-10">
              <div>
                <ul className="space-y-4">
                  <li className="text-xs sm:text-sm font-semibold">
                    GET HELP 24/7
                  </li>
                  <li className="flex items-center gap-2 cursor-pointer hover:text-black">
                    <HelpCircle size={16} strokeWidth={1} />
                    Help Center
                  </li>
                  <li className="flex items-center gap-2 cursor-pointer hover:text-black">
                    <MessageCircle size={16} strokeWidth={1} />
                    Chat with us
                  </li>
                  <li className="flex items-center gap-2 cursor-pointer hover:text-black">
                    <Phone size={16} strokeWidth={1} />
                    Call us
                  </li>
                  <li className="flex items-center gap-2 cursor-pointer hover:text-black">
                    <Mail size={16} strokeWidth={1} />
                    support@flyfim.com
                  </li>
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full lg:col-span-2">
                <ul className="space-y-4">
                  <li className="text-xs sm:text-sm font-semibold">CITIES</li>
                  <li className="cursor-pointer hover:text-black">
                    Nueva York
                  </li>
                  <li className="cursor-pointer hover:text-black">Las Vegas</li>
                  <li className="cursor-pointer hover:text-black">Roma</li>
                  <li className="cursor-pointer hover:text-black">París</li>
                  <li className="cursor-pointer hover:text-black">Londres</li>
                  <li className="cursor-pointer hover:text-black">Dubái</li>
                  <li className="cursor-pointer hover:text-black">Barcelona</li>
                  <li className="cursor-pointer hover:text-black">+192 more</li>
                </ul>
                <ul className="space-y-4">
                  <li className="text-xs sm:text-sm font-semibold">FLYFIM</li>
                  <li className="cursor-pointer hover:text-black">Our story</li>
                  <li className="cursor-pointer hover:text-black">Careers</li>
                  <li className="cursor-pointer hover:text-black">Newsroom</li>
                  <li className="cursor-pointer hover:text-black">
                    Company blog
                  </li>
                  <li className="cursor-pointer hover:text-black">
                    Travel blog
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-4">
                  <li className="text-xs sm:text-sm font-semibold">PARTNERS</li>
                  <li className="cursor-pointer hover:text-black">
                    Experience providers
                  </li>
                  <li className="cursor-pointer hover:text-black">
                    Affiliates
                  </li>
                  <li className="cursor-pointer hover:text-black">
                    Creators & influencers
                  </li>
                </ul>
                <div className="mt-10">
                  <p className="text-xs sm:text-sm font-semibold">WE ACCEPT</p>
                  <img src="/images/cards.png" alt="" className="w-56 mt-2" />
                </div>
                <div className="md:hidden flex items-center gap-4 mt-5">
                  <a href="https://www.linkedin.com/company/flyfim">
                    <TbBrandLinkedinFilled size={16} />
                  </a>
                  <a href="https://www.instagram.com/flyfim.com">
                    <TbBrandInstagramFilled size={16} />
                  </a>
                  <a href="https://www.youtube.com/flyfim.com">
                    <TbBrandYoutubeFilled size={16} />
                  </a>
                  <a href="https://www.facebook.com/flyfim.com">
                    <TbBrandFacebookFilled size={16} />
                  </a>
                  <a href="https://www.x.com/flyfim.com">
                    <TbBrandTwitterFilled size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="py-5 flex flex-col sm:flex-row justify-between gap-4">
            <ul className="text-xs text-gray-500 flex items-center gap-4">
              <li className="hidden md:block">
                ©️2005-2025 Fly in Minute, 1 Cornish Al Nile St #85953 Luxor,
                Egypt
              </li>
              <li className="cursor-pointer hover:text-black">
                Terms of usage
              </li>
              <li className="cursor-pointer hover:text-black">•</li>
              <li className="cursor-pointer hover:text-black">
                Privacy policy
              </li>
              <li className="cursor-pointer hover:text-black">•</li>
              <li className="cursor-pointer hover:text-black">
                Company details
              </li>
            </ul>
            <p className="text-xs text-gray-500 md:hidden">
              ©️2005-2025 Fly in Minute, 1 Cornish Al Nile St #85953 Luxor,
              Egypt
            </p>
            <div className="hidden md:flex items-center gap-4 justify-center sm:justify-start text-gray-500">
              <a
                href="https://www.linkedin.com/company/flyfim"
                className="hover:text-black"
              >
                <TbBrandLinkedinFilled size={16} />
              </a>
              <a
                href="https://www.instagram.com/flyfim.com"
                className="hover:text-black"
              >
                <TbBrandInstagramFilled size={16} />
              </a>
              <a
                href="https://www.youtube.com/flyfim.com"
                className="hover:text-black"
              >
                <TbBrandYoutubeFilled size={16} />
              </a>
              <a
                href="https://www.facebook.com/flyfim.com"
                className="hover:text-black"
              >
                <TbBrandFacebookFilled size={16} />
              </a>
              <a
                href="https://www.x.com/flyfim.com"
                className="hover:text-black"
              >
                <TbBrandTwitterFilled size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
