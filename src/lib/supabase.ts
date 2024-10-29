import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Get the current site URL based on environment
const siteUrl = import.meta.env.DEV 
  ? 'http://localhost:5173'
  : import.meta.env.VITE_SITE_URL || 'https://mailandshiponline.com';

export const supabase = createClient<Database>(
  supabaseUrl, 
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      storage: localStorage,
      storageKey: 'mailbox-auth',
      debug: import.meta.env.DEV,
    },
    global: {
      headers: {
        'apikey': supabaseAnonKey
      }
    },
    db: {
      schema: 'public'
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    },
    // Add retry configuration
    fetch: (url, options = {}) => {
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Content-Type': 'application/json',
        },
        // Add retry logic
      }).then(async (response) => {
        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw new Error(error.message || 'Network response was not ok');
        }
        return response;
      }).catch((error) => {
        console.error('Fetch error:', error);
        // Retry logic for failed requests
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            fetch(url, options)
              .then(resolve)
              .catch(reject);
          }, 1000); // Retry after 1 second
        });
      });
    }
  }
);