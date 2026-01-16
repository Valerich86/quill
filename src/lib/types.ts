export type User = {
  id: string;
  name: string;
  bio: string|undefined;
  avatar: string|undefined;
  email: string;
  password: string;
}

export type UserCookie = {
  id: string;
  name: string;
  avatar: string|null;
}

export type Post = {
  content: string;
  created_at: string;
  excerpt?: string;
  id: string;
  published_at?: null;
  slug: string;
  status: string;
  title: string;
  updated_at: string;
  user_id: string;
  author: string;
  views: number;
  image_url?: string;
};

export type Photo = {
  alt?: string;
  caption?: string;
  id: string;
  position: number;
  post_id: string;
  url: string;
};

export type Tag = {
  id: string;
  name: string;
};

export type Comment = {
  id: string;
  content: string;
  post_id: string;
  user_id: string;
  created_at: string;
  author: string;
}

export type ParsedLine = {
  type: 'heading' | 'paragraph' | 'offset';
  content: string;
};