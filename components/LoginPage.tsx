import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GoogleIcon, AppleIcon, EnvelopeIcon } from './icons';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // This is a mock login. In a real app, you'd validate credentials.
    // For this demo, any non-empty email will log in.
    if (email) {
      login({ 
        name: email.split('@')[0], 
        avatarUrl: `https://i.pravatar.cc/150?u=${email}`,
        email: email 
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-z-bg-primary dark:bg-z-bg-primary-dark p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <img src="https://appdesignmex.com/Zone4Reyes.png" alt="Logo" className="h-[40px] mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-z-text-primary dark:text-z-text-primary-dark">Welcome Back</h1>
            <p className="text-z-text-secondary dark:text-z-text-secondary-dark">Sign in to continue to Zone4Reyes Social</p>
        </div>

        <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark p-8 rounded-xl shadow-lg">
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-z-text-secondary dark:text-z-text-secondary-dark mb-1" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-z-bg-primary dark:bg-z-hover-dark rounded-md px-4 py-2.5 text-z-text-primary dark:text-z-text-primary-dark focus:outline-none focus:ring-2 focus:ring-z-primary/50"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-z-text-secondary dark:text-z-text-secondary-dark mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-z-bg-primary dark:bg-z-hover-dark rounded-md px-4 py-2.5 text-z-text-primary dark:text-z-text-primary-dark focus:outline-none focus:ring-2 focus:ring-z-primary/50"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-z-primary text-white font-bold py-2.5 px-4 rounded-lg hover:bg-z-dark-blue transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-z-primary dark:focus:ring-offset-z-bg-secondary-dark"
            >
              Sign In
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-z-border-dark"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-z-bg-secondary dark:bg-z-bg-secondary-dark text-z-text-secondary dark:text-z-text-secondary-dark">Or continue with</span>
            </div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
             <button className="w-full flex items-center justify-center space-x-2 bg-white dark:bg-z-bg-secondary-dark border border-gray-300 dark:border-z-border-dark font-medium py-2.5 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-z-hover-dark transition-colors">
                <GoogleIcon className="h-5 w-5" />
                <span className="text-z-text-primary dark:text-z-text-primary-dark">Google</span>
             </button>
              <button className="w-full flex items-center justify-center space-x-2 bg-black text-white font-medium py-2.5 px-4 rounded-lg hover:bg-gray-800 transition-colors">
                <AppleIcon className="h-5 w-5" />
                <span>Apple</span>
             </button>
           </div>

        </div>
        <p className="text-center text-sm text-z-text-secondary dark:text-z-text-secondary-dark mt-6">
            Don't have an account? <a href="#" className="font-medium text-z-primary hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;