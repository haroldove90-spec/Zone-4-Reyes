
import React from 'react';
import { Notification } from '../types';
import { useAuth } from '../contexts/AuthContext';

const notificationsData: Omit<Notification, 'id' | 'read'>[] = [
    {
        user: { name: 'Jane Smith', avatarUrl: 'https://picsum.photos/id/1025/200' },
        text: 'le ha gustado tu publicación: "¡Acabo de terminar una nueva pintura. 🎨"',
        timestamp: 'hace 2 horas'
    },
    {
        user: { name: 'John Doe', avatarUrl: 'https://picsum.photos/id/1011/200' },
        text: 'ha comentado tu foto: "¡Qué gran vista!"',
        timestamp: 'hace 5 horas'
    },
    {
        user: { name: 'Carlos Dev', avatarUrl: 'https://picsum.photos/id/20/200' },
        text: 'ha compartido tu publicación.',
        timestamp: 'hace 1 día'
    }
];

const NotificationsPanel: React.FC = () => {
    return (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-md shadow-lg z-50 border dark:border-z-border-dark animate-fadeIn">
            <div className="p-4 border-b dark:border-z-border-dark">
                <h2 className="text-2xl font-bold text-z-text-primary dark:text-z-text-primary-dark">Notificaciones</h2>
            </div>
            <div className="py-2 max-h-96 overflow-y-auto">
                {notificationsData.map((notification, index) => (
                    <div key={index} className="flex items-start p-3 space-x-3 hover:bg-gray-100 dark:hover:bg-z-hover-dark cursor-pointer transition-colors">
                        <img src={notification.user.avatarUrl} alt={notification.user.name} className="h-14 w-14 rounded-full" loading="lazy"/>
                        <div className="flex-1">
                            <p className="text-sm text-z-text-primary dark:text-z-text-primary-dark">
                                <span className="font-bold">{notification.user.name}</span> {notification.text}
                            </p>
                            <p className="text-xs text-z-primary font-bold mt-1">{notification.timestamp}</p>
                        </div>
                        <div className="w-2 h-2 bg-z-primary rounded-full self-center"></div>
                    </div>
                ))}
            </div>
             <div className="text-center p-2 border-t dark:border-z-border-dark">
                <a href="#" className="text-sm font-bold text-z-primary hover:underline">Ver todas</a>
            </div>
        </div>
    );
};

export default NotificationsPanel;
