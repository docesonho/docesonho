import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Product } from '@/types';

export function useProducts() {
  const queryClient = useQueryClient();

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar produtos:', error);
        throw error;
      }
      return data;
    },
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Erro ao buscar categorias:', error);
        throw error;
      }
      return data;
    },
  });

  const createProduct = useMutation({
    mutationFn: async (newProduct: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
      // Garantir que o preço seja um número
      const productData = {
        ...newProduct,
        price: typeof newProduct.price === 'string' ? parseFloat(newProduct.price.replace(',', '.')) : newProduct.price
      };

      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar produto:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Produto criado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro na mutação:', error);
      toast.error('Erro ao criar produto. Por favor, verifique os dados e tente novamente.');
    },
  });

  const updateProduct = useMutation({
    mutationFn: async (product: Product) => {
      const { id, created_at, updated_at, ...updateData } = product;
      
      // Garantir que o preço seja um número
      const productData = {
        ...updateData,
        price: typeof updateData.price === 'string' ? parseFloat(updateData.price.replace(',', '.')) : updateData.price
      };

      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar produto:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Produto atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar:', error);
      toast.error('Erro ao atualizar produto. Por favor, verifique os dados e tente novamente.');
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar produto:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Produto deletado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao deletar:', error);
      toast.error('Erro ao deletar produto');
    },
  });

  const createCategory = useMutation({
    mutationFn: async (newCategory) => {
      const { data, error } = await supabase
        .from('categories')
        .insert(newCategory)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Categoria criada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao criar categoria');
    },
  });

  const updateCategory = useMutation({
    mutationFn: async ({ id, ...category }) => {
      const { data, error } = await supabase
        .from('categories')
        .update(category)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Categoria atualizada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar categoria');
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Categoria deletada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao deletar categoria');
    },
  });

  return {
    products,
    categories,
    isLoading: isLoadingProducts || isLoadingCategories,
    createProduct,
    updateProduct,
    deleteProduct,
    createCategory,
    updateCategory,
    deleteCategory,
  };
} 