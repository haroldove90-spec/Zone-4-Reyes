
import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { BellIcon, UsersIcon, SunIcon, MoonIcon, LockIcon } from '../components/icons';
import { useAuth } from '../contexts/AuthContext';

const SettingsHeader: React.FC<{ title: string, onBack: () => void }> = ({ title, onBack }) => (
    <div className="flex items-center space-x-4 mb-6">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-z-hover-dark">&larr;</button>
        <h1 className="text-3xl font-bold text-z-text-primary dark:text-z-text-primary-dark">{title}</h1>
    </div>
);

const SettingToggle: React.FC<{ title: string, description: string, isEnabled: boolean }> = ({ title, description, isEnabled }) => (
     <div className="flex items-center justify-between p-3 rounded-lg">
        <div>
            <p className="font-semibold text-z-text-primary dark:text-z-text-primary-dark">{title}</p>
            <p className="text-sm text-z-text-secondary dark:text-z-text-secondary-dark">{description}</p>
        </div>
        <div className={`relative w-12 h-6 rounded-full transition-colors ${isEnabled ? 'bg-z-primary' : 'bg-gray-300 dark:bg-z-border-dark'}`}>
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${isEnabled ? 'transform translate-x-6' : ''}`}></div>
        </div>
    </div>
);


const AccountSettings: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { user } = useAuth();
    return (
        <div>
            <SettingsHeader title="Cuenta" onBack={onBack} />
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-z-text-secondary dark:text-z-text-secondary-dark mb-1">Nombre</label>
                    <input type="text" defaultValue={user?.name} className="w-full bg-z-bg-primary dark:bg-z-hover-dark rounded-md p-2.5" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-z-text-secondary dark:text-z-text-secondary-dark mb-1">Correo Electrónico</label>
                    <input type="email" defaultValue={user?.email} disabled className="w-full bg-z-bg-primary dark:bg-z-hover-dark rounded-md p-2.5 text-z-text-secondary dark:text-z-text-secondary-dark cursor-not-allowed" />
                </div>
                <button className="w-full bg-z-primary text-white font-bold py-2.5 rounded-lg hover:bg-z-dark-blue">Guardar Cambios</button>
            </div>
        </div>
    );
};
const NotificationsSettings: React.FC<{ onBack: () => void }> = ({ onBack }) => (
    <div>
        <SettingsHeader title="Notificaciones" onBack={onBack} />
        <div className="space-y-2">
            <SettingToggle title="Notificaciones Push" description="Recibir notificaciones en tu dispositivo." isEnabled={true} />
            <SettingToggle title="Comentarios en tus publicaciones" description="Recibir notificaciones por correo." isEnabled={true} />
            <SettingToggle title="Reacciones a tus publicaciones" description="Recibir notificaciones por correo." isEnabled={false} />
            <SettingToggle title="Solicitudes de amistad" description="Recibir notificaciones por correo y push." isEnabled={true} />
        </div>
    </div>
);
const PrivacySettings: React.FC<{ onBack: () => void }> = ({ onBack }) => (
    <div>
        <SettingsHeader title="Privacidad y Seguridad" onBack={onBack} />
         <div className="space-y-2">
            <SettingToggle title="Perfil Privado" description="Solo tus amigos pueden ver tus publicaciones." isEnabled={false} />
            <SettingToggle title="Permitir que te encuentren por email" description="Otros podrán buscarte usando tu correo." isEnabled={true} />
             <div>
                <label className="block text-sm font-medium text-z-text-secondary dark:text-z-text-secondary-dark mt-4 mb-1">Quién puede ver tu lista de amigos</label>
                <select className="w-full bg-z-bg-primary dark:bg-z-hover-dark rounded-md p-2.5">
                    <option>Público</option>
                    <option>Amigos</option>
                    <option>Solo yo</option>
                </select>
             </div>
        </div>
    </div>
);

const SettingsPage: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const [activeSection, setActiveSection] = useState<string | null>(null);

    const settingsOptions = [
        { icon: UsersIcon, title: 'Cuenta', description: 'Gestiona la información de tu cuenta.' },
        { icon: BellIcon, title: 'Notificaciones', description: 'Elige qué notificaciones recibir.' },
        { icon: LockIcon, title: 'Privacidad y Seguridad', description: 'Controla quién ve tu actividad.' },
    ];
    
    const renderContent = () => {
        switch (activeSection) {
            case 'Cuenta': return <AccountSettings onBack={() => setActiveSection(null)} />;
            case 'Notificaciones': return <NotificationsSettings onBack={() => setActiveSection(null)} />;
            case 'Privacidad y Seguridad': return <PrivacySettings onBack={() => setActiveSection(null)} />;
            default: return (
                <div>
                    <h1 className="text-3xl font-bold text-z-text-primary dark:text-z-text-primary-dark mb-6">Configuración</h1>
                    <div className="space-y-4">
                        {settingsOptions.map(opt => (
                            <div key={opt.title} onClick={() => setActiveSection(opt.title)} className="flex items-center space-x-4 p-3 hover:bg-gray-100 dark:hover:bg-z-hover-dark rounded-lg cursor-pointer transition-colors">
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
            )
        }
    }

    return (
        <main className="flex-grow pt-14 lg:ml-20 xl:ml-80 lg:mr-72 overflow-x-hidden p-4 md:p-6">
            <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-xl shadow-md p-4 md:p-6 max-w-3xl mx-auto">
                {renderContent()}
            </div>
        </main>
    );
};


export default SettingsPage;
