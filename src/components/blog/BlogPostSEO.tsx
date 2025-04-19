
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BlogPost } from '@/types/blog';

interface BlogPostSEOProps {
  post: BlogPost;
  slug: string;
}

export const BlogPostSEO = ({ post, slug }: BlogPostSEOProps) => {
  return (
    <Helmet>
      <title>{post.title} | ViaFix Blog | Austin, TX</title>
      <meta name="description" content={post.metaDescription || `Read about ${post.title} from ViaFix, Austin's premier mobile auto repair service.`} />
      <meta name="keywords" content={post.tags ? post.tags.join(', ') : post.category} />
      <link rel="canonical" href={`https://tryviafix.com/blog/${slug}`} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={post.title} />
      <meta property="og:description" content={post.metaDescription} />
      <meta property="og:image" content={post.image} />
      <meta property="article:published_time" content={new Date(post.date).toISOString()} />
      <meta property="article:author" content={post.author} />
      {post.tags && post.tags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={post.title} />
      <meta name="twitter:description" content={post.metaDescription} />
      <meta name="twitter:image" content={post.image} />
    </Helmet>
  );
};
