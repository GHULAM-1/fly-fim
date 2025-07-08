import React from "react";
import ProductHeader from "@/components/detail/ProductHeader";
import ImageGallery from "@/components/detail/ImageGallery";
import KeyFeatures from "@/components/detail/KeyFeatures";
import TicketPreference from "@/components/detail/TicketPreference";
import ReviewsSection from "@/components/detail/ReviewsSection";
import BookingCard from "@/components/detail/BookingCard";
import Highlights from "@/components/detail/Highlights";
import Reviews from "@/components/detail/Reviews";
import Stats from "@/components/home/Stats";
import Testimonials from "@/components/things-to-do/Testimonials";
import Banner from "@/components/home/Banner";
import Destinations from "@/components/home/Destinations";
import BrowseThemes from "@/components/tickets/BrowseThemes";
import Activities from "@/components/home/Activities";

const ProductDetail = () => {
  return (
    <div className="min-h-screen">
      <ProductHeader />
      <ImageGallery />
      <div className="my-10 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-28 max-w-screen-2xl mx-auto">
        <div className="flex gap-10 relative">
          <div className="w-2/3">
            <KeyFeatures />
            <TicketPreference />
            <ReviewsSection />
            <Highlights />
            <Reviews />
          </div>
          <div className="w-1/3 sticky top-32 h-fit">
            <BookingCard />
          </div>
        </div>
      </div>
      <Activities />
      <BrowseThemes />
      <Destinations />
      <Banner />
      <Testimonials />
      <Stats />
    </div>
  );
};

export default ProductDetail;
