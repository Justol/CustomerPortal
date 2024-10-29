import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export function AuthTest() {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createAdminUser = async () => {
    try {
      setLoading(true);
      
      // First, create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: 'admin@example.com',
        password: 'admin123',
        options: {
          data: {
            role: 'admin',
            firstName: 'Admin',
            lastName: 'User',
          }
        }
      });

      if (authError) throw authError;

      // Directly update the profile to ensure admin role
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          role: 'admin',
          status: 'active'
        })
        .eq('id', authData.user?.id);

      if (profileError) throw profileError;

      toast({
        title: "Admin Created",
        description: "Admin user created successfully. Email: admin@example.com, Password: admin123",
      });

      // Auto sign in as admin
      await signIn('admin@example.com', 'admin123');

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Create Admin User</h2>
      <Button 
        onClick={createAdminUser} 
        disabled={loading}
        className="w-full"
      >
        {loading ? "Creating Admin..." : "Create Admin User"}
      </Button>
      <p className="mt-4 text-sm text-muted-foreground">
        This will create an admin user with the following credentials:
        <br />
        Email: admin@example.com
        <br />
        Password: admin123
      </p>
    </Card>
  );
}