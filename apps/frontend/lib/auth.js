import { createClient } from '@supabase/supabase-js';

let supabase = null;

function getSupabase() {
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables');
    }

    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabase;
}

export async function signInWithGoogle() {
  const client = getSupabase();
  const { data, error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001'}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
  return { data, error };
}

export async function signOut() {
  const client = getSupabase();
  const { error } = await client.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const client = getSupabase();
  const { data: { user } } = await client.auth.getUser();
  return user;
}

export async function getSession() {
  const client = getSupabase();
  const { data: { session } } = await client.auth.getSession();
  return session;
}
