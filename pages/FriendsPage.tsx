
import React, { useState } from 'react';
import { UsersIcon, UsersPlusIcon } from '../components/icons';

const initialFriends = [
    { name: 'John Doe', avatarUrl: 'https://picsum.photos/id/1011/200' },
    { name: 'Jane Smith', avatarUrl: 'https://picsum.photos/id/1025/200' },
    { name: 'Alice Johnson', avatarUrl: 'https://picsum.photos/id/1027/200' },
];

const initialRequests = [
    { name: 'Bob Williams', avatarUrl: 'https://picsum.photos/id/103/200' },
    { name: 'Charlie Brown', avatarUrl: 'https://picsum.photos/id/1040/200' },
];

const FriendsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('requests');
    const [requests, setRequests] = useState(initialRequests);
    const [friends, setFriends] = useState(initialFriends);

    const handleConfirm = (name: string) => {
        const newFriend = requests.find(r => r.name === name);
        if(newFriend) {
            setFriends(prev => [newFriend, ...prev]);
            setRequests(prev => prev.filter(r => r.name !== name));
        }
    };

    const handleDelete = (name: string) => {
        setRequests(prev => prev.filter(r => r.name !== name));
    };

    return (
        <main className="flex-grow pt-14 lg:ml-20 xl:ml-80 lg:mr-72 overflow-x-hidden p-4 md:p-6">
            <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-xl shadow-md p-4 md:p-6">
                <h1 className="text-2xl font-bold text-z-text-primary dark:text-z-text-primary-dark mb-4">Amigos</h1>
                
                <div className="flex space-x-4 border-b dark:border-z-border-dark mb-4">
                    <button onClick={() => setActiveTab('requests')} className={`py-2 px-4 font-semibold ${activeTab === 'requests' ? 'text-z-primary border-b-2 border-z-primary' : 'text-z-text-secondary dark:text-z-text-secondary-dark'}`}>Solicitudes de Amistad</button>
                    <button onClick={() => setActiveTab('all')} className={`py-2 px-4 font-semibold ${activeTab === 'all' ? 'text-z-primary border-b-2 border-z-primary' : 'text-z-text-secondary dark:text-z-text-secondary-dark'}`}>Todos los Amigos</button>
                </div>

                {activeTab === 'requests' && (
                    <div>
                        <h2 className="text-lg font-semibold text-z-text-primary dark:text-z-text-primary-dark mb-2">Solicitudes ({requests.length})</h2>
                        {requests.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {requests.map(req => (
                                    <div key={req.name} className="bg-z-bg-primary dark:bg-z-hover-dark p-3 rounded-lg flex items-center space-x-3">
                                        <img src={req.avatarUrl} alt={req.name} className="h-16 w-16 rounded-lg object-cover" />
                                        <div className="flex-grow">
                                            <p className="font-bold text-z-text-primary dark:text-z-text-primary-dark">{req.name}</p>
                                            <div className="flex space-x-2 mt-2">
                                                <button onClick={() => handleConfirm(req.name)} className="flex-1 bg-z-primary text-white text-sm font-semibold py-1.5 rounded-md hover:bg-z-dark-blue">Confirmar</button>
                                                <button onClick={() => handleDelete(req.name)} className="flex-1 bg-gray-200 dark:bg-z-border-dark text-z-text-primary dark:text-z-text-primary-dark text-sm font-semibold py-1.5 rounded-md hover:bg-gray-300">Eliminar</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-z-text-secondary dark:text-z-text-secondary-dark">No tienes solicitudes de amistad pendientes.</p>
                        )}
                    </div>
                )}

                {activeTab === 'all' && (
                    <div>
                        <h2 className="text-lg font-semibold text-z-text-primary dark:text-z-text-primary-dark mb-2">Amigos ({friends.length})</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {friends.map(friend => (
                                <div key={friend.name} className="text-center">
                                    <img src={friend.avatarUrl} alt={friend.name} className="h-24 w-24 rounded-lg object-cover mx-auto" />
                                    <p className="mt-2 font-semibold text-z-text-primary dark:text-z-text-primary-dark text-sm">{friend.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default FriendsPage;
