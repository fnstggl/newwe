
import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '@/types/blog';
import { format } from 'date-fns';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <article className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors group">
      {post.featured_image && (
        <div className="aspect-video overflow-hidden">
          <img
            src={post.featured_image}
            alt={post.featured_image_alt || post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="p-6">
        <Link to={`/blog/${post.slug}`} className="block">
          <h2 className="text-xl font-semibold mb-3 hover:text-blue-400 transition-colors tracking-tight">
            {post.title}
          </h2>
        </Link>
        
        <p className="text-gray-300 mb-4 leading-relaxed">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-400">
          <time dateTime={post.published_at}>
            {post.published_at && format(new Date(post.published_at), 'MMMM d, yyyy')}
          </time>
          <Link 
            to={`/blog/${post.slug}`}
            className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
          >
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
