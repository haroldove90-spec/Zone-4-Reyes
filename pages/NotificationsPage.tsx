
import React from 'react';
import { AppNotification } from '../types';
import { BellIcon } from '../components/icons';

interface NotificationsPageProps {
    notifications: AppNotification[];
    navigate: (path: string) => void;
}

const NotificationItem: React.FC<{ notification: AppNotification; navigate: (path: string) => void; }> = ({ notification, navigate }) => (
    <div className="flex items-start p-3 space-x-3 hover:bg-gray-100 dark:hover:bg-z-hover-dark cursor-pointer transition-colors border-b dark:border-z-border-dark">
        <img 
            src={notification.user.avatarUrl} 
            alt={notification.user.name} 
            className="h-14 w-14 rounded-full" 
            loading="lazy"
            onClick={() => navigate(`profile/${notification.user.id}`)}
        />
        <div className="flex-1">
            <p className="text-sm text-z-text-primary dark:text-z-text-primary-dark">
                <span className="font-bold cursor-pointer hover:underline" onClick={() => navigate(`profile/${notification.user.id}`)}>{notification.user.name}</span> {notification.text}
            </p>
            {notification.postContent && <p className="text-sm text-z-text-secondary dark:text-z-text-secondary-dark mt-1 p-2 bg-gray-100 dark:bg-z-hover-dark rounded-md">"{notification.postContent}"</p>}
            <p className="text-xs text-z-primary font-bold mt-1">{notification.timestamp}</p>
        </div>
        {!notification.read && <div className="w-2.5 h-2.5 bg-z-primary rounded-full self-center"></div>}
    </div>
);


const NotificationsPage: React.FC<NotificationsPageProps> = ({ notifications, navigate }) => {
    return (
        <main className="flex-grow pt-14 lg:ml-20 xl:ml-80 lg:mr-72 overflow-x-hidden p-4 md:p-6">
            <div className="max-w-3xl mx-auto bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-xl shadow-md">
                <div className="p-4 border-b dark:border-z-border-dark flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <BellIcon className="h-7 w-7 text-z-text-primary dark:text-z-text-primary-dark" />
                        <h1 className="text-2xl font-bold text-z-text-primary dark:text-z-text-primary-dark">Notificaciones</h1>
                    </div>
                    <a href="#" className="text-sm font-bold text-z-primary hover:underline">Marcar todo como leído</a>
                </div>
                <div>
                    {notifications.length > 0 ? (
                        notifications.map(notification => (
                            <NotificationItem key={notification.id} notification={notification} navigate={navigate} />
                        ))
                    ) : (
                        <p className="p-8 text-center text-z-text-secondary dark:text-z-text-secondary-dark">No tienes notificaciones.</p>
                    )}
                </div>
            </div>
        </main>
    );
};

export default NotificationsPage;
