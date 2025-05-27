export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string;
  category_id: string;
  featured: boolean;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  order_index: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  username: string;
  password: string;
}

export interface HeroConfig {
  title: string;
  subtitle: string;
  buttonText: string;
  image1: string;
  image2: string;
  image3: string;
}
