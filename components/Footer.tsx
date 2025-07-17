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
      <div className="max-w-[1200px] mx-auto px-[24px] xl:px-0 mb-12 md:mb-0">
        <div className="2xl:max-w-screen-xl mx-auto">
          <div className="py-6 sm:py-10 border-b">
            <img src="/images/logo.png" alt="logo" className="w-24 sm:w-32" />
            <div className="grid grid-cols-1 !text-[12px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 text-sm text-gray-500 gap-10 md:gap-20 mt-10">
              <div>
                <ul className="space-y-[10px] ">
                  <li className="font-heading text-[#444444] tracking-widest ">GET HELP 24/7</li>
                  <li className="flex text-[#666666]  items-center gap-2 cursor-pointer hover:text-primary">
                    <HelpCircle size={16} strokeWidth={1} />
                    Help Center
                  </li>
                  <li className="flex text-[#666666] items-center gap-2 cursor-pointer hover:text-primary">
                    <MessageCircle size={16} strokeWidth={1} />
                    Chat with us
                  </li>
                  <li className="flex text-[#666666] items-center gap-2 cursor-pointer hover:text-primary">
                    <Phone size={16} strokeWidth={1} />
                    Call us
                  </li>
                  <li className="flex text-[#666666] items-center gap-2 cursor-pointer hover:text-primary">
                    <Mail size={16} strokeWidth={1} />
                    support@flyfim.com
                  </li>
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full lg:col-span-2">
                <ul className="space-y-[10px] ">
                  <li className="font-heading text-[#444444] tracking-widest">CITIES</li>
                  <li className="text-[#666666] cursor-pointer hover:text-primary">
                    Nueva York
                  </li>
                  <li className="text-[#666666] cursor-pointer hover:text-primary">
                    Las Vegas
                  </li>
                  <li className="text-[#666666] cursor-pointer hover:text-primary">Roma</li>
                  <li className="text-[#666666] cursor-pointer hover:text-primary">París</li>
                  <li className="text-[#666666] cursor-pointer hover:text-primary">Londres</li>
                  <li className="text-[#666666] cursor-pointer hover:text-primary">
                    Barcelona
                  </li>
                  <li className="text-[#666666] cursor-pointer hover:text-primary">
                    +192 more
                  </li>
                </ul>
                <ul className="space-y-[10px] ">
                  <li className="font-heading text-[#444444] tracking-widest">FLYFIM</li>
                  <li className="text-[#666666] cursor-pointer hover:text-primary">
                    Our story
                  </li>
                  <li className="text-[#666666] cursor-pointer hover:text-primary">Careers</li>
                  <li className="text-[#666666] cursor-pointer hover:text-primary">
                    Newsroom
                  </li>
                  <li className="text-[#666666] cursor-pointer hover:text-primary">
                    Company blog
                  </li>
                  <li className="text-[#666666] cursor-pointer hover:text-primary">
                    Travel blog
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-[10px] ">
                  <li className="font-heading text-[#444444] tracking-widest">PARTNERS</li>
                  <li className="text-[#666666] cursor-pointer hover:text-primary">
                    Experience providers
                  </li>
                  <li className="text-[#666666] cursor-pointer hover:text-primary">
                    Affiliates
                  </li>
                  <li className="text-[#666666] cursor-pointer hover:text-primary">
                    Creators & influencers
                  </li>
                </ul>
                <div className="mt-10">
                  <p className="font-heading text-[#444444] tracking-widest">WE ACCEPT</p>
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
              <li className="hidden md:block !text-[12px]">
                ©️2005-2025 Fly in Minute, 1 Cornish Al Nile St #85953 Luxor,
                Egypt
              </li>
              <li className="text-[#666666] cursor-pointer text-[9px] hover:text-primary">
                Terms of usage
              </li>
              <li className="text-[#666666] cursor-pointer text-[9px] hover:text-primary">•</li>
              <li className="text-[#666666] cursor-pointer text-[9px] hover:text-primary">
                Privacy policy
              </li>
              <li className="text-[#666666] cursor-pointer text-[9px] hover:text-primary">•</li>
              <li className="cursor-pointer text-[9px] hover:text-primary">
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
                className="hover:text-primary"
              >
                <TbBrandLinkedinFilled size={16} />
              </a>
              <a
                href="https://www.instagram.com/flyfim.com"
                className="hover:text-primary"
              >
                <TbBrandInstagramFilled size={16} />
              </a>
              <a
                href="https://www.youtube.com/flyfim.com"
                className="hover:text-primary"
              >
                <TbBrandYoutubeFilled size={16} />
              </a>
              <a
                href="https://www.facebook.com/flyfim.com"
                className="hover:text-primary"
              >
                <TbBrandFacebookFilled size={16} />
              </a>
              <a
                href="https://www.x.com/flyfim.com"
                className="hover:text-primary"
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
