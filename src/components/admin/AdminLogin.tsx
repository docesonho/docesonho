import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { verifyPassword, resetPassword, isLoading } = useAdmin();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isValid = await verifyPassword(password);
      if (isValid) {
        onLoginSuccess();
        toast.success('Login realizado com sucesso!');
      } else {
        toast.error('Senha incorreta!');
      }
    } catch (error) {
      toast.error('Erro ao verificar senha');
    }
  };

  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem!');
      return;
    }

    try {
      await resetPassword(recoveryCode, newPassword);
      toast.success('Senha alterada com sucesso!');
      setShowRecovery(false);
      setRecoveryCode('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error('Código de recuperação inválido!');
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-display font-bold text-bakery-dark-purple">Admin</h1>
          <p className="text-gray-500 mt-2">Entre para gerenciar os produtos</p>
        </div>
        
        {!showRecovery ? (
          <>
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  Entrar
                </Button>
              </div>
            </form>
            
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowRecovery(true)}
                className="text-sm text-gray-600 hover:text-bakery-dark-purple"
              >
                Esqueceu a senha?
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleRecovery}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="recoveryCode">Código de Recuperação</Label>
                <Input
                  id="recoveryCode"
                  value={recoveryCode}
                  onChange={(e) => setRecoveryCode(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div>
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowRecovery(false)}
                >
                  Voltar
                </Button>
                <Button type="submit" className="flex-1">
                  Alterar Senha
                </Button>
              </div>
            </div>
          </form>
        )}
        
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-600 hover:text-bakery-dark-purple flex items-center justify-center mx-auto"
          >
            <ArrowLeft size={16} className="mr-1" /> Voltar para o site
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
