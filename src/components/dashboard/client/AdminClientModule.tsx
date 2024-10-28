import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClientList } from './ClientList';
import { ClientAnalytics } from './ClientAnalytics';
import { ClientCommunication } from './ClientCommunication';

export function AdminClientModule() {
  const [activeTab, setActiveTab] = useState('clients');

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Client Management</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="clients">Client List</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
        </TabsList>

        <TabsContent value="clients">
          <ClientList />
        </TabsContent>

        <TabsContent value="analytics">
          <ClientAnalytics />
        </TabsContent>

        <TabsContent value="communication">
          <ClientCommunication />
        </TabsContent>
      </Tabs>
    </Card>
  );
}