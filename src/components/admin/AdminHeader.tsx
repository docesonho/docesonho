import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LogOut } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface AdminHeaderProps {
  onLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    toast.info('Logout realizado com sucesso!');
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-8 p-4 sm:p-6 bg-white rounded-lg shadow-sm">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-bakery-dark-purple">
          Painel de Administração
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">
          Gerencie seus produtos e categorias
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="w-full sm:w-auto justify-center"
        >
          <ArrowLeft size={16} className="mr-2" /> Ver site
        </Button>
        
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full sm:w-auto justify-center text-red-500 hover:text-red-700"
        >
          <LogOut size={16} className="mr-2" /> Sair
        </Button>
      </div>
    </div>
  );
};

export default AdminHeader;
