import Link from "next/link";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sara",
      country: "Italy",
      avatar: "/images/t1.jpeg",
      images: ["/images/d4.jpg.avif", "/images/d3.jpg.avif"],
      rating: 5,
      review:
        "Very positive experience. To change the digital tickets, just go to the cashiers (the attendants will show you the correct way) and you will be given the paper tickets. Audio guide well done and very interesting tour of the castle",
      originalLanguage: "Italian",
      experience: "Windsor Castle Entry Tickets",
    },
    {
      id: 2,
      name: "Sarah",
      country: "United States",
      avatar: "/images/t2.jpeg",
      images: ["/images/d1.jpg.avif", "/images/d2.jpg.avif"],
      rating: 5,
      review:
        "Absolutely fantastic trip! Everything was perfectly planned and executed. The attention to detail was remarkable and exceeded all expectations. The guide was knowledgeable and friendly throughout the entire experience.",
      originalLanguage: "English",
      experience: "London Eye Fast Track Tickets",
    },
    {
      id: 3,
      name: "Marco",
      country: "Spain",
      avatar: "/images/t3.jpeg",
      images: ["/images/d5.jpg.avif", "/images/d6.jpeg.avif"],
      rating: 4,
      review:
        "Great value for money! The booking process was smooth and the experience was memorable. Would definitely book again for my next trip. The staff was helpful and the facilities were clean and well-maintained.",
      originalLanguage: "Spanish",
      experience: "Tower Bridge Exhibition",
    },
    {
      id: 4,
      name: "Emma",
      country: "Australia",
      avatar: "/images/t1.jpeg",
      images: ["/images/d3.jpg.avif", "/images/d4.jpg.avif"],
      rating: 5,
      review:
        "Outstanding service from start to finish. The team was professional, friendly, and made sure we had an unforgettable experience. Highly recommend this to anyone visiting London for the first time.",
      originalLanguage: "English",
      experience: "Westminster Abbey Tickets",
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-pink-500 fill-pink-500" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="py-4 sm:py-10 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-28 max-w-screen-2xl mx-auto 2xl:px-0 bg-gradient-to-b from-white to-purple-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg sm:text-2xl font-semibold md:font-bold text-gray-700 flex items-center gap-2">
          Millions love flying out with us
          <img src="/images/info3.png" alt="" className="w-10" />
        </h2>
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="#"
            className="text-sm text-gray-500 underline underline-offset-4 whitespace-nowrap"
          >
            See all
          </Link>
        </div>
      </div>
      <Carousel>
        <CarouselContent className="px-4 gap-4">
          {testimonials.map((testimonial) => (
            <CarouselItem
              key={testimonial.id}
              className="p-4 bg-white border rounded-xl basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              {/* Header with avatar, name, country and rating */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {testimonial.name}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {testimonial.country}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex items-center">
                    {renderStars(testimonial.rating)}
                  </div>
                  <span className="text-pink-500 font-semibold ml-1">
                    {testimonial.rating}/5
                  </span>
                </div>
              </div>

              {/* Images */}
              <div className="flex gap-2 mb-4">
                {testimonial.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Experience image ${index + 1}`}
                    className="w-1/2 h-24 object-cover rounded-lg"
                  />
                ))}
              </div>

              {/* Review text */}
              <p className="text-gray-700 text-sm leading-relaxed mb-3">
                {testimonial.review}
              </p>

              {/* View original review link */}
              <Link
                href="#"
                className="text-blue-600 text-sm hover:underline block mb-4"
              >
                View original review in {testimonial.originalLanguage}
              </Link>

              {/* Experience name */}
              <div className="border-t pt-3">
                <p className="text-gray-600 text-sm font-medium">
                  {testimonial.experience}
                </p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default Testimonials;
