"use client";
import React, { useState, useEffect } from "react";
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
import { getHomePageData } from "@/lib/api/home";
import { City, Experience } from "@/types/home";

const Home = () => {
  const [destinations, setDestinations] = useState<City[]>([]);
  const [recommendations, setRecommendations] = useState<Experience[]>([]);
  const [activities, setActivities] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await getHomePageData();
      if (response.success) {
        setDestinations(response.data.destinations);
        setRecommendations(response.data.recommendations);
        setActivities(response.data.activities);
      } else {
        console.error("Failed to fetch home page data:", response.message);
        
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div>
      <Hero />
      <Info />
      <div className="px-[24px]">
        <Destinations destinations={destinations} loading={loading} />
      </div>
      <Recommendations recommendations={recommendations} loading={loading} />
      <Activities activities={activities} loading={loading} />
      <Testimonials />
      <MarqueeComp />
      <div className="px-[24px]">
        <div className="md:mb-25 mb-15">
          <BrowseThemes />
        </div>
        <Banner />
        <Stats />
      </div>
    </div>
  );
};

export default Home;
