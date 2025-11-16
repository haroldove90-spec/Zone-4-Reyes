
import React from 'react';
import { HomeIcon, UsersIcon, ClapperboardIcon, StoreIcon, BellIcon, MessageCircleIcon, SearchIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-z-bg-secondary shadow-md sticky top-0 z-50 flex items-center justify-between px-4 py-1">
      {/* Left Section */}
      <div className="flex items-center space-x-2">
        <img src="https://appdesignmex.com/Zone4Reyes.png" alt="Logo" className="h-10 w-10" />
        <div className="relative hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search Zone4Reyes"
            className="bg-z-bg-primary text-z-text-primary rounded-full py-2 pl-10 pr-4 w-60 focus:outline-none focus:ring-2 focus:ring-z-light-blue/50"
          />
        </div>
      </div>

      {/* Center Section */}
      <div className="flex-grow flex justify-center">
        <div className="flex space-x-2 sm:space-x-10">
          <div className="p-2 sm:px-4 rounded-lg cursor-pointer text-z-light-blue" title="Home">
            <HomeIcon className="h-7 w-7" />
          </div>
          <div className="p-2 sm:px-4 rounded-lg cursor-pointer hover:bg-gray-100 text-z-text-secondary" title="Friends">
            <UsersIcon className="h-7 w-7" />
          </div>
          <div className="p-2 sm:px-4 rounded-lg cursor-pointer hover:bg-gray-100 text-z-text-secondary" title="Watch">
            <ClapperboardIcon className="h-7 w-7" />
          </div>
          <div className="p-2 sm:px-4 rounded-lg cursor-pointer hover:bg-gray-100 text-z-text-secondary" title="Marketplace">
            <StoreIcon className="h-7 w-7" />
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2">
        <div className="p-2 bg-z-bg-primary rounded-full cursor-pointer hover:bg-gray-200" title="Messenger">
          <MessageCircleIcon className="h-6 w-6 text-z-text-primary" />
        </div>
        <div className="p-2 bg-z-bg-primary rounded-full cursor-pointer hover:bg-gray-200" title="Notifications">
          <BellIcon className="h-6 w-6 text-z-text-primary" />
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
