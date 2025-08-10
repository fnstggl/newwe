
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image?: string;
  featured_image_alt?: string;
  meta_description: string;
  author_email: string;
  published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBlogPostData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image?: string;
  featured_image_alt?: string;
  meta_description: string;
  published?: boolean;
}
