
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Post as PostType } from '../types';
import Post from '../components/Post';
import CreatePost from '../components/CreatePost';
import { MoreHorizontalIcon, ImagePlusIcon, MapPinIcon, LinkIcon, CakeIcon, UsersIcon, PhotoIcon } from '../components/icons';
import EditProfileModal from '../components/modals/EditProfileModal';

const Spinner: React.FC = () => (
    <div className="flex justify-center items-center p-10">
        <div className="w-12 h-12 border-4 border-z-primary/30 border-t-z-primary rounded-full animate-spin"></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } } .animate-spin { animation: spin 1s linear infinite; }`}</style>
    </div>
);

interface ProfilePageProps {
    userPosts: PostType[];
    onAddPost: (post: PostType) => void;
    navigate: (page: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userPosts, onAddPost, navigate }) => {
    const { user, updateUser } = useAuth();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const coverPhotoInputRef = useRef<HTMLInputElement>(null);
    const profilePhotoInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setLoading(true);
        // Simulate loading user data and posts
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1200);
        return () => clearTimeout(timer);
    }, [user]);

    const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            updateUser({ coverUrl: reader.result as string });
          };
          reader.readAsDataURL(file);
        }
    };
    
    const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            updateUser({ avatarUrl: reader.result as string });
          };
          reader.readAsDataURL(file);
        }
    };

    // Mock data for friends and photos
    const friends = Array.from({ length: 9 }, (_, i) => ({ name: `Amigo ${i+1}`, avatarUrl: `https://picsum.photos/id/${10 + i}/200` }));
    const photos = Array.from({ length: 9 }, (_, i) => `https://picsum.photos/id/${20 + i}/200`);

    if (loading) {
        return <main className="flex-grow pt-14 lg:ml-20 xl:ml-80 lg:mr-72"><Spinner /></main>;
    }
    
    if (!user) return null;

    return (
        <main className="flex-grow pt-14 lg:ml-20 xl:ml-80 lg:mr-72 overflow-x-hidden">
            <div className="max-w-4xl mx-auto">
                <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark shadow-md">
                    {/* Cover Photo */}
                    <div className="relative h-48 md:h-64 lg:h-80 group">
                        <img src={user.coverUrl} alt="Foto de portada" className="w-full h-full object-cover" loading="lazy"/>
                        <input type="file" ref={coverPhotoInputRef} onChange={handleCoverPhotoChange} className="hidden" accept="image/*" />
                        <button onClick={() => coverPhotoInputRef.current?.click()} className="absolute bottom-4 right-4 bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black text-z-text-primary dark:text-z-text-primary-dark font-semibold py-2 px-4 rounded-md flex items-center space-x-2 transition-colors opacity-0 group-hover:opacity-100">
                           <ImagePlusIcon className="h-5 w-5"/> <span>Editar foto de portada</span>
                        </button>
                    </div>

                    {/* Profile Info */}
                    <div className="p-4 flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-8 space-y-4 sm:space-y-0 sm:space-x-6 border-b dark:border-z-border-dark pb-4">
                        <div className="relative group cursor-pointer" onClick={() => profilePhotoInputRef.current?.click()}>
                            <img src={user.avatarUrl} alt="Avatar del usuario" className="w-40 h-40 rounded-full border-4 border-z-bg-secondary dark:border-z-bg-secondary-dark" loading="lazy"/>
                             <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <ImagePlusIcon className="h-8 w-8 text-white"/>
                            </div>
                            <input type="file" ref={profilePhotoInputRef} onChange={handleProfilePhotoChange} className="hidden" accept="image/*" />
                        </div>
                        <div className="flex-grow text-center sm:text-left">
                            <h1 className="text-3xl font-bold text-z-text-primary dark:text-z-text-primary-dark">{user.name}</h1>
                            <p className="text-z-text-secondary dark:text-z-text-secondary-dark">{user.friendsCount} amigos</p>
                        </div>
                        <div className="flex space-x-2">
                             <button onClick={() => setIsEditModalOpen(true)} className="bg-z-primary text-white font-semibold py-2 px-6 rounded-md hover:bg-z-dark-blue transition-colors">Editar Perfil</button>
                             <button className="bg-gray-200 dark:bg-z-hover-dark text-z-text-primary dark:text-z-text-primary-dark font-semibold py-2 px-4 rounded-md hover:bg-gray-300 dark:hover:bg-z-border-dark transition-colors"><MoreHorizontalIcon className="h-5 w-5"/></button>
                        </div>
                    </div>
                </div>

                <div className="p-0 md:p-4 grid grid-cols-1 md:grid-cols-5 gap-6">
                    <div className="md:col-span-2 space-y-6 p-4 md:p-0">
                        <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-xl shadow-md p-4">
                            <h2 className="text-xl font-bold mb-3 text-z-text-primary dark:text-z-text-primary-dark">Intro</h2>
                            <p className="text-center text-z-text-secondary dark:text-z-text-secondary-dark">{user.bio}</p>
                            <ul className="mt-4 space-y-2">
                                <li className="flex items-center space-x-3 text-z-text-primary dark:text-z-text-primary-dark"><MapPinIcon className="h-5 w-5 text-z-text-secondary"/><span>Vive en <b>{user.location}</b></span></li>
                                <li className="flex items-center space-x-3 text-z-text-primary dark:text-z-text-primary-dark"><CakeIcon className="h-5 w-5 text-z-text-secondary"/><span>Tiene <b>{user.age}</b> años</span></li>
                                <li className="flex items-center space-x-3 text-z-text-primary dark:text-z-text-primary-dark"><LinkIcon className="h-5 w-5 text-z-text-secondary"/><a href={`https://${user.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline"><b>{user.website}</b></a></li>
                            </ul>
                        </div>

                        <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-xl shadow-md p-4">
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-xl font-bold text-z-text-primary dark:text-z-text-primary-dark">Amigos</h2>
                                <button onClick={() => navigate('friends')} className="text-sm text-z-primary hover:underline">Ver todos</button>
                            </div>
                             <p className="text-z-text-secondary dark:text-z-text-secondary-dark mb-3">{user.friendsCount} amigos</p>
                            <div className="grid grid-cols-3 gap-2">
                                {friends.map(friend => (
                                    <div key={friend.name}>
                                        <img src={friend.avatarUrl} alt={friend.name} className="rounded-lg w-full aspect-square object-cover" loading="lazy"/>
                                        <p className="text-xs font-semibold mt-1 text-z-text-primary dark:text-z-text-primary-dark truncate">{friend.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                         <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-xl shadow-md p-4">
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-xl font-bold text-z-text-primary dark:text-z-text-primary-dark">Fotos</h2>
                                <a href="#" className="text-sm text-z-primary hover:underline">Ver todas</a>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {photos.map((photo, i) => (
                                     <img key={i} src={photo} alt={`Foto ${i}`} className="rounded-lg w-full aspect-square object-cover" loading="lazy"/>
                                ))}
                            </div>
                        </div>

                    </div>
                    <div className="md:col-span-3">
                        <div className="px-4 md:px-0">
                             <CreatePost onAddPost={onAddPost} />
                        </div>
                        {userPosts.map((post, index) => (
                            <Post key={post.id} post={post} index={index} addNotification={() => {}} />
                        ))}
                    </div>
                </div>
            </div>
            {isEditModalOpen && <EditProfileModal onClose={() => setIsEditModalOpen(false)} />}
        </main>
    );
};

export default ProfilePage;