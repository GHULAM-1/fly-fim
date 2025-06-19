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
      <Destinations />
      <Recommendations />
      <Activities />
      <Testimonials />
      <MarqueeComp />
      <BrowseThemes />
      <div className="hidden lg:block">
        <Banner />
      </div>
      <Stats />
    </div>
  );
};

export default Home;
