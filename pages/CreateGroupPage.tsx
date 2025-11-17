
import React, { useState } from 'react';
import { Group } from '../types';

interface CreateGroupPageProps {
    onAddGroup: (group: Group) => void;
    navigate: (path: string) => void;
}

const CreateGroupPage: React.FC<CreateGroupPageProps> = ({ onAddGroup, navigate }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !description) return;

        const newGroup: Group = {
            id: `g${Date.now()}`,
            name,
            description,
            isPrivate,
            memberCount: 1,
            avatarUrl: `https://picsum.photos/seed/${name.replace(/\s/g, '')}/200`,
            coverUrl: `https://picsum.photos/seed/${name.replace(/\s/g, '')}cover/1600/400`,
        };
        onAddGroup(newGroup);
        navigate('groups');
    };

    return (
        <main className="flex-grow pt-14 lg:ml-20 xl:ml-80 lg:mr-72 overflow-x-hidden p-4 md:p-6">
            <div className="max-w-2xl mx-auto bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-xl shadow-md p-6">
                <div className="flex items-center space-x-4 mb-6">
                    <button onClick={() => navigate('groups')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-z-hover-dark transition-colors">&larr;</button>
                    <h1 className="text-2xl font-bold text-z-text-primary dark:text-z-text-primary-dark">Crear un Grupo</h1>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="group-name" className="block text-sm font-medium mb-1 text-z-text-secondary dark:text-z-text-secondary-dark">Nombre del Grupo</label>
                        <input id="group-name" type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-z-bg-primary dark:bg-z-hover-dark rounded-md p-2.5" placeholder="Ej: Amantes del Cine y Series" />
                    </div>
                     <div>
                        <label htmlFor="group-desc" className="block text-sm font-medium mb-1 text-z-text-secondary dark:text-z-text-secondary-dark">Descripción</label>
                        <textarea id="group-desc" value={description} onChange={e => setDescription(e.target.value)} rows={4} required className="w-full bg-z-bg-primary dark:bg-z-hover-dark rounded-md p-2.5 resize-none" placeholder="Describe de qué trata tu grupo..."></textarea>
                    </div>
                     <div>
                        <label htmlFor="group-privacy" className="block text-sm font-medium mb-1 text-z-text-secondary dark:text-z-text-secondary-dark">Privacidad</label>
                        <select id="group-privacy" value={isPrivate.toString()} onChange={e => setIsPrivate(e.target.value === 'true')} className="w-full bg-z-bg-primary dark:bg-z-hover-dark rounded-md p-2.5">
                            <option value="false">Público</option>
                            <option value="true">Privado</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-z-primary text-white font-bold py-2.5 rounded-lg hover:bg-z-dark-blue disabled:bg-gray-400" disabled={!name || !description}>Crear Grupo</button>
                </form>
            </div>
        </main>
    );
};

export default CreateGroupPage;
