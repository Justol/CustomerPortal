import { useAuth } from '@/lib/auth-context';
import { CustomerDashboard } from '@/components/dashboard/CustomerDashboard';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';

interface DashboardProps {
  onNavigate?: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return user.role === 'admin' ? (
    <AdminDashboard onNavigate={onNavigate} />
  ) : (
    <CustomerDashboard onNavigate={onNavigate} />
  );
}