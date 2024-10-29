import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GroupList } from './groups/GroupList';
import { GroupPermissions } from './groups/GroupPermissions';
import { GroupAuditLog } from './groups/GroupAuditLog';
import { BulkUserManagement } from './groups/BulkUserManagement';

export function AdminGroupManagement() {
  const [activeTab, setActiveTab] = useState('groups');

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Admin Group Management</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Management</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>

        <TabsContent value="groups">
          <GroupList />
        </TabsContent>

        <TabsContent value="permissions">
          <GroupPermissions />
        </TabsContent>

        <TabsContent value="bulk">
          <BulkUserManagement />
        </TabsContent>

        <TabsContent value="audit">
          <GroupAuditLog />
        </TabsContent>
      </Tabs>
    </Card>
  );
}