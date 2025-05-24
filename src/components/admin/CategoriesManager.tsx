
import React, { useState } from 'react';
import { Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus } from 'lucide-react';

interface CategoriesManagerProps {
  categories: Category[];
  products: { categoryId: string }[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
}

const initialCategory: Omit<Category, 'id'> = {
  name: '',
  slug: '',
};

const CategoriesManager: React.FC<CategoriesManagerProps> = ({
  categories,
  products,
  addCategory,
  updateCategory,
  deleteCategory,
}) => {
  const [currentCategory, setCurrentCategory] = useState<Omit<Category, 'id'> & Partial<Pick<Category, 'id'>>>(initialCategory);
  const [isCategoryEditing, setIsCategoryEditing] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentCategory.name) {
      toast.error('Por favor, preencha o nome da categoria!');
      return;
    }

    if (isCategoryEditing && currentCategory.id) {
      updateCategory(currentCategory as Category);
    } else {
      addCategory(currentCategory);
    }

    setCurrentCategory(initialCategory);
    setIsCategoryEditing(false);
    setIsCategoryDialogOpen(false);
  };

  const handleEditCategory = (category: Category) => {
    setCurrentCategory(category);
    setIsCategoryEditing(true);
    setIsCategoryDialogOpen(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      deleteCategory(categoryId);
    }
  };

  const handleAddNewCategory = () => {
    setCurrentCategory(initialCategory);
    setIsCategoryEditing(false);
    setIsCategoryDialogOpen(true);
  };

  return (
    <div className="py-4">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-semibold">Lista de Categorias</h2>
        
        <Button onClick={handleAddNewCategory}>
          <Plus size={16} className="mr-1" /> Nova Categoria
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Slug: {category.slug}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {products.filter((p) => p.categoryId === category.id).length} produtos nesta categoria
                  </p>
                </div>
                
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditCategory(category)}
                  >
                    <Pencil size={16} />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{isCategoryEditing ? 'Editar Categoria' : 'Adicionar Nova Categoria'}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleCategorySubmit} className="space-y-4 py-4">
            <div>
              <Label htmlFor="categoryName">Nome da Categoria</Label>
              <Input
                id="categoryName"
                value={currentCategory.name}
                onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                required
              />
            </div>
            
            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCategoryDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {isCategoryEditing ? 'Atualizar' : 'Adicionar'} Categoria
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoriesManager;
