

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth, AuthUser } from '../contexts/AuthContext';
import { Post as PostType, Media, User, FriendshipStatus } from '../types';
import Post, { PostSkeleton } from '../components/Post';
import CreatePost from '../components/CreatePost';
import { MoreHorizontalIcon, ImagePlusIcon, MapPinIcon, LinkIcon, CakeIcon, UsersIcon, PhotoIcon, FlagIcon, UsersPlusIcon, UserCheckIcon, UserXIcon } from '../components/icons';
import EditProfileModal from '../components/modals/EditProfileModal';
import { supabase } from '../services/supabaseClient';

const ProfilePageSkeleton: React.FC = () => (
    <main className="flex-grow pt-14 lg:ml-20 xl:ml-80 lg:mr-72 overflow-x-hidden animate-pulse">
        <div className="max-w-4xl mx-auto">
            <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark shadow-md">
                <div className="h-48 md:h-64 lg:h-80 bg-gray-200 dark:bg-z-hover-dark"></div>
                <div className="p-4 flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-8 space-y-4 sm:space-y-0 sm:space-x-6 border-b dark:border-z-border-dark pb-4">
                    <div className="w-40 h-40 rounded-full bg-gray-200 dark:bg-z-hover-dark border-4 border-z-bg-secondary dark:border-z-bg-secondary-dark"></div>
                    <div className="flex-grow text-center sm:text-left">
                        <div className="h-8 w-48 bg-gray-200 dark:bg-z-hover-dark rounded-md mb-2"></div>
                        <div className="h-4 w-24 bg-gray-200 dark:bg-z-hover-dark rounded-md"></div>
                    </div>
                    <div className="flex space-x-2"><div className="h-10 w-32 bg-gray-200 dark:bg-z-hover-dark rounded-md"></div><div className="h-10 w-12 bg-gray-200 dark:bg-z-hover-dark rounded-md"></div></div>
                </div>
            </div>
            <div className="p-0 md:p-4 grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="md:col-span-2 space-y-6 p-4 md:p-0"><div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-xl shadow-md p-4 space-y-3"><div className="h-6 w-20 bg-gray-200 dark:bg-z-hover-dark rounded-md"></div><div className="h-4 w-full bg-gray-200 dark:bg-z-hover-dark rounded-md"></div><div className="h-4 w-5/6 bg-gray-200 dark:bg-z-hover-dark rounded-md"></div><div className="h-4 w-full bg-gray-200 dark:bg-z-hover-dark rounded-md mt-2"></div></div></div>
                <div className="md:col-span-3"><div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-xl shadow-md p-4 mb-6"><div className="flex space-x-3 items-start"><div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-z-hover-dark"></div><div className="h-10 w-full bg-gray-200 dark:bg-z-hover-dark rounded-2xl"></div></div></div><PostSkeleton /><PostSkeleton /></div>
            </div>
        </div>
    </main>
);

interface ProfilePageProps {
    userId: string;
    onAddPost: (content: string, mediaFiles: File[], postType?: 'standard' | 'report', group?: { id: string; name: string }, existingMedia?: Media[]) => Promise<void>;
    navigate: (page: string) => void;
    addNotification: (text: string, user: User, postContent?: string) => void;
}

const formatProfileData = (profileData: any): AuthUser | null => {
    if (!profileData) return null;
    return {
        id: profileData.id,
        email: profileData.email || '',
        name: profileData.name,
        avatarUrl: profileData.avatar_url,
        bio: profileData.bio,
        coverUrl: profileData.cover_url,
        nickname: profileData.nickname,
        age: profileData.age,
        location: profileData.location,
        website: profileData.website,
        friendsCount: profileData.friends_count,
        isAdmin: profileData.is_admin,
    };
};

const ProfilePage: React.FC<ProfilePageProps> = ({ userId, onAddPost, navigate, addNotification }) => {
    const { user: currentUser, updateUser } = useAuth();
    const [profileUser, setProfileUser] = useState<AuthUser | null>(null);
    const [userPosts, setUserPosts] = useState<PostType[]>([]);
    const [friendshipStatus, setFriendshipStatus] = useState<FriendshipStatus>('loading');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [friends, setFriends] = useState<User[]>([]);

    const coverPhotoInputRef = useRef<HTMLInputElement>(null);
    const profilePhotoInputRef = useRef<HTMLInputElement>(null);
    const isOwnProfile = currentUser?.id === userId;

    const fetchProfileData = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
            if (error) throw error;
            setProfileUser(formatProfileData(data));

            const { data: postsData, error: postsError } = await supabase.from('posts').select('*, user:profiles!user_id(id, name, avatar_url), groups(id, name)').eq('user_id', userId).order('created_at', { ascending: false });
            if(postsError) throw postsError;
            setUserPosts(postsData.map((p: any) => ({
                id: p.id.toString(), user: {id: p.user.id, name: p.user.name, avatarUrl: p.user.avatar_url}, timestamp: new Date(p.created_at).toLocaleString(), content: p.content, media: p.media, type: p.type, format: p.format, likes: 0, commentsCount: 0, comments: [], group: p.groups ? { id: p.groups.id, name: p.groups.name } : undefined,
            })));
            
            // Fetch friends
            const { data: friendships, error: friendshipsError } = await supabase
                .from('friendships')
                .select('requester_id, addressee_id')
                .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
                .eq('status', 'accepted');
            if (friendshipsError) throw friendshipsError;

            if (friendships && friendships.length > 0) {
                const friendIds = friendships.map(f => f.requester_id === userId ? f.addressee_id : f.requester_id);
                const { data: friendsData, error: friendsError } = await supabase
                    .from('profiles')
                    .select('id, name, avatar_url')
                    .in('id', friendIds);
                if (friendsError) throw friendsError;
                setFriends(friendsData.map((f: any) => ({ id: f.id, name: f.name, avatarUrl: f.avatar_url })));
            } else {
                setFriends([]);
            }

        } catch (error: any) {
            console.error("Error fetching profile data:", error.message || error);
            setProfileUser(null);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const checkFriendshipStatus = useCallback(async () => {
        if (isOwnProfile || !currentUser) return;
        setFriendshipStatus('loading');
        try {
            const { data, error } = await supabase
                .from('friendships')
                .select('status, requester_id')
                .or(`(requester_id.eq.${currentUser.id},addressee_id.eq.${userId}),(requester_id.eq.${userId},addressee_id.eq.${currentUser.id})`)
                .maybeSingle();

            if (error) throw error;
            
            if (data?.status === 'accepted') {
                setFriendshipStatus('friends');
            } else if (data?.status === 'pending') {
                if (data.requester_id === currentUser.id) {
                    setFriendshipStatus('pending_sent');
                } else {
                    setFriendshipStatus('pending_received');
                }
            } else {
                setFriendshipStatus('not_friends');
            }
        } catch (error: any) {
            console.error("Error checking friendship status:", error.message || error);
            setFriendshipStatus('not_friends');
        }
    }, [currentUser, userId, isOwnProfile]);

    useEffect(() => {
        fetchProfileData();
        checkFriendshipStatus();
    }, [fetchProfileData, checkFriendshipStatus]);

    const handleFriendAction = async (action: 'add' | 'cancel' | 'accept' | 'remove') => {
        if (!currentUser || isOwnProfile) return;
        try {
            let error;
            if (action === 'add') {
                ({ error } = await supabase.from('friendships').insert({ requester_id: currentUser.id, addressee_id: userId, status: 'pending' }));
            } else if (action === 'cancel' || action === 'remove') {
                ({ error } = await supabase
                    .from('friendships')
                    .delete()
                    .or(`(requester_id.eq.${currentUser.id},addressee_id.eq.${userId}),(requester_id.eq.${userId},addressee_id.eq.${currentUser.id})`));
            } else if (action === 'accept') {
                ({ error } = await supabase.from('friendships').update({ status: 'accepted' }).match({ requester_id: userId, addressee_id: currentUser.id }));
                if(!error) addNotification('ha aceptado tu solicitud de amistad.', currentUser);
            }
            if (error) throw error;
            checkFriendshipStatus();
            fetchProfileData(); // To update friends count
        } catch (err) {
            console.error(`Failed to ${action} friend:`, err);
        }
    };
    
    const handlePhotoUpload = async (file: File, type: 'cover' | 'profile') => {
        if (!currentUser) return;
        const bucket = type === 'profile' ? 'avatars' : 'covers';
        const fileName = `${currentUser.id}/${Date.now()}.${file.name.split('.').pop()}`;
        const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file);
        if (uploadError) { console.error(`Error uploading ${type} photo:`, uploadError); return; }
        const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName);
        updateUser(type === 'cover' ? { coverUrl: publicUrl } : { avatarUrl: publicUrl });
        setProfileUser(prev => prev ? { ...prev, [type === 'cover' ? 'coverUrl' : 'avatarUrl']: publicUrl } : null);
    };

    const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files?.[0]) handlePhotoUpload(e.target.files[0], 'cover'); };
    const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files?.[0]) handlePhotoUpload(e.target.files[0], 'profile'); };

    const handleAddProfilePost = async (
        content: string,
        mediaFiles: File[],
        postType?: 'standard' | 'report',
        group?: { id: string; name: string },
        existingMedia?: Media[]
    ) => {
        try {
            // This wrapper ensures that after a post is created via the onAddPost prop (from MainLayout),
            // the profile-specific post list is re-fetched to show the new post immediately.
            await onAddPost(content, mediaFiles, postType, group, existingMedia);
            fetchProfileData(); // Trigger a refresh of posts on the profile page.
        } catch (error) {
            console.error("Failed to add post and refresh profile:", error);
            // Optionally, handle the error in the UI.
        }
    };

    const photos = userPosts.flatMap(p => p.media?.filter(m => m.type === 'image').map(m => m.url) || []).slice(0, 9);
    
    const renderFriendshipButton = () => {
        if (isOwnProfile) return <button onClick={() => setIsEditModalOpen(true)} className="bg-z-primary text-white font-semibold py-2 px-6 rounded-md hover:bg-z-dark-blue transition-colors">Editar Perfil</button>;
        switch (friendshipStatus) {
            case 'loading': return <button className="bg-gray-200 dark:bg-z-hover-dark font-semibold py-2 px-6 rounded-md" disabled>Cargando...</button>;
            case 'not_friends': return <button onClick={() => handleFriendAction('add')} className="bg-z-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-z-dark-blue flex items-center space-x-2"><UsersPlusIcon className="h-5 w-5"/><span>Agregar amigo</span></button>;
            case 'pending_sent': return <button onClick={() => handleFriendAction('cancel')} className="bg-gray-300 dark:bg-z-border-dark font-semibold py-2 px-4 rounded-md hover:bg-gray-400">Cancelar solicitud</button>;
            case 'pending_received': return (
                <div className="flex space-x-2">
                    <button onClick={() => handleFriendAction('accept')} className="bg-z-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-z-dark-blue">Aceptar</button>
                    <button className="bg-gray-300 dark:bg-z-border-dark font-semibold py-2 px-4 rounded-md hover:bg-gray-400">Rechazar</button>
                </div>
            );
            case 'friends': return <button onClick={() => handleFriendAction('remove')} className="bg-gray-200 dark:bg-z-hover-dark font-semibold py-2 px-4 rounded-md hover:bg-gray-300 flex items-center space-x-2"><UserCheckIcon className="h-5 w-5 text-green-600"/><span>Amigos</span></button>;
            default: return null;
        }
    };

    if (loading) return <ProfilePageSkeleton />;
    if (!profileUser) return (
        <main className="flex-grow pt-14 lg:ml-20 xl:ml-80 lg:mr-72 overflow-x-hidden flex items-center justify-center" style={{ minHeight: 'calc(100vh - 3.5rem)' }}>
            <div className="text-center p-8 bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-lg shadow-md max-w-sm mx-auto">
                <h2 className="text-2xl font-bold text-z-text-primary dark:text-z-text-primary-dark">Usuario no encontrado</h2>
                <p className="text-z-text-secondary dark:text-z-text-secondary-dark mt-2">
                    El perfil que estás buscando no existe, ha sido eliminado o no está disponible.
                </p>
                <button onClick={() => navigate('feed')} className="mt-6 bg-z-primary text-white font-semibold py-2 px-6 rounded-md hover:bg-z-dark-blue transition-colors">
                    Volver al Inicio
                </button>
            </div>
        </main>
    );

    return (
        <main className="flex-grow pt-14 lg:ml-20 xl:ml-80 lg:mr-72 overflow-x-hidden">
            <div className="max-w-4xl mx-auto">
                <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark shadow-md">
                    <div className="relative h-48 md:h-64 lg:h-80 group">
                        <img src={profileUser.coverUrl} alt="Foto de portada" className="w-full h-full object-cover" loading="lazy"/>
                        {isOwnProfile && <>
                            <input type="file" ref={coverPhotoInputRef} onChange={handleCoverPhotoChange} className="hidden" accept="image/*" />
                            <button onClick={() => coverPhotoInputRef.current?.click()} className="absolute bottom-4 right-4 bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black text-z-text-primary dark:text-z-text-primary-dark font-semibold py-2 px-4 rounded-md flex items-center space-x-2 transition-colors opacity-0 group-hover:opacity-100"><ImagePlusIcon className="h-5 w-5"/> <span>Editar foto de portada</span></button>
                        </>}
                    </div>
                    <div className="p-4 flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-8 space-y-4 sm:space-y-0 sm:space-x-6 border-b dark:border-z-border-dark pb-4">
                        <div className={`relative group ${isOwnProfile ? 'cursor-pointer' : ''}`} onClick={() => isOwnProfile && profilePhotoInputRef.current?.click()}>
                            <img src={profileUser.avatarUrl} alt="Avatar del usuario" className="w-40 h-40 rounded-full border-4 border-z-bg-secondary dark:border-z-bg-secondary-dark" loading="lazy"/>
                            {isOwnProfile && <><div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><ImagePlusIcon className="h-8 w-8 text-white"/></div><input type="file" ref={profilePhotoInputRef} onChange={handleProfilePhotoChange} className="hidden" accept="image/*" /></>}
                        </div>
                        <div className="flex-grow text-center sm:text-left">
                            <h1 className="text-3xl font-bold text-z-text-primary dark:text-z-text-primary-dark">{profileUser.name}</h1>
                            <p className="text-z-text-secondary dark:text-z-text-secondary-dark">{friends.length} amigos</p>
                        </div>
                        <div className="flex space-x-2">
                             {renderFriendshipButton()}
                             <button className="bg-gray-200 dark:bg-z-hover-dark text-z-text-primary dark:text-z-text-primary-dark font-semibold py-2 px-4 rounded-md hover:bg-gray-300 dark:hover:bg-z-border-dark transition-colors"><MoreHorizontalIcon className="h-5 w-5"/></button>
                        </div>
                    </div>
                </div>

                <div className="p-0 md:p-4 grid grid-cols-1 md:grid-cols-5 gap-6">
                    <div className="md:col-span-2 space-y-6 p-4 md:p-0">
                        <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-xl shadow-md p-4">
                            <h2 className="text-xl font-bold mb-3 text-z-text-primary dark:text-z-text-primary-dark">Intro</h2>
                            {profileUser.bio && <p className="text-center text-z-text-secondary dark:text-z-text-secondary-dark">{profileUser.bio}</p>}
                            <ul className="mt-4 space-y-2">
                                {profileUser.location && <li className="flex items-center space-x-3 text-z-text-primary dark:text-z-text-primary-dark"><MapPinIcon className="h-5 w-5 text-z-text-secondary"/><span>Vive en <b>{profileUser.location}</b></span></li>}
                                {profileUser.age && <li className="flex items-center space-x-3 text-z-text-primary dark:text-z-text-primary-dark"><CakeIcon className="h-5 w-5 text-z-text-secondary"/><span>Tiene <b>{profileUser.age}</b> años</span></li>}
                                {profileUser.website && <li className="flex items-center space-x-3 text-z-text-primary dark:text-z-text-primary-dark"><LinkIcon className="h-5 w-5 text-z-text-secondary"/><a href={`https://${profileUser.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline"><b>{profileUser.website}</b></a></li>}
                            </ul>
                        </div>
                        <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-xl shadow-md p-4">
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-xl font-bold text-z-text-primary dark:text-z-text-primary-dark">Amigos</h2>
                                <button onClick={() => navigate('friends')} className="text-sm text-z-primary hover:underline">Ver todos</button>
                            </div>
                             <p className="text-z-text-secondary dark:text-z-text-secondary-dark mb-3">{friends.length} amigos</p>
                            <div className="grid grid-cols-3 gap-2">
                                {friends.slice(0, 9).map(friend => (
                                    <div key={friend.id} onClick={() => navigate(`profile/${friend.id}`)} className="cursor-pointer">
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
                                {photos.map((photo, i) => <img key={i} src={photo} alt={`Foto ${i}`} className="rounded-lg w-full aspect-square object-cover" loading="lazy"/>)}
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-3">
                        <div className="px-4 md:px-0">
                           {isOwnProfile && <CreatePost onAddPost={handleAddProfilePost} />}
                        </div>
                        {userPosts.map((post, index) => (
                            <Post key={post.id} post={post} index={index} addNotification={addNotification} onAddPost={handleAddProfilePost} navigate={navigate} />
                        ))}
                    </div>
                </div>
            </div>
            {isEditModalOpen && <EditProfileModal onClose={() => setIsEditModalOpen(false)} />}
        </main>
    );
};

export default ProfilePage;