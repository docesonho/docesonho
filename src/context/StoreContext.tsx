import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, CartItem, HeroConfig } from '../types';
import toast from 'react-hot-toast';
import { useHero } from '@/hooks/useHero';
import { useProducts } from '@/hooks/useProducts';

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
  isLoadingHero?: boolean;
  isLoadingProducts?: boolean;
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
  const { heroConfig: heroConfigData, isLoading: isLoadingHero, updateHeroConfig: mutateHeroConfigHook } = useHero();
  const { 
    products = [], 
    categories = [], 
    isLoading: isLoadingProducts,
    createProduct,
    updateProduct: mutateProduct,
    deleteProduct: mutateDeleteProduct,
    createCategory,
    updateCategory: mutateCategory,
    deleteCategory: mutateDeleteCategory
  } = useProducts();
  
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCartItems = localStorage.getItem('cartItems');
    return savedCartItems ? JSON.parse(savedCartItems) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Garantir que temos um heroConfig mesmo durante o carregamento
  const heroConfig = heroConfigData || defaultHeroConfig;

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
      const itemToRemove = prev.find(item => item.product.id === productId);
      const updatedItems = prev.filter(item => item.product.id !== productId);
      if (itemToRemove) {
        toast(`${itemToRemove.product.name} removido do carrinho`);
      } else {
        toast("Item removido do carrinho"); // Fallback se o item não for encontrado (improvável)
      }
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
    toast("Carrinho esvaziado");
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const addProduct = (product: Omit<Product, "id">) => {
    createProduct.mutate(product);
  };

  const updateProduct = (product: Product) => {
    mutateProduct.mutate(product);
  };

  const deleteProduct = (productId: string) => {
    mutateDeleteProduct.mutate(productId);
  };

  const getProductsByCategory = (categoryId: string) => {
    return products.filter(product => product.categoryId === categoryId);
  };

  const getFeaturedProducts = () => {
    return products.filter(product => product.featured);
  };

  const addCategory = (category: Omit<Category, "id">) => {
    createCategory.mutate(category);
  };

  const updateCategory = (category: Category) => {
    mutateCategory.mutate(category);
  };

  const deleteCategory = (categoryId: string) => {
    const productsInCategory = products.filter(p => p.categoryId === categoryId);
    if (productsInCategory.length > 0) {
      toast.error("Não é possível excluir uma categoria que possui produtos associados.");
      return;
    }
    mutateDeleteCategory.mutate(categoryId);
  };

  const value = {
    products,
    categories,
    cartItems,
    heroConfig,
    isLoadingHero,
    isLoadingProducts,
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
    updateHeroConfig: (config: HeroConfig) => {
      mutateHeroConfigHook.mutate(config);
    },
    addCategory,
    updateCategory,
    deleteCategory
  };

  // Só renderiza o conteúdo quando os dados essenciais estiverem carregados
  if (isLoadingHero || isLoadingProducts) {
    return (
      <StoreContext.Provider value={value}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-bakery-pink"></div>
        </div>
      </StoreContext.Provider>
    );
  }

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
