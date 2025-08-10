
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types/blog';
import BlogCard from '@/components/BlogCard';
import { Helmet } from 'react-helmet-async';

const POSTS_PER_PAGE = 6;

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: blogPosts = [], isLoading } = useQuery({
    queryKey: ['blog-posts', currentPage],
    queryFn: async () => {
      const offset = (currentPage - 1) * POSTS_PER_PAGE;
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false })
        .range(offset, offset + POSTS_PER_PAGE - 1);

      if (error) throw error;
      return data as BlogPost[];
    },
  });

  const { data: totalCount = 0 } = useQuery({
    queryKey: ['blog-posts-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true })
        .eq('published', true);

      if (error) throw error;
      return count || 0;
    },
  });

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  return (
    <>
      <Helmet>
        <title>Realer Estate Blog - NYC Real Estate Tips & Guides</title>
        <meta name="description" content="Tips, guides, and stories on finding affordable apartments, rent-stabilized homes, and below-market deals in NYC." />
        <meta property="og:title" content="Realer Estate Blog - NYC Real Estate Tips & Guides" />
        <meta property="og:description" content="Tips, guides, and stories on finding affordable apartments, rent-stabilized homes, and below-market deals in NYC." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`${window.location.origin}/blog`} />
      </Helmet>

      <div className="min-h-screen bg-black text-white font-inter">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tighter">
              Realer Estate Blog
            </h1>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              Tips, guides, and stories on finding affordable apartments, rent-stabilized homes, and below-market deals in NYC.
            </p>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-900 rounded-lg p-6 animate-pulse">
                    <div className="h-48 bg-gray-800 rounded-lg mb-4"></div>
                    <div className="h-6 bg-gray-800 rounded mb-3"></div>
                    <div className="h-4 bg-gray-800 rounded mb-2"></div>
                    <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : blogPosts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  {blogPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-4">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                    >
                      Previous
                    </button>
                    
                    <span className="text-gray-300">
                      Page {currentPage} of {totalPages}
                    </span>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <h2 className="text-2xl font-semibold mb-4">No blog posts yet</h2>
                <p className="text-gray-400">Check back soon for our latest insights on NYC real estate.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;
