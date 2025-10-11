'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, signIn as supabaseSignIn, signUp as supabaseSignUp, signOut as supabaseSignOut } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | { message: string } | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | { message: string } | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } else {
        // Mock authentication - check localStorage
        const storedUser = localStorage.getItem('mock-user');
        setUser(storedUser ? JSON.parse(storedUser) : null);
      }
      setLoading(false);
    };

    getInitialSession();

    if (supabase) {
      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      );

      return () => subscription.unsubscribe();
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabaseSignIn(email, password);
    if (data?.user) {
      setUser(data.user);
    }
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabaseSignUp(email, password);
    if (data?.user) {
      setUser(data.user);
    }
    return { error };
  };

  const signOut = async () => {
    await supabaseSignOut();
    setUser(null);
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
