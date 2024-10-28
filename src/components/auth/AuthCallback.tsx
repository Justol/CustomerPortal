import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export function AuthCallback() {
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Check if email is verified
        if (!session.user.email_confirmed_at) {
          toast({
            title: "Email verification required",
            description: "Please check your email and verify your account.",
            variant: "warning"
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          });
          window.location.href = '/dashboard';
        }
      } else if (event === 'SIGNED_OUT') {
        window.location.href = '/';
      }
    });

    // Handle initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        if (!session.user.email_confirmed_at) {
          toast({
            title: "Email verification required",
            description: "Please check your email and verify your account.",
            variant: "warning"
          });
        } else {
          window.location.href = '/dashboard';
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Completing authentication...</h2>
        <p className="text-muted-foreground">Please wait while we verify your account.</p>
      </div>
    </div>
  );
}