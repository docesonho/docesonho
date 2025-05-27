import React, { useState, useEffect } from 'react';
import { HeroConfig } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-hot-toast';
import { resizeImage } from '@/lib/utils';

interface HeroManagerProps {
  heroConfig: HeroConfig;
  updateHeroConfig: (config: HeroConfig) => void;
}

const HeroManager: React.FC<HeroManagerProps> = ({ heroConfig, updateHeroConfig }) => {
  const [currentHeroConfig, setCurrentHeroConfig] = useState<HeroConfig>(heroConfig);

  useEffect(() => {
    setCurrentHeroConfig(heroConfig);
  }, [heroConfig]);

  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateHeroConfig(currentHeroConfig);
      toast.success('Configuração do Hero atualizada com sucesso!');
    } catch (error) {
      console.error('[HeroManager] Erro ao salvar:', error);
      toast.error('Erro ao salvar alterações. Por favor, tente novamente.');
    }
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, imageKey: keyof Pick<HeroConfig, 'image1' | 'image2' | 'image3'>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Tamanho otimizado para o hero: 600x600px
      const resizedImageData = await resizeImage(file);
      setCurrentHeroConfig({ ...currentHeroConfig, [imageKey]: resizedImageData });
      toast.success('Imagem carregada e pronta para salvar!');
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Erro ao processar imagem!');
    }
  };

  const handleTextChange = (field: keyof HeroConfig, value: string) => {
    setCurrentHeroConfig({ ...currentHeroConfig, [field]: value });
  };

  return (
    <div className="py-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Configuração do Hero</h2>
        <p className="text-sm text-gray-500 mb-6">
          Personalize o texto e as imagens do Hero na página inicial. As imagens aparecem em um carrossel ao lado do texto.
        </p>
        
        <form onSubmit={handleHeroSubmit} className="space-y-8 bg-white p-6 rounded-lg shadow-sm">
          
          {/* Text Configuration */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Conteúdo de Texto</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="heroTitle">Título Principal</Label>
                <Input
                  id="heroTitle"
                  type="text"
                  value={currentHeroConfig.title}
                  onChange={(e) => handleTextChange('title', e.target.value)}
                  placeholder="Ex: Delícias com um clique"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">A última palavra aparecerá em rosa</p>
              </div>
              
              <div>
                <Label htmlFor="heroButtonText">Texto do Botão</Label>
                <Input
                  id="heroButtonText"
                  type="text"
                  value={currentHeroConfig.buttonText}
                  onChange={(e) => handleTextChange('buttonText', e.target.value)}
                  placeholder="Ex: Ver Catálogo"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="heroSubtitle">Subtítulo/Descrição</Label>
              <Textarea
                id="heroSubtitle"
                value={currentHeroConfig.subtitle}
                onChange={(e) => handleTextChange('subtitle', e.target.value)}
                placeholder="Ex: Bolos, doces e tortas artesanais com entrega rápida. Faça seu pedido pelo WhatsApp!"
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          {/* Images Configuration */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Imagens do Carrossel</h3>
              <div className="mt-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">📸 Especificações das Imagens</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li><strong>• Tamanho ideal:</strong> 600×600 pixels (formato quadrado)</li>
                  <li><strong>• Formato:</strong> JPG, PNG ou WebP</li>
                  <li><strong>• Tamanho máximo:</strong> 2MB por imagem</li>
                  <li><strong>• Qualidade:</strong> Alta resolução para melhor visualização</li>
                  <li><strong>• Conteúdo:</strong> Produtos, promoções ou novidades da doceria</li>
                </ul>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="heroImage1">Imagem 1 (Principal)</Label>
                <div className="mt-2 flex flex-col items-center">
                  <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden mb-2">
                    <img
                      src={currentHeroConfig.image1}
                      alt="Hero Image 1"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-full">
                    <p className="text-xs text-green-600 mb-1 font-medium">✓ Tamanho: 600×600px</p>
                    <Input
                      id="heroImage1"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleHeroImageUpload(e, 'image1')}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="heroImage2">Imagem 2 (Secundária)</Label>
                <div className="mt-2 flex flex-col items-center">
                  <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden mb-2">
                    <img
                      src={currentHeroConfig.image2}
                      alt="Hero Image 2"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-full">
                    <p className="text-xs text-green-600 mb-1 font-medium">✓ Tamanho: 600×600px</p>
                    <Input
                      id="heroImage2"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleHeroImageUpload(e, 'image2')}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="heroImage3">Imagem 3 (Terciária)</Label>
                <div className="mt-2 flex flex-col items-center">
                  <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden mb-2">
                    <img
                      src={currentHeroConfig.image3}
                      alt="Hero Image 3"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-full">
                    <p className="text-xs text-green-600 mb-1 font-medium">✓ Tamanho: 600×600px</p>
                    <Input
                      id="heroImage3"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleHeroImageUpload(e, 'image3')}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-800">
                <strong>💡 Dica:</strong> Use imagens que representem seus melhores produtos, promoções especiais ou novidades. 
                O carrossel roda automaticamente, então coloque a imagem mais importante na posição 1.
              </p>
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button type="submit" className="px-8">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HeroManager;
