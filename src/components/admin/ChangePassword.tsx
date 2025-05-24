import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdmin } from '@/hooks/useAdmin';
import { toast } from 'sonner';

const ChangePassword: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newRecoveryCode, setNewRecoveryCode] = useState('');
  const { updatePassword, verifyPassword, updateRecoveryCode } = useAdmin();

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem!');
      return;
    }

    try {
      const isValid = await verifyPassword(currentPassword);
      if (!isValid) {
        toast.error('Senha atual incorreta!');
        return;
      }

      await updatePassword.mutateAsync(newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error('Erro ao alterar senha');
    }
  };

  const handleRecoveryCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newRecoveryCode) {
      toast.error('O código de recuperação não pode estar vazio!');
      return;
    }

    try {
      await updateRecoveryCode.mutateAsync(newRecoveryCode);
      setNewRecoveryCode('');
    } catch (error) {
      toast.error('Erro ao alterar código de recuperação');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Alterar Senha</h2>
        
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">Senha Atual</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
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

          <Button type="submit" className="w-full">
            Alterar Senha
          </Button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Alterar Código de Recuperação</h2>
        
        <form onSubmit={handleRecoveryCodeSubmit} className="space-y-4">
          <div>
            <Label htmlFor="newRecoveryCode">Novo Código de Recuperação</Label>
            <Input
              id="newRecoveryCode"
              value={newRecoveryCode}
              onChange={(e) => setNewRecoveryCode(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Alterar Código de Recuperação
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword; 