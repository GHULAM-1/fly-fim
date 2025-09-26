import React, { useState, useEffect } from "react";
import { Diamond, Calendar, Clock, MapPin } from "lucide-react";
import { getBlogPostBySlug } from "@/lib/sanity/queries";

const TravelGuide = ({ blogSlugs, city }: { blogSlugs: string[], city: string }) => {
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // Fetch blog posts from Sanity using the provided slugs
  useEffect(() => {
    const fetchBlogPosts = async () => {
      if (blogSlugs.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const posts = await Promise.all(
          blogSlugs.map(slug => getBlogPostBySlug(slug))
        );
        // Filter out null results and use all available posts
        const validPosts = posts.filter(post => post !== null);
        setBlogPosts(validPosts);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setBlogPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, [blogSlugs]);


  return (
    <div className="py-10 max-w-screen-2xl mx-auto 2xl:px-0">
      <h2 className="text-lg sm:text-2xl font-heading text-[#444444]">
        Get inspired for your {city} visit
      </h2>

      <div className="flex flex-col hover:cursor-pointer md:flex-row gap-6 mt-4">
        {/* Large Purple Card */}
        <a
          href={blogPosts[0] ? `/blog/${blogPosts[0].slug?.current || blogPosts[0].slug || '#'}` : '#'}
          className="w-full md:w-1/2 max-h-[385px] h-[80%] bg-[#330066] rounded-xl overflow-hidden relative p-4 group block hover:bg-[#2d0055] transition-colors"
        >
          <img
            src={blogPosts[0]?.heroImage?.asset?.url || blogPosts[0]?.cardImage?.asset?.url}
            alt=""
            className="absolute bottom-0 right-0 w-36 group-hover:translate-5 transition-all duration-300"
          />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[#330066]/60"></div>
          <div className="flex flex-col md:flex-row h-full">
            {/* Image Section */}
            <div className="w-full md:w-1/2 h-full rounded-lg overflow-hidden z-10">
              <img
                src={blogPosts[0]?.heroImage?.asset?.url || blogPosts[0]?.cardImage?.asset?.url}
                alt="London Eye"
                className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-all duration-300"
              />
            </div>

            {/* Content Section */}
            <div className="w-full md:w-1/2 p-3 md:pl-6 text-white relative z-10">
              <h3 className="text-xl font-halyard-text font-semibold mb-2">{blogPosts[0]?.title}</h3>

              <p className="text-white line-clamp-8 font-halyard-text text-[13px]">
                {blogPosts[0]?.introduction}
              </p>
              <div className="my-3 h-[0.5px] w-full bg-gray-300" />
              {/* <div className="space-y-3 font-halyard-text mb-6">
                <div className="flex items-center gap-2 text-[13px]">
                  <Diamond className="w-4 h-4" />
                  <span>Top attractions & hidden gems</span>
                </div>
                <div className="flex items-center gap-2 text-[13px]">
                  <Clock className="w-4 h-4" />
                  <span>Tips on tickets and timings</span>
                </div>
                <div className="flex items-center gap-2 text-[13px]">
                  <Calendar className="w-4 h-4" />
                  <span>Best of food, shopping & fun</span>
                </div>
                <div className="flex items-center gap-2 text-[13px]">
                  <MapPin className="w-4 h-4" />
                  <span>Seasonal and local events</span>
                </div>
              </div> */}

              <button className="text-sm font-halyard-text bg-white text-purple-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                Get Inspired
              </button>
            </div>
          </div>
        </a>

        {/* Middle Card - Detailed London Itineraries */}
        <a
          href={blogPosts[1] ? `/blog/${blogPosts[1].slug?.current || blogPosts[1].slug || '#'}` : '#'}
          className="w-full md:w-1/4 hover:translate-y-[-7px] hover:cursor-pointer transition-all duration-300 bg-white overflow-hidden flex flex-row md:flex-col gap-3 hover:shadow-lg"
        >
          <img
            src={blogPosts[1]?.heroImage?.asset?.url || blogPosts[1]?.cardImage?.asset?.url}
            alt="London street with UK flags"
            className="w-1/2 md:w-full h-40 md:h-60 object-cover rounded-xl"
          />
          <div>
            <h3 className="text-sm line-clamp-1 md:text-base font-halyard-text text-[#444444] mb-3">
              {blogPosts[1]?.title}
            </h3>
            <p className="text-xs line-clamp-3 text-gray-600 md:text-sm font-halyard-text-light">
              {blogPosts[1]?.introduction}
            </p>
          </div>
        </a>

        {/* Right Card - Best Time To Visit London */}
        <a
          href={blogPosts[2] ? `/blog/${blogPosts[2].slug?.current || blogPosts[2].slug || '#'}` : '#'}
          className="w-full md:w-1/4 hover:translate-y-[-7px] hover:cursor-pointer transition-all duration-300 bg-white overflow-hidden flex flex-row md:flex-col gap-3 hover:shadow-lg"
        >
          <img
            src={blogPosts[2]?.heroImage?.asset?.url || blogPosts[2]?.cardImage?.asset?.url}
            alt="Tower Bridge at sunset"
            className="w-1/2 md:w-full h-40 md:h-60 object-cover rounded-xl"
          />
          <div>
            <h3 className="text-sm line-clamp-1 md:text-base font-halyard-text text-[#444444] mb-3">
              {blogPosts[2]?.title}
            </h3>
            <p className="text-xs line-clamp-3 text-gray-600 md:text-sm font-halyard-text-light">
              {blogPosts[2]?.introduction}
            </p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default TravelGuide;
