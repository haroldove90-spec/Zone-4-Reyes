

import React from 'react';
import { AppNotification } from '../types';

interface NotificationsPanelProps {
    notifications: AppNotification[];
    navigate: (path: string) => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications, navigate }) => {
    return (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-md shadow-lg z-50 border dark:border-z-border-dark animate-fadeIn">
            <div className="p-4 border-b dark:border-z-border-dark flex justify-between items-center">
                <h2 className="text-2xl font-bold text-z-text-primary dark:text-z-text-primary-dark">Notificaciones</h2>
                <a href="#" className="text-sm font-bold text-z-primary hover:underline">Marcar como leídas</a>
            </div>
            <div className="py-2 max-h-96 overflow-y-auto">
                {notifications.length > 0 ? notifications.map((notification) => (
                    <div key={notification.id} className="flex items-start p-3 space-x-3 hover:bg-gray-100 dark:hover:bg-z-hover-dark cursor-pointer transition-colors">
                        <img src={notification.user.avatarUrl} alt={notification.user.name} className="h-14 w-14 rounded-full cursor-pointer" loading="lazy" onClick={() => navigate(`profile/${notification.user.id}`)}/>
                        <div className="flex-1">
                            <p className="text-sm text-z-text-primary dark:text-z-text-primary-dark">
                                <span className="font-bold cursor-pointer hover:underline" onClick={() => navigate(`profile/${notification.user.id}`)}>{notification.user.name}</span> {notification.text}
                            </p>
                             {notification.postContent && <p className="text-sm text-z-text-secondary dark:text-z-text-secondary-dark mt-1 p-2 bg-gray-100 dark:bg-z-hover-dark rounded-md">"{notification.postContent}"</p>}
                            <p className="text-xs text-z-primary font-bold mt-1">{notification.timestamp}</p>
                        </div>
                        {!notification.read && <div className="w-2.5 h-2.5 bg-z-primary rounded-full self-center"></div>}
                    </div>
                )) : (
                    <p className="p-4 text-center text-z-text-secondary dark:text-z-text-secondary-dark">No tienes notificaciones nuevas.</p>
                )}
            </div>
             <div className="text-center p-2 border-t dark:border-z-border-dark">
                <button onClick={() => navigate('notifications')} className="text-sm font-bold text-z-primary hover:underline">Ver todas</button>
            </div>
        </div>
    );
};

export default NotificationsPanel;