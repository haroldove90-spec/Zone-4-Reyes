
import React, { useState } from 'react';
import { Fanpage } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface CreateFanpageProps {
    onAddPage: (page: Fanpage) => void;
    navigate: (path: string) => void;
}

const CreateFanpage: React.FC<CreateFanpageProps> = ({ onAddPage, navigate }) => {
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [bio, setBio] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !category || !user) return;
        const newPage: Fanpage = {
            id: `fp${Date.now()}`,
            name, category, ownerEmail: user.email,
            bio: bio || 'Bienvenido a nuestra nueva página.',
            avatarUrl: `https://picsum.photos/seed/${name.replace(/\s/g, '')}/200`,
            coverUrl: `https://picsum.photos/seed/${name.replace(/\s/g, '')}cover/1600/400`,
        };
        onAddPage(newPage);
        navigate('my-pages');
    };

    return (
        <main className="flex-grow pt-14 lg:ml-20 xl:ml-80 lg:mr-72 overflow-x-hidden p-4 md:p-6">
            <div className="max-w-2xl mx-auto bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-xl shadow-md p-6">
                <div className="flex items-center space-x-4 mb-6">
                    <button onClick={() => navigate('my-pages')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-z-hover-dark transition-colors">&larr;</button>
                    <h1 className="text-2xl font-bold text-z-text-primary dark:text-z-text-primary-dark">Crear una Página</h1>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="page-name" className="block text-sm font-medium mb-1 text-z-text-secondary dark:text-z-text-secondary-dark">Nombre de la Página</label>
                        <input id="page-name" type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-z-bg-primary dark:bg-z-hover-dark rounded-md p-2.5 focus:ring-2 focus:ring-z-primary outline-none transition-colors" placeholder="Ej: El Rincón del Café" />
                    </div>
                    <div>
                        <label htmlFor="page-category" className="block text-sm font-medium mb-1 text-z-text-secondary dark:text-z-text-secondary-dark">Categoría</label>
                        <input id="page-category" type="text" value={category} onChange={e => setCategory(e.target.value)} required className="w-full bg-z-bg-primary dark:bg-z-hover-dark rounded-md p-2.5 focus:ring-2 focus:ring-z-primary outline-none transition-colors" placeholder="Ej: Cafetería" />
                    </div>
                     <div>
                        <label htmlFor="page-bio" className="block text-sm font-medium mb-1 text-z-text-secondary dark:text-z-text-secondary-dark">Biografía (Opcional)</label>
                        <textarea id="page-bio" value={bio} onChange={e => setBio(e.target.value)} rows={3} className="w-full bg-z-bg-primary dark:bg-z-hover-dark rounded-md p-2.5 focus:ring-2 focus:ring-z-primary outline-none resize-none transition-colors" placeholder="Describe tu página..."></textarea>
                    </div>
                    <button type="submit" className="w-full bg-z-primary text-white font-bold py-2.5 rounded-lg hover:bg-z-dark-blue transition-colors disabled:bg-gray-400" disabled={!name || !category}>Crear Página</button>
                </form>
            </div>
        </main>
    );
};

export default CreateFanpage;
