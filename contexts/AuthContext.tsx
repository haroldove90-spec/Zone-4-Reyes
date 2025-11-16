
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
    email: supabaseUser.email!,
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


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            if (session?.user) {
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();
                if (error) throw error;
                if (profile) {
                    setUser(formatProfile(profile, session.user));
                }
            }
        } catch (error) {
            console.error("Error in initial session fetch:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session?.user) {
            try {
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();
                if (error) throw error;
                if(profile) {
                    setUser(formatProfile(profile, session.user));
                }
            } catch (error) {
                 console.error("Error fetching profile on auth state change:", error);
                 setUser(null);
            }
        } else {
            setUser(null);
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
    // Pasa el nombre en los metadatos del usuario para que el trigger de la BD pueda acceder a él.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        }
      }
    });

    // El trigger se encarga de la creación del perfil, por lo que solo devolvemos el resultado de la autenticación.
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
