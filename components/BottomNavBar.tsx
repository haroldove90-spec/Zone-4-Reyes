
import React from 'react';
import { HomeIcon, UsersIcon, ClapperboardIcon, StoreIcon } from './icons';

const BottomNavBar: React.FC = () => {
  // In a real app, you'd use a router to determine the active link
  const activeLink = 'Inicio'; 

  const navItems = [
    { name: 'Inicio', icon: HomeIcon },
    { name: 'Amigos', icon: UsersIcon },
    { name: 'Videos', icon: ClapperboardIcon },
    { name: 'Marketplace', icon: StoreIcon },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-z-bg-secondary dark:bg-z-bg-secondary-dark shadow-[0_-2px_5px_rgba(0,0,0,0.1)] dark:shadow-[0_-2px_5px_rgba(0,0,0,0.3)] z-40">
      <div className="flex justify-around h-16">
        {navItems.map(({ name, icon: Icon }) => {
          const isActive = activeLink === name;
          return (
            <div
              key={name}
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
