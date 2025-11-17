
import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './components/LoginPage';
import MainLayout from './components/MainLayout';

const App: React.FC = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      // When user logs out or session expires, clear the hash
      // to ensure they are on the root path for the login page.
      if (window.location.hash && window.location.hash !== '#') {
        window.location.hash = '';
      }
    }
  }, [user, loading]);

  if (loading) {
    return (
        <div className="min-h-screen flex justify-center items-center bg-z-bg-primary dark:bg-z-bg-primary-dark">
            <div className="w-12 h-12 border-4 border-z-primary/30 border-t-z-primary rounded-full animate-spin"></div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } } .animate-spin { animation: spin 1s linear infinite; }`}</style>
        </div>
    );
  }

  return (
    <ThemeProvider>
      {user ? <MainLayout /> : <LoginPage />}
    </ThemeProvider>
  );
};

export default App;