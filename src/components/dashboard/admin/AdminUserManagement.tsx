import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserList } from './users/UserList';
import { UserGroups } from './users/UserGroups';
import { UserAnalytics } from './users/UserAnalytics';
import { UserSettings } from './users/UserSettings';

export function AdminUserManagement() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User & Client Management</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="groups">User Groups</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UserList />
        </TabsContent>

        <TabsContent value="groups">
          <UserGroups />
        </TabsContent>

        <TabsContent value="analytics">
          <UserAnalytics />
        </TabsContent>

        <TabsContent value="settings">
          <UserSettings />
        </TabsContent>
      </Tabs>
    </Card>
  );
}