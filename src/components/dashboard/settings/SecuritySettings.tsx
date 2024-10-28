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
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

const securitySettingsSchema = z.object({
  passwordMinLength: z.string().min(1, 'Minimum password length is required'),
  passwordExpiration: z.string().min(1, 'Password expiration is required'),
  twoFactorAuth: z.boolean(),
  sessionTimeout: z.string().min(1, 'Session timeout is required'),
  ipWhitelist: z.string().optional(),
});

type SecuritySettingsForm = z.infer<typeof securitySettingsSchema>;

export function SecuritySettings() {
  const { toast } = useToast();
  const form = useForm<SecuritySettingsForm>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      passwordMinLength: '8',
      passwordExpiration: '90',
      twoFactorAuth: true,
      sessionTimeout: '30',
      ipWhitelist: '',
    },
  });

  const onSubmit = async (data: SecuritySettingsForm) => {
    try {
      // Implement save logic
      toast({
        title: "Settings Updated",
        description: "Security settings have been updated successfully.",
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="passwordMinLength"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Password Length</FormLabel>
              <FormControl>
                <Input type="number" min="8" {...field} />
              </FormControl>
              <FormDescription>
                Minimum number of characters required for passwords
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="passwordExpiration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password Expiration (Days)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormDescription>
                Number of days before passwords must be changed
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="twoFactorAuth"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Two-Factor Authentication</FormLabel>
                <FormDescription>
                  Require two-factor authentication for all users
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

        <FormField
          control={form.control}
          name="sessionTimeout"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Session Timeout (Minutes)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormDescription>
                Time of inactivity before users are logged out
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ipWhitelist"
          render={({ field }) => (
            <FormItem>
              <FormLabel>IP Whitelist</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter IP addresses, comma-separated" />
              </FormControl>
              <FormDescription>
                Optional: Restrict access to specific IP addresses
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Save Changes</Button>
      </form>
    </Form>
  );
}