// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';

// Lazy import supabase to avoid initialization errors
let supabaseModule: typeof import('../lib/supabase') | null = null;

const getSupabase = async () => {
  if (!supabaseModule) {
    supabaseModule = await import('../lib/supabase');
  }
  return supabaseModule;
};

interface Profile {
  id: string;
  name: string | null;
  dob: string | null;
  contact: string;
  contact_type: 'phone' | 'email';
  username: string;
  language: string;
  contact_verified: boolean;
  profile_complete: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile from database
  const fetchProfile = async (userId: string) => {
    try {
      const { getUserProfile } = await getSupabase();
      const { data, error } = await getUserProfile(userId);
      if (!error && data) {
        setProfile(data as Profile);
      }
    } catch (err) {
      console.log('[v0] Error fetching profile:', err);
    }
  };

  // Refresh profile data
  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { supabase } = await getSupabase();
      await supabase.auth.signOut();
    } catch (err) {
      console.log('[v0] Error signing out:', err);
    }
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;

    const initAuth = async () => {
      try {
        const { supabase } = await getSupabase();
        
        // Get initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        
        if (initialSession?.user) {
          await fetchProfile(initialSession.user.id);
        }

        // Listen for auth changes
        const { data } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            setSession(newSession);
            setUser(newSession?.user ?? null);

            if (event === 'SIGNED_IN' && newSession?.user) {
              await fetchProfile(newSession.user.id);
            } else if (event === 'SIGNED_OUT') {
              setProfile(null);
            }
          }
        );
        subscription = data.subscription;
      } catch (err) {
        console.log('[v0] Auth initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    user,
    session,
    profile,
    isLoading,
    isAuthenticated: !!session,
    signOut,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
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
