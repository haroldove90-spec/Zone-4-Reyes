


import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseClient';
import { User } from '../types';
import { UserCheckIcon, UsersPlusIcon, UserXIcon } from '../components/icons';

interface FriendsPageProps {
  navigate: (path: string) => void;
  addNotification: (text: string, user: User, postContent?: string) => void;
}

const UserCard: React.FC<{ user: User; children: React.ReactNode; onProfileClick: () => void; }> = ({ user, children, onProfileClick }) => (
    <div className="bg-z-bg-primary dark:bg-z-hover-dark p-3 rounded-lg flex flex-col sm:flex-row items-center sm:space-x-3 shadow">
        <img src={user.avatarUrl} alt={user.name} className="h-20 w-20 sm:h-16 sm:w-16 rounded-lg object-cover mb-2 sm:mb-0 cursor-pointer" loading="lazy" onClick={onProfileClick} />
        <div className="flex-grow text-center sm:text-left">
            <p className="font-bold text-z-text-primary dark:text-z-text-primary-dark cursor-pointer hover:underline" onClick={onProfileClick}>{user.name}</p>
            <div className="flex space-x-2 mt-2 justify-center sm:justify-start">
                {children}
            </div>
        </div>
    </div>
);

const FriendsPage: React.FC<FriendsPageProps> = ({ navigate, addNotification }) => {
    const { user: currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('requests');
    const [requests, setRequests] = useState<User[]>([]);
    const [friends, setFriends] = useState<User[]>([]);
    const [suggestions, setSuggestions] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        if (!currentUser) return;
        setLoading(true);

        try {
            // Fetch friend requests
            const { data: reqData, error: reqError } = await supabase
                .from('friendships')
                .select('requester_id, profiles!requester_id(id, name, avatar_url)')
                .eq('addressee_id', currentUser.id)
                .eq('status', 'pending');
            if (reqError) throw reqError;
            setRequests(
                reqData
                    .filter((r: any) => r.profiles)
                    .map((r: any) => ({ 
                        id: r.profiles.id, 
                        name: r.profiles.name, 
                        avatarUrl: r.profiles.avatar_url 
                    }))
            );

            // Fetch friends
            const { data: friendsData, error: friendsError } = await supabase.rpc('get_friends', { user_id: currentUser.id });
            if (friendsError) throw friendsError;
            setFriends(friendsData.map((f: any) => ({ id: f.id, name: f.name, avatarUrl: f.avatar_url })));

            // Fetch suggestions
            const { data: suggestionsData, error: suggestionsError } = await supabase.rpc('get_friend_suggestions', { user_id: currentUser.id });
            if (suggestionsError) throw suggestionsError;
            setSuggestions(suggestionsData.map((s: any) => ({ id: s.id, name: s.name, avatarUrl: s.avatar_url })));

        } catch (error: any) {
            console.error("Error fetching friends data:", error.message || error);
        } finally {
            setLoading(false);
        }
    }, [currentUser]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAction = async (otherUserId: string, action: 'accept' | 'decline' | 'remove' | 'add') => {
        if (!currentUser) return;

        try {
            if (action === 'accept') {
                const { error } = await supabase
                    .from('friendships')
                    .update({ status: 'accepted' })
                    .eq('requester_id', otherUserId)
                    .eq('addressee_id', currentUser.id);
                if (error) throw error;
                 addNotification(`ha aceptado tu solicitud de amistad.`, currentUser);
            }
            if (action === 'decline') {
                 const { error } = await supabase
                    .from('friendships')
                    .delete()
                    .eq('requester_id', otherUserId)
                    .eq('addressee_id', currentUser.id);
                if (error) throw error;
            }
            if (action === 'remove') {
                const { error } = await supabase.rpc('remove_friend', { user1_id: currentUser.id, user2_id: otherUserId });
                if (error) throw error;
            }
            if(action === 'add') {
                const { error } = await supabase
                    .from('friendships')
                    .insert({ requester_id: currentUser.id, addressee_id: otherUserId, status: 'pending' });
                if (error) throw error;
            }

            // Refresh all data after any action
            fetchData();
        } catch (error) {
            console.error(`Error performing action ${action}:`, error);
        }
    };

    const renderContent = () => {
        if(loading) return <div className="text-center p-8">Cargando...</div>
        
        if (activeTab === 'requests') {
            return requests.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {requests.map(req => (
                        <UserCard key={req.id} user={req} onProfileClick={() => navigate(`profile/${req.id}`)}>
                            <button onClick={() => handleAction(req.id, 'accept')} className="flex-1 bg-z-primary text-white text-sm font-semibold py-1.5 rounded-md hover:bg-z-dark-blue">Confirmar</button>
                            <button onClick={() => handleAction(req.id, 'decline')} className="flex-1 bg-gray-200 dark:bg-z-border-dark text-z-text-primary dark:text-z-text-primary-dark text-sm font-semibold py-1.5 rounded-md hover:bg-gray-300">Eliminar</button>
                        </UserCard>
                    ))}
                </div>
            ) : <p className="text-z-text-secondary dark:text-z-text-secondary-dark text-center p-8">No tienes solicitudes de amistad pendientes.</p>;
        }
        
        if (activeTab === 'suggestions') {
             return suggestions.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {suggestions.map(sug => (
                        <UserCard key={sug.id} user={sug} onProfileClick={() => navigate(`profile/${sug.id}`)}>
                            <button onClick={() => handleAction(sug.id, 'add')} className="flex items-center justify-center flex-1 bg-z-light-blue text-white text-sm font-semibold py-1.5 rounded-md hover:bg-z-primary">
                                <UsersPlusIcon className="w-4 h-4 mr-1.5"/> Agregar
                            </button>
                        </UserCard>
                    ))}
                </div>
            ) : <p className="text-z-text-secondary dark:text-z-text-secondary-dark text-center p-8">No hay nuevas sugerencias de amistad.</p>;
        }

        if (activeTab === 'all') {
            return friends.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {friends.map(friend => (
                        <UserCard key={friend.id} user={friend} onProfileClick={() => navigate(`profile/${friend.id}`)}>
                             <button onClick={() => navigate(`profile/${friend.id}`)} className="flex items-center justify-center flex-1 bg-gray-200 dark:bg-z-border-dark text-z-text-primary dark:text-z-text-primary-dark text-sm font-semibold py-1.5 rounded-md hover:bg-gray-300">Ver Perfil</button>
                            <button onClick={() => handleAction(friend.id, 'remove')} className="p-1.5 rounded-md bg-red-500/10 text-red-500 hover:bg-red-500/20"><UserXIcon className="w-4 h-4"/></button>
                        </UserCard>
                    ))}
                </div>
            ) : <p className="text-z-text-secondary dark:text-z-text-secondary-dark text-center p-8">Aún no tienes amigos. ¡Busca en las sugerencias!</p>;
        }
    }


    return (
        <main className="flex-grow pt-14 lg:ml-20 xl:ml-80 lg:mr-72 overflow-x-hidden p-4 md:p-6">
            <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-xl shadow-md p-4 md:p-6">
                <h1 className="text-2xl font-bold text-z-text-primary dark:text-z-text-primary-dark mb-4">Amigos</h1>
                
                <div className="flex space-x-2 sm:space-x-4 border-b dark:border-z-border-dark mb-4 text-sm sm:text-base">
                    <button onClick={() => setActiveTab('requests')} className={`py-2 px-4 font-semibold relative ${activeTab === 'requests' ? 'text-z-primary border-b-2 border-z-primary' : 'text-z-text-secondary dark:text-z-text-secondary-dark'}`}>
                        Solicitudes {requests.length > 0 && <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">{requests.length}</span>}
                    </button>
                    <button onClick={() => setActiveTab('suggestions')} className={`py-2 px-4 font-semibold ${activeTab === 'suggestions' ? 'text-z-primary border-b-2 border-z-primary' : 'text-z-text-secondary dark:text-z-text-secondary-dark'}`}>Sugerencias</button>
                    <button onClick={() => setActiveTab('all')} className={`py-2 px-4 font-semibold ${activeTab === 'all' ? 'text-z-primary border-b-2 border-z-primary' : 'text-z-text-secondary dark:text-z-text-secondary-dark'}`}>Todos los Amigos</button>
                </div>
                {renderContent()}
            </div>
        </main>
    );
};

export default FriendsPage;