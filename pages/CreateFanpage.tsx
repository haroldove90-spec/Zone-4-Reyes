

import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseClient';
import { ImagePlusIcon } from '../components/icons';

interface CreateFanpageProps {
    navigate: (path: string) => void;
}

const CreateFanpage: React.FC<CreateFanpageProps> = ({ navigate }) => {
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [bio, setBio] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [coverPreview, setCoverPreview] = useState<string>('https://i.imgur.com/62vORzS.png');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const avatarInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            if (type === 'avatar') {
                setAvatarFile(file);
                setAvatarPreview(previewUrl);
            } else {
                setCoverFile(file);
                setCoverPreview(previewUrl);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !category || !user) {
            setError('El nombre y la categoría son obligatorios.');
            return;
        }
        setLoading(true);
        setError(null);

        try {
            let avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;
            let coverUrl = `https://picsum.photos/seed/${encodeURIComponent(name.replace(/\s/g, ''))}cover/1600/400`;

            if (avatarFile) {
                const filePath = `public/fanpage-avatars/${user.id}-${Date.now()}`;
                const { error: uploadError } = await supabase.storage.from('media').upload(filePath, avatarFile);
                if (uploadError) throw uploadError;
                const { data } = supabase.storage.from('media').getPublicUrl(filePath);
                avatarUrl = data.publicUrl;
            }

            if (coverFile) {
                const filePath = `public/fanpage-covers/${user.id}-${Date.now()}`;
                const { error: uploadError } = await supabase.storage.from('media').upload(filePath, coverFile);
                if (uploadError) throw uploadError;
                const { data } = supabase.storage.from('media').getPublicUrl(filePath);
                coverUrl = data.publicUrl;
            }

            const { error: insertError } = await supabase.from('fanpages').insert([{
                name,
                category,
                bio,
                owner_id: user.id,
                avatar_url: avatarUrl,
                cover_url: coverUrl,
            }]);

            if (insertError) throw insertError;

            navigate('my-pages');

        } catch (err: any) {
            console.error("Error creating fanpage:", err);
            setError(err.message || 'No se pudo crear la página. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex-grow pt-14 lg:ml-20 xl:ml-80 lg:mr-72 overflow-x-hidden p-4 md:p-6">
            <div className="max-w-2xl mx-auto bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-xl shadow-md">
                <div className="p-6 border-b dark:border-z-border-dark flex items-center space-x-4">
                    <button onClick={() => navigate('my-pages')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-z-hover-dark transition-colors">&larr;</button>
                    <h1 className="text-2xl font-bold text-z-text-primary dark:text-z-text-primary-dark">Crear una Página</h1>
                </div>
                <div className="p-6">
                    <div className="mb-6">
                        <h3 className="font-bold text-lg mb-2">Vista Previa</h3>
                        <div className="relative h-48 bg-gray-200 dark:bg-z-hover-dark rounded-lg group">
                            <img src={coverPreview} alt="Vista previa de portada" className="w-full h-full object-cover rounded-lg" />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => coverInputRef.current?.click()} className="bg-white/80 dark:bg-black/50 text-z-text-primary dark:text-z-text-primary-dark font-semibold py-2 px-4 rounded-md flex items-center space-x-2">
                                    <ImagePlusIcon className="h-5 w-5"/> <span>Cambiar Portada</span>
                                </button>
                            </div>
                            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-4 border-z-bg-secondary dark:border-z-bg-secondary-dark bg-gray-300 dark:bg-z-border-dark overflow-hidden group/avatar">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Vista previa de avatar" className="w-full h-full object-cover"/>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                         <ImagePlusIcon className="h-8 w-8 text-z-text-secondary" />
                                    </div>
                                )}
                                 <div onClick={() => avatarInputRef.current?.click()} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer">
                                    <ImagePlusIcon className="h-6 w-6 text-white"/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 mt-16">
                         <input type="file" ref={coverInputRef} onChange={(e) => handleFileChange(e, 'cover')} className="hidden" accept="image/*" />
                         <input type="file" ref={avatarInputRef} onChange={(e) => handleFileChange(e, 'avatar')} className="hidden" accept="image/*" />
                        <div>
                            <label htmlFor="page-name" className="block text-sm font-medium mb-1 text-z-text-secondary dark:text-z-text-secondary-dark">Nombre de la Página</label>
                            <input id="page-name" type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-z-bg-primary dark:bg-z-hover-dark rounded-md p-2.5 focus:ring-2 focus:ring-z-primary outline-none transition-colors" placeholder="Ej: El Rincón del Café" />
                        </div>
                        <div>
                            <label htmlFor="page-category" className="block text-sm font-medium mb-1 text-z-text-secondary dark:text-z-text-secondary-dark">Categoría</label>
                            <input id="page-category" type="text" value={category} onChange={e => setCategory(e.target.value)} required className="w-full bg-z-bg-primary dark:bg-z-hover-dark rounded-md p-2.5 focus:ring-2 focus:ring-z-primary outline-none transition-colors" placeholder="Ej: Cafetería" />
                        </div>
                         <div>
                            <label htmlFor="page-bio" className="block text-sm font-medium mb-1 text-z-text-secondary dark:text-z-text-secondary-dark">Biografía (Opcional)</label>
                            <textarea id="page-bio" value={bio} onChange={e => setBio(e.target.value)} rows={3} className="w-full bg-z-bg-primary dark:bg-z-hover-dark rounded-md p-2.5 focus:ring-2 focus:ring-z-primary outline-none resize-none transition-colors" placeholder="Describe tu página..."></textarea>
                        </div>
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        <button type="submit" className="w-full bg-z-primary text-white font-bold py-2.5 rounded-lg hover:bg-z-dark-blue transition-colors disabled:bg-gray-400 disabled:cursor-wait" disabled={loading || !name || !category}>
                            {loading ? 'Creando Página...' : 'Crear Página'}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default CreateFanpage;