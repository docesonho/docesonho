import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { HeroConfig } from '@/types';

const defaultHeroConfig: HeroConfig = {
  title: "Delícias com um clique",
  subtitle: "Bolos, doces e tortas artesanais com entrega rápida. Faça seu pedido pelo WhatsApp!",
  buttonText: "Ver Catálogo",
  image1: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&h=800&auto=format&fit=crop",
  image2: "https://images.unsplash.com/photo-1587668178277-295251f900ce?q=80&w=800&h=800&auto=format&fit=crop",
  image3: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=800&h=800&auto=format&fit=crop"
};

export function useHero() {
  const queryClient = useQueryClient();

  const { data: heroConfig, isLoading } = useQuery({
    queryKey: ['heroConfig'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'hero_config')
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar heroConfig:', error);
        throw error;
      }
      
      return data?.value as HeroConfig;
    },
  });

  const updateHeroConfig = useMutation({
    mutationFn: async (newConfig: HeroConfig) => {
      if (typeof newConfig !== 'object' || newConfig === null) {
        throw new Error('Formato de dados inválido para salvar.');
      }

      const { data, error } = await supabase
        .from('site_settings')
        .upsert(
          { key: 'hero_config', value: newConfig },
          { onConflict: 'key' }
        )
        .select();

      if (error) {
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['heroConfig'] });
    },
    onError: (error: Error) => {
      console.error('[useHero] onError da mutação heroConfig:', error);
    },
  });

  return {
    heroConfig: heroConfig || undefined,
    isLoading,
    updateHeroConfig,
  };
}
