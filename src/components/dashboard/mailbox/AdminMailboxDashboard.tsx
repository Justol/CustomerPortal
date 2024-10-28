import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MailList } from './MailList';
import { NewMailForm } from './NewMailForm';
import { TaskProcessor } from './TaskProcessor';
import { Button } from '@/components/ui/button';
import { Camera, Upload, Package, Scan, Truck, FileX, CheckSquare, FileText, Phone } from 'lucide-react';

export function AdminMailboxDashboard() {
  const [activeTab, setActiveTab] = useState('mail-list');

  const tasks = [
    { id: 'pickup', label: 'Pickup', icon: Package },
    { id: 'consolidate-pickup', label: 'Consolidate/Pickup', icon: Package },
    { id: 'scan', label: 'Scan10', icon: Scan },
    { id: 'ship', label: 'Ship', icon: Truck },
    { id: 'consolidate-ship', label: 'Consolidate/Ship', icon: Truck },
    { id: 'shred', label: 'Shred', icon: FileX },
    { id: 'discard', label: 'Discard', icon: FileX },
    { id: 'approve', label: 'Approve Docs', icon: CheckSquare },
    { id: 'notarize', label: 'Notarize', icon: FileText },
    { id: 'fax', label: 'Fax', icon: Phone },
  ];

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Mailbox Management</h2>
        <div className="flex gap-2">
          <Button onClick={() => setActiveTab('new-mail')} className="gap-2">
            <Camera className="h-4 w-4" />
            Capture Mail
          </Button>
          <Button variant="outline" onClick={() => setActiveTab('new-mail')} className="gap-2">
            <Upload className="h-4 w-4" />
            Import Mail
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="mail-list">Mail List</TabsTrigger>
          <TabsTrigger value="new-mail">Add New Mail</TabsTrigger>
          <TabsTrigger value="tasks">Process Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="mail-list">
          <MailList />
        </TabsContent>

        <TabsContent value="new-mail">
          <NewMailForm onSuccess={() => setActiveTab('mail-list')} />
        </TabsContent>

        <TabsContent value="tasks">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {tasks.map((task) => (
              <TaskProcessor
                key={task.id}
                id={task.id}
                label={task.label}
                icon={task.icon}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}