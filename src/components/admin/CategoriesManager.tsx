import React, { useState } from 'react';
import { Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';
import { Pencil, Trash2, Plus } from 'lucide-react';

interface CategoriesManagerProps {
  categories: Category[];
  products: { categoryId: string }[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
}

// Atualizando o initialCategory para corresponder à estrutura do banco
const initialCategory = {
  name: '',
  active: true,
  order_index: 0
};

const CategoriesManager: React.FC<CategoriesManagerProps> = ({
  categories,
  products,
  addCategory,
  updateCategory,
  deleteCategory,
}) => {
  const [currentCategory, setCurrentCategory] = useState(initialCategory);
  const [isCategoryEditing, setIsCategoryEditing] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentCategory.name.trim()) {
      toast.error('Por favor, preencha o nome da categoria!');
      return;
    }

    // Preparar os dados da categoria
    const categoryData = {
      name: currentCategory.name.trim(),
      active: true,
      order_index: isCategoryEditing ? currentCategory.order_index : (categories?.length || 0) + 1
    };

    if (isCategoryEditing && 'id' in currentCategory) {
      updateCategory({ ...categoryData, id: currentCategory.id } as Category);
    } else {
      addCategory(categoryData);
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
    const productsInCategory = products.filter((p) => p.categoryId === categoryId);
    if (productsInCategory.length > 0) {
      toast.error('Não é possível excluir uma categoria que possui produtos.');
      return;
    }
    
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
        {categories?.map((category) => (
          <Card key={category.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Ordem: {category.order_index}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {products.filter((p) => p.categoryId === category.id).length} produtos
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
            <DialogDescription>
              Preencha os dados da categoria abaixo
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCategorySubmit} className="space-y-4 py-4">
            <div>
              <Label htmlFor="categoryName">Nome da Categoria</Label>
              <Input
                id="categoryName"
                value={currentCategory.name}
                onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                placeholder="Ex: Bolos, Doces, Tortas..."
                required
                autoComplete="off"
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
