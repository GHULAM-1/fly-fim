import React from "react";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <div className="px-28 border-t">
      <div className="py-10 border-b">
        <img src="/images/logo.png" alt="logo" className="w-42" />
        <div className="grid grid-cols-4 text-sm text-gray-500 gap-10 mt-10">
          <div>
            <ul className="space-y-3">
              <li className="font-medium">GET HELP 24/7</li>
              <li>Help Center</li>
              <li>Chat with us</li>
              <li>Call us</li>
              <li>support@headout.com</li>
            </ul>
            <div className="mt-5 p-2 border border-gray-200 rounded-lg bg-zinc-50 flex items-center justify-center gap-2 max-w-60">
              <img src="/images/qr.svg" alt="" className="w-20" />
              <p className="text-base font-medium">Download the Headout app</p>
            </div>
          </div>
          <ul className="space-y-3">
            <li className="font-medium">CITIES</li>
            <li>Nueva York</li>
            <li>Las Vegas</li>
            <li>Roma</li>
            <li>París</li>
            <li>Londres</li>
            <li>Dubái</li>
            <li>Barcelona</li>
            <li>+192 more</li>
          </ul>
          <ul className="space-y-3">
            <li className="font-medium">HEADOUT</li>
            <li>Our story</li>
            <li>Careers</li>
            <li>Newsroom</li>
            <li>Company blog</li>
            <li>Travel blog</li>
          </ul>
          <div>
            <ul className="space-y-3">
              <li className="font-medium">PARTNERS</li>
              <li>Experience providers</li>
              <li>Affiliates</li>
              <li>Creators & influencers</li>
            </ul>
            <div className="mt-10">
              <p className="font-medium">WE ACCEPT</p>
              <img src="/images/cards.png" alt="" className="w-56 mt-2" />
            </div>
          </div>
        </div>
      </div>
      <div className="py-5 flex justify-between">
        <ul className="text-xs text-gray-500 flex items-center gap-4">
          <li>© 2014-2025 Headout, 82 Nassau St #60351 New York, NY 10038</li>
          <li>Terms of usage</li>
          <li>•</li>
          <li>Privacy policy</li>
          <li>•</li>
          <li>Company details</li>
        </ul>
        <div className="flex items-center gap-4">
          <a href="https://www.youtube.com/headout.com">
            <Youtube size={16} strokeWidth={1} />
          </a>
          <a href="https://www.facebook.com/headout.com">
            <Facebook size={16} strokeWidth={1} />
          </a>
          <a href="https://www.instagram.com/headout.com">
            <Instagram size={16} strokeWidth={1} />
          </a>
          <a href="https://www.twitter.com/headout.com">
            <Twitter size={16} strokeWidth={1} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
