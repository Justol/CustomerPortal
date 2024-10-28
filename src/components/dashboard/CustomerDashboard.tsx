import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, 
  Package, 
  Clock, 
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  Truck,
  AlertCircle,
  CreditCard,
  User,
  Bell
} from 'lucide-react';
import { CustomerOverview } from './customer/CustomerOverview';
import { CustomerMailbox } from './customer/CustomerMailbox';
import { CustomerPackages } from './customer/CustomerPackages';
import { CustomerBilling } from './customer/CustomerBilling';
import { CustomerProfile } from './customer/CustomerProfile';
import { CustomerNotifications } from './customer/CustomerNotifications';

interface CustomerDashboardProps {
  onNavigate: (page: string) => void;
}

export function CustomerDashboard({ onNavigate }: CustomerDashboardProps) {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = async () => {
    try {
      await signOut();
      onNavigate('home');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const stats = [
    { 
      icon: Mail, 
      label: 'Pending Mail', 
      value: '3',
      trend: 'up',
      trendValue: '+12.5%',
      color: 'text-green-500'
    },
    { 
      icon: Package, 
      label: 'Packages', 
      value: '2',
      trend: 'down',
      trendValue: '-5.0%',
      color: 'text-red-500'
    },
    { 
      icon: Truck, 
      label: 'In Transit', 
      value: '1',
      trend: 'up',
      trendValue: '+3.2%',
      color: 'text-green-500'
    },
    { 
      icon: CreditCard, 
      label: 'Balance', 
      value: '$45.20',
      trend: 'up',
      trendValue: '+8.7%',
      color: 'text-green-500'
    },
  ];

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 ${stat.color}`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">{stat.trendValue}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="mailbox" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Mailbox
            </TabsTrigger>
            <TabsTrigger value="packages" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Packages
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <CustomerOverview />
          </TabsContent>

          <TabsContent value="mailbox">
            <CustomerMailbox />
          </TabsContent>

          <TabsContent value="packages">
            <CustomerPackages />
          </TabsContent>

          <TabsContent value="billing">
            <CustomerBilling />
          </TabsContent>

          <TabsContent value="profile">
            <CustomerProfile />
          </TabsContent>

          <TabsContent value="notifications">
            <CustomerNotifications />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}