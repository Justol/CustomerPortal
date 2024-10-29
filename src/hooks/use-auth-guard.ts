import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';

interface AuthGuardOptions {
  requiredRoles?: string[];
}

export function useAuthGuard(onNavigate: (page: string) => void, options: AuthGuardOptions = {}) {
  const { user, userDetails, loading } = useAuth();
  const { requiredRoles } = options;

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not authenticated
        onNavigate('home');
      } else if (requiredRoles?.length) {
        // Check role requirements
        const hasRequiredRole = requiredRoles.includes(userDetails?.role || '');
        if (!hasRequiredRole) {
          // User doesn't have required role - redirect to regular dashboard
          onNavigate('dashboard');
        }
      }
    }
  }, [user, userDetails, loading, onNavigate, requiredRoles]);

  return { user, userDetails, loading };
}