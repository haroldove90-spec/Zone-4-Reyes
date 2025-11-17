

import React, { useState, useEffect, useCallback } from 'react';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import Feed from './Feed';
import RightSidebar from './RightSidebar';
import { Post, Fanpage, AppNotification, User, Group, AppEvent, Media } from '../types';
import { FAKE_GROUPS, FAKE_EVENTS } from '../services/geminiService';
import BottomNavBar from './BottomNavBar';
import ProfilePage from '../pages/ProfilePage';
import FriendsPage from '../pages/FriendsPage';
import AdCenterPage from '../pages/AdCenterPage';
import SettingsPage from '../pages/SettingsPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import MyPages from '../pages/MyPages';
import CreateFanpage from '../pages/CreateFanpage';
import CitizenReportPage from '../pages/CitizenReportPage';
import ReelsPage from '../pages/ReelsPage';
import MarketplacePage from '../pages/MarketplacePage';
import GroupsPage from '../pages/GroupsPage';
import GroupDetailPage from '../pages/GroupDetailPage';
import CreateGroupPage from '../pages/CreateGroupPage';
import EventsPage from '../pages/EventsPage';
import EventDetailPage from '../pages/EventDetailPage';
import CreateEventPage from '../pages/CreateEventPage';
import NotificationsPage from '../pages/NotificationsPage';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseClient';

const MOCK_FANPAGES: Fanpage[] = [
    { id: 'fp1', name: 'El Rincón del Café', category: 'Cafetería', bio: 'El mejor café de Reyes Iztacala.', ownerEmail: 'admin@example.com', avatarUrl: 'https://picsum.photos/id/55/200', coverUrl: 'https://picsum.photos/id/225/1600/400' },
    { id: 'fp2', name: 'Gaming Zone', category: 'Videojuegos', bio: 'Tu comunidad de gaming.', ownerEmail: 'carlos@example.com', avatarUrl: 'https://picsum.photos/id/44/200', coverUrl: 'https://picsum.photos/id/99/1600/400' },
];

const MainLayout: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [fanpages, setFanpages] = useState<Fanpage[]>(MOCK_FANPAGES);
  const [groups, setGroups] = useState<Group[]>(FAKE_GROUPS);
  const [events, setEvents] = useState<AppEvent[]>(FAKE_EVENTS);
  const [currentPath, setCurrentPath] = useState(window.location.hash.substring(1) || 'feed');
  const { user } = useAuth();

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [friendRequests, setFriendRequests] = useState<User[]>([]);

  const fetchFriendRequests = useCallback(async () => {
      if (!user) return;
      try {
          const { data, error } = await supabase
              .from('friendships')
              .select('requester_id, profiles!requester_id(id, name, avatar_url)')
              .eq('addressee_id', user.id)
              .eq('status', 'pending');

          if (error) throw error;
          
          const requests = data
              .filter((req: any) => req.profiles) // Filter out requests where user profile might be missing
              .map((req: any) => ({
                  id: req.profiles.id,
                  name: req.profiles.name,
                  avatarUrl: req.profiles.avatar_url,
              }));

          setFriendRequests(requests);
      } catch (error: any) {
          console.error("Error fetching friend requests:", error.message || error);
      }
  }, [user]);
  
  const fetchNotifications = useCallback(async () => {
    if (!user) {
        setNotifications([]);
        setNotificationCount(0);
        return;
    };
    try {
        const { data, error } = await supabase
            .from('notifications')
            .select('*, actor:profiles!actor_id(id, name, avatar_url), posts(content)')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) throw error;

        const formattedNotifications: AppNotification[] = data.map((n: any) => ({
            id: n.id,
            user: {
                id: n.actor.id,
                name: n.actor.name,
                avatarUrl: n.actor.avatar_url,
            },
            text: n.text,
            timestamp: new Date(n.created_at).toLocaleString(),
            read: n.read,
            postContent: n.posts?.content ? n.posts.content.substring(0, 50) + '...' : undefined
        }));

        setNotifications(formattedNotifications);
        setNotificationCount(formattedNotifications.filter(n => !n.read).length);

    } catch (err) {
        console.error("Error fetching notifications:", err);
    }
  }, [user]);

  const addNotification = useCallback(async (
    recipientId: string,
    text: string,
    postId?: string
  ) => {
      if (!user || recipientId === user.id) return;

      try {
          const { error } = await supabase.from('notifications').insert({
              user_id: recipientId,
              actor_id: user.id,
              text: text,
              post_id: postId,
          });

          if (error) throw error;
      } catch (err: any) {
          console.error("Error creating notification:", err.message);
      }
  }, [user]);

  const resetNotificationCount = async () => {
    if (!user || notificationCount === 0) return;
    
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    
    setNotificationCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

    try {
        if (unreadIds.length > 0) {
            const { error } = await supabase
                .from('notifications')
                .update({ read: true })
                .in('id', unreadIds);
            if (error) throw error;
        }
    } catch (err) {
        console.error("Error marking notifications as read:", err);
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
        setCurrentPath(window.location.hash.substring(1) || 'feed');
    };
    window.addEventListener('hashchange', handleHashChange);
    
    if (window.location.hash === '' || window.location.hash === '#/') {
        window.location.hash = 'feed';
    }
    handleHashChange();
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
  };

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
        const { data: postsData, error: postsError } = await supabase
            .from('posts')
            .select('id, created_at, content, media, type, format, user_id, groups(id, name)')
            .order('created_at', { ascending: false });

        if (postsError) throw postsError;
        if (!postsData) {
            setPosts([]);
            setLoading(false);
            return;
        }

        const userIds = [...new Set(postsData.map(p => p.user_id).filter(Boolean))];

        if (userIds.length === 0) {
            setPosts([]);
            setLoading(false);
            return;
        }

        const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, name, avatar_url')
            .in('id', userIds);

        if (profilesError) throw profilesError;
        const profilesMap = new Map<string, { id: string; name: string; avatar_url: string; }>((profilesData || []).map((profile: any) => [profile.id, profile]));

        const fetchedPosts: Post[] = postsData.map((p: any) => {
            const profile = profilesMap.get(p.user_id);
            const postUser = profile
                ? { id: profile.id, name: profile.name, avatarUrl: profile.avatar_url }
                : { id: p.user_id || 'unknown', name: 'Usuario Desconocido', avatarUrl: 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg' };

            return {
                id: p.id.toString(),
                timestamp: new Date(p.created_at).toLocaleString(),
                content: p.content,
                media: p.media,
                type: p.type,
                format: p.format,
                user: postUser,
                likes: 0,
                commentsCount: 0,
                comments: [],
                group: p.groups ? { id: p.groups.id, name: p.groups.name } : undefined,
            };
        });
        setPosts(fetchedPosts);

    } catch (error: any) {
        console.error("Error fetching posts:", error.message || error);
    } finally {
        setLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchPosts();
    fetchFriendRequests();
    fetchNotifications();
  }, [fetchPosts, fetchFriendRequests, fetchNotifications]);

  const handleAddPost = async (content: string, mediaFiles: File[], postType: 'standard' | 'report' = 'standard', group?: { id: string; name: string }, existingMedia?: Media[]) => {
    if (!user) {
        throw new Error("No estás autenticado. Por favor, inicia sesión de nuevo.");
    }
    
    try {
        let mediaToUpload: Media[] = [];

        if (existingMedia && existingMedia.length > 0) {
            mediaToUpload = existingMedia;
        } else if (mediaFiles.length > 0) {
            for (const file of mediaFiles) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${user.id}/${Date.now()}.${fileExt}`;
                
                const { error: uploadError } = await supabase.storage
                    .from('media')
                    .upload(fileName, file);
                
                if (uploadError) throw new Error(`Error al subir el archivo: ${uploadError.message}`);

                const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(fileName);
                mediaToUpload.push({ type: file.type.startsWith('image/') ? 'image' : 'video', url: publicUrl });
            }
        }

        const postData: { [key: string]: any } = { 
            user_id: user.id, 
            content,
            media: mediaToUpload.length > 0 ? mediaToUpload : null,
            type: postType,
            format: 'post',
            group_id: group?.id
        };

        const { error: insertError } = await supabase.from('posts').insert(postData).select().single();
        if (insertError) throw new Error(`Error al guardar la publicación: ${insertError.message}`);

        await fetchPosts();
        
        if (currentPath.startsWith('profile')) navigate(`profile/${user.id}`);
        else if (!currentPath.startsWith('group/')) window.scrollTo(0, 0);

    } catch(error) {
        console.error("Error en handleAddPost:", error);
        throw error;
    }
  };

  const handleAddPage = (newPage: Fanpage) => setFanpages(prev => [newPage, ...prev]);
  const handleAddGroup = (newGroup: Group) => setGroups(prev => [newGroup, ...prev]);
  const handleAddEvent = (newEvent: AppEvent) => setEvents(prev => [newEvent, ...prev]);
  
  const renderPage = () => {
      const [path, param] = currentPath.split('/');
      
      switch(path) {
          case 'profile':
              const profileId = param || user?.id;
              if (!profileId) return <Feed posts={[]} onAddPost={handleAddPost} loading={true} addNotification={addNotification} navigate={navigate} />;
              return <ProfilePage key={profileId} userId={profileId} onAddPost={handleAddPost} navigate={navigate} addNotification={addNotification} />;
          case 'friends':
              return <FriendsPage navigate={navigate} addNotification={addNotification} />;
          case 'ads':
              return <AdCenterPage />;
          case 'settings':
              return <SettingsPage />;
          case 'my-pages':
              return <MyPages myPages={fanpages.filter(p => p.ownerEmail === user?.email)} navigate={navigate} />;
          case 'create-fanpage':
              return <CreateFanpage onAddPage={handleAddPage} navigate={navigate} />;
          case 'report':
              return <CitizenReportPage reportPosts={posts.filter(p => p.type === 'report')} onAddPost={handleAddPost} navigate={navigate} />;
          case 'reels':
              return <ReelsPage reels={posts.filter(p => p.format === 'reel')} addNotification={addNotification} onAddPost={handleAddPost} />;
          case 'marketplace':
              return <MarketplacePage />;
          case 'groups':
              return <GroupsPage navigate={navigate} groups={groups} />;
          case 'group':
              const group = groups.find(g => g.id === param);
              return group ? <GroupDetailPage group={group} posts={posts.filter(p => p.group?.id === param)} onAddPost={handleAddPost} navigate={navigate} /> : <div>Grupo no encontrado</div>;
          case 'create-group':
                return <CreateGroupPage onAddGroup={handleAddGroup} navigate={navigate} />;
          case 'events':
              return <EventsPage navigate={navigate} events={events} />;
          case 'event':
              const event = events.find(e => e.id === param);
              return event ? <EventDetailPage event={event} /> : <div>Evento no encontrado</div>;
          case 'create-event':
              return <CreateEventPage onAddEvent={handleAddEvent} navigate={navigate} />;
          case 'notifications':
              return <NotificationsPage notifications={notifications} navigate={navigate} />;
          case 'admin':
              return user?.isAdmin ? <AdminDashboardPage fanpages={fanpages}/> : <Feed posts={posts.filter(p => p.type !== 'report' && p.format !== 'reel')} onAddPost={handleAddPost} loading={loading} addNotification={addNotification} navigate={navigate} />;
          case 'feed':
          default:
              const isNewUser = user ? posts.filter(p => p.user && p.user.id === user.id).length === 0 && !loading : false;
              return <Feed posts={posts.filter(p => p.type !== 'report' && p.format !== 'reel')} onAddPost={handleAddPost} loading={loading} addNotification={addNotification} isNewUser={isNewUser} navigate={navigate} />;
      }
  }

  return (
    <div className="min-h-screen bg-z-bg-primary dark:bg-z-bg-primary-dark animate-fadeIn">
      {currentPath !== 'reels' && <Header navigate={navigate} notificationCount={notificationCount} notifications={notifications} onNotificationsOpen={resetNotificationCount} friendRequests={friendRequests} onFriendRequestAction={fetchFriendRequests} />}
      <div className="flex">
        {currentPath !== 'reels' && <LeftSidebar navigate={navigate} />}
        {renderPage()}
        {currentPath !== 'reels' && <RightSidebar />}
      </div>
      {currentPath !== 'reels' && <BottomNavBar navigate={navigate} activePath={currentPath} />}
    </div>
  );
};

export default MainLayout;