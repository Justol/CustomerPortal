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

interface AdminDashboardProps {
  onNavigate?: (page: string) => void;
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

const recentUsers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    plan: 'Digital Mailbox - 60n',
    status: 'active',
    joined: '2024-01-15',
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'michael@example.com',
    plan: 'Physical Mailbox - Business',
    status: 'pending',
    joined: '2024-01-14',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    email: 'emily@example.com',
    plan: 'Digital Mailbox - 30n',
    status: 'active',
    joined: '2024-01-13',
  },
];

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    if (onNavigate) {
      onNavigate('home');
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

        <Card className="mb-8">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Users</h3>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input className="pl-10" placeholder="Search users..." />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.plan}</TableCell>
                  <TableCell>
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-500' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-500'
                    }`}>
                      {user.status}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(user.joined).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <div className="flex items-center gap-2 text-yellow-500 bg-yellow-50 dark:bg-yellow-500/10 p-4 rounded-lg">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm">There are 5 pending user verifications that require your attention</p>
          <Button variant="ghost" size="sm" className="ml-auto">
            Review Now
          </Button>
        </div>
      </div>
    </section>
  );
}