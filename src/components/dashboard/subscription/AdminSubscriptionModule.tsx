import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SubscriptionList } from './SubscriptionList';
import { SubscriptionPlans } from './SubscriptionPlans';
import { SubscriptionAnalytics } from './SubscriptionAnalytics';

export function AdminSubscriptionModule() {
  const [activeTab, setActiveTab] = useState('subscriptions');

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Subscription Management</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="subscriptions">Active Subscriptions</TabsTrigger>
          <TabsTrigger value="plans">Plans & Pricing</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions">
          <SubscriptionList />
        </TabsContent>

        <TabsContent value="plans">
          <SubscriptionPlans />
        </TabsContent>

        <TabsContent value="analytics">
          <SubscriptionAnalytics />
        </TabsContent>
      </Tabs>
    </Card>
  );
}