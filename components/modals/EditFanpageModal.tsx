
import React, { useState } from 'react';
import { Fanpage } from '../../types';

interface EditFanpageModalProps {
    fanpage: Fanpage;
    onClose: () => void;
    onUpdate: (updatedData: { name: string; category: string; bio: string }) => Promise<void>;
}

const EditFanpageModal: React.FC<EditFanpageModalProps> = ({ fanpage, onClose, onUpdate }) => {
    const [name, setName] = useState(fanpage.name);
    const [category, setCategory] = useState(fanpage.category);
    const [bio, setBio] = useState(fanpage.bio || '');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !category) return;
        setLoading(true);
        await onUpdate({ name, category, bio });
        setLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-fadeIn" style={{ animationDuration: '0.2s' }}>
            <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-lg shadow-xl w-full max-w-lg m-4">
                <div className="p-4 border-b dark:border-z-border-dark flex justify-between items-center">
                    <h2 className="text-xl font-bold text-z-text-primary dark:text-z-text-primary-dark">Editar Página</h2>
                    <button onClick={onClose} className="text-2xl text-z-text-secondary dark:text-z-text-secondary-dark hover:text-z-text-primary dark:hover:text-z-text-primary-dark">&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div>
                            <label htmlFor="fanpage-name" className="block text-sm font-medium text-z-text-secondary dark:text-z-text-secondary-dark mb-1">Nombre de la Página</label>
                            <input
                                type="text"
                                id="fanpage-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full bg-z-bg-primary dark:bg-z-hover-dark rounded-md px-4 py-2.5 text-z-text-primary dark:text-z-text-primary-dark focus:outline-none focus:ring-2 focus:ring-z-primary/50"
                            />
                        </div>
                        <div>
                            <label htmlFor="fanpage-category" className="block text-sm font-medium text-z-text-secondary dark:text-z-text-secondary-dark mb-1">Categoría</label>
                            <input
                                type="text"
                                id="fanpage-category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                                className="w-full bg-z-bg-primary dark:bg-z-hover-dark rounded-md px-4 py-2.5 text-z-text-primary dark:text-z-text-primary-dark focus:outline-none focus:ring-2 focus:ring-z-primary/50"
                            />
                        </div>
                        <div>
                            <label htmlFor="fanpage-bio" className="block text-sm font-medium text-z-text-secondary dark:text-z-text-secondary-dark mb-1">Biografía</label>
                            <textarea
                                id="fanpage-bio"
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
                        <button type="submit" disabled={loading} className="bg-z-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-z-dark-blue transition-colors disabled:bg-gray-400 disabled:cursor-wait">
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditFanpageModal;
