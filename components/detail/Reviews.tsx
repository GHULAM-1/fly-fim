"use client";
import React, { useState } from "react";
import { Star, ChevronDown } from "lucide-react";

const Reviews = () => {
  const [selectedFilter, setSelectedFilter] = useState("Most relevant");

  const ratingBreakdown = [
    { stars: 5, count: 656, percentage: 61 },
    { stars: 4, count: 251, percentage: 23 },
    { stars: 3, count: 76, percentage: 7 },
    { stars: 2, count: 49, percentage: 5 },
    { stars: 1, count: 46, percentage: 4 },
  ];

  const countries = [
    "Germany",
    "United States",
    "France",
    "Spain",
    "Italy",
    "Ireland",
    "Switzerland",
    "India",
    "Greece",
    "Brazil",
  ];

  const filterOptions = [
    "Most relevant",
    "With images",
    "4+ stars",
    "3 stars",
    "<3 stars",
  ];

  const reviews = [
    {
      id: 1,
      user: "Bulou Fay",
      userShort: "Bulou",
      date: "May, 2025",
      rating: 5,
      hasImage: true,
      verified: true,
      text: "Awesome ticket service. Not long to wait in the que. Family loved the view.",
      avatar: "/avatars/bulou.jpg",
    },
    {
      id: 2,
      user: "Ellen Perkins",
      userShort: "Ellen",
      date: "Jul, 2025",
      rating: 5,
      hasImage: false,
      verified: true,
      text: "We had to queue but it didn't take long and once we were on the wheel it was brilliant a really hot day but air con and fabulous views then we headed for sealife and we really enjoyed it especially the penguins!! My favourite ❤️",
      avatar: "/avatars/ellen.jpg",
    },
    {
      id: 3,
      user: "Peter McGuckin",
      userShort: "Peter",
      date: "Jun, 2025",
      rating: 5,
      hasImage: false,
      verified: true,
      text: "Booking the London Eye and river cruise through Headout was very convenient online. The day itself was brilliant, thanks!",
      avatar: "/avatars/peter.jpg",
    },
    {
      id: 4,
      user: "Sandra Dawid",
      userShort: "Sandra",
      date: "Jun, 2025",
      rating: 3,
      hasImage: false,
      verified: true,
      text: "I'm not just writing a positive review here, but a general one. The boat was easy to find, but it certainly wasn't a 40 minute round trip and we had to get off at a station which we didn't want to do. Then we went on the way home (London Eye Pier) and one stop before that the boat was probably broken and everyone had to get off. At this stop, the guests who were already on board were only told that we should get a new ticket (there was a meter-long queue), although we had a ticket and we got it in advance to avoid these queues. We then went downstairs and nobody said anything. In the end we took the Underground back to the London eye because we were already 20 minutes over our timeslot. Luckily we got into the London eye and didn't have to queue, but we were really unlucky with the group inside the eye because they were children who couldn't behave at all and kicked the windows etc. However, this had nothing to do with the ticket from Headout. As a tip, if you book it, allow at least 3 hours between the boat and the eye in case something comes up. It was still nice and you got a perfect impression of London on the first day.",
      avatar: "/avatars/sandra.jpg",
      originalLanguage: "German",
    },
    {
      id: 5,
      user: "Stephen Curtis",
      userShort: "Stephen",
      date: "Jun, 2025",
      rating: 5,
      hasImage: false,
      verified: true,
      text: "We had the best of both worlds... a visit to the Tower of London and then a great cruise to see all the other attractions in the area.",
      avatar: "/avatars/stephen.jpg",
    },
  ];

  const StarRating = ({
    rating,
    size = 16,
  }: {
    rating: number;
    size?: number;
  }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={`${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="my-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Reviews</h2>
      <div>
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="text-center mb-6">
            <div className="text-sm text-gray-600 mb-2">
              How do we collect reviews?
            </div>
            <div className="text-5xl font-bold text-gray-900 mb-2">4.3</div>
            <div className="text-gray-600 mb-2">1,078 ratings</div>
            <StarRating rating={4} size={20} />
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-3 mb-6">
            {ratingBreakdown.map((item) => (
              <div key={item.stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-8">
                  <span className="text-sm font-medium">{item.stars}</span>
                  <Star size={12} className="text-yellow-400 fill-current" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-8">{item.count}</span>
              </div>
            ))}
          </div>

          {/* Countries */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {countries.slice(0, 3).map((country) => (
                <span
                  key={country}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium"
                >
                  {country}
                </span>
              ))}
            </div>
            <div className="text-sm text-gray-600">
              Guests from <strong>Germany, United States, France</strong> and{" "}
              <strong>over 66 countries</strong> have loved this experience
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="mt-10">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filterOptions.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedFilter === filter
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Review Cards */}
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-6">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {review.userShort.charAt(0)}
                </div>

                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-900">
                      {review.userShort}
                    </h4>
                    <span className="text-sm text-gray-500">{review.date}</span>
                    {review.verified && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        Verified booking
                      </span>
                    )}
                  </div>

                  <div className="mb-3">
                    <StarRating rating={review.rating} />
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-3">
                    {review.text}
                  </p>

                  {review.hasImage && (
                    <div className="w-20 h-20 bg-gray-200 rounded-lg mb-3"></div>
                  )}

                  {review.originalLanguage && (
                    <button className="text-blue-600 text-sm hover:underline">
                      View original review in {review.originalLanguage}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show All Reviews Button */}
        <div className="text-center mt-8">
          <button className="text-blue-600 font-semibold hover:underline">
            Show all reviews
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
