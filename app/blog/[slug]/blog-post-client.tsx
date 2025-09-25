"use client";
import React, { useState, useEffect } from "react";
import BlogNavbar from "@/components/blog/blog-navbar";
import {
  Calendar,
  Clock,
  Share2,
  User,
  ChevronRight,
  Twitter,
  Dot,
  X,
  Menu,
  ArrowUp,
  ChevronUp,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@radix-ui/react-dropdown-menu";
import EmailCard from "@/components/blog/email-card";
import Stats from "@/components/home/Stats";
import { BlogPost } from "@/lib/sanity/types";

interface BlogPostClientProps {
  post: BlogPost;
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
  const [activeSection, setActiveSection] = useState("");
  const [showTOC, setShowTOC] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  // Generate unique ID from section title
  const generateSectionId = (title: string, index: number) => {
    if (!title) return `section-${index + 1}`;
    return title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
  };

  // Generate table of contents from content sections
  const generateTableOfContents = () => {
    if (!post?.contentSections) return [];
    return post.contentSections.map((section, index) => ({
      id: generateSectionId(section.title, index),
      title: section.title || `Section ${index + 1}`,
    }));
  };

  const tableOfContents = generateTableOfContents();

  useEffect(() => {
    const handleScroll = () => {
      const sections = tableOfContents;
      const scrollPosition = window.scrollY + 100;

      // Update active section
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i].id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }

      // Update scroll progress
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tableOfContents]);

  return (
    <div className="bg-white ">
      {/* Navbar - Fixed on mobile, relative on desktop */}
      <div className="bg-white  fixed md:relative top-0 left-0 right-0 z-[9998]">
        <div className="max-w-[1200px] w-full px-[14px] lg:px-0 mx-auto relative z-[9998]">
          <BlogNavbar />
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative pt-16 md:pt-0" data-hero-section>
        <img
          src={post.heroImage?.asset?.url || "/placeholder-image.jpg"}
          alt={post.heroImage?.alt || post.title}
          className="w-full object-cover h-[190px] lg:h-[490px]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, #131b26 4.83%, rgba(14, 18, 22, .88) 35.88%, rgba(0, 0, 0, .3) 92.18%)",
          }}
        />

        {/* Hero Content */}
        <div className="absolute inset-0  font-halyard-text flex flex-col justify-center z-10">
          <div className="max-w-[1200px] mt-10 md:mt-0 w-full px-[14px] lg:px-0 mx-auto">
            <div className="text-center">
              <div className="text-white/80 md:text-sm text-[10px] mb-[10px]">
                <span className="text-[#d2a6ff]">{post.category?.title}</span>
              </div>
              <h1 className="text-white font-bold text-[22px] md:text-[32px] leading-tight mb-[10px]">
                {post.title}
              </h1>

              {/* Meta info */}
              <div className="flex justify-center flex-wrap items-center gap-6 text-[#ffffffa6]">
                <div className="flex items-center gap-2">
                  <span className="text-[15px] md:text-sm"> Last updated:</span>
                  <span className="text-[15px] md:text-sm">
                    {new Date(post.publishDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] w-full px-[14px] lg:px-[20px] mx-auto py-[15px] lg:py-[30px]">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Desktop Sidebar - Table of Contents */}
          <aside className="hidden lg:block lg:w-[280px] lg:flex-shrink-0 lg:order-1">
            <div className="sticky top-13">
              {/* Table of Contents */}
              <div className="rounded-xl p-4">
                <h3 className="font-semibold border-b-[3px] font-halyard-text text-[#080808] border-[#080808] mb-4 text-[14px]">
                  {post.title}{" "}
                </h3>
                <nav className="space-y-2 mt-6">
                  <ul className="list-disc list-outside pl-4 max-h-[400px] overflow-y-auto">
                    {tableOfContents?.map((item, index) => (
                      <li
                        key={index}
                        className={`mb-[8px] text-[13px] transition-colors font-halyard-text-light${
                          activeSection === item.id
                            ? " text-purple-700"
                            : " hover:text-purple-600"
                        }`}
                      >
                        <a
                          href={`#${item.id}`}
                          className="hover:cursor-pointer block"
                          onClick={(e) => {
                            e.preventDefault();
                            const element = document.getElementById(item.id);
                            if (element) {
                              element.scrollIntoView({ behavior: "smooth" });
                            }
                          }}
                        >
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </aside>

          {/* Article Content */}
          <article className="w-full lg:flex-1 lg:min-w-0 lg:order-2">
            <div className="mb-[13px]">
              <Breadcrumb>
                <BreadcrumbList className="gap-1 md:gap-1.5">
                  {post.breadcrumbs?.map((breadcrumb, index) => (
                    <React.Fragment key={index}>
                      <BreadcrumbItem>
                        {breadcrumb.isCurrentPage ? (
                          <BreadcrumbPage className="text-[11px] md:text-[14px] font-halyard-text text-[#444444]">
                            {breadcrumb.label}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink
                            className="text-[11px] md:text-[14px] font-halyard-text text-[#03829d]"
                            href={breadcrumb.href}
                          >
                            {breadcrumb.label}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {index < (post.breadcrumbs?.length || 0) - 1 && (
                        <BreadcrumbSeparator />
                      )}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <p className="text-[14px] leading-[26px] font-halyard-text text-[#444444]">
              {post.introduction}
            </p>

            {/* Dynamic Sections */}
            {post.contentSections
              ?.filter((section) => section._type !== "stepSection")
              .map((section, index) => (
                <div
                  key={index}
                  id={generateSectionId(section.title, index)}
                  className="font-halyard-text text-[#080808] pt-[20px] scroll-mt-8"
                >
                  <div>
                    <h1 className="md:text-[22px] text-[18px] font-bold mb-[18px]">
                      {section.title}
                    </h1>
                    <div className="border-b border-[#8000FF] border-[1.5px] w-[15%] mb-[16px]"></div>
                    {section.description && (
                      <p className="text-[14px] leading-[26px] font-halyard-text text-[#444444]">
                        {section.description}
                      </p>
                    )}
                    {section.bulletPoints && (
                      <ul className="list-disc list-inside pl-[5px] text-[15px] leading-[26px] font-halyard-text text-[#444444] mt-4">
                        {section.bulletPoints.map((item, itemIndex) => (
                          <li key={itemIndex} className="mb-[10px]">
                            <span className="font-bold">{item.boldText}</span>{" "}
                            {item.subtext}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}

            <div className="mt-15 md:mt-10">
              {/* Steps Section - Dynamic */}
              {post.contentSections
                ?.filter((section) => section._type === "stepSection")
                .map((section, index) => (
                  <div
                    key={index}
                    id={generateSectionId(section.title, index)}
                    className="border relative mt-10 scroll-mt-18"
                  >
                    <div className=" text-white flex items-center justify-center absolute -top-[25px] left-0 right-0">
                      <div className="bg-[#4d7298] text-white md:w-14 md:h-14 w-11 h-11 flex items-center justify-center font-halyard-text font-bold md:text-[22px] text-[18px] rounded-full">
                        {section.stepNumber}
                      </div>
                    </div>
                    <div className="font-halyard-text text-[#080808] mt-[65px] mb-[15px]">
                      <h1 className="md:text-[22px] text-[18px] font-bold text-center">
                        {section.stepTitle}
                      </h1>
                    </div>
                    {section.stepImage && (
                      <div className="max-h-[535px] overflow-hidden">
                        <img
                          src={section.stepImage.asset.url}
                          alt={section.stepImage.alt || section.stepTitle}
                          className="w-full h-auto"
                        />
                      </div>
                    )}
                    <div className="p-[14px]">
                      <div className="mb-[10px]">
                        <p className="text-[15px] leading-[26px] font-halyard-text text-[#444444]">
                          {section.description}
                        </p>
                      </div>
                      <div>
                        {section.location && (
                          <div>
                            <span className="font-bold text-[15px] leading-[26px] font-halyard-text text-[#444444]">
                              Location:
                            </span>{" "}
                            <span className="text-[15px] leading-[26px] font-halyard-text text-[#444444]">
                              {section.location}
                            </span>
                          </div>
                        )}
                        {section.price && (
                          <div>
                            <span className="font-bold text-[15px] leading-[26px] font-halyard-text text-[#444444]">
                              Price:
                            </span>{" "}
                            <span className="text-[15px] leading-[26px] font-halyard-text text-[#444444]">
                              {section.price}
                            </span>
                          </div>
                        )}
                        {section.booking && (
                          <div>
                            <span className="font-bold text-[15px] leading-[26px] font-halyard-text text-[#444444]">
                              Booking:
                            </span>{" "}
                            <span className="text-[15px] leading-[26px] font-halyard-text text-[#444444]">
                              {section.booking.text}
                            </span>
                            {section.booking.link && (
                              <a
                                href={section.booking.link}
                                className="ml-2 text-[#8000FF] hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {section.booking.linkText || "Book Now"}
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="font-halyard-text text-[#080808] text-center pb-10 mt-30 border border-[#8000ff]">
              <p>
                For more on what to do in Rome during the Jubilee Year, check
                out
                <span className="text-[#8000FF]">our guide here</span>
              </p>
            </div>

            {/* More Reads - Dynamic */}
            {post.moreReads && (
              <div className="mt-15 font-halyard-text text-[#080808]">
                <h1 className="text-[32px] font-bold mb-[30px]">
                  {post.moreReads.title}
                </h1>
                <div className="flex flex-wrap md:gap-[34px] gap-[24px]">
                  {post.moreReads.posts?.map((relatedPost, index) => (
                    <div
                      key={relatedPost._id || index}
                      className="flex flex-col w-full md:max-w-[192px] max-w-[186px] overflow-hidden items-center gap-[13px]"
                    >
                      <div className="h-[129px] md:h-[163px] overflow-hidden rounded-[10px]">
                        <img
                          src={
                            relatedPost.heroImage?.asset?.url ||
                            "/placeholder-image.jpg"
                          }
                          alt={relatedPost.heroImage?.alt || relatedPost.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-[15px] leading-[26px] font-halyard-text text-[#444444]">
                        {relatedPost.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Author Review - Dynamic - Responsive Layout */}
            {post.review && (
              <div className="border-t border-[#a8a8a8] border-dotted pt-[15px] md:pt-[30px] mt-[30px]">
                {/* Mobile: Text wrapping around image */}
                <div className="md:hidden relative">
                  <div className="float-left w-[174px] h-[174px] overflow-hidden mr-[15px] mb-[15px]">
                    <img
                      src={
                        post.review.image?.asset?.url ||
                        "/placeholder-image.jpg"
                      }
                      alt={post.review.image?.alt || post.review.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="font-halyard-text text-[#080808]">
                    <h2 className="md:text-[16px] text-[14px] font-bold mb-[10px] text-[#080808]">
                      {post.review.name}
                    </h2>
                    <p className="md:text-[13px] text-[13px] leading-[22px] font-halyard-text text-[#444444] mb-[10px]">
                      {post.review.reviewText}
                    </p>
                    {post.review.socialLink && (
                      <div className="flex">
                        <a
                          href={post.review.socialLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Twitter
                            className="w-[14px] h-[14px]"
                            fill="#444444"
                          />
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="clear-both"></div>
                </div>

                {/* Desktop: Image on right */}
                <div className="hidden md:flex gap-[20px]">
                  <div className="w-[200px] h-[200px] overflow-hidden flex-shrink-0">
                    <img
                      src={
                        post.review.image?.asset?.url ||
                        "/placeholder-image.jpg"
                      }
                      alt={post.review.image?.alt || post.review.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="font-halyard-text text-[#080808] flex-1">
                    <h2 className="text-[18px] font-bold mb-[15px] text-[#080808]">
                      {post.review.name}
                    </h2>
                    <p className="text-[14px] leading-[24px] font-halyard-text text-[#444444] mb-[15px]">
                      {post.review.reviewText}
                    </p>
                    {post.review.socialLink && (
                      <div className="flex">
                        <a
                          href={post.review.socialLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Twitter
                            className="w-[16px] h-[16px]"
                            fill="#444444"
                          />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </article>
        </div>
        <div className="mt-[50px]">
          <EmailCard />
          <Stats />
        </div>
      </div>

      {/* Summary Button - Bottom Right - Mobile Only */}
      <button
        onClick={() => setShowSummary(true)}
        className="md:hidden fixed bottom-20 -right-1 bg-white text-purple-600 px-2 py-1 rounded-full shadow-sm transition-colors z-40 flex items-center gap-2"
      >
        <Menu className="w-2 h-2" />
        <span className="text-[9px] font-halyard-text font-medium">
          Summary
        </span>
      </button>

      {/* Scroll to Top Button - Bottom Right */}
      <button
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="fixed bottom-4 right-4 bg-[#00000099] text-white p-1 rounded-xs shadow-lg hover:bg-purple-700 transition-colors z-40"
      >
        <ChevronUp className="w-4 h-4" />
      </button>

      {/* Summary Sidebar Overlay - Mobile Only */}
      {showSummary && (
        <div
          className="md:hidden fixed inset-0 bg-black/70 bg-opacity-50 z-50"
          onClick={() => setShowSummary(false)}
        />
      )}

      {/* Summary Sidebar - Mobile Only */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 z-[60] ${
          showSummary ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-3">
            <h4 className="font-semibold font-halyard-text text-[#080808]  mb-6 text-[16px]">
            {post.title}            </h4>
            <nav className="space-y-2">
              <ul className="list-none space-y-3">
                {tableOfContents?.map((item, index) => (
                  <li key={index}>
                    <a
                      href={`#${item.id}`}
                      className={`block py-2 px-3 border-b text-[14px] transition-colors font-halyard-text hover:bg-purple-50 hover:text-purple-600 ${
                        activeSection === item.id
                          ? " text-purple-700 font-medium"
                          : "text-gray-700"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        const element = document.getElementById(item.id);
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth" });
                          setShowSummary(false); // Close sidebar after navigation
                        }
                      }}
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
