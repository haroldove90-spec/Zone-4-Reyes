
import React from 'react';
import { Fanpage } from '../types';

interface MyPagesProps {
    myPages: Fanpage[];
    navigate: (path: string) => void;
}

const MyPages: React.FC<MyPagesProps> = ({ myPages, navigate }) => (
    <main className="flex-grow pt-14 lg:ml-20 xl:ml-80 lg:mr-72 overflow-x-hidden p-4 md:p-6">
        <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-z-text-primary dark:text-z-text-primary-dark">Mis Páginas</h1>
                <button onClick={() => navigate('create-fanpage')} className="bg-z-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-z-dark-blue transition-colors">
                    + Crear Nueva Página
                </button>
            </div>
            <div className="space-y-4">
                {myPages.length > 0 ? myPages.map(p => (
                    <div key={p.id} className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-xl shadow-md p-4 flex items-center space-x-4 hover:shadow-lg transition-shadow cursor-pointer">
                        <img src={p.avatarUrl} alt={p.name} className="h-20 w-20 rounded-lg object-cover" loading="lazy" />
                        <div>
                            <h2 className="text-lg font-bold text-z-text-primary dark:text-z-text-primary-dark">{p.name}</h2>
                            <p className="text-sm text-z-text-secondary dark:text-z-text-secondary-dark">{p.category}</p>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-16 bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-xl">
                        <h2 className="text-xl font-bold text-z-text-primary dark:text-z-text-primary-dark">Aún no has creado ninguna página</h2>
                        <p className="text-z-text-secondary dark:text-z-text-secondary-dark mt-2 mb-4">Crea una página para tu negocio, marca o comunidad.</p>
                        <button onClick={() => navigate('create-fanpage')} className="mt-4 bg-z-primary text-white font-semibold py-2 px-5 rounded-md hover:bg-z-dark-blue">
                            Crea tu primera página
                        </button>
                    </div>
                )}
            </div>
        </div>
    </main>
);

export default MyPages;
