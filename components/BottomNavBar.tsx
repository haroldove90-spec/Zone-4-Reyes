
import React from 'react';
import { HomeIcon, UsersIcon, StoreIcon, AlertTriangleIcon } from './icons';

interface BottomNavBarProps {
    navigate: (path: string) => void;
    activePath: string;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ navigate, activePath }) => {
  
  const navItems = [
    { name: 'Inicio', path: 'feed', icon: HomeIcon },
    { name: 'Amigos', path: 'friends', icon: UsersIcon },
    { name: 'Denuncia', path: 'report', icon: AlertTriangleIcon },
    { name: 'Marketplace', path: 'marketplace', icon: StoreIcon },
  ];

  const getActivePathBase = (path: string) => {
      return path.split('/')[0];
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-z-bg-secondary dark:bg-z-bg-secondary-dark shadow-[0_-2px_5px_rgba(0,0,0,0.1)] dark:shadow-[0_-2px_5px_rgba(0,0,0,0.3)] z-40">
      <div className="flex justify-around h-16">
        {navItems.map(({ name, path, icon: Icon }) => {
          const isActive = getActivePathBase(activePath) === path;
          return (
            <div
              key={name}
              onClick={() => navigate(path)}
              className={`flex-1 flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 ${
                isActive
                  ? 'text-z-primary'
                  : 'text-z-text-secondary dark:text-z-text-secondary-dark hover:bg-gray-100 dark:hover:bg-z-hover-dark'
              }`}
              title={name}
            >
              <div className="relative w-full flex justify-center">
                 <Icon className={`h-7 w-7 ${isActive ? '' : ''}`} />
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