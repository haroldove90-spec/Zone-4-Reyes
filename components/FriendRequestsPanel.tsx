



import React from 'react';
import { User } from '../types';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

interface FriendRequestsPanelProps {
    requests: User[];
    onAction: () => void; // Callback to refresh the list in MainLayout
    navigate: (path: string) => void;
}

const FriendRequestsPanel: React.FC<FriendRequestsPanelProps> = ({ requests, onAction, navigate }) => {
    const { user: currentUser } = useAuth();
    
    const handleAccept = async (requesterId: string) => {
        if (!currentUser) return;
        const { error } = await supabase
            .from('friendships')
            .update({ status: 'accepted' })
            .eq('requester_id', requesterId)
            .eq('addressee_id', currentUser.id);
        if (error) console.error("Error accepting request:", error);
        else onAction();
    };

    const handleDecline = async (requesterId: string) => {
         if (!currentUser) return;
         const { error } = await supabase
            .from('friendships')
            .delete()
            .eq('requester_id', requesterId)
            .eq('addressee_id', currentUser.id);
        if (error) console.error("Error declining request:", error);
        else onAction();
    };

    return (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-md shadow-lg z-50 border dark:border-z-border-dark animate-fadeIn">
            <div className="p-4 border-b dark:border-z-border-dark">
                <h2 className="text-xl font-bold text-z-text-primary dark:text-z-text-primary-dark">Solicitudes de amistad</h2>
            </div>
            <div className="py-2 max-h-96 overflow-y-auto">
                {requests.length > 0 ? requests.map((req) => (
                    <div key={req.id} className="p-3 hover:bg-gray-100 dark:hover:bg-z-hover-dark transition-colors">
                       <div className="flex items-center space-x-3">
                         <img src={req.avatarUrl} alt={req.name} className="h-14 w-14 rounded-full cursor-pointer" loading="lazy" onClick={() => navigate(`profile/${req.id}`)}/>
                         <div className="flex-1">
                            <p className="text-sm text-z-text-primary dark:text-z-text-primary-dark">
                                <span className="font-bold cursor-pointer hover:underline" onClick={() => navigate(`profile/${req.id}`)}>{req.name}</span>
                            </p>
                            <div className="flex space-x-2 mt-2">
                                <button onClick={() => handleAccept(req.id)} className="flex-1 bg-z-primary text-white text-sm font-semibold py-1.5 rounded-md hover:bg-z-dark-blue">Confirmar</button>
                                <button onClick={() => handleDecline(req.id)} className="flex-1 bg-gray-200 dark:bg-z-border-dark text-z-text-primary dark:text-z-text-primary-dark text-sm font-semibold py-1.5 rounded-md hover:bg-gray-300">Eliminar</button>
                            </div>
                         </div>
                       </div>
                    </div>
                )) : (
                    <p className="p-4 text-center text-z-text-secondary dark:text-z-text-secondary-dark">No tienes solicitudes de amistad.</p>
                )}
            </div>
             <div className="text-center p-2 border-t dark:border-z-border-dark">
                <a onClick={() => navigate('friends')} className="text-sm font-bold text-z-primary hover:underline cursor-pointer">Ver todo</a>
            </div>
        </div>
    );
};

export default FriendRequestsPanel;