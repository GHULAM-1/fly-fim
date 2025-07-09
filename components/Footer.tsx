import React from "react";
import {
  TbBrandLinkedinFilled,
  TbBrandInstagramFilled,
  TbBrandYoutubeFilled,
  TbBrandFacebookFilled,
  TbBrandTwitterFilled,
  TbBrandX,
} from "react-icons/tb";

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
                  <li>Help Center</li>
                  <li>Chat with us</li>
                  <li>Call us</li>
                  <li>support@flyfim.com</li>
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full lg:col-span-2">
                <ul className="space-y-4">
                  <li className="text-xs sm:text-sm font-semibold">CITIES</li>
                  <li>Nueva York</li>
                  <li>Las Vegas</li>
                  <li>Roma</li>
                  <li>París</li>
                  <li>Londres</li>
                  <li>Dubái</li>
                  <li>Barcelona</li>
                  <li>+192 more</li>
                </ul>
                <ul className="space-y-4">
                  <li className="text-xs sm:text-sm font-semibold">FLYFIM</li>
                  <li>Our story</li>
                  <li>Careers</li>
                  <li>Newsroom</li>
                  <li>Company blog</li>
                  <li>Travel blog</li>
                </ul>
              </div>
              <div>
                <ul className="space-y-4">
                  <li className="text-xs sm:text-sm font-semibold">PARTNERS</li>
                  <li>Experience providers</li>
                  <li>Affiliates</li>
                  <li>Creators & influencers</li>
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
                © 2014-2025 Flyfim, 82 Nassau St #60351 New York, NY 10038
              </li>
              <li>Terms of usage</li>
              <li>•</li>
              <li>Privacy policy</li>
              <li>•</li>
              <li>Company details</li>
            </ul>
            <p className="text-xs text-gray-500 md:hidden">
              © 2014-2025 Flyfim, 82 Nassau St #60351 New York, NY 10038
            </p>
            <div className="hidden md:flex items-center gap-4 justify-center sm:justify-start text-gray-500">
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
    </div>
  );
};

export default Footer;
