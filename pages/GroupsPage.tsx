
import React, { useState } from 'react';
import { Group } from '../types';
import { SearchIcon, UsersRoundIcon, LockIcon } from '../components/icons';

interface GroupsPageProps {
  navigate: (path: string) => void;
  groups: Group[];
}

const GroupCard: React.FC<{ group: Group; onClick: () => void }> = ({ group, onClick }) => (
    <div onClick={onClick} className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-lg shadow-md overflow-hidden group cursor-pointer">
        <img src={group.coverUrl} alt={group.name} className="w-full h-24 object-cover" />
        <div className="p-4">
            <h3 className="font-bold text-z-text-primary dark:text-z-text-primary-dark group-hover:text-z-primary transition-colors">{group.name}</h3>
            <p className="text-sm text-z-text-secondary dark:text-z-text-secondary-dark mt-1">{group.memberCount} miembros</p>
            {group.isPrivate && <div className="flex items-center text-xs mt-2 text-z-text-secondary dark:text-z-text-secondary-dark"><LockIcon className="w-3 h-3 mr-1" /> Grupo Privado</div>}
        </div>
    </div>
);

const GroupsPage: React.FC<GroupsPageProps> = ({ navigate, groups }) => {
    const [activeTab, setActiveTab] = useState('discover');

    return (
        <main className="flex-grow pt-14 lg:ml-20 xl:ml-80 lg:mr-72 overflow-x-hidden p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                    <h1 className="text-3xl font-bold text-z-text-primary dark:text-z-text-primary-dark">Grupos</h1>
                    <button onClick={() => navigate('create-group')} className="bg-z-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-z-dark-blue transition-colors w-full md:w-auto">
                        + Crear Nuevo Grupo
                    </button>
                </div>
                 <div className="flex space-x-4 border-b dark:border-z-border-dark mb-4">
                    <button onClick={() => setActiveTab('discover')} className={`py-2 px-4 font-semibold ${activeTab === 'discover' ? 'text-z-primary border-b-2 border-z-primary' : 'text-z-text-secondary dark:text-z-text-secondary-dark'}`}>Descubrir</button>
                    <button onClick={() => setActiveTab('my-groups')} className={`py-2 px-4 font-semibold ${activeTab === 'my-groups' ? 'text-z-primary border-b-2 border-z-primary' : 'text-z-text-secondary dark:text-z-text-secondary-dark'}`}>Mis Grupos</button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groups.map(group => (
                        <GroupCard key={group.id} group={group} onClick={() => navigate(`group/${group.id}`)} />
                    ))}
                </div>
            </div>
        </main>
    );
};

export default GroupsPage;
