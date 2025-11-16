
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../services/supabaseClient';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  name: string;
  avatarUrl: string;
  email: string;
  bio?: string;
  coverUrl?: string;
  nickname?: string;
  age?: number;
  location?: string;
  website?: string;
  friendsCount?: number;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  login: (data: any) => Promise<any>;
  logout: () => Promise<void>;
  signUp: (data: any) => Promise<any>;
  updateUser: (newUserData: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        if (session) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
            setUser(profile ? { ...session.user, ...profile } : null);
        }
        setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
            setUser(profile ? { id: session.user.id, email: session.user.email!, ...profile } : null);
        } else {
            setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async ({ email, password }) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = async ({ name, email, password }) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { user: null, session: null, error };
    if (data.user) {
        const { error: profileError } = await supabase.from('profiles').insert({
            id: data.user.id,
            name,
            email,
            avatar_url: `https://i.pravatar.cc/150?u=${email}`,
            cover_url: 'https://picsum.photos/id/1018/1600/400',
            bio: '¡Hola! Estoy usando Zone4Reyes. Es la red social oficial de Reyes Iztacala.',
            nickname: name.toLowerCase().replace(/\s+/g, '_'),
            age: 25,
            location: 'Reyes Iztacala, México',
            website: 'https://appdesignmex.com',
            friends_count: 0,
            is_admin: email === 'admin@example.com'
        });
        if(profileError) return { user: null, session: null, error: profileError }
    }
    return { user: data.user, session: data.session, error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };
  
  const updateUser = async (newUserData: Partial<AuthUser>) => {
      if(!user) return;
      
      const snakeCaseData = {
          name: newUserData.name,
          nickname: newUserData.nickname,
          bio: newUserData.bio,
          location: newUserData.location,
          website: newUserData.website,
          age: newUserData.age,
          avatar_url: newUserData.avatarUrl,
          cover_url: newUserData.coverUrl,
      };

      const { data, error } = await supabase
        .from('profiles')
        .update(snakeCaseData)
        .eq('id', user.id)
        .select()
        .single();
      
      if(data) {
           setUser(prevUser => prevUser ? { ...prevUser, ...newUserData } : null);
      }
      if (error) {
          console.error("Error updating profile:", error);
      }
  };


  const value = {
    session,
    user,
    loading,
    login,
    logout,
    signUp,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
