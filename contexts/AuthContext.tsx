import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthUser {
  name: string;
  avatarUrl: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (userData: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // In a real app, you would check localStorage or a cookie for a session token
  const [user, setUser] = useState<AuthUser | null>(null);

  // In a real app, this would involve an API call to your backend
  const login = (userData: AuthUser) => {
    setUser(userData);
  };

  // In a real app, this would clear the session token and call a logout endpoint
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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