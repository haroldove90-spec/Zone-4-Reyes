import React, { useState, useRef, useEffect } from 'react';
import { HomeIcon, UsersIcon, ClapperboardIcon, StoreIcon, BellIcon, MessageCircleIcon, SearchIcon, LogOutIcon } from './icons';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <header className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark shadow-md fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 border-b border-transparent dark:border-z-border-dark">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <img src="https://appdesignmex.com/Zone4Reyes.png" alt="Logo" className="h-[30px]" />
        <div className="relative hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400 dark:text-z-text-secondary-dark" />
          </div>
          <input
            type="text"
            placeholder="Search Zone4Reyes"
            className="bg-z-bg-primary dark:bg-z-hover-dark text-z-text-primary dark:text-z-text-primary-dark rounded-full py-2 pl-10 pr-4 w-60 focus:outline-none focus:ring-2 focus:ring-z-primary/50"
          />
        </div>
         <div className="md:hidden p-2 bg-z-bg-primary dark:bg-z-bg-secondary-dark rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-z-hover-dark">
            <SearchIcon className="h-5 w-5 text-gray-500 dark:text-z-text-secondary-dark" />
        </div>
      </div>

      {/* Center Section */}
      <div className="flex-grow flex justify-center items-stretch h-full hidden md:flex">
        <div className="flex space-x-2">
          <div className="flex items-center border-b-4 border-z-primary text-z-primary px-6 cursor-pointer" title="Home">
            <HomeIcon className="h-7 w-7" />
          </div>
          <div className="flex items-center text-z-text-secondary dark:text-z-text-secondary-dark hover:bg-gray-100 dark:hover:bg-z-hover-dark px-6 rounded-lg cursor-pointer" title="Friends">
            <UsersIcon className="h-7 w-7" />
          </div>
          <div className="flex items-center text-z-text-secondary dark:text-z-text-secondary-dark hover:bg-gray-100 dark:hover:bg-z-hover-dark px-6 rounded-lg cursor-pointer" title="Watch">
            <ClapperboardIcon className="h-7 w-7" />
          </div>
          <div className="flex items-center text-z-text-secondary dark:text-z-text-secondary-dark hover:bg-gray-100 dark:hover:bg-z-hover-dark px-6 rounded-lg cursor-pointer" title="Marketplace">
            <StoreIcon className="h-7 w-7" />
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2">
        <ThemeToggle />
        <div className="p-2 bg-z-bg-primary dark:bg-z-bg-secondary-dark rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-z-hover-dark" title="Messenger">
          <MessageCircleIcon className="h-6 w-6 text-z-text-primary dark:text-z-text-primary-dark" />
        </div>
        <div className="p-2 bg-z-bg-primary dark:bg-z-bg-secondary-dark rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-z-hover-dark" title="Notifications">
          <BellIcon className="h-6 w-6 text-z-text-primary dark:text-z-text-primary-dark" />
        </div>
        <div className="relative" ref={menuRef}>
          <img
            src={user?.avatarUrl}
            alt="User Avatar"
            className="h-10 w-10 rounded-full cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
          {isMenuOpen && (
             <div className="absolute right-0 mt-2 w-48 bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-md shadow-lg py-1 z-50 border dark:border-z-border-dark">
                <div className="px-4 py-2 text-sm text-z-text-primary dark:text-z-text-primary-dark border-b dark:border-z-border-dark">
                  Signed in as <br/>
                  <span className="font-semibold">{user?.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-z-hover-dark"
                >
                  <LogOutIcon className="h-5 w-5" />
                  <span>Logout</span>
                </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;