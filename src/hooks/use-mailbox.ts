import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';

interface Mailbox {
  id: string;
  number: string;
  type: string;
  user_id: string;
  created_at: string;
}

interface CreateMailboxParams {
  number: string;
  type: string;
}

export function useMailbox(mailboxId?: string) {
  const { user } = useAuth();
  const [mailbox, setMailbox] = useState<Mailbox | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (mailboxId && user) {
      fetchMailbox();
    }
  }, [mailboxId, user]);

  async function fetchMailbox() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mailboxes')
        .select('*')
        .eq('id', mailboxId)
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setMailbox(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setLoading(false);
    }
  }

  async function createMailbox(params: CreateMailboxParams) {
    if (!user) throw new Error('User must be authenticated');

    const { data, error } = await supabase
      .from('mailboxes')
      .insert([
        {
          user_id: user.id,
          number: params.number,
          type: params.type,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  return {
    mailbox,
    loading,
    error,
    createMailbox,
  };
}