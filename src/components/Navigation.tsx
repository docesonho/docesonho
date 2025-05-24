import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import CartContent from './CartContent';

const Navigation: React.FC = () => {
  const { cartItems } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img src="./logo.png" alt="Logo" className="w-10 h-10" />
          <span className="text-2xl font-display font-bold text-bakery-dark-purple">Doce</span>
          <span className="text-2xl font-display font-bold text-bakery-pink">Sonho</span>
        </Link>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-gray-700 hover:text-bakery-dark-purple"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a 
            href="#" 
            className="font-medium hover:text-bakery-dark-purple transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Início
          </a>
          <a 
            href="#catalogo" 
            className="font-medium hover:text-bakery-dark-purple transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Cardápio
          </a>
          <a 
            href="#call-to-action" 
            className="font-medium hover:text-bakery-dark-purple transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Encomendas
          </a>
        </nav>

        {/* Cart button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-bakery-pink text-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[90%] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Seu Carrinho</SheetTitle>
            </SheetHeader>
            <CartContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 shadow-lg animate-in fade-in">
          <nav className="flex flex-col space-y-4">
            <a 
              href="/"
              className="font-medium hover:text-bakery-dark-purple transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Início
            </a>
            <a
              href="#catalogo"
              className="font-medium hover:text-bakery-dark-purple transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Cardápio
            </a>
            <a
              href="#call-to-action"
              className="font-medium hover:text-bakery-dark-purple transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Encomendas
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navigation;
