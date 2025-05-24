
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
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
