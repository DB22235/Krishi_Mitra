// src/lib/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Try multiple env var naming conventions - Vite injects these at build time
const supabaseUrl = 
  import.meta.env.VITE_SUPABASE_URL || 
  '';

const supabaseAnonKey = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  '';

// Create a singleton instance
let supabaseInstance: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (!supabaseInstance) {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('[v0] Supabase credentials not available. Auth features may not work.');
    }
    supabaseInstance = createClient(
      supabaseUrl || 'https://placeholder.supabase.co', 
      supabaseAnonKey || 'placeholder-key'
    );
  }
  return supabaseInstance;
}

export const supabase = getSupabaseClient();

// Auth helper functions
export async function signUpWithEmail(
  email: string,
  password: string,
  metadata: {
    name?: string;
    dob?: string;
    contact: string;
    contact_type: 'email' | 'phone';
    username: string;
    language?: string;
  }
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
  return { data, error };
}

export async function signUpWithPhone(
  phone: string,
  password: string,
  metadata: {
    name?: string;
    dob?: string;
    contact: string;
    contact_type: 'email' | 'phone';
    username: string;
    language?: string;
  }
) {
  const { data, error } = await supabase.auth.signUp({
    phone,
    password,
    options: {
      data: metadata,
    },
  });
  return { data, error };
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signInWithPhone(phone: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    phone,
    password,
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
}

// Profile helper functions
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
}

export async function updateUserProfile(userId: string, updates: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
}

export async function checkUsernameAvailability(username: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .maybeSingle();
  
  if (error) return { available: false, error };
  return { available: !data, error: null };
}
