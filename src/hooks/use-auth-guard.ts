import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';

export function useAuthGuard(onNavigate: (page: string) => void) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      onNavigate('home');
    }
  }, [user, loading, onNavigate]);

  return { user, loading };
}