import React from "react";
import BlogPostClient from "./blog-post-client";
import { getBlogPostBySlug, getBlogPostSlugs } from "@/lib/sanity/queries";

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  try {
    const post = await getBlogPostBySlug(slug);
    if (!post) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Post Not Found</h1>
            <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
            <a href="/blog" className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
              Back to Blog
            </a>
          </div>
        </div>
      );
    }

    return <BlogPostClient post={post} />;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Error Loading Post</h1>
          <p className="text-gray-600 mb-8">There was an error loading the blog post.</p>
          <a href="/blog" className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
            Back to Blog
          </a>
        </div>
      </div>
    );
  }
}

export async function generateStaticParams() {
  try {
    const slugs = await getBlogPostSlugs();
    console.log("Generated slugs for static params:", slugs);

    return slugs.map((slug: string) => ({
      slug: slug
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    // Fallback to empty array if there's an error
    return [];
  }
}