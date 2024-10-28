import { useAuth } from '@/lib/auth-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users,
  Package,
  DollarSign,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  Mail,
  CreditCard,
  Repeat,
  Cog
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminUserManagement } from './AdminUserManagement';
import { AdminMailboxDashboard } from './mailbox/AdminMailboxDashboard';
import { AdminShippingDashboard } from './shipping/AdminShippingDashboard';
import { AdminPaymentManagement } from './payment/AdminPaymentManagement';
import { AdminSubscriptionModule } from './subscription/AdminSubscriptionModule';
import { AdminSettingsModule } from './settings/AdminSettingsModule';
import { AdminOverview } from './overview/AdminOverview';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      onNavigate('home');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="mailbox" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Mailbox
            </TabsTrigger>
            <TabsTrigger value="shipping" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Shipping
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users & Clients
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="flex items-center gap-2">
              <Repeat className="h-4 w-4" />
              Subscriptions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AdminOverview />
          </TabsContent>

          <TabsContent value="mailbox">
            <AdminMailboxDashboard />
          </TabsContent>

          <TabsContent value="shipping">
            <AdminShippingDashboard />
          </TabsContent>

          <TabsContent value="users">
            <Card className="p-6">
              <AdminUserManagement />
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <AdminPaymentManagement />
          </TabsContent>

          <TabsContent value="subscriptions">
            <AdminSubscriptionModule />
          </TabsContent>

          <TabsContent value="settings">
            <AdminSettingsModule />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}