import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Creates a standard Supabase client that does NOT use PKCE or cookies.
 * This is useful for auth flows that need to be cross-browser/device compatible,
 * like password resets where the request and callback might happen in different browsers.
 */
export const createStandardClient = () => {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        detectSessionInUrl: false,
        autoRefreshToken: false,
      }
    }
  );
};
