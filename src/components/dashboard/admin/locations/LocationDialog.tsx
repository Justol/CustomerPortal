import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const locationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  site_number: z.string().min(1, 'Site number is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zip_code: z.string().min(5, 'ZIP code is required'),
  phone: z.string().min(10, 'Phone number is required'),
  isActive: z.boolean(),
});

type LocationForm = z.infer<typeof locationSchema>;

interface LocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  location?: any;
  onClose: () => void;
}

export function LocationDialog({
  open,
  onOpenChange,
  location,
  onClose,
}: LocationDialogProps) {
  const { toast } = useToast();
  const form = useForm<LocationForm>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: location?.name || '',
      site_number: location?.site_number || '',
      address: location?.address || '',
      city: location?.city || '',
      state: location?.state || '',
      zip_code: location?.zip_code || '',
      phone: location?.phone || '',
      isActive: location?.status === 'active' || true,
    },
  });

  const onSubmit = async (data: LocationForm) => {
    try {
      const locationData = {
        name: data.name,
        site_number: data.site_number,
        address: data.address,
        city: data.city,
        state: data.state,
        zip_code: data.zip_code,
        phone: data.phone,
        status: data.isActive ? 'active' : 'inactive',
      };

      if (location) {
        const { error } = await supabase
          .from('locations')
          .update(locationData)
          .eq('id', location.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('locations')
          .insert([locationData]);

        if (error) throw error;
      }

      toast({
        title: location ? "Location Updated" : "Location Created",
        description: `Location has been ${location ? 'updated' : 'created'} successfully.`,
      });

      onClose();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${location ? 'update' : 'create'} location.`,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {location ? 'Edit Location' : 'Add Location'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="site_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zip_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ZIP Code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Enable or disable this location
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {location ? 'Save Changes' : 'Create Location'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}