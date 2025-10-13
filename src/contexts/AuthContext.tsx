'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, signIn as supabaseSignIn, signUp as supabaseSignUp, signOut as supabaseSignOut } from '@/lib/supabase';
import { customerService } from '@/lib/database';
import { setStoredRole, setStoredUserId } from '@/lib/roleUtils';

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
        
        // If user is logged in, fetch their role from database
        if (session?.user?.email) {
          try {
            const userInfo = await customerService.getUserByEmail(session.user.email);
            if (userInfo) {
              setStoredRole(userInfo.role as 'admin' | 'user');
              localStorage.setItem('user-name', userInfo.name);
            } else {
              setStoredRole('user');
              localStorage.setItem('user-name', 'Regular User');
            }
          } catch (dbError) {
            console.error('Error fetching user info:', dbError);
            setStoredRole('user');
            localStorage.setItem('user-name', 'Regular User');
          }
        }
      } else {
        // Mock authentication - check localStorage or set default user
        const storedUser = localStorage.getItem('mock-user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUser(user);
          // Set role based on stored user email
          if (user.email === 'superadmin@linguiniholidays.com') {
            setStoredRole('superadmin');
            localStorage.setItem('user-name', 'Super Admin');
          } else if (user.email === 'admin@linguiniholidays.com') {
            setStoredRole('admin');
            localStorage.setItem('user-name', 'Admin User');
          } else {
            setStoredRole('user');
            localStorage.setItem('user-name', 'Regular User');
          }
        } else {
          // Set default mock user for development
          const defaultUser = {
            id: 'mock-user-id',
            email: 'superadmin@linguiniholidays.com',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            aud: 'authenticated',
            role: 'authenticated',
            app_metadata: {},
            user_metadata: {},
            identities: [],
            factors: [],
            email_confirmed_at: new Date().toISOString(),
            last_sign_in_at: new Date().toISOString(),
            phone: '',
            phone_confirmed_at: undefined,
            confirmed_at: new Date().toISOString(),
            recovery_sent_at: undefined,
            new_email: undefined,
            invited_at: undefined,
            action_link: undefined,
            email_change_sent_at: undefined,
            new_phone: undefined,
            phone_change_sent_at: undefined,
            reauthentication_sent_at: undefined,
            reauthentication_confirm_at: undefined,
            is_sso_user: false,
            deleted_at: undefined,
            is_anonymous: false,
          };
          localStorage.setItem('mock-user', JSON.stringify(defaultUser));
          setUser(defaultUser);
          // Set user role for testing (change to 'superadmin' for admin access)
          setStoredRole('user');
          setStoredUserId('Sales');
          localStorage.setItem('user-name', 'Sales');
        }
      }
      setLoading(false);
    };

    getInitialSession();

    if (supabase) {
      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setUser(session?.user ?? null);
          
          // If user is logged in, fetch their role from database
          if (session?.user?.email) {
            try {
              const userInfo = await customerService.getUserByEmail(session.user.email);
              if (userInfo) {
                setStoredRole(userInfo.role as 'admin' | 'user');
                localStorage.setItem('user-name', userInfo.name);
              } else {
                setStoredRole('user');
                localStorage.setItem('user-name', 'Regular User');
              }
            } catch (dbError) {
              console.error('Error fetching user info:', dbError);
              setStoredRole('user');
              localStorage.setItem('user-name', 'Regular User');
            }
          } else {
            // Clear role and user name if logged out
            localStorage.removeItem('linguini-crm-user-role');
            localStorage.removeItem('user-name');
          }
          
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
      
      // Fetch user information from database and set role
      try {
        const userInfo = await customerService.getUserByEmail(email);
        if (userInfo) {
          // Set role from database
          setStoredRole(userInfo.role as 'admin' | 'user');
          // Store user name in localStorage for use in comments
          localStorage.setItem('user-name', userInfo.name);
        } else {
          // Default to 'user' role if user not found in database
          setStoredRole('user');
          localStorage.setItem('user-name', 'Regular User');
        }
      } catch (dbError) {
        console.error('Error fetching user info:', dbError);
        // Default to 'user' role if database error
        setStoredRole('user');
        localStorage.setItem('user-name', 'Regular User');
      }
    }
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabaseSignUp(email, password);
    if (data?.user) {
      setUser(data.user);
      
      // Fetch user information from database and set role
      try {
        const userInfo = await customerService.getUserByEmail(email);
        if (userInfo) {
          // Set role from database
          setStoredRole(userInfo.role as 'admin' | 'user');
          // Store user name in localStorage for use in comments
          localStorage.setItem('user-name', userInfo.name);
        } else {
          // Default to 'user' role if user not found in database
          setStoredRole('user');
          localStorage.setItem('user-name', 'Regular User');
        }
      } catch (dbError) {
        console.error('Error fetching user info:', dbError);
        // Default to 'user' role if database error
        setStoredRole('user');
        localStorage.setItem('user-name', 'Regular User');
      }
    }
    return { error };
  };

  const signOut = async () => {
    await supabaseSignOut();
    setUser(null);
    // Clear stored role and user name
    localStorage.removeItem('linguini-crm-user-role');
    localStorage.removeItem('user-name');
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
