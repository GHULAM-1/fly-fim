"use client"
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
import PaymentSuccessHandler from "@/components/PaymentSuccessHandler";
import React, { useEffect, useState } from "react";
import { WorldwideResponse } from "@/types/worldwide/worldwide-home-types";
import { fetchHomePage } from "@/api/worldwide/worlwide-home-api";

export default function Home () {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<WorldwideResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
    useEffect(() => {
      const loadData = async () => {
        try {
          setLoading(true);
          const data = await fetchHomePage();
          setData(data);
        } catch (err) {
          console.error('Error loading cities:', err);
          setError('Failed to load cities.');
          // Keep empty array instead of fallback data
          setData(null);  
        } finally {
          setLoading(false);
        }
      };
  
      loadData();
    }, []);
  return (
    <div>
      <PaymentSuccessHandler />
      <Hero />
      <Info />
      <div className="px-[24px]">
        <Destinations />
      </div>
      <Recommendations data={data?.data} />
      <Activities />
      <Testimonials data={data?.data}/>
      <MarqueeComp />
      <div className="px-[24px]">
        <div className="md:mb-25 mb-15">
          <BrowseThemes categoriesData={data?.data?.categories} />
        </div>
        <Banner />
        <Stats />
      </div>
    </div>
  );
};
