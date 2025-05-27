import React from 'react';
import { useStore } from '../context/StoreContext';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, Send } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const CartContent: React.FC = () => {
  const { cartItems, removeFromCart, updateCartItemQuantity, clearCart, getCartTotal } = useStore();
  
  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;
    
    const itemsList = cartItems.map(item => `*${item.quantity}x* ${item.product.name}`).join('\n');
    const phoneNumber = '5527996487579'; // Numero do whatsapp da Doce Sonho
    const message = `*Novo Pedido*\n\n${itemsList}\n\n*Total:* R$ ${getCartTotal().toFixed(2)}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4 text-center">
        <div className="text-5xl">🛒</div>
        <h3 className="text-lg font-semibold">Seu carrinho está vazio</h3>
        <p className="text-muted-foreground">Adicione alguns produtos deliciosos!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-auto py-4">
        {cartItems.map((item) => (
          <div key={item.product.id} className="flex items-center gap-4 py-4 border-b">
            <img 
              src={item.product.image_url} 
              alt={item.product.name} 
              className="w-16 h-16 object-cover rounded-md"
            />
            
            <div className="flex-1">
              <h4 className="font-medium">{item.product.name}</h4>
              <p className="text-sm text-muted-foreground">{formatCurrency(item.product.price)}</p>
              
              <div className="flex items-center mt-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-7 w-7 rounded-full"
                  onClick={() => updateCartItemQuantity(item.product.id, item.quantity - 1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                
                <span className="w-8 text-center">{item.quantity}</span>
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-7 w-7 rounded-full"
                  onClick={() => updateCartItemQuantity(item.product.id, item.quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-medium">{formatCurrency(item.product.price * item.quantity)}</div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={() => removeFromCart(item.product.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t pt-4 mt-auto">
        <div className="flex justify-between font-semibold text-lg mb-4">
          <span>Total</span>
          <span>{formatCurrency(getCartTotal())}</span>
        </div>
        
        <Button
          className="w-full bg-green-500 hover:bg-green-600"
          onClick={handleWhatsAppCheckout}
        >
          <Send className="mr-2 h-4 w-4 text-white" />
          <span className="text-white">Pedir pelo WhatsApp</span>
        </Button>
        
        <Button 
          variant="outline" 
          onClick={clearCart}
          className="w-full mt-2"
        >
          Limpar Carrinho
        </Button>
      </div>
    </div>
  );
};

export default CartContent;
