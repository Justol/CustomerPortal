import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

export function GroupPermissions() {
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const { toast } = useToast();

  const permissionCategories = [
    'User Management',
    'Content Management',
    'System Settings',
    'Billing & Payments',
    'Reports & Analytics',
  ];

  const handleSavePermissions = async () => {
    try {
      // Implement save logic
      toast({
        title: "Permissions Updated",
        description: "Group permissions have been updated successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update group permissions.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Select value={selectedGroup} onValueChange={setSelectedGroup}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select admin group" />
          </SelectTrigger>
          <SelectContent>
            {/* Add group options here */}
          </SelectContent>
        </Select>

        <Button onClick={handleSavePermissions} className="gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      {selectedGroup && (
        <div className="space-y-6">
          {permissionCategories.map((category) => (
            <Card key={category} className="p-6">
              <h3 className="text-lg font-semibold mb-4">{category}</h3>
              <div className="space-y-4">
                {permissions
                  .filter((p) => p.category === category)
                  .map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-center justify-between py-2"
                    >
                      <div>
                        <h4 className="font-medium">{permission.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {permission.description}
                        </p>
                      </div>
                      <Switch />
                    </div>
                  ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}