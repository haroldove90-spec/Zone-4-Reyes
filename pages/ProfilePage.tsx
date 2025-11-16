
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Post as PostType } from '../types';
import Post from '../components/Post';
import CreatePost from '../components/CreatePost';
import { MoreHorizontalIcon, ImagePlusIcon } from '../components/icons';
import EditProfileModal from '../components/modals/EditProfileModal';

interface ProfilePageProps {
    userPosts: PostType[];
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userPosts }) => {
    const { user } = useAuth();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    if (!user) return null;

    return (
        <main className="flex-grow pt-14 lg:ml-20 xl:ml-80 lg:mr-72 overflow-x-hidden">
            <div className="max-w-4xl mx-auto">
                <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark shadow-md">
                    {/* Cover Photo */}
                    <div className="relative h-48 md:h-64 lg:h-80 group">
                        <img src={user.coverUrl} alt="Foto de portada" className="w-full h-full object-cover"/>
                        <button className="absolute bottom-4 right-4 bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black text-z-text-primary dark:text-z-text-primary-dark font-semibold py-2 px-4 rounded-md flex items-center space-x-2 transition-colors opacity-0 group-hover:opacity-100">
                           <ImagePlusIcon className="h-5 w-5"/> <span>Editar foto de portada</span>
                        </button>
                    </div>

                    {/* Profile Info */}
                    <div className="p-4 flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-8 space-y-4 sm:space-y-0 sm:space-x-6 border-b dark:border-z-border-dark pb-4">
                        <img src={user.avatarUrl} alt="Avatar del usuario" className="w-40 h-40 rounded-full border-4 border-z-bg-secondary dark:border-z-bg-secondary-dark"/>
                        <div className="flex-grow text-center sm:text-left">
                            <h1 className="text-3xl font-bold text-z-text-primary dark:text-z-text-primary-dark">{user.name}</h1>
                            <p className="text-z-text-secondary dark:text-z-text-secondary-dark">{user.bio}</p>
                        </div>
                        <div className="flex space-x-2">
                             <button onClick={() => setIsEditModalOpen(true)} className="bg-z-primary text-white font-semibold py-2 px-6 rounded-md hover:bg-z-dark-blue transition-colors">Editar Perfil</button>
                             <button className="bg-gray-200 dark:bg-z-hover-dark text-z-text-primary dark:text-z-text-primary-dark font-semibold py-2 px-4 rounded-md hover:bg-gray-300 dark:hover:bg-z-border-dark transition-colors"><MoreHorizontalIcon className="h-5 w-5"/></button>
                        </div>
                    </div>
                </div>

                <div className="p-4 grid grid-cols-1 md:grid-cols-5 gap-6">
                    <div className="md:col-span-2">
                        {/* Intro / Friends */}
                    </div>
                    <div className="md:col-span-3">
                        <CreatePost onAddPost={() => {}} />
                        {userPosts.map((post, index) => (
                            <Post key={post.id} post={post} index={index} />
                        ))}
                    </div>
                </div>
            </div>
            {isEditModalOpen && <EditProfileModal onClose={() => setIsEditModalOpen(false)} />}
        </main>
    );
};

export default ProfilePage;
