
import React from 'react';
import { UsersIcon, ClapperboardIcon, StoreIcon, MegaphoneIcon, ShieldIcon, FlagIcon, AlertTriangleIcon, UsersRoundIcon, CalendarIcon } from './icons';
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
      <img src={avatarUrl} alt={title} className="h-8 w-8 rounded-full" loading="lazy" />
    ) : (
      <Icon className="h-8 w-8 text-z-primary" />
    )}
    <span className="font-semibold text-z-text-primary dark:text-z-text-primary-dark hidden xl:inline">{title}</span>
  </div>
);

interface LeftSidebarProps {
  navigate: (page: string) => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ navigate }) => {
  const { user } = useAuth();

  return (
    <aside className="hidden lg:block w-20 xl:w-80 pt-14 px-4 fixed h-full">
      <nav className="flex flex-col space-y-2 mt-4">
        {user && <SidebarItem avatarUrl={user.avatarUrl} title={user.name} Icon={UsersIcon} onClick={() => navigate('profile')} />}
        <SidebarItem Icon={UsersIcon} title="Amigos" onClick={() => navigate('friends')} />
        <SidebarItem Icon={AlertTriangleIcon} title="Denuncia Ciudadana" onClick={() => navigate('report')} />
        <SidebarItem Icon={ClapperboardIcon} title="Reels" onClick={() => navigate('reels')} />
        <SidebarItem Icon={UsersRoundIcon} title="Grupos" onClick={() => navigate('groups')} />
        <SidebarItem Icon={StoreIcon} title="Marketplace" onClick={() => navigate('marketplace')} />
        <SidebarItem Icon={CalendarIcon} title="Eventos" onClick={() => navigate('events')} />
        <SidebarItem Icon={MegaphoneIcon} title="Centro de Anuncios" onClick={() => navigate('ads')} />
        <SidebarItem Icon={FlagIcon} title="Mis Páginas" onClick={() => navigate('my-pages')} />
        {user?.isAdmin && <SidebarItem Icon={ShieldIcon} title="Admin Dashboard" onClick={() => navigate('admin')} />}
         <div className="border-t border-gray-300 dark:border-z-border-dark my-2"></div>
        <h2 className="text-z-text-secondary dark:text-z-text-secondary-dark font-semibold text-lg pt-2 hidden xl:block">Tus Atajos</h2>
        <SidebarItem avatarUrl="https://picsum.photos/id/33/200" title="Grupo de Diseño" Icon={UsersIcon} />
        <SidebarItem avatarUrl="https://picsum.photos/id/44/200" title="Comunidad de Gaming" Icon={UsersIcon} />
      </nav>
    </aside>
  );
};

export default LeftSidebar;