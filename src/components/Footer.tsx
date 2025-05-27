import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 pt-12 pb-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <a 
              href="/" 
              className="flex items-center space-x-2"
            >
              <img src="./logo.png" alt="Logo" className="w-10 h-10" />
              <span className="text-2xl font-display font-bold text-bakery-dark-purple">Doce</span>
              <span className="text-2xl font-display font-bold text-bakery-pink">Sonho</span>
            </a>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between pb-8">
          <div className="mb-8 md:mb-0">
            <p className="text-gray-600 mt-2 max-w-xs">
              Delícias artesanais feitas com amor e carinho. Entregas para toda a região.
            </p>
          </div>
          
          <div className="mb-8 md:mb-0">
            <h3 className="font-semibold text-lg mb-4">Links Rápidos</h3>
            <nav className="flex flex-col space-y-3">
              <a 
                href="#" 
                className="text-gray-600 hover:text-bakery-dark-purple transition-colors"
              >
                Início
              </a>
              <a 
                href="#catalogo" 
                className="text-gray-600 hover:text-bakery-dark-purple transition-colors"
              >
                Catálogo      
              </a>
            </nav>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Contato</h3>
            <div className="flex flex-col space-y-3 text-gray-600">
              <p>(27) 99648-7579</p>
              <p>docesonhosite@outlook.com.br</p>
              <p>Ibiraçu - ES</p>
              <a 
                href="https://www.instagram.com/_docesonho.confeitaria._/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-bakery-pink hover:text-bakery-dark-purple transition-colors transform hover:scale-110 duration-300"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="hsl(330 38% 56%)" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                <span>@_docesonho.confeitaria._</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 mt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Doce Sonho. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
