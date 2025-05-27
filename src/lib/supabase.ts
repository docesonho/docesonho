import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key são necessários');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Função para garantir que o bucket 'products' existe
export async function ensureProductsBucket() {
  try {
    // Tenta obter o bucket primeiro
    const { data: bucket, error: getBucketError } = await supabase.storage.getBucket('products');
    
    if (getBucketError) {
      // Se o erro for de bucket não encontrado, tenta criar
      if (getBucketError.message.includes('not found')) {
        const { data, error: createError } = await supabase.storage.createBucket('products', {
          public: true,
          allowedMimeTypes: ['image/*'],
          fileSizeLimit: 10485760, // 10MB em bytes
        });

        if (createError) {
          console.error('Erro ao criar bucket:', createError);
          throw createError;
        }
        
        return data;
      } else {
        throw getBucketError;
      }
    }

    if (!bucket) {
      const { data, error: createError } = await supabase.storage.createBucket('products', {
        public: true,
        allowedMimeTypes: ['image/*'],
        fileSizeLimit: 10485760, // 10MB em bytes
      });

      if (createError) {
        console.error('Erro ao criar bucket:', createError);
        throw createError;
      }
      
      return data;
    }

    return bucket;
  } catch (error) {
    console.error('Erro ao verificar/criar bucket:', error);
    throw error;
  }
}

export async function uploadProductImage(base64Image: string, fileName: string): Promise<string> {
  try {
    // Garantir que o bucket existe antes do upload
    await ensureProductsBucket();

    // Converter base64 para blob
    const base64Data = base64Image.split(',')[1];
    if (!base64Data) {
      throw new Error('Formato de imagem base64 inválido');
    }

    const blob = await fetch(`data:image/jpeg;base64,${base64Data}`).then(res => res.blob());
    
    if (blob.size > 10485760) { // 10MB em bytes
      throw new Error('Imagem muito grande. O tamanho máximo permitido é 10MB');
    }
    
    // Gerar nome único para o arquivo
    const uniqueFileName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    // Upload para o Supabase Storage
    const { data, error } = await supabase.storage
      .from('products')
      .upload(uniqueFileName, blob, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Erro no upload:', error);
      throw error;
    }

    // Retornar URL pública da imagem
    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(uniqueFileName);
    
    // Verificar se a URL é acessível
    try {
      const response = await fetch(publicUrl, { method: 'HEAD' });
      if (!response.ok) {
        throw new Error(`URL não acessível: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.warn('Aviso: Não foi possível verificar a URL da imagem:', error);
    }
    
    return publicUrl;
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    throw error;
  }
}