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

const formatProfile = (profileData: any, supabaseUser: SupabaseUser): AuthUser => ({
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: profileData.name,
    avatarUrl: profileData.avatar_url,
    bio: profileData.bio,
    coverUrl: profileData.cover_url,
    nickname: profileData.nickname,
    age: profileData.age,
    location: profileData.location,
    website: profileData.website,
    friendsCount: profileData.friends_count,
    isAdmin: profileData.is_admin,
});

const getUserProfile = async (supabaseUser: SupabaseUser): Promise<AuthUser | null> => {
    try {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', supabaseUser.id)
            .single();

        if (error) {
            console.error('Error fetching profile:', error.message);
            return null;
        }

        return profile ? formatProfile(profile, supabaseUser) : null;
    } catch (e) {
        console.error('Exception fetching profile', e);
        return null;
    }
}


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialSession = async () => {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
            console.error("Error fetching initial session:", error.message);
        }
        
        setSession(session);
        
        if (session?.user) {
            const profile = await getUserProfile(session.user);
            setUser(profile);
        }
        
        setLoading(false);
    };

    fetchInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        const profile = session?.user ? await getUserProfile(session.user) : null;
        setUser(profile);
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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        }
      }
    });
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
