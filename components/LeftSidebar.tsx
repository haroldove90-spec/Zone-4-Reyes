
import React from 'react';
import { UsersIcon, ClapperboardIcon, StoreIcon, MegaphoneIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';

interface SidebarItemProps {
  Icon: React.ElementType;
  title: string;
  avatarUrl?: string;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ Icon, title, avatarUrl, onClick }) => (
  <div onClick={onClick} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-z-hover-dark cursor-pointer transition-colors duration-200">
    {avatarUrl ? (
      <img src={avatarUrl} alt={title} className="h-8 w-8 rounded-full" />
    ) : (
      <Icon className="h-8 w-8 text-z-primary" />
    )}
    <span className="font-semibold text-z-text-primary dark:text-z-text-primary-dark hidden xl:inline">{title}</span>
  </div>
);

interface LeftSidebarProps {
  setCurrentPage: (page: string) => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ setCurrentPage }) => {
  const { user } = useAuth();

  return (
    <aside className="hidden lg:block w-20 xl:w-80 pt-14 px-4 fixed h-full">
      <nav className="flex flex-col space-y-2 mt-4">
        {user && <SidebarItem avatarUrl={user.avatarUrl} title={user.name} Icon={UsersIcon} onClick={() => setCurrentPage('profile')} />}
        <SidebarItem Icon={UsersIcon} title="Amigos" onClick={() => setCurrentPage('friends')} />
        <SidebarItem Icon={ClapperboardIcon} title="Videos" />
        <SidebarItem Icon={StoreIcon} title="Marketplace" />
        <SidebarItem Icon={MegaphoneIcon} title="Centro de Anuncios" onClick={() => setCurrentPage('ads')} />
         <div className="border-t border-gray-300 dark:border-z-border-dark my-2"></div>
        <h2 className="text-z-text-secondary dark:text-z-text-secondary-dark font-semibold text-lg pt-2 hidden xl:block">Tus Atajos</h2>
        <SidebarItem avatarUrl="https://picsum.photos/id/33/200" title="Grupo de Diseño" Icon={UsersIcon} />
        <SidebarItem avatarUrl="https://picsum.photos/id/44/200" title="Comunidad de Gaming" Icon={UsersIcon} />
      </nav>
    </aside>
  );
};

export default LeftSidebar;
