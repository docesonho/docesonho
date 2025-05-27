import React, { useState } from 'react';
import { Product, Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { formatCurrency, resizeImage, uploadProductImage } from '@/lib/utils';

interface ProductsManagerProps {
  products: Product[];
  categories: Category[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
}

interface ProductFormData {
  id?: string;
  name: string;
  description: string | null;
  price: string;
  image_url: string;
  category_id: string;
  featured: boolean;
  active: boolean;
}

const initialProduct: ProductFormData = {
  name: '',
  description: null,
  price: '',
  image_url: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=800&h=800&auto=format&fit=crop',
  category_id: '',
  featured: false,
  active: true
};

const ProductsManager: React.FC<ProductsManagerProps> = ({
  products,
  categories,
  addProduct,
  updateProduct,
  deleteProduct,
}) => {
  const [currentProduct, setCurrentProduct] = useState<ProductFormData>(initialProduct);
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentProduct.name || !currentProduct.category_id || !currentProduct.price) {
      toast.error('Por favor, preencha os campos obrigatórios: Nome, Categoria e Preço!');
      return;
    }

    const price = parseFloat(currentProduct.price.replace(',', '.'));
    if (isNaN(price) || price <= 0) {
      toast.error('Por favor, insira um preço válido!');
      return;
    }

    const productData = {
      name: currentProduct.name.trim(),
      description: currentProduct.description?.trim() || null,
      price,
      image_url: currentProduct.image_url,
      category_id: currentProduct.category_id,
      featured: currentProduct.featured,
      active: currentProduct.active
    };

    if (isEditing && currentProduct.id) {
      updateProduct({ ...productData, id: currentProduct.id });
    } else {
      addProduct(productData);
    }

    setCurrentProduct(initialProduct);
    setIsEditing(false);
    setIsDialogOpen(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Primeiro redimensiona a imagem
      const resizedImageData = await resizeImage(file);
      
      // Faz upload da imagem redimensionada para o Supabase Storage
      const imageUrl = await uploadProductImage(resizedImageData, file.name);
      
      // Atualiza o estado com a URL da imagem
      setCurrentProduct({ ...currentProduct, image_url: imageUrl });
      toast.success('Imagem carregada com sucesso!');
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Erro ao processar imagem!');
    }
  };

  const handleEditProduct = (product: Product) => {
    setCurrentProduct({
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      image_url: product.image_url,
      category_id: product.category_id,
      featured: product.featured || false,
      active: product.active
    });
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="relative h-32 sm:h-40">
              <img
                src={product.image_url}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">{product.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                  <p className="font-medium text-bakery-dark-purple mt-2">
                    {formatCurrency(product.price)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {categories.find((c) => c.id === product.category_id)?.name}
                    {product.featured && " • Em destaque"}
                  </p>
                </div>
                
                <div className="flex gap-1 ml-2">
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
        <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Produto' : 'Adicionar Novo Produto'}</DialogTitle>
            <DialogDescription>
              Preencha os dados do produto. Os campos marcados com * são obrigatórios.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleProductSubmit} className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Nome do Produto *</Label>
              <Input
                id="name"
                value={currentProduct.name}
                onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                placeholder="Ex: Bolo de Chocolate"
                autoComplete="off"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Descrição (Opcional)</Label>
              <Textarea
                id="description"
                rows={3}
                value={currentProduct.description}
                onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                placeholder="Ex: Delicioso bolo de chocolate com cobertura de brigadeiro"
                className="mt-1"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Preço (R$) *</Label>
                <Input
                  id="price"
                  type="text"
                  value={currentProduct.price}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d,.]/, '');
                    setCurrentProduct({ ...currentProduct, price: value });
                  }}
                  placeholder="0,00"
                  autoComplete="off"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Categoria *</Label>
                <Select
                  value={currentProduct.category_id}
                  onValueChange={(value) => setCurrentProduct({ ...currentProduct, category_id: value })}
                >
                  <SelectTrigger className="mt-1">
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
              <Label htmlFor="image">Imagem do Produto</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mt-1"
              />
              {currentProduct.image_url && (
                <div className="mt-2 relative h-32 sm:h-40 rounded-lg overflow-hidden">
                  <img
                    src={currentProduct.image_url}
                    alt="Preview"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={currentProduct.featured}
                onChange={(e) => setCurrentProduct({ ...currentProduct, featured: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="featured">Produto em destaque</Label>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                className="w-full sm:w-auto"
              >
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
