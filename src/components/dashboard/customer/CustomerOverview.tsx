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

const mailActivityData = [
  { month: 'Jan', received: 45, forwarded: 30 },
  { month: 'Feb', received: 52, forwarded: 42 },
  { month: 'Mar', received: 48, forwarded: 38 },
  { month: 'Apr', received: 61, forwarded: 45 },
  { month: 'May', received: 55, forwarded: 48 },
  { month: 'Jun', received: 67, forwarded: 52 },
];

const packageActivityData = [
  { month: 'Jan', received: 12, shipped: 10 },
  { month: 'Feb', received: 15, shipped: 14 },
  { month: 'Mar', received: 13, shipped: 12 },
  { month: 'Apr', received: 18, shipped: 16 },
  { month: 'May', received: 16, shipped: 15 },
  { month: 'Jun', received: 20, shipped: 18 },
];

export function CustomerOverview() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Mail Activity</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mailActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="received"
                  name="Received"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="forwarded"
                  name="Forwarded"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Package Activity</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={packageActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="received" name="Received" fill="hsl(var(--primary))" />
                <Bar dataKey="shipped" name="Shipped" fill="hsl(var(--muted))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {/* Add recent activity items here */}
        </div>
      </Card>
    </div>
  );
}