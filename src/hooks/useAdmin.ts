import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useState } from 'react';

const DEFAULT_RECOVERY_CODE = 'DOCE1234'; // Código de recuperação padrão
const DEFAULT_ADMIN_PASSWORD = 'admin123'; // Senha padrão

export function useAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const queryClient = useQueryClient();

  const { data: adminPassword, isLoading } = useQuery({
    queryKey: ['adminPassword'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .match({ key: 'admin_password' })
          .maybeSingle();

        if (error) {
          console.error('Erro ao buscar senha:', error);
          throw error;
        }

        if (!data) {
          const { data: insertData, error: insertError } = await supabase
            .from('site_settings')
            .insert({
              key: 'admin_password',
              value: DEFAULT_ADMIN_PASSWORD
            })
            .select('value')
            .single();

          if (insertError) {
            console.error('Erro ao criar senha:', insertError);
            throw insertError;
          }

          return insertData.value;
        }

        return data.value;
      } catch (error) {
        console.error('Erro na operação:', error);
        throw error;
      }
    },
  });

  const { data: recoveryCode } = useQuery({
    queryKey: ['recoveryCode'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .match({ key: 'recovery_code' })
          .maybeSingle();

        if (error) {
          console.error('Erro ao buscar código de recuperação:', error);
          throw error;
        }

        if (!data) {
          const { data: insertData, error: insertError } = await supabase
            .from('site_settings')
            .insert({
              key: 'recovery_code',
              value: DEFAULT_RECOVERY_CODE
            })
            .select('value')
            .single();

          if (insertError) {
            console.error('Erro ao criar código:', insertError);
            throw insertError;
          }

          return insertData.value;
        }

        return data.value;
      } catch (error) {
        console.error('Erro na operação:', error);
        throw error;
      }
    },
  });

  const updatePassword = useMutation({
    mutationFn: async (newPassword: string) => {
      try {
        const { error } = await supabase
          .from('site_settings')
          .update({ value: newPassword })
          .match({ key: 'admin_password' });

        if (error) {
          console.error('Erro ao atualizar senha:', error);
          throw error;
        }
      } catch (error) {
        console.error('Erro na operação:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminPassword']);
      toast.success('Senha atualizada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar senha:', error);
      toast.error('Erro ao atualizar senha');
    },
  });

  const updateRecoveryCode = useMutation({
    mutationFn: async (newCode: string) => {
      try {
        const { error } = await supabase
          .from('site_settings')
          .update({ value: newCode })
          .match({ key: 'recovery_code' });

        if (error) {
          console.error('Erro ao atualizar código:', error);
          throw error;
        }
      } catch (error) {
        console.error('Erro na operação:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['recoveryCode']);
      toast.success('Código de recuperação atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar código:', error);
      toast.error('Erro ao atualizar código de recuperação');
    },
  });

  const verifyPassword = async (password: string) => {
    try {
      if (!adminPassword) {
        console.error('Senha não encontrada no banco');
        return false;
      }
      const isValid = password === adminPassword;
      if (isValid) {
        setIsAuthenticated(true);
      }
      return isValid;
    } catch (error) {
      console.error('Erro ao verificar senha:', error);
      return false;
    }
  };

  const verifyRecoveryCode = async (code: string) => {
    try {
      if (!recoveryCode) {
        console.error('Código de recuperação não encontrado no banco');
        return false;
      }
      const isValid = code === recoveryCode;
      return isValid;
    } catch (error) {
      console.error('Erro ao verificar código:', error);
      return false;
    }
  };

  const resetPassword = async (code: string, newPassword: string) => {
    try {
      if (!code || !newPassword) {
        throw new Error('Código de recuperação e nova senha são obrigatórios');
      }

      const isValid = await verifyRecoveryCode(code);
      if (!isValid) {
        throw new Error('Código de recuperação inválido');
      }

      await updatePassword.mutateAsync(newPassword);
      return true;
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      throw error;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isLoading,
    verifyPassword,
    verifyRecoveryCode,
    updatePassword,
    updateRecoveryCode,
    resetPassword,
    logout,
  };
} 