import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Get the current site URL based on environment
const siteUrl = import.meta.env.DEV 
  ? 'http://localhost:5173'  // Development URL
  : import.meta.env.VITE_SITE_URL || 'https://mailandshiponline.com'; // Production URL

export const supabase = createClient<Database>(
  supabaseUrl, 
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      redirectTo: `${siteUrl}/auth/callback`,
      storageKey: 'mailbox-auth',
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      emailRedirectTo: `${siteUrl}/auth/callback`
    },
    global: {
      headers: {
        'apikey': supabaseAnonKey
      }
    },
    db: {
      schema: 'public'
    }
  }
);