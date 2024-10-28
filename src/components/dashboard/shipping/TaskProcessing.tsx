import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Scan, Truck, FileX, CheckSquare, FileText, Phone } from 'lucide-react';

interface Task {
  id: string;
  label: string;
  icon: any;
  description: string;
}

export function TaskProcessing() {
  const tasks: Task[] = [
    {
      id: 'pickup',
      label: 'Pickup',
      icon: Package,
      description: 'Process package pickup requests'
    },
    {
      id: 'consolidate-pickup',
      label: 'Consolidate/Pickup',
      icon: Package,
      description: 'Consolidate multiple items for pickup'
    },
    {
      id: 'scan',
      label: 'Scan10',
      icon: Scan,
      description: 'Scan documents (up to 10 pages)'
    },
    {
      id: 'ship',
      label: 'Ship',
      icon: Truck,
      description: 'Process shipping requests'
    },
    {
      id: 'consolidate-ship',
      label: 'Consolidate/Ship',
      icon: Truck,
      description: 'Consolidate items for shipping'
    },
    {
      id: 'shred',
      label: 'Shred',
      icon: FileX,
      description: 'Securely shred documents'
    },
    {
      id: 'approve',
      label: 'Approve Docs',
      icon: CheckSquare,
      description: 'Review and approve documents'
    },
    {
      id: 'notarize',
      label: 'Notarize',
      icon: FileText,
      description: 'Notarize documents'
    },
    {
      id: 'fax',
      label: 'Fax',
      icon: Phone,
      description: 'Send faxes'
    }
  ];

  const handleTaskClick = (taskId: string) => {
    console.log(`Processing task: ${taskId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <Card
          key={task.id}
          className="p-6 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <task.icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">{task.label}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {task.description}
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleTaskClick(task.id)}
            >
              Process Task
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}