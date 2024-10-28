import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShippingProfiles } from './ShippingProfiles';
import { CarrierPricing } from './CarrierPricing';
import { OrderHistory } from './OrderHistory';
import { TaskProcessing } from './TaskProcessing';

export function AdminShippingDashboard() {
  const [activeTab, setActiveTab] = useState('profiles');

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Shipping Management</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="profiles">Shipping Profiles</TabsTrigger>
          <TabsTrigger value="carriers">Carrier Pricing</TabsTrigger>
          <TabsTrigger value="orders">Order History</TabsTrigger>
          <TabsTrigger value="tasks">Task Processing</TabsTrigger>
        </TabsList>

        <TabsContent value="profiles">
          <ShippingProfiles />
        </TabsContent>

        <TabsContent value="carriers">
          <CarrierPricing />
        </TabsContent>

        <TabsContent value="orders">
          <OrderHistory />
        </TabsContent>

        <TabsContent value="tasks">
          <TaskProcessing />
        </TabsContent>
      </Tabs>
    </Card>
  );
}