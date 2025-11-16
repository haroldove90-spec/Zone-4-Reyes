
import React, { useState, useRef, useEffect } from 'react';
import { BellIcon, MessageCircleIcon, SearchIcon, LogOutIcon, CogIcon } from './icons';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import NotificationsPanel from './NotificationsPanel';
import Messenger from './Messenger';
import { Notification } from '../types';

interface HeaderProps {
  navigate: (page: string) => void;
  notificationCount: number;
  notifications: Notification[];
  onNotificationsOpen: () => void;
}

const Header: React.FC<HeaderProps> = ({ navigate, notificationCount, notifications, onNotificationsOpen }) => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMessengerOpen, setIsMessengerOpen] = useState(false);

  const [messageCount, setMessageCount] = useState(5);

  const menuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const messengerRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (messengerRef.current && !messengerRef.current.contains(event.target as Node)) {
        // Messenger is a floating window, so we don't close it this way
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNotificationsClick = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (!isNotificationsOpen) {
      onNotificationsOpen();
    }
  };
  
  const handleMessengerClick = () => {
    setIsMessengerOpen(!isMessengerOpen);
  }

  const handleProfileClick = () => {
    setIsMenuOpen(false);
    navigate('profile');
  };

  const handleSettingsClick = () => {
    setIsMenuOpen(false);
    navigate('settings');
  };

  return (
    <header className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark shadow-md fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 border-b border-transparent dark:border-z-border-dark">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <img src="https://appdesignmex.com/Zone4Reyes.png" alt="Logo" className="h-[30px] cursor-pointer" onClick={() => navigate('feed')} loading="lazy" />
        <div className="relative hidden lg:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400 dark:text-z-text-secondary-dark" />
          </div>
          <input
            type="text"
            placeholder="Buscar en Zone4Reyes"
            className="bg-z-bg-primary dark:bg-z-hover-dark text-z-text-primary dark:text-z-text-primary-dark rounded-full py-2 pl-10 pr-4 w-60 focus:outline-none focus:ring-2 focus:ring-z-primary/50 transition-colors"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        <ThemeToggle />
        <div className="relative" ref={messengerRef}>
          <div className="p-2.5 bg-z-bg-primary dark:bg-z-bg-secondary-dark rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-z-hover-dark transition-transform hover:scale-110 relative" title="Messenger" onClick={handleMessengerClick}>
            <MessageCircleIcon className="h-6 w-6 text-z-text-primary dark:text-z-text-primary-dark" />
            {messageCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{messageCount}</span>
            )}
          </div>
          {isMessengerOpen && <Messenger onClose={() => setIsMessengerOpen(false)} unreadCount={messageCount} setUnreadCount={setMessageCount}/>}
        </div>
        <div className="relative" ref={notificationsRef}>
          <div className="p-2.5 bg-z-bg-primary dark:bg-z-bg-secondary-dark rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-z-hover-dark transition-transform hover:scale-110 relative" title="Notificaciones" onClick={handleNotificationsClick}>
            <BellIcon className="h-6 w-6 text-z-text-primary dark:text-z-text-primary-dark" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{notificationCount}</span>
            )}
          </div>
          {isNotificationsOpen && <NotificationsPanel notifications={notifications} />}
        </div>
        <div className="relative" ref={menuRef}>
          <img
            src={user?.avatarUrl}
            alt="User Avatar"
            className="h-10 w-10 rounded-full cursor-pointer transition-transform hover:scale-105"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            loading="lazy"
          />
          {isMenuOpen && (
             <div className="absolute right-0 mt-2 w-72 bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-md shadow-lg py-1 z-50 border dark:border-z-border-dark animate-fadeIn">
                <div onClick={handleProfileClick} className="p-4 border-b dark:border-z-border-dark flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-z-hover-dark cursor-pointer rounded-t-md">
                   <img src={user?.avatarUrl} alt="User Avatar" className="h-14 w-14 rounded-full" loading="lazy"/>
                   <div>
                     <p className="font-bold text-lg text-z-text-primary dark:text-z-text-primary-dark">{user?.name}</p>
                     <p className="text-sm text-z-text-secondary dark:text-z-text-secondary-dark">Ver tu perfil</p>
                   </div>
                </div>
                <div className="p-2">
                   <button
                    onClick={handleSettingsClick}
                    className="w-full text-left flex items-center space-x-3 px-3 py-2.5 text-sm text-z-text-primary dark:text-z-text-primary-dark hover:bg-gray-100 dark:hover:bg-z-hover-dark rounded-md transition-colors"
                  >
                    <div className="p-2 bg-gray-200 dark:bg-z-border-dark rounded-full">
                      <CogIcon className="h-5 w-5" />
                    </div>
                    <span>Configuración</span>
                  </button>
                  <button
                    onClick={logout}
                    className="w-full text-left flex items-center space-x-3 px-3 py-2.5 text-sm text-z-text-primary dark:text-z-text-primary-dark hover:bg-gray-100 dark:hover:bg-z-hover-dark rounded-md transition-colors"
                  >
                    <div className="p-2 bg-gray-200 dark:bg-z-border-dark rounded-full">
                      <LogOutIcon className="h-5 w-5" />
                    </div>
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;