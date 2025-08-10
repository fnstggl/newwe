
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types/blog';
import { Helmet } from 'react-helmet-async';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      if (!slug) throw new Error('No slug provided');
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) throw error;
      return data as BlogPost;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white font-inter">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto animate-pulse">
            <div className="h-8 bg-gray-800 rounded mb-4"></div>
            <div className="h-4 bg-gray-800 rounded mb-8 w-1/3"></div>
            <div className="h-64 bg-gray-800 rounded mb-8"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-800 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <>
      <Helmet>
        <title>{post.title} - Realer Estate Blog</title>
        <meta name="description" content={post.meta_description} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.meta_description} />
        <meta property="og:type" content="article" />
        {post.featured_image && (
          <meta property="og:image" content={post.featured_image} />
        )}
        <meta property="article:published_time" content={post.published_at} />
        <meta property="article:author" content="Realer Estate" />
        <link rel="canonical" href={`${window.location.origin}/blog/${post.slug}`} />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.title,
            "description": post.meta_description,
            "author": {
              "@type": "Organization",
              "name": "Realer Estate"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Realer Estate",
              "logo": {
                "@type": "ImageObject",
                "url": `${window.location.origin}/favicon.ico`
              }
            },
            "datePublished": post.published_at,
            "dateModified": post.updated_at,
            ...(post.featured_image && {
              "image": {
                "@type": "ImageObject",
                "url": post.featured_image,
                "alt": post.featured_image_alt || post.title
              }
            })
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-black text-white font-inter">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <header className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tighter leading-tight">
                {post.title}
              </h1>
              
              <div className="text-gray-400 mb-8">
                <time dateTime={post.published_at}>
                  {post.published_at && format(new Date(post.published_at), 'MMMM d, yyyy')}
                </time>
              </div>

              {post.featured_image && (
                <div className="aspect-video overflow-hidden rounded-lg mb-8">
                  <img
                    src={post.featured_image}
                    alt={post.featured_image_alt || post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </header>

            <article className="prose prose-lg prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="text-3xl font-bold mb-6 tracking-tight">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-2xl font-semibold mb-4 mt-8 tracking-tight">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-xl font-semibold mb-3 mt-6 tracking-tight">{children}</h3>,
                  p: ({ children }) => <p className="mb-6 leading-relaxed text-gray-200">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-6 space-y-2 text-gray-200">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-6 space-y-2 text-gray-200">{children}</ol>,
                  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-blue-500 pl-6 my-6 italic text-gray-300">
                      {children}
                    </blockquote>
                  ),
                  code: ({ children }) => (
                    <code className="bg-gray-800 px-2 py-1 rounded text-sm font-mono">{children}</code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto mb-6">{children}</pre>
                  ),
                  a: ({ href, children }) => (
                    <a href={href} className="text-blue-400 hover:text-blue-300 transition-colors underline">
                      {children}
                    </a>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </article>

            <div className="mt-16 pt-8 border-t border-gray-800">
              <a 
                href="/blog" 
                className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                ← Back to Blog
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPostPage;
