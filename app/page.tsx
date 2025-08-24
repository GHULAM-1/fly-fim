import Hero from "@/components/home/Hero";
import Banner from "@/components/home/Banner";
import Stats from "@/components/home/Stats";
import BrowseThemes from "@/components/home/BrowseThemes";
import MarqueeComp from "@/components/home/Marquee";
import Info from "@/components/home/Info";
import Destinations from "@/components/home/Destinations";
import Recommendations from "@/components/home/Recommendations";
import Activities from "@/components/home/Activities";
import Testimonials from "@/components/home/Testimonials";
import React from "react";

const Home = () => {
  return (
    <div>
      <Hero />
      <Info />
      <div className="px-[24px]">
        <Destinations />
      </div>
      <Recommendations />
      <Activities />
      <Testimonials />
      <MarqueeComp />
      <div className="px-[24px]">
        <BrowseThemes />
        <Banner />
        <Stats />
      </div>
    </div>
  );
};

export default Home;
