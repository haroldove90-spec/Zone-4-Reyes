import React from 'react';
import { HomeIcon, UsersIcon, ClapperboardIcon, StoreIcon, BellIcon, MessageCircleIcon, SearchIcon } from './icons';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
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
        <img
          src="https://picsum.photos/id/1/200"
          alt="User Avatar"
          className="h-10 w-10 rounded-full cursor-pointer"
        />
      </div>
    </header>
  );
};

export default Header;