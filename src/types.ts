export type Collection = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  image_url: string | null;
  gallery: string[] | null;
  collection_id: string | null;
  badge: string | null;
  rating: number;
  in_stock: boolean;
};

export type Review = {
  id: string;
  product_id: string | null;
  author: string;
  rating: number;
  title: string | null;
  body: string;
  location: string | null;
  avatar_color: string | null;
  verified: boolean | null;
  helpful_count: number | null;
  source: string | null;
  reviewed_at: string | null;
  created_at: string;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  quantity: number;
  variant?: string;
};
