
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LogOut } from 'lucide-react';
import { toast } from 'sonner';

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
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-bakery-dark-purple">Painel de Administração</h1>
        <p className="text-gray-500">Gerencie seus produtos e categorias</p>
      </div>
      
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={16} className="mr-1" /> Ver site
        </Button>
        
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="text-red-500 hover:text-red-700"
        >
          <LogOut size={16} className="mr-1" /> Sair
        </Button>
      </div>
    </div>
  );
};

export default AdminHeader;
