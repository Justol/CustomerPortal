import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth-context';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

interface LoginDialogProps {
  onNavigate: (page: string) => void;
}

export function LoginDialog({ onNavigate }: LoginDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { login, isAuthenticated } = useAuth();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      
      toast({
        title: "Logged in successfully!",
        description: "Welcome back to MailBox & Ship.",
      });
      
      setOpen(false);
      form.reset();
      onNavigate('dashboard');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid email or password.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isAuthenticated ? (
          <Button variant="ghost" onClick={() => onNavigate('dashboard')}>
            Dashboard
          </Button>
        ) : (
          <Button variant="ghost">Login</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
                    <Input placeholder="you@example.com" {...field} />
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
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Login</Button>
          </form>
          <div className="mt-4 text-center">
            <Button variant="link" className="text-sm text-muted-foreground">
              Forgot your password?
            </Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}