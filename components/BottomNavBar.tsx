
import React from 'react';
import { HomeIcon, UsersIcon, ClapperboardIcon, StoreIcon } from './icons';

interface BottomNavBarProps {
    setCurrentPage: (page: string) => void;
    activePage: string;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ setCurrentPage, activePage }) => {
  
  const navItems = [
    { name: 'Inicio', page: 'feed', icon: HomeIcon },
    { name: 'Amigos', page: 'friends', icon: UsersIcon },
    { name: 'Videos', page: 'videos', icon: ClapperboardIcon },
    { name: 'Marketplace', page: 'marketplace', icon: StoreIcon },
  ];

  const getPageName = (page: string) => {
    if(page === 'feed') return 'Inicio';
    if(page === 'friends') return 'Amigos';
    if(page === 'videos') return 'Videos';
    if(page === 'marketplace') return 'Marketplace';
    return '';
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-z-bg-secondary dark:bg-z-bg-secondary-dark shadow-[0_-2px_5px_rgba(0,0,0,0.1)] dark:shadow-[0_-2px_5px_rgba(0,0,0,0.3)] z-40">
      <div className="flex justify-around h-16">
        {navItems.map(({ name, page, icon: Icon }) => {
          const isActive = getPageName(activePage) === name;
          return (
            <div
              key={name}
              onClick={() => setCurrentPage(page)}
              className={`flex-1 flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 ${
                isActive
                  ? 'text-z-primary'
                  : 'text-z-text-secondary dark:text-z-text-secondary-dark hover:bg-gray-100 dark:hover:bg-z-hover-dark'
              }`}
              title={name}
            >
              <div className="relative w-full flex justify-center">
                 <Icon className="h-7 w-7" />
                 {isActive && (
                    <div className="absolute -top-4 h-1 w-1/2 bg-z-primary rounded-full"></div>
                 )}
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavBar;
