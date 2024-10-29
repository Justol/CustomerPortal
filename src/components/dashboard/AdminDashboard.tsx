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
  Cog,
  Building2,
  UserCog
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminUserManagement } from './admin/AdminUserManagement';
import { AdminMailboxDashboard } from './mailbox/AdminMailboxDashboard';
import { AdminShippingDashboard } from './shipping/AdminShippingDashboard';
import { AdminPaymentManagement } from './payment/AdminPaymentManagement';
import { AdminSubscriptionModule } from './subscription/AdminSubscriptionModule';
import { AdminSettingsModule } from './settings/AdminSettingsModule';
import { AdminOverview } from './overview/AdminOverview';
import { LocationManagement } from './admin/locations/LocationManagement';
import { AdminGroupManagement } from './admin/AdminGroupManagement';
import { useAuthGuard } from '@/hooks/use-auth-guard';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

// Define role-based access permissions
const ADMIN_PERMISSIONS = {
  super_admin: ['overview', 'mailbox', 'shipping', 'users', 'locations', 'groups', 'payments', 'subscriptions', 'settings'],
  admin: ['overview', 'mailbox', 'shipping', 'users', 'locations', 'payments', 'subscriptions'],
  location_admin: ['overview', 'mailbox', 'shipping', 'users']
};

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { user, userDetails, signOut } = useAuth();
  
  // Use auth guard with required admin roles
  useAuthGuard(onNavigate, {
    requiredRoles: ['super_admin', 'admin', 'location_admin']
  });

  // Get allowed tabs based on user role
  const allowedTabs = ADMIN_PERMISSIONS[userDetails?.role as keyof typeof ADMIN_PERMISSIONS] || [];

  const handleLogout = async () => {
    try {
      await signOut();
      onNavigate('home');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user || !userDetails) return null;

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              {userDetails.firstName} {userDetails.lastName} ({userDetails.role})
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {allowedTabs.includes('overview') && (
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Overview
              </TabsTrigger>
            )}
            {allowedTabs.includes('mailbox') && (
              <TabsTrigger value="mailbox" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Mailbox
              </TabsTrigger>
            )}
            {allowedTabs.includes('shipping') && (
              <TabsTrigger value="shipping" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Shipping
              </TabsTrigger>
            )}
            {allowedTabs.includes('users') && (
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Users & Clients
              </TabsTrigger>
            )}
            {allowedTabs.includes('locations') && (
              <TabsTrigger value="locations" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Locations
              </TabsTrigger>
            )}
            {allowedTabs.includes('groups') && (
              <TabsTrigger value="groups" className="flex items-center gap-2">
                <UserCog className="h-4 w-4" />
                Admin Groups
              </TabsTrigger>
            )}
            {allowedTabs.includes('payments') && (
              <TabsTrigger value="payments" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payments
              </TabsTrigger>
            )}
            {allowedTabs.includes('subscriptions') && (
              <TabsTrigger value="subscriptions" className="flex items-center gap-2">
                <Repeat className="h-4 w-4" />
                Subscriptions
              </TabsTrigger>
            )}
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
            <AdminUserManagement />
          </TabsContent>

          <TabsContent value="locations">
            <LocationManagement />
          </TabsContent>

          <TabsContent value="groups">
            <AdminGroupManagement />
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