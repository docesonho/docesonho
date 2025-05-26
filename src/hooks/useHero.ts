import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
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
      console.log('[useHero] mutationFn: Tentando salvar newConfig:', newConfig);

      if (typeof newConfig !== 'object' || newConfig === null) {
        console.error('[useHero] mutationFn: newConfig não é um objeto válido. Abortando.');
        toast.error('Erro interno: Formato de dados inválido para salvar.');
        throw new Error('Formato de dados inválido para salvar.');
      }

      if (Object.keys(newConfig).every(k => !isNaN(parseInt(k))) && Object.keys(newConfig).length > 10) {
         console.warn('[useHero] mutationFn: newConfig é um OBJETO, mas parece já estar no formato {"0": "...", "1": "..."}. Isso é inesperado aqui.');
      }

      const { data, error } = await supabase
        .from('site_settings')
        .upsert(
          { key: 'hero_config', value: newConfig },
          { onConflict: 'key' }
        )
        .select();

      if (error) {
        console.error('[useHero] Erro no upsert do heroConfig:', error);
        toast.error(`Erro ao salvar: ${error.message}`);
        throw error;
      }
      console.log('[useHero] heroConfig upsert bem-sucedido:', data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['heroConfig'] });
      toast.success('Configuração do Hero atualizada com sucesso!');
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
