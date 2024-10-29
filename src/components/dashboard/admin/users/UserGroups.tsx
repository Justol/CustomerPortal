import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, UserMinus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
}

export function UserGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_groups')
        .select(`
          *,
          members:admin_group_members(count)
        `)
        .eq('status', 'active');

      if (error) throw error;

      const formattedGroups = data.map(group => ({
        id: group.id,
        name: group.name,
        description: group.description,
        memberCount: group.members[0]?.count || 0
      }));

      setGroups(formattedGroups);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load groups.",
      });
    }
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {groups.map((group) => (
        <Card key={group.id} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">{group.name}</h3>
            </div>
            <Badge variant="secondary">
              {group.memberCount} members
            </Badge>
          </div>
          <p className="text-muted-foreground mb-4">
            {group.description}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" className="w-full gap-2">
              <UserPlus className="h-4 w-4" />
              Add Members
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}