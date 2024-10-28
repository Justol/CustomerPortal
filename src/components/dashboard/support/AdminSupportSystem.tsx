import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TicketList } from './TicketList';
import { KnowledgeBase } from './KnowledgeBase';
import { SupportMetrics } from './SupportMetrics';
import { WishlistManagement } from './WishlistManagement';

export function AdminSupportSystem() {
  const [activeTab, setActiveTab] = useState('tickets');

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Support Management</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="knowledge-base">Knowledge Base</TabsTrigger>
          <TabsTrigger value="metrics">Support Metrics</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets">
          <TicketList />
        </TabsContent>

        <TabsContent value="knowledge-base">
          <KnowledgeBase />
        </TabsContent>

        <TabsContent value="metrics">
          <SupportMetrics />
        </TabsContent>

        <TabsContent value="wishlist">
          <WishlistManagement />
        </TabsContent>
      </Tabs>
    </Card>
  );
}