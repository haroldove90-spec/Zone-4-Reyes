
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { BellIcon, UsersIcon, SunIcon, MoonIcon, LockIcon } from '../components/icons';

const SettingsPage: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    const settingsOptions = [
        { icon: UsersIcon, title: 'Cuenta', description: 'Gestiona la información de tu cuenta.' },
        { icon: BellIcon, title: 'Notificaciones', description: 'Elige qué notificaciones recibir.' },
        { icon: LockIcon, title: 'Privacidad y Seguridad', description: 'Controla quién ve tu actividad.' },
    ];

    return (
        <main className="flex-grow pt-14 lg:ml-20 xl:ml-80 lg:mr-72 overflow-x-hidden p-4 md:p-6">
            <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-xl shadow-md p-4 md:p-6 max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-z-text-primary dark:text-z-text-primary-dark mb-6">Configuración</h1>
                
                <div className="space-y-4">
                    {settingsOptions.map(opt => (
                        <div key={opt.title} className="flex items-center space-x-4 p-3 hover:bg-gray-100 dark:hover:bg-z-hover-dark rounded-lg cursor-pointer transition-colors">
                            <div className="p-2 bg-gray-200 dark:bg-z-border-dark rounded-full">
                                <opt.icon className="h-6 w-6 text-z-text-primary dark:text-z-text-primary-dark" />
                            </div>
                            <div>
                                <p className="font-semibold text-z-text-primary dark:text-z-text-primary-dark">{opt.title}</p>
                                <p className="text-sm text-z-text-secondary dark:text-z-text-secondary-dark">{opt.description}</p>
                            </div>
                            <span className="ml-auto text-z-text-secondary dark:text-z-text-secondary-dark">&gt;</span>
                        </div>
                    ))}
                    
                    <div className="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-z-hover-dark rounded-lg cursor-pointer transition-colors" onClick={toggleTheme}>
                         <div className="flex items-center space-x-4">
                            <div className="p-2 bg-gray-200 dark:bg-z-border-dark rounded-full">
                                {theme === 'light' ? <MoonIcon className="h-6 w-6 text-z-text-primary dark:text-z-text-primary-dark" /> : <SunIcon className="h-6 w-6 text-z-text-primary dark:text-z-text-primary-dark" />}
                            </div>
                             <div>
                                <p className="font-semibold text-z-text-primary dark:text-z-text-primary-dark">Tema</p>
                                <p className="text-sm text-z-text-secondary dark:text-z-text-secondary-dark">Cambiar entre modo claro y oscuro.</p>
                            </div>
                         </div>
                         <div className="relative w-12 h-6 bg-gray-300 dark:bg-z-border-dark rounded-full transition-colors">
                             <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${theme === 'dark' ? 'transform translate-x-6' : ''}`}></div>
                         </div>
                    </div>
                </div>
            </div>
        </main>
    );
};


export default SettingsPage;
