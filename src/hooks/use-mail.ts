import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/database.types';
import { useToast } from './use-toast';

type Mail = Database['public']['Tables']['mail']['Row'];
type NewMail = Database['public']['Tables']['mail']['Insert'];

export function useMail(mailboxId: string | undefined) {
  const [mail, setMail] = useState<Mail[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!mailboxId) {
      setLoading(false);
      return;
    }

    async function loadMail() {
      try {
        const { data, error } = await supabase
          .from('mail')
          .select('*')
          .eq('mailbox_id', mailboxId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setMail(data || []);
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

    loadMail();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('mail_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'mail',
          filter: `mailbox_id=eq.${mailboxId}`
        }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMail(prev => [payload.new as Mail, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setMail(prev => prev.map(item => 
              item.id === payload.new.id ? payload.new as Mail : item
            ));
          } else if (payload.eventType === 'DELETE') {
            setMail(prev => prev.filter(item => item.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [mailboxId, toast]);

  const updateMailStatus = useCallback(async (id: string, status: Mail['status']) => {
    try {
      const { error } = await supabase
        .from('mail')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Mail updated",
        description: "Mail status has been successfully updated.",
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

  const uploadScan = useCallback(async (id: string, file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${id}.${fileExt}`;
      const filePath = `mail-scans/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('mail-scans')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('mail-scans')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('mail')
        .update({ 
          scanned_url: publicUrl,
          status: 'scanned'
        })
        .eq('id', id);

      if (updateError) throw updateError;

      toast({
        title: "Scan uploaded",
        description: "Mail scan has been successfully uploaded.",
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
    mail,
    loading,
    updateMailStatus,
    uploadScan,
  };
}