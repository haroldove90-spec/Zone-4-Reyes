

import React, { useState, useEffect, useCallback } from 'react';
import { Fanpage } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseClient';

interface MyPagesProps {
    navigate: (path: string) => void;
}

const PageSkeleton: React.FC = () => (
    <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-xl shadow-md p-4 flex items-center space-x-4 animate-pulse">
        <div className="h-20 w-20 rounded-lg bg-gray-200 dark:bg-z-hover-dark"></div>
        <div>
            <div className="h-5 w-40 bg-gray-200 dark:bg-z-hover-dark rounded-md mb-2"></div>
            <div className="h-4 w-24 bg-gray-200 dark:bg-z-hover-dark rounded-md"></div>
        </div>
    </div>
);

const MyPages: React.FC<MyPagesProps> = ({ navigate }) => {
    const { user } = useAuth();
    const [myPages, setMyPages] = useState<Fanpage[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMyPages = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('fanpages')
                .select('*')
                .eq('owner_id', user.id);

            if (error) throw error;

            const formattedPages = data.map((p: any) => ({
                id: p.id,
                name: p.name,
                category: p.category,
                avatarUrl: p.avatar_url,
                coverUrl: p.cover_url,
                bio: p.bio,
                ownerId: p.owner_id
            }));
            setMyPages(formattedPages);
        } catch (err) {
            console.error("Error fetching my pages:", err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchMyPages();
    }, [fetchMyPages]);

    return (
        <main className="flex-grow pt-14 lg:ml-20 xl:ml-80 lg:mr-72 overflow-x-hidden p-4 md:p-6">
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-z-text-primary dark:text-z-text-primary-dark">Mis Páginas</h1>
                    <button onClick={() => navigate('create-fanpage')} className="bg-z-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-z-dark-blue transition-colors">
                        + Crear Nueva Página
                    </button>
                </div>
                <div className="space-y-4">
                    {loading ? (
                        <>
                            <PageSkeleton />
                            <PageSkeleton />
                        </>
                    ) : myPages.length > 0 ? (
                        myPages.map(p => (
                            <div key={p.id} onClick={() => navigate(`fanpage/${p.id}`)} className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-xl shadow-md p-4 flex items-center space-x-4 hover:shadow-lg transition-shadow cursor-pointer">
                                <img src={p.avatarUrl} alt={p.name} className="h-20 w-20 rounded-lg object-cover" loading="lazy" />
                                <div>
                                    <h2 className="text-lg font-bold text-z-text-primary dark:text-z-text-primary-dark">{p.name}</h2>
                                    <p className="text-sm text-z-text-secondary dark:text-z-text-secondary-dark">{p.category}</p>
                                </div>
                            </div>
                        ))
                    ) : (
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
};

export default MyPages;