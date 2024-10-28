import { useAuth } from '@/lib/auth-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Package, Clock, Settings } from 'lucide-react';

interface DashboardProps {
  onNavigate?: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    if (onNavigate) {
      onNavigate('home');
    }
  };

  const stats = [
    { icon: Mail, label: 'Pending Mail', value: '3' },
    { icon: Package, label: 'Packages', value: '2' },
    { icon: Clock, label: 'Recent Activity', value: '12' },
  ];

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center gap-4">
                <stat.icon className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
          <div className="space-y-4">
            <p className="text-muted-foreground">No recent activity to display.</p>
          </div>
        </Card>
      </div>
    </section>
  );
}