
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface EditProfileModalProps {
    onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ onClose }) => {
    const { user, updateUser } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [nickname, setNickname] = useState(user?.nickname || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [location, setLocation] = useState(user?.location || '');
    const [website, setWebsite] = useState(user?.website || '');
    const [age, setAge] = useState(user?.age || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateUser({ name, nickname, bio, location, website, age: Number(age) });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-fadeIn" style={{ animationDuration: '0.2s' }}>
            <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-lg shadow-xl w-full max-w-lg m-4">
                <div className="p-4 border-b dark:border-z-border-dark flex justify-between items-center">
                    <h2 className="text-xl font-bold text-z-text-primary dark:text-z-text-primary-dark">Editar Perfil</h2>
                    <button onClick={onClose} className="text-2xl text-z-text-secondary dark:text-z-text-secondary-dark hover:text-z-text-primary dark:hover:text-z-text-primary-dark">&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-z-text-secondary dark:text-z-text-secondary-dark mb-1">Nombre</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-z-bg-primary dark:bg-z-hover-dark rounded-md px-4 py-2.5 text-z-text-primary dark:text-z-text-primary-dark focus:outline-none focus:ring-2 focus:ring-z-primary/50"
                            />
                        </div>
                        <div>
                            <label htmlFor="nickname" className="block text-sm font-medium text-z-text-secondary dark:text-z-text-secondary-dark mb-1">Nickname</label>
                            <input
                                type="text"
                                id="nickname"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                className="w-full bg-z-bg-primary dark:bg-z-hover-dark rounded-md px-4 py-2.5 text-z-text-primary dark:text-z-text-primary-dark focus:outline-none focus:ring-2 focus:ring-z-primary/50"
                            />
                        </div>
                         <div>
                            <label htmlFor="age" className="block text-sm font-medium text-z-text-secondary dark:text-z-text-secondary-dark mb-1">Edad</label>
                            <input
                                type="number"
                                id="age"
                                value={age}
                                onChange={(e) => setAge(Number(e.target.value))}
                                className="w-full bg-z-bg-primary dark:bg-z-hover-dark rounded-md px-4 py-2.5 text-z-text-primary dark:text-z-text-primary-dark focus:outline-none focus:ring-2 focus:ring-z-primary/50"
                            />
                        </div>
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-z-text-secondary dark:text-z-text-secondary-dark mb-1">Ubicación</label>
                            <input
                                type="text"
                                id="location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full bg-z-bg-primary dark:bg-z-hover-dark rounded-md px-4 py-2.5 text-z-text-primary dark:text-z-text-primary-dark focus:outline-none focus:ring-2 focus:ring-z-primary/50"
                            />
                        </div>
                        <div>
                            <label htmlFor="website" className="block text-sm font-medium text-z-text-secondary dark:text-z-text-secondary-dark mb-1">Sitio Web</label>
                            <input
                                type="text"
                                id="website"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                className="w-full bg-z-bg-primary dark:bg-z-hover-dark rounded-md px-4 py-2.5 text-z-text-primary dark:text-z-text-primary-dark focus:outline-none focus:ring-2 focus:ring-z-primary/50"
                            />
                        </div>
                        <div>
                            <label htmlFor="bio" className="block text-sm font-medium text-z-text-secondary dark:text-z-text-secondary-dark mb-1">Biografía</label>
                            <textarea
                                id="bio"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                rows={4}
                                className="w-full bg-z-bg-primary dark:bg-z-hover-dark rounded-md px-4 py-2.5 text-z-text-primary dark:text-z-text-primary-dark focus:outline-none focus:ring-2 focus:ring-z-primary/50 resize-none"
                            />
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-z-bg-primary-dark/50 border-t dark:border-z-border-dark flex justify-end space-x-2 rounded-b-lg">
                        <button type="button" onClick={onClose} className="bg-gray-200 dark:bg-z-hover-dark text-z-text-primary dark:text-z-text-primary-dark font-semibold py-2 px-4 rounded-md hover:bg-gray-300 dark:hover:bg-z-border-dark transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" className="bg-z-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-z-dark-blue transition-colors">
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
