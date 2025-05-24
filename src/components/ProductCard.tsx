import React from 'react';
import { Product } from '@/types';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ShoppingCart, Send } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useStore();
  
  const handleAddToCart = () => {
    addToCart(product, 1);
  };
  
  const handleWhatsAppOrder = () => {
    const phoneNumber = '5527998329362'; // Numero do whatsapp da Doce Sonho
    const message = `Olá! Gostaria de pedir *${product.name}* por ${formatCurrency(product.price)}.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Card className="overflow-hidden card-hover">
      <div className="h-48 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardContent className="pt-4">
        <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 h-10">{product.description}</p>
        <div className="font-semibold text-lg mt-2 text-bakery-dark-purple">
          {formatCurrency(product.price)}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-0">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="mr-1 h-4 w-4" /> Adicionar
        </Button>
        <Button
          className="flex-1 bg-green-500 hover:bg-green-600"
          onClick={handleWhatsAppOrder}
        >
          <Send className="mr-1 h-4 w-4 text-white" />
          <span className="text-white">WhatsApp</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
