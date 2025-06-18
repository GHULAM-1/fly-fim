import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const Destinations = () => {
  const destinations = [
    {
      id: 1,
      description: "Things to do in New York",
      place: "United States",
      image: "/images/d6.jpeg.avif",
    },
    {
      id: 2,
      description: "Things to do in London",
      place: "United Kingdom",
      image: "/images/d5.jpg.avif",
    },
    {
      id: 3,
      description: "Things to do in Dubai",
      place: "United Arab Emirates",
      image: "/images/d4.jpg.avif",
    },
    {
      id: 4,
      description: "Things to do in Rome",
      place: "Italy",
      image: "/images/d3.jpg.avif",
    },
    {
      id: 5,
      description: "Things to do in Paris",
      place: "France",
      image: "/images/d2.jpg.avif",
    },
    {
      id: 6,
      description: "Things to do in Singapore",
      place: "Singapore",
      image: "/images/d1.jpg.avif",
    },
  ];

  return (
    <div className="py-10 px-28">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-700">
          Explore world's top destinations
        </h2>
        <div className="flex items-center gap-2">
          <button className="text-sm text-gray-500 underline underline-offset-4">
            See all
          </button>
        </div>
      </div>
      <Carousel className="mt-10">
        <CarouselContent>
          {destinations.map((destination) => (
            <CarouselItem key={destination.id} className="basis-1/6">
              <img
                src={destination.image}
                alt={destination.description}
                className="rounded"
              />
              <p className="font-semibold text-gray-700 mt-2 max-w-32">
                {destination.description}
              </p>
              <p className="text-gray-500 text-sm mt-1">{destination.place}</p>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default Destinations;
