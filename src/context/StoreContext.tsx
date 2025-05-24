import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, CartItem, HeroConfig } from '../types';
import { toast } from "sonner";

// Sample data
const sampleCategories: Category[] = [
  { id: "1", name: "Bolos", slug: "bolos" },
  { id: "2", name: "Doces", slug: "doces" },
  { id: "3", name: "Tortas", slug: "tortas" },
  { id: "4", name: "Salgados", slug: "salgados" },
];

const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Bolo de Chocolate",
    description: "Delicioso bolo de chocolate com cobertura de ganache",
    price: 45.9,
    image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=800&h=800&auto=format&fit=crop",
    categoryId: "1",
    featured: true,
  },
  {
    id: "2",
    name: "Bolo de Morango",
    description: "Bolo com massa branca, recheio e cobertura de morangos frescos",
    price: 48.9,
    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=800&h=800&auto=format&fit=crop",
    categoryId: "1",
  },
  {
    id: "3",
    name: "Brigadeiro Gourmet",
    description: "Brigadeiros artesanais com chocolate belga",
    price: 3.5,
    image: "https://images.unsplash.com/photo-1597655601841-214a4cfe8b2c?q=80&w=800&h=800&auto=format&fit=crop",
    categoryId: "2",
    featured: true,
  },
  {
    id: "4",
    name: "Torta de Limão",
    description: "Torta de limão com base crocante e cobertura de merengue",
    price: 38.9,
    image: "https://images.unsplash.com/photo-1519915028121-7d3463d5b1ff?q=80&w=800&h=800&auto=format&fit=crop",
    categoryId: "3",
  },
  {
    id: "5",
    name: "Coxinha",
    description: "Coxinha cremosa de frango com catupiry",
    price: 4.9,
    image: "https://images.unsplash.com/photo-1628824851008-ad858fa70dd2?q=80&w=800&h=800&auto=format&fit=crop",
    categoryId: "4",
  },
  {
    id: "6",
    name: "Bolo Red Velvet",
    description: "Bolo vermelho com recheio de cream cheese",
    price: 55.9,
    image: "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?q=80&w=800&h=800&auto=format&fit=crop",
    categoryId: "1",
  },
  {
    id: "7",
    name: "Beijinho",
    description: "Docinhos de coco com cravos",
    price: 2.9,
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800&h=800&auto=format&fit=crop",
    categoryId: "2",
  },
  {
    id: "8",
    name: "Torta de Maçã",
    description: "Torta de maçã com canela e açúcar",
    price: 36.9,
    image: "https://images.unsplash.com/photo-1562007908-17c67e878c88?q=80&w=800&h=800&auto=format&fit=crop",
    categoryId: "3",
    featured: true,
  },
];

// Default hero configuration
const defaultHeroConfig: HeroConfig = {
  title: "Delícias com um clique",
  subtitle: "Bolos, doces e tortas artesanais com entrega rápida. Faça seu pedido pelo WhatsApp!",
  buttonText: "Ver Catálogo",
  image1: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&h=800&auto=format&fit=crop",
  image2: "https://images.unsplash.com/photo-1587668178277-295251f900ce?q=80&w=800&h=800&auto=format&fit=crop",
  image3: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=800&h=800&auto=format&fit=crop"
};

interface StoreContextType {
  products: Product[];
  categories: Category[];
  cartItems: CartItem[];
  heroConfig: HeroConfig;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  getProductsByCategory: (categoryId: string) => Product[];
  getFeaturedProducts: () => Product[];
  updateHeroConfig: (config: HeroConfig) => void;
  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with sample data
  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = localStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : sampleProducts;
  });
  
  const [categories, setCategories] = useState<Category[]>(() => {
    const savedCategories = localStorage.getItem('categories');
    return savedCategories ? JSON.parse(savedCategories) : sampleCategories;
  });
  
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCartItems = localStorage.getItem('cartItems');
    return savedCartItems ? JSON.parse(savedCartItems) : [];
  });

  const [heroConfig, setHeroConfig] = useState<HeroConfig>(() => {
    const savedHeroConfig = localStorage.getItem('heroConfig');
    return savedHeroConfig ? JSON.parse(savedHeroConfig) : defaultHeroConfig;
  });

  // Save to localStorage when products change
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  // Save to localStorage when cart items change
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Save to localStorage when hero config changes
  useEffect(() => {
    localStorage.setItem('heroConfig', JSON.stringify(heroConfig));
  }, [heroConfig]);

  // Save to localStorage when categories change
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const addToCart = (product: Product, quantity: number) => {
    setCartItems(prev => {
      const existingItemIndex = prev.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...prev];
        updatedItems[existingItemIndex].quantity += quantity;
        toast.success(`${product.name} adicionado ao carrinho`);
        return updatedItems;
      } else {
        // Add new item
        toast.success(`${product.name} adicionado ao carrinho`);
        return [...prev, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => {
      const updatedItems = prev.filter(item => item.product.id !== productId);
      toast.info("Item removido do carrinho");
      return updatedItems;
    });
  };

  const updateCartItemQuantity = (productId: string, quantity: number) => {
    setCartItems(prev => {
      const updatedItems = prev.map(item => {
        if (item.product.id === productId) {
          return { ...item, quantity };
        }
        return item;
      });
      return updatedItems.filter(item => item.quantity > 0);
    });
  };

  const clearCart = () => {
    setCartItems([]);
    toast.info("Carrinho esvaziado");
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  // Admin functions
  const addProduct = (product: Product) => {
    setProducts(prev => {
      const newProduct = { ...product, id: Date.now().toString() };
      toast.success(`Produto "${product.name}" adicionado com sucesso!`);
      return [...prev, newProduct];
    });
  };

  const updateProduct = (product: Product) => {
    setProducts(prev => {
      const updatedProducts = prev.map(p => 
        p.id === product.id ? product : p
      );
      toast.success(`Produto "${product.name}" atualizado com sucesso!`);
      return updatedProducts;
    });
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => {
      const productToDelete = prev.find(p => p.id === productId);
      const updatedProducts = prev.filter(p => p.id !== productId);
      if (productToDelete) {
        toast.success(`Produto "${productToDelete.name}" removido com sucesso!`);
      }
      return updatedProducts;
    });
  };

  const getProductsByCategory = (categoryId: string) => {
    return products.filter(product => product.categoryId === categoryId);
  };

  const getFeaturedProducts = () => {
    return products.filter(product => product.featured);
  };

  const updateHeroConfig = (config: HeroConfig) => {
    setHeroConfig(config);
    toast.success('Configuração do Hero atualizada com sucesso!');
  };

  const addCategory = (category: Omit<Category, "id">) => {
    const slug = category.name
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
      
    setCategories(prev => {
      const newCategory = { ...category, slug, id: Date.now().toString() };
      toast.success(`Categoria "${category.name}" adicionada com sucesso!`);
      return [...prev, newCategory];
    });
  };

  const updateCategory = (category: Category) => {
    setCategories(prev => {
      const updatedCategories = prev.map(c => 
        c.id === category.id ? category : c
      );
      toast.success(`Categoria "${category.name}" atualizada com sucesso!`);
      return updatedCategories;
    });
  };

  const deleteCategory = (categoryId: string) => {
    // Check if there are products using this category
    const productsInCategory = products.filter(p => p.categoryId === categoryId);
    if (productsInCategory.length > 0) {
      toast.error("Não é possível excluir uma categoria que possui produtos associados.");
      return;
    }
    
    setCategories(prev => {
      const categoryToDelete = prev.find(c => c.id === categoryId);
      const updatedCategories = prev.filter(c => c.id !== categoryId);
      if (categoryToDelete) {
        toast.success(`Categoria "${categoryToDelete.name}" removida com sucesso!`);
      }
      return updatedCategories;
    });
  };

  const value = {
    products,
    categories,
    cartItems,
    heroConfig,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    getCartTotal,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
    getFeaturedProducts,
    updateHeroConfig,
    addCategory,
    updateCategory,
    deleteCategory
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
