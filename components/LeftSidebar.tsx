
import React from 'react';
import { UsersIcon, ClapperboardIcon, StoreIcon } from './icons';

interface SidebarItemProps {
  Icon: React.ElementType;
  title: string;
  avatarUrl?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ Icon, title, avatarUrl }) => (
  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-z-hover-dark cursor-pointer">
    {avatarUrl ? (
      <img src={avatarUrl} alt={title} className="h-8 w-8 rounded-full" />
    ) : (
      <Icon className="h-8 w-8 text-z-primary" />
    )}
    <span className="font-semibold text-z-text-primary dark:text-z-text-primary-dark hidden xl:inline">{title}</span>
  </div>
);

const LeftSidebar: React.FC = () => {
  return (
    <aside className="hidden lg:block w-20 xl:w-80 pt-14 px-4 fixed h-full">
      <nav className="flex flex-col space-y-2">
        <SidebarItem avatarUrl="https://picsum.photos/id/1/200" title="My Profile" Icon={UsersIcon} />
        <SidebarItem Icon={UsersIcon} title="Friends" />
        <SidebarItem Icon={ClapperboardIcon} title="Watch" />
        <SidebarItem Icon={StoreIcon} title="Marketplace" />
         <div className="border-t border-gray-300 dark:border-z-border-dark my-2"></div>
        <h2 className="text-z-text-secondary dark:text-z-text-secondary-dark font-semibold text-lg pt-2 hidden xl:block">Your Shortcuts</h2>
        <SidebarItem avatarUrl="https://picsum.photos/id/33/200" title="Design Group" Icon={UsersIcon} />
        <SidebarItem avatarUrl="https://picsum.photos/id/44/200" title="Gaming Community" Icon={UsersIcon} />
      </nav>
    </aside>
  );
};

export default LeftSidebar;
