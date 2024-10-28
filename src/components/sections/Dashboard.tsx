import { useAuthGuard } from '@/hooks/use-auth-guard';
import { CustomerDashboard } from '@/components/dashboard/CustomerDashboard';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { useAuth } from '@/lib/auth-context';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { user, userDetails, loading } = useAuth();
  useAuthGuard(onNavigate);

  if (loading || !user) {
    return null;
  }

  return userDetails?.role === 'admin' ? (
    <AdminDashboard onNavigate={onNavigate} />
  ) : (
    <CustomerDashboard onNavigate={onNavigate} />
  );
}