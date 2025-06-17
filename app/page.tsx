import Hero from "@/components/home/Hero";
import Banner from "@/components/home/Banner";
import Stats from "@/components/home/Stats";
import BrowseThemes from "@/components/home/BrowseThemes";
import MarqueeComp from "@/components/home/Marquee";
import Info from "@/components/home/Info";
import React from "react";

const Home = () => {
  return (
    <div>
      <Hero />
      <Info />
      <MarqueeComp />
      <BrowseThemes />
      <Banner />
      <Stats />
    </div>
  );
};

export default Home;
