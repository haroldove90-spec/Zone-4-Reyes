import React from 'react';
import Header from './components/Header';
import LeftSidebar from './components/LeftSidebar';
import Feed from './components/Feed';
import RightSidebar from './components/RightSidebar';
import { Post } from './types';
import { generateSocialFeed } from './services/geminiService';
import { ThemeProvider } from './contexts/ThemeContext';
import InstallPWA from './components/InstallPWA';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './components/LoginPage';
import MainLayout from './components/MainLayout';

const App: React.FC = () => {
  const { user } = useAuth();

  return (
    <ThemeProvider>
      {user ? <MainLayout /> : <LoginPage />}
    </ThemeProvider>
  );
};

export default App;