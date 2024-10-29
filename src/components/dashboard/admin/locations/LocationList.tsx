import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
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
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { LocationDialog } from './LocationDialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface Location {
  id: string;
  name: string;
  site_number: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export function LocationList() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('site_number', { ascending: true });

      if (error) throw error;
      setLocations(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load locations.",
      });
    }
  };

  const handleEdit = (location: Location) => {
    setSelectedLocation(location);
    setIsDialogOpen(true);
  };

  const handleDelete = async (locationId: string) => {
    try {
      const { error } = await supabase
        .from('locations')
        .delete()
        .eq('id', locationId);

      if (error) throw error;

      toast({
        title: "Location Deleted",
        description: "Location has been deleted successfully.",
      });

      loadLocations();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete location.",
      });
    }
  };

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.site_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Location
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Site Number</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLocations.map((location) => (
              <TableRow key={location.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    {location.site_number}
                  </div>
                </TableCell>
                <TableCell>{location.name}</TableCell>
                <TableCell>
                  <div>
                    <div>{location.address}</div>
                    <div className="text-sm text-muted-foreground">
                      {location.city}, {location.state} {location.zip_code}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{location.phone}</TableCell>
                <TableCell>
                  <Badge variant={location.status === 'active' ? 'success' : 'secondary'}>
                    {location.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(location)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(location.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <LocationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        location={selectedLocation}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedLocation(null);
          loadLocations();
        }}
      />
    </div>
  );
}