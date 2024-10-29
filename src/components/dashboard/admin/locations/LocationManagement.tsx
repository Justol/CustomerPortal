import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LocationList } from './LocationList';
import { LocationAdministrators } from './LocationAdministrators';

export function LocationManagement() {
  const [activeTab, setActiveTab] = useState('locations');

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Location Management</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="administrators">Location Administrators</TabsTrigger>
        </TabsList>

        <TabsContent value="locations">
          <LocationList />
        </TabsContent>

        <TabsContent value="administrators">
          <LocationAdministrators />
        </TabsContent>
      </Tabs>
    </Card>
  );
}