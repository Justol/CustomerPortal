import { Card } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const revenueData = [
  { month: 'Jan', revenue: 12500 },
  { month: 'Feb', revenue: 15000 },
  { month: 'Mar', revenue: 13800 },
  { month: 'Apr', revenue: 16200 },
  { month: 'May', revenue: 14500 },
  { month: 'Jun', revenue: 17800 },
];

const mailVolumeData = [
  { month: 'Jan', received: 450, processed: 430 },
  { month: 'Feb', received: 520, processed: 500 },
  { month: 'Mar', received: 480, processed: 460 },
  { month: 'Apr', received: 610, processed: 590 },
  { month: 'May', received: 550, processed: 530 },
  { month: 'Jun', received: 670, processed: 650 },
];

const stats = [
  {
    label: 'Total Revenue',
    value: '$45,231',
    change: '+20.1%',
    trend: 'up',
  },
  {
    label: 'Active Users',
    value: '2,543',
    change: '+15.3%',
    trend: 'up',
  },
  {
    label: 'Mail Volume',
    value: '15.8K',
    change: '+12.2%',
    trend: 'up',
  },
  {
    label: 'Processing Time',
    value: '1.2 days',
    change: '-8.1%',
    trend: 'down',
  },
];

export function AdminOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className={`flex items-center gap-1 ${
                stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
              }`}>
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">{stat.change}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Mail Volume</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mailVolumeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="received" fill="hsl(var(--primary))" />
                <Bar dataKey="processed" fill="hsl(var(--muted))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}