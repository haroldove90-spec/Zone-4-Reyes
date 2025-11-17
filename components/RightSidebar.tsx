

import React from 'react';
import { User } from '../types';

interface RightSidebarProps {
  friends: User[];
  navigate: (path: string) => void;
}

const ContactItem: React.FC<{ user: User; onClick: () => void; }> = ({ user, onClick }) => (
  <div onClick={onClick} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-z-hover-dark cursor-pointer transition-colors duration-200">
    <div className="relative">
      <img src={user.avatarUrl} alt={user.name} className="h-8 w-8 rounded-full" loading="lazy" />
      <div className="absolute bottom-0 right-0 bg-green-500 w-2.5 h-2.5 rounded-full border-2 border-z-bg-secondary dark:border-z-bg-primary-dark"></div>
    </div>
    <span className="font-semibold text-z-text-primary dark:text-z-text-primary-dark hidden lg:inline">{user.name}</span>
  </div>
);

const RightSidebar: React.FC<RightSidebarProps> = ({ friends, navigate }) => {
  return (
    <aside className="hidden lg:block w-72 pt-16 px-4 fixed right-0 h-full">
      <div className="flex flex-col space-y-2 mt-4">
        <h2 className="text-z-text-secondary dark:text-z-text-secondary-dark font-semibold text-lg mb-2">Contactos</h2>
        {friends.length > 0 ? (
          friends.map((friend) => (
            <ContactItem key={friend.id} user={friend} onClick={() => navigate(`profile/${friend.id}`)} />
          ))
        ) : (
           <p className="text-sm text-center text-z-text-secondary dark:text-z-text-secondary-dark p-4">
              Tus amigos aparecerán aquí. ¡Busca a personas que conoces!
           </p>
        )}
      </div>
    </aside>
  );
};

export default RightSidebar;