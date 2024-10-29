import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, UserPlus, UserMinus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  added_at?: string;
}

interface GroupMembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: any;
  onClose: () => void;
}

export function GroupMembersDialog({
  open,
  onOpenChange,
  group,
  onClose,
}: GroupMembersDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [members, setMembers] = useState<User[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (open && group) {
      loadUsers();
    }
  }, [open, group]);

  const loadUsers = async () => {
    if (!group) return;

    try {
      // Load current members
      const { data: memberData, error: memberError } = await supabase
        .from('admin_group_members')
        .select(`
          user_id,
          created_at,
          profiles:user_id (
            id,
            first_name,
            last_name,
            email,
            role
          )
        `)
        .eq('group_id', group.id);

      if (memberError) throw memberError;

      const currentMembers = memberData.map(m => ({
        ...m.profiles,
        added_at: m.created_at,
      }));

      setMembers(currentMembers);

      // Load available users (not in the group)
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'customer')
        .not('id', 'in', `(${currentMembers.map(m => m.id).join(',')})`);

      if (userError) throw userError;

      setAvailableUsers(userData);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load users.",
      });
    }
  };

  const handleAddMember = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('admin_group_members')
        .insert({
          group_id: group.id,
          user_id: userId,
        });

      if (error) throw error;

      toast({
        title: "Member Added",
        description: "User has been added to the group successfully.",
      });

      loadUsers();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add user to the group.",
      });
    }
  };

  const handleRemoveMember = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('admin_group_members')
        .delete()
        .eq('group_id', group.id)
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Member Removed",
        description: "User has been removed from the group successfully.",
      });

      loadUsers();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove user from the group.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Manage Group Members - {group?.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium mb-4">Available Users</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAddMember(user.id)}
                        >
                          <UserPlus className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-4">Current Members</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Added</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {member.first_name} {member.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {member.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {member.added_at && new Date(member.added_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}