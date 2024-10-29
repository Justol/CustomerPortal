import { useState, useEffect } from 'react';
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
import { Plus, Search, Edit, Trash, UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { GroupDialog } from './GroupDialog';
import { supabase } from '@/lib/supabase';

interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  status: string;
}

const defaultGroups = [
  {
    id: 'super-admin',
    name: 'Super Admin',
    description: 'Full system access and control',
    memberCount: 0,
    status: 'active'
  },
  {
    id: 'location-admin',
    name: 'Location Administrators',
    description: 'Manage specific location operations',
    memberCount: 0,
    status: 'active'
  },
  {
    id: 'location-staff',
    name: 'Location Staff',
    description: 'Handle day-to-day location tasks',
    memberCount: 0,
    status: 'active'
  },
  {
    id: 'customer',
    name: 'Customer',
    description: 'Standard customer access',
    memberCount: 0,
    status: 'active'
  }
];

export function GroupList() {
  const [groups, setGroups] = useState<Group[]>(defaultGroups);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('groups')
        .select('*');

      if (error) throw error;

      // Merge default groups with database groups
      const mergedGroups = [...defaultGroups];
      if (data) {
        data.forEach(dbGroup => {
          const existingIndex = mergedGroups.findIndex(g => g.id === dbGroup.id);
          if (existingIndex >= 0) {
            mergedGroups[existingIndex] = {
              ...mergedGroups[existingIndex],
              ...dbGroup
            };
          } else {
            mergedGroups.push(dbGroup);
          }
        });
      }

      setGroups(mergedGroups);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load groups"
      });
    }
  };

  const handleEdit = (group: Group) => {
    setSelectedGroup(group);
    setIsDialogOpen(true);
  };

  const handleDelete = async (groupId: string) => {
    try {
      const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', groupId);

      if (error) throw error;

      setGroups(groups.filter(group => group.id !== groupId));
      toast({
        title: "Success",
        description: "Group deleted successfully"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    }
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Group
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGroups.map((group) => (
              <TableRow key={group.id}>
                <TableCell className="font-medium">{group.name}</TableCell>
                <TableCell>{group.description}</TableCell>
                <TableCell>{group.memberCount}</TableCell>
                <TableCell>
                  <Badge variant={group.status === 'active' ? 'success' : 'secondary'}>
                    {group.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(group)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(group.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <GroupDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        group={selectedGroup}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedGroup(null);
          loadGroups();
        }}
      />
    </div>
  );
}