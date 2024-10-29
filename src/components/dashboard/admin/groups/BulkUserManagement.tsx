import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Users, UserPlus, UserMinus } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  groups: string[];
}

export function BulkUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const { toast } = useToast();

  const handleSelectAll = (checked: boolean) => {
    setSelectedUsers(checked ? users.map(user => user.id) : []);
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    setSelectedUsers(prev =>
      checked
        ? [...prev, userId]
        : prev.filter(id => id !== userId)
    );
  };

  const handleBulkAddToGroup = async () => {
    if (!selectedGroup || selectedUsers.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a group and at least one user.",
      });
      return;
    }

    try {
      // Implement bulk add logic
      toast({
        title: "Users Added",
        description: `${selectedUsers.length} users have been added to the group.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add users to the group.",
      });
    }
  };

  const handleBulkRemoveFromGroup = async () => {
    if (!selectedGroup || selectedUsers.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a group and at least one user.",
      });
      return;
    }

    try {
      // Implement bulk remove logic
      toast({
        title: "Users Removed",
        description: `${selectedUsers.length} users have been removed from the group.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove users from the group.",
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

        <div className="flex gap-2">
          <Button
            onClick={handleBulkAddToGroup}
            disabled={!selectedGroup || selectedUsers.length === 0}
            className="gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Add to Group
          </Button>
          <Button
            onClick={handleBulkRemoveFromGroup}
            disabled={!selectedGroup || selectedUsers.length === 0}
            variant="outline"
            className="gap-2"
          >
            <UserMinus className="h-4 w-4" />
            Remove from Group
          </Button>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedUsers.length === users.length}
                  onCheckedChange={(checked: boolean) => handleSelectAll(checked)}
                />
              </TableHead>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Current Groups</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={(checked: boolean) =>
                      handleSelectUser(user.id, checked)
                    }
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{user.role}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {user.groups.map((group) => (
                      <Badge key={group} variant="outline" className="gap-1">
                        <Users className="h-3 w-3" />
                        {group}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}