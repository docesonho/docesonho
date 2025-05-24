import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminHeader from '@/components/admin/AdminHeader';
import ProductsManager from '@/components/admin/ProductsManager';
import CategoriesManager from '@/components/admin/CategoriesManager';
import HeroManager from '@/components/admin/HeroManager';
import ChangePassword from '@/components/admin/ChangePassword';

const Admin: React.FC = () => {
  const { 
    products, 
    categories, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    heroConfig, 
    updateHeroConfig,
    addCategory,
    updateCategory,
    deleteCategory 
  } = useStore();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuthenticated ? (
        <AdminLogin onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div className="container mx-auto px-4 py-8">
          <AdminHeader onLogout={handleLogout} />
          
          <Tabs defaultValue="products">
            <TabsList>
              <TabsTrigger value="products">Produtos</TabsTrigger>
              <TabsTrigger value="categories">Categorias</TabsTrigger>
              <TabsTrigger value="hero">Hero</TabsTrigger>
              <TabsTrigger value="password">Senha</TabsTrigger>
            </TabsList>
            
            <TabsContent value="products">
              <ProductsManager 
                products={products}
                categories={categories}
                addProduct={addProduct}
                updateProduct={updateProduct}
                deleteProduct={deleteProduct}
              />
            </TabsContent>

            <TabsContent value="categories">
              <CategoriesManager 
                categories={categories}
                products={products}
                addCategory={addCategory}
                updateCategory={updateCategory}
                deleteCategory={deleteCategory}
              />
            </TabsContent>

            <TabsContent value="hero">
              <HeroManager
                heroConfig={heroConfig}
                updateHeroConfig={updateHeroConfig}
              />
            </TabsContent>

            <TabsContent value="password">
              <ChangePassword />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default Admin;
