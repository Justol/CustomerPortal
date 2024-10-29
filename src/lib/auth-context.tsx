import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface UserDetails {
  role: 'super_admin' | 'admin' | 'location_admin' | 'location_staff' | 'customer_service' | 'customer';
  firstName?: string;
  lastName?: string;
  status: 'active' | 'inactive' | 'suspended';
}

interface AuthContextType {
  user: User | null;
  userDetails: UserDetails | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: { [key: string]: any }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  fetchUserDetails: (userId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const isAdmin = ['super_admin', 'admin', 'location_admin'].includes(userDetails?.role || '');
  const isSuperAdmin = userDetails?.role === 'super_admin';

  const fetchUserDetails = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role, first_name, last_name, status')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!profile) {
        // Create profile if it doesn't exist
        const { data: userData } = await supabase.auth.getUser(userId);
        const defaultRole = userData.user?.user_metadata?.role || 'customer';

        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            email: userData.user?.email,
            role: defaultRole,
            status: 'active',
          })
          .select()
          .single();

        if (insertError) throw insertError;

        setUserDetails({
          role: newProfile.role,
          firstName: newProfile.first_name,
          lastName: newProfile.last_name,
          status: newProfile.status,
        });
      } else {
        setUserDetails({
          role: profile.role,
          firstName: profile.first_name,
          lastName: profile.last_name,
          status: profile.status,
        });
      }
    } catch (error: any) {
      console.error('Error fetching user details:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch user details. Please try again.",
      });
      throw error;
    }
  };

  useEffect(() => {
    const setupAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          await fetchUserDetails(session.user.id);
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
              await fetchUserDetails(session.user.id);
            } else {
              setUserDetails(null);
            }
            setLoading(false);
          }
        );

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth setup error:', error);
        setLoading(false);
      }
    };

    setupAuth();
  }, []);

  const signUp = async (email: string, password: string, metadata?: { [key: string]: any }) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...metadata,
            role: metadata?.role || 'customer',
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Please check your email to confirm your account.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await fetchUserDetails(data.user.id);
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
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
      
      setUser(null);
      setUserDetails(null);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
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
        isAdmin,
        isSuperAdmin,
        fetchUserDetails
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