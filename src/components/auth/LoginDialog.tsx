import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

interface LoginDialogProps {
  onNavigate: (page: string) => void;
}

export function LoginDialog({ onNavigate }: LoginDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, user, userDetails } = useAuth();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true);
      await signIn(data.email, data.password);
      setOpen(false);
      form.reset();

      // Navigate based on user role
      if (userDetails?.role === 'super_admin' || userDetails?.role === 'admin' || userDetails?.role === 'location_admin') {
        onNavigate('admin-dashboard');
      } else {
        onNavigate('dashboard');
      }
    } catch (error) {
      form.setError('password', {
        type: 'manual',
        message: 'Invalid email or password'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDashboardClick = () => {
    if (userDetails?.role === 'super_admin' || userDetails?.role === 'admin' || userDetails?.role === 'location_admin') {
      onNavigate('admin-dashboard');
    } else {
      onNavigate('dashboard');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {user ? (
          <Button variant="ghost" onClick={handleDashboardClick}>
            Dashboard
          </Button>
        ) : (
          <Button variant="ghost">Login</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome back</DialogTitle>
          <DialogDescription>
            Login to your MailBox & Ship account
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="you@example.com" 
                      type="email"
                      disabled={loading}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password"
                      disabled={loading}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}