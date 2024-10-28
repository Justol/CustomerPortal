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
  Search,
  Mail,
  AlertCircle,
  Filter
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminUserManagement } from './AdminUserManagement';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

const revenueData = [
  { month: 'Jan', revenue: 12500 },
  { month: 'Feb', revenue: 15000 },
  { month: 'Mar', revenue: 13800 },
  { month: 'Apr', revenue: 16200 },
  { month: 'May', revenue: 14500 },
  { month: 'Jun', revenue: 17800 },
];

const serviceDistribution = [
  { name: 'Digital Mailbox', value: 45 },
  { name: 'Physical Mailbox', value: 30 },
  { name: 'Shipping', value: 25 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

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

  const stats = [
    { 
      icon: Users, 
      label: 'Total Users', 
      value: '2,543',
      trend: 'up',
      trendValue: '+15.3%',
      color: 'text-green-500'
    },
    { 
      icon: Package, 
      label: 'Active Mailboxes', 
      value: '1,876',
      trend: 'up',
      trendValue: '+12.1%',
      color: 'text-green-500'
    },
    { 
      icon: DollarSign, 
      label: 'Monthly Revenue', 
      value: '$45.2K',
      trend: 'down',
      trendValue: '-2.5%',
      color: 'text-red-500'
    },
    { 
      icon: Mail, 
      label: 'Mail Volume', 
      value: '15.8K',
      trend: 'up',
      trendValue: '+8.2%',
      color: 'text-green-500'
    },
  ];

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
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="mail">Mail</TabsTrigger>
            <TabsTrigger value="packages">Packages</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Revenue Overview</h3>
                  <Select defaultValue="6months">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30days">Last 30 days</SelectItem>
                      <SelectItem value="6months">Last 6 months</SelectItem>
                      <SelectItem value="1year">Last year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-6">Service Distribution</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={serviceDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {serviceDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4">
                  {serviceDistribution.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-2 mb-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index] }}
                      />
                      <span className="text-sm">{item.name}</span>
                      <span className="text-sm text-muted-foreground ml-auto">
                        {item.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">User Management</h2>
              <AdminUserManagement />
            </Card>
          </TabsContent>

          <TabsContent value="mail">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Mail Management</h2>
              {/* Add mail management component here */}
            </Card>
          </TabsContent>

          <TabsContent value="packages">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Package Management</h2>
              {/* Add package management component here */}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}