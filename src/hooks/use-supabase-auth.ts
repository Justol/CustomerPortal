import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from './use-toast';
import { AuthError, User } from '@supabase/supabase-js';

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = useCallback(async (email: string, password: string, metadata: { firstName: string; lastName: string }) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            firstName: metadata.firstName,
            lastName: metadata.lastName,
            role: 'customer', // Default role
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Check your email",
        description: "We've sent you a verification link to complete your registration.",
      });
    } catch (error) {
      const e = error as AuthError;
      toast({
        variant: "destructive",
        title: "Error",
        description: e.message,
      });
      throw error;
    }
  }, [toast]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
    } catch (error) {
      const e = error as AuthError;
      toast({
        variant: "destructive",
        title: "Error",
        description: e.message,
      });
      throw error;
    }
  }, [toast]);

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      const e = error as AuthError;
      toast({
        variant: "destructive",
        title: "Error",
        description: e.message,
      });
      throw error;
    }
  }, [toast]);

  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Check your email",
        description: "We've sent you a password reset link.",
      });
    } catch (error) {
      const e = error as AuthError;
      toast({
        variant: "destructive",
        title: "Error",
        description: e.message,
      });
      throw error;
    }
  }, [toast]);

  const updateProfile = useCallback(async (data: { firstName?: string; lastName?: string }) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
        },
      });

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      const e = error as AuthError;
      toast({
        variant: "destructive",
        title: "Error",
        description: e.message,
      });
      throw error;
    }
  }, [toast]);

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
  };
}