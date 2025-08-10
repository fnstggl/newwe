
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { BlogPost, CreateBlogPostData } from '@/types/blog';
import { toast } from 'sonner';

const BlogAdmin = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  // Check if user is admin
  const isAdmin = user?.email === 'beckettfbusiness@gmail.com';

  const { data: posts = [] } = useQuery({
    queryKey: ['admin-blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as BlogPost[];
    },
    enabled: isAdmin,
  });

  const createMutation = useMutation({
    mutationFn: async (postData: CreateBlogPostData) => {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([postData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      setIsCreating(false);
      toast.success('Blog post created successfully!');
    },
    onError: (error) => {
      toast.error('Failed to create blog post: ' + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...postData }: { id: string } & Partial<CreateBlogPostData>) => {
      const { data, error } = await supabase
        .from('blog_posts')
        .update(postData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      setEditingPost(null);
      toast.success('Blog post updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update blog post: ' + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      toast.success('Blog post deleted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to delete blog post: ' + error.message);
    },
  });

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black text-white font-inter flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold tracking-tighter">Blog Administration</h1>
            <button
              onClick={() => setIsCreating(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Create New Post
            </button>
          </div>

          {(isCreating || editingPost) && (
            <BlogPostForm
              post={editingPost}
              onSubmit={(data) => {
                if (editingPost) {
                  updateMutation.mutate({ id: editingPost.id, ...data });
                } else {
                  createMutation.mutate(data);
                }
              }}
              onCancel={() => {
                setIsCreating(false);
                setEditingPost(null);
              }}
              isLoading={createMutation.isPending || updateMutation.isPending}
            />
          )}

          <div className="grid gap-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-gray-900 p-6 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                    <p className="text-gray-400 mb-3">{post.excerpt}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Status: {post.published ? 'Published' : 'Draft'}</span>
                      <span>Slug: {post.slug}</span>
                      <span>Created: {new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingPost(post)}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this post?')) {
                          deleteMutation.mutate(post.id);
                        }
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface BlogPostFormProps {
  post?: BlogPost | null;
  onSubmit: (data: CreateBlogPostData) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const BlogPostForm: React.FC<BlogPostFormProps> = ({ post, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState<CreateBlogPostData>({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    featured_image: post?.featured_image || '',
    featured_image_alt: post?.featured_image_alt || '',
    meta_description: post?.meta_description || '',
    published: post?.published || false,
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg mb-8">
      <h2 className="text-2xl font-bold mb-6">
        {post ? 'Edit Post' : 'Create New Post'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => {
              const title = e.target.value;
              setFormData({
                ...formData,
                title,
                slug: generateSlug(title),
              });
            }}
            className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Slug</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Excerpt</label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            rows={3}
            className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Meta Description (SEO)</label>
          <textarea
            value={formData.meta_description}
            onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
            rows={2}
            className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Featured Image URL (optional)</label>
          <input
            type="url"
            value={formData.featured_image}
            onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
            className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Featured Image Alt Text</label>
          <input
            type="text"
            value={formData.featured_image_alt}
            onChange={(e) => setFormData({ ...formData, featured_image_alt: e.target.value })}
            className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Content (Markdown)</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={15}
            className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none font-mono"
            required
          />
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="rounded"
            />
            <span>Publish immediately</span>
          </label>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg transition-colors"
          >
            {isLoading ? 'Saving...' : (post ? 'Update Post' : 'Create Post')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogAdmin;
