import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { Shield, UserX, UserCheck } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface User {
  id: string;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
}

export function AdminUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .ilike('email', `%${searchTerm}%`);

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleUserRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));

      toast({
        title: "Role Updated",
        description: `User role successfully updated to ${newRole}`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search users by email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={loadUsers} disabled={loading}>
          {loading ? "Loading..." : "Search"}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                {user.first_name} {user.last_name}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                  {user.role === 'admin' ? (
                    <Shield className="w-3 h-3 mr-1" />
                  ) : null}
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      {user.role === 'admin' ? (
                        <UserX className="w-4 h-4 mr-1" />
                      ) : (
                        <UserCheck className="w-4 h-4 mr-1" />
                      )}
                      Make {user.role === 'admin' ? 'Customer' : 'Admin'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Role Change</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to change {user.email}'s role from {user.role} to {user.role === 'admin' ? 'customer' : 'admin'}?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => toggleUserRole(user.id, user.role)}
                      >
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}