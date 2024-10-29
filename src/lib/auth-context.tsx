// src/lib/auth-context.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  userDetails: { 
    role: string;
    firstName?: string;
    lastName?: string;
  } | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: { [key: string]: any }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<{ role: string; firstName?: string; lastName?: string; } | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const isAdmin = userDetails?.role === 'super_admin' || 
                 userDetails?.role === 'admin' || 
                 userDetails?.role === 'location_admin';

  useEffect(() => {
    // Set up Supabase auth state listener
    const setupAuthListener = async () => {
      // Get initial session
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchUserDetails(session.user.id);
      }

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchUserDetails(session.user.id);
        } else {
          setUserDetails(null);
        }
        setLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    };

    setupAuthListener();
  }, []);

  const fetchUserDetails = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role, first_name, last_name, status')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (!data.status || data.status !== 'active') {
        await signOut();
        toast({
          variant: "destructive",
          title: "Account Inactive",
          description: "Your account is not active. Please contact support.",
        });
        return;
      }
      
      setUserDetails({
        role: data.role,
        firstName: data.first_name,
        lastName: data.last_name
      });
    } catch (error) {
      console.error('Error fetching user details:', error);
      setUserDetails(null);
    }
  };

  const signUp = async (email: string, password: string, metadata?: { [key: string]: any }) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...metadata,
            role: 'customer',
            status: 'active'
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Please check your email to confirm your account.",
      });
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to sign up. Please try again.",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to sign in. Please try again.",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear user state
      setUser(null);
      setUserDetails(null);
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to sign out. Please try again.",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        userDetails,
        loading,
        signUp,
        signIn,
        signOut,
        isAuthenticated: !!user,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
