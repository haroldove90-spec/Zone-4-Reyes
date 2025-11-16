
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface AuthUser {
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
  login: (userData: AuthUser) => void;
  logout: () => void;
  updateUser: (newUserData: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (userData: AuthUser) => {
    const isAdmin = userData.email === 'admin@example.com';
    // Add default bio and cover for the simulation
    const fullUserData: AuthUser = {
        ...userData,
        bio: '¡Hola! Estoy usando Zone4Reyes. Es la red social oficial de Reyes Iztacala.',
        coverUrl: 'https://picsum.photos/id/1018/1600/400',
        nickname: userData.name.toLowerCase().replace(/\s+/g, '_'),
        age: 25,
        location: 'Reyes Iztacala, México',
        website: 'https://appdesignmex.com',
        friendsCount: 188,
        isAdmin: isAdmin,
    };
    setUser(fullUserData);
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (newUserData: Partial<AuthUser>) => {
    setUser(currentUser => {
        if (!currentUser) return null;
        return { ...currentUser, ...newUserData };
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
