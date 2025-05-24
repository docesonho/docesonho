
import React, { useState } from 'react';
import { Product, Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { formatCurrency, resizeImage } from '@/lib/utils';

interface ProductsManagerProps {
  products: Product[];
  categories: Category[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
}

const initialProduct: Product = {
  id: '',
  name: '',
  description: '',
  price: 0,
  image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=800&h=800&auto=format&fit=crop',
  categoryId: '',
  featured: false,
};

const ProductsManager: React.FC<ProductsManagerProps> = ({
  products,
  categories,
  addProduct,
  updateProduct,
  deleteProduct,
}) => {
  const [currentProduct, setCurrentProduct] = useState<Product>(initialProduct);
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentProduct.name || !currentProduct.description || !currentProduct.image || !currentProduct.categoryId || currentProduct.price <= 0) {
      toast.error('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    if (isEditing) {
      updateProduct(currentProduct);
    } else {
      addProduct(currentProduct);
    }

    setCurrentProduct(initialProduct);
    setIsEditing(false);
    setIsDialogOpen(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const resizedImageData = await resizeImage(file);
      setCurrentProduct({ ...currentProduct, image: resizedImageData });
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Erro ao processar imagem!');
    }
  };

  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      deleteProduct(productId);
    }
  };

  const handleAddNewProduct = () => {
    setCurrentProduct(initialProduct);
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  return (
    <div className="py-4">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-semibold">Lista de Produtos</h2>
        
        <Button onClick={handleAddNewProduct}>
          <Plus size={16} className="mr-1" /> Novo Produto
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="relative h-40">
              <img
                src={product.image}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                  <p className="font-medium text-bakery-dark-purple mt-2">
                    {formatCurrency(product.price)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {categories.find((c) => c.id === product.categoryId)?.name}
                    {product.featured && " • Em destaque"}
                  </p>
                </div>
                
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditProduct(product)}
                  >
                    <Pencil size={16} />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Produto' : 'Adicionar Novo Produto'}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleProductSubmit} className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Nome do Produto</Label>
              <Input
                id="name"
                value={currentProduct.name}
                onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                rows={3}
                value={currentProduct.description}
                onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Preço (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={currentProduct.price}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, price: parseFloat(e.target.value) })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select
                  value={currentProduct.categoryId}
                  onValueChange={(value) => setCurrentProduct({ ...currentProduct, categoryId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="image">Imagem</Label>
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src={currentProduct.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <p className="text-xs text-gray-500 mt-1">Tamanho ideal: 800x800px</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={!!currentProduct.featured}
                onChange={(e) => setCurrentProduct({ ...currentProduct, featured: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="featured">Destacar na página inicial</Label>
            </div>
            
            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {isEditing ? 'Atualizar' : 'Adicionar'} Produto
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsManager;
