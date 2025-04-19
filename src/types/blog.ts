
export interface BlogPost {
  title: string;
  date: string;
  author: string;
  category: string;
  image: string;
  metaDescription: string;
  content: string;
  tags?: string[];
}

export type BlogPostsCollection = Record<string, BlogPost>;
