import { useAuth } from '@/lib/auth-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Mail, 
  Package, 
  Clock, 
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  Truck,
  AlertCircle
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CustomerDashboardProps {
  onNavigate?: (page: string) => void;
}

const mailData = [
  { month: 'Jan', received: 45, forwarded: 30 },
  { month: 'Feb', received: 52, forwarded: 42 },
  { month: 'Mar', received: 48, forwarded: 38 },
  { month: 'Apr', received: 61, forwarded: 45 },
  { month: 'May', received: 55, forwarded: 48 },
  { month: 'Jun', received: 67, forwarded: 52 },
];

const recentActivity = [
  {
    id: 1,
    type: 'mail',
    description: 'New mail received from USPS',
    time: '2 hours ago',
    status: 'pending',
  },
  {
    id: 2,
    type: 'package',
    description: 'Package forwarded to shipping address',
    time: '5 hours ago',
    status: 'completed',
  },
  {
    id: 3,
    type: 'scan',
    description: 'Document scan requested',
    time: '1 day ago',
    status: 'processing',
  },
];

export function CustomerDashboard({ onNavigate }: CustomerDashboardProps) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    if (onNavigate) {
      onNavigate('home');
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

        <div className="grid md:grid-cols-3 gap-6 mb-8">
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

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-2 p-6">
            <h3 className="text-lg font-semibold mb-4">Mail Activity</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mailData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="received" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="forwarded" 
                    stroke="hsl(var(--muted-foreground))" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-6">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {activity.type === 'mail' && <Mail className="h-4 w-4 text-primary" />}
                    {activity.type === 'package' && <Package className="h-4 w-4 text-primary" />}
                    {activity.type === 'scan' && <Clock className="h-4 w-4 text-primary" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <div className={`text-xs font-medium ${
                    activity.status === 'completed' ? 'text-green-500' :
                    activity.status === 'pending' ? 'text-yellow-500' :
                    'text-blue-500'
                  }`}>
                    {activity.status}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Tabs defaultValue="mail" className="w-full">
          <TabsList>
            <TabsTrigger value="mail">Mail</TabsTrigger>
            <TabsTrigger value="packages">Packages</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="mail">
            <Card className="p-6">
              <div className="flex items-center gap-2 text-yellow-500 bg-yellow-50 dark:bg-yellow-500/10 p-4 rounded-lg mb-6">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm">You have 3 pieces of mail waiting for action</p>
              </div>
              {/* Mail content would go here */}
            </Card>
          </TabsContent>
          <TabsContent value="packages">
            <Card className="p-6">
              {/* Package tracking content would go here */}
            </Card>
          </TabsContent>
          <TabsContent value="notifications">
            <Card className="p-6">
              {/* Notifications content would go here */}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}