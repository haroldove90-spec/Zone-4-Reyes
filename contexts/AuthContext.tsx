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
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        try {
          setSession(session);
          if (session?.user) {
            const profile = await getUserProfile(session.user);
            setUser(profile);
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Error handling auth state change:", error);
          setUser(null);
        } finally {
          setLoading(false);
        }
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
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    });

    if (authError) {
      return { user: null, session: null, error: authError };
    }

    if (authData.user) {
      // After successful sign up, create a profile for the new user
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        name,
        // Using a placeholder avatar, user can change it later
        avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
      });

      if (profileError) {
        // If profile creation fails, this is a problem, but the user is already created in auth.
        console.error("Error creating profile for new user:", profileError);
        // We still return the auth data, but the app might be in a weird state.
        // In a real app, you might want to handle this more gracefully (e.g., delete the auth user).
        return { user: authData.user, session: authData.session, error: profileError };
      }
    }
    
    return { user: authData.user, session: authData.session, error: null };
  };


  const logout = async () => {
    await supabase.auth.signOut();
  };
  
  const updateUser = async (newUserData: Partial<AuthUser>) => {
      if(!user) return;
      
      const newUserDataSnake: {[key: string]: any} = {
          name: newUserData.name,
          nickname: newUserData.nickname,
          bio: newUserData.bio,
          location: newUserData.location,
          website: newUserData.website,
          age: newUserData.age,
          avatar_url: newUserData.avatarUrl,
          cover_url: newUserData.coverUrl,
      };

      // Filter out undefined values to avoid overwriting existing data with null
      const updateData = Object.fromEntries(
        Object.entries(newUserDataSnake).filter(([_, v]) => v !== undefined)
      );

      if (Object.keys(updateData).length === 0) return;

      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
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