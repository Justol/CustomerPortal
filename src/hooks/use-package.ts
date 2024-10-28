import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/database.types';
import { useToast } from './use-toast';

type Package = Database['public']['Tables']['packages']['Row'];
type NewPackage = Database['public']['Tables']['packages']['Insert'];

export function usePackage(userId: string | undefined) {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function loadPackages() {
      try {
        const { data, error } = await supabase
          .from('packages')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPackages(data || []);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    }

    loadPackages();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('packages_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'packages',
          filter: `user_id=eq.${userId}`
        }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setPackages(prev => [payload.new as Package, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setPackages(prev => prev.map(pkg => 
              pkg.id === payload.new.id ? payload.new as Package : pkg
            ));
          } else if (payload.eventType === 'DELETE') {
            setPackages(prev => prev.filter(pkg => pkg.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId, toast]);

  const createPackage = useCallback(async (data: Omit<NewPackage, 'user_id'>) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('packages')
        .insert({
          ...data,
          user_id: userId,
        });

      if (error) throw error;

      toast({
        title: "Package created",
        description: "Package has been successfully created.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      throw error;
    }
  }, [userId, toast]);

  const updatePackageStatus = useCallback(async (id: string, status: Package['status']) => {
    try {
      const { error } = await supabase
        .from('packages')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Package updated",
        description: "Package status has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      throw error;
    }
  }, [toast]);

  return {
    packages,
    loading,
    createPackage,
    updatePackageStatus,
  };
}