import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const settingsSchema = z.object({
  defaultRole: z.string().min(1, 'Default role is required'),
  autoApprove: z.boolean(),
  passwordMinLength: z.string().min(1, 'Minimum password length is required'),
  maxLoginAttempts: z.string().min(1, 'Maximum login attempts is required'),
  sessionTimeout: z.string().min(1, 'Session timeout is required'),
});

type SettingsForm = z.infer<typeof settingsSchema>;

export function UserSettings() {
  const { toast } = useToast();
  const form = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      defaultRole: 'customer',
      autoApprove: true,
      passwordMinLength: '8',
      maxLoginAttempts: '5',
      sessionTimeout: '30',
    },
  });

  const onSubmit = async (data: SettingsForm) => {
    try {
      // Implement settings save logic
      toast({
        title: "Settings Updated",
        description: "User management settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update settings.",
      });
    }
  };

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="defaultRole"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default User Role</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Role assigned to new users by default
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="autoApprove"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Auto-Approve Users</FormLabel>
                  <FormDescription>
                    Automatically approve new user registrations
                  </FormDescription>
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

          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="passwordMinLength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Password Length</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxLoginAttempts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Login Attempts</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sessionTimeout"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Session Timeout (minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit">Save Settings</Button>
        </form>
      </Form>
    </Card>
  );
}