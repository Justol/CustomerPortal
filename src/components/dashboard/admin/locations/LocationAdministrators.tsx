import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Trash2, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface Administrator {
  id: string;
  name: string;
  email: string;
  locationName: string;
  created_at: string;
}

interface Location {
  id: string;
  name: string;
  site_number: string;
}

export function LocationAdministrators() {
  const [administrators, setAdministrators] = useState<Administrator[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [availableUsers, setAvailableUsers] = useState<{ id: string; name: string }[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadAdministrators();
    loadAvailableUsers();
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('id, name, site_number')
        .eq('status', 'active');

      if (error) throw error;
      setLocations(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load locations",
      });
    }
  };

  const loadAdministrators = async () => {
    try {
      const { data, error } = await supabase
        .from('location_administrators')
        .select(`
          *,
          profiles:user_id (
            id,
            first_name,
            last_name,
            email
          ),
          locations:location_id (
            name
          )
        `);

      if (error) throw error;

      const formattedData = data.map(item => ({
        id: item.id,
        name: `${item.profiles.first_name} ${item.profiles.last_name}`,
        email: item.profiles.email,
        locationName: item.locations.name,
        created_at: item.created_at
      }));

      setAdministrators(formattedData);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load administrators",
      });
    }
  };

  const loadAvailableUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .eq('role', 'admin');

      if (error) throw error;

      const users = data.map(user => ({
        id: user.id,
        name: `${user.first_name} ${user.last_name}`
      }));

      setAvailableUsers(users);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load available users",
      });
    }
  };

  const addAdministrator = async () => {
    if (!selectedUser || !selectedLocation) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select both a user and a location",
      });
      return;
    }

    try {
      // Check if the assignment already exists
      const { data: existing } = await supabase
        .from('location_administrators')
        .select('id')
        .eq('user_id', selectedUser)
        .eq('location_id', selectedLocation)
        .single();

      if (existing) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "This user is already an administrator for this location",
        });
        return;
      }

      const { error } = await supabase
        .from('location_administrators')
        .insert({
          user_id: selectedUser,
          location_id: selectedLocation
        });

      if (error) throw error;

      toast({
        title: "Administrator Added",
        description: "Administrator has been added successfully",
      });

      setSelectedUser('');
      setSelectedLocation('');
      loadAdministrators();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add administrator",
      });
    }
  };

  const removeAdministrator = async (adminId: string) => {
    try {
      const { error } = await supabase
        .from('location_administrators')
        .delete()
        .eq('id', adminId);

      if (error) throw error;

      toast({
        title: "Administrator Removed",
        description: "Administrator has been removed successfully",
      });

      loadAdministrators();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove administrator",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location.id} value={location.id}>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  {location.name} ({location.site_number})
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedUser} onValueChange={setSelectedUser}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select administrator" />
          </SelectTrigger>
          <SelectContent>
            {availableUsers.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={addAdministrator} className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Administrator
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Assigned Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {administrators.map((admin) => (
            <TableRow key={admin.id}>
              <TableCell>{admin.name}</TableCell>
              <TableCell>{admin.email}</TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {admin.locationName}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(admin.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAdministrator(admin.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}