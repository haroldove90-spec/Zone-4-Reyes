
import React, { useState, useEffect, useCallback } from 'react';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import Feed from './Feed';
import RightSidebar from './RightSidebar';
import { Post, Fanpage, Notification, User, Group, Event, Media } from '../types';
import { FAKE_GROUPS, FAKE_EVENTS } from '../services/geminiService';
import InstallPWA from './InstallPWA';
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
  const [events, setEvents] = useState<Event[]>(FAKE_EVENTS);
  const [currentPath, setCurrentPath] = useState(window.location.hash.substring(1) || 'feed');
  const { user } = useAuth();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationCount, setNotificationCount] = useState(3); // Start with some fake notifications

  const addNotification = useCallback((text: string, user: User, postContent?: string) => {
    const newNotification: Notification = {
        id: new Date().toISOString(),
        user: { id: user.id, name: user.name, avatarUrl: user.avatarUrl },
        text,
        timestamp: 'Justo ahora',
        read: false,
        postContent: postContent ? postContent.substring(0, 50) + '...' : undefined
    };
    setNotifications(prev => [newNotification, ...prev]);
    setNotificationCount(prev => prev + 1);
  }, []);

  const resetNotificationCount = () => {
    setNotificationCount(0);
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
        const { data, error } = await supabase
            .from('posts')
            .select(`
                id,
                created_at,
                content,
                media,
                type,
                format,
                group_id,
                user:profiles!user_id(id, name, avatar_url)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Map Supabase response to app's Post type
        const fetchedPosts: Post[] = data.map((p: any) => {
            const group = p.group_id ? FAKE_GROUPS.find(g => g.id === p.group_id) : undefined;
            const postUser = p.user 
                ? { id: p.user.id, name: p.user.name, avatarUrl: p.user.avatar_url } 
                : { id: 'unknown', name: 'Usuario Desconocido', avatarUrl: 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg' };

            return {
                id: p.id.toString(),
                timestamp: new Date(p.created_at).toLocaleString(),
                content: p.content,
                media: p.media,
                type: p.type,
                format: p.format,
                user: postUser,
                likes: 0, // Should be fetched separately or with a join
                commentsCount: 0, // Should be fetched separately
                comments: [],
                group: group ? { id: group.id, name: group.name } : undefined,
            };
        });

        setPosts(fetchedPosts);

    } catch (error) {
        console.error("Error fetching posts:", error);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleAddPost = async (content: string, mediaFiles: File[], postType: 'standard' | 'report' = 'standard', group?: { id: string; name: string }) => {
    if (!user) return;

    let mediaToUpload: Media[] = [];

    for (const file of mediaFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
            .from('media')
            .upload(fileName, file);
        
        if (uploadError) {
            console.error('Error uploading file:', uploadError);
            throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('media')
            .getPublicUrl(fileName);
        
        mediaToUpload.push({
            type: file.type.startsWith('image/') ? 'image' : 'video',
            url: publicUrl,
        });
    }

    const postData: { [key: string]: any } = { 
      user_id: user.id, 
      content,
      media: mediaToUpload.length > 0 ? mediaToUpload : null,
      type: postType,
      format: 'post'
    };
    if (group) {
        postData.group_id = group.id;
    }

    const { data, error } = await supabase
      .from('posts')
      .insert(postData)
      .select('*, user:profiles!user_id(id, name, avatar_url)')
      .single();

    if (error) {
        console.error('Error creating post:', error);
        throw error;
    } else if (data) {
        const newPost: Post = {
            id: data.id.toString(),
            timestamp: new Date(data.created_at).toLocaleString(),
            content: data.content,
            media: data.media,
            type: data.type,
            format: data.format,
            user: { id: data.user.id, name: data.user.name, avatarUrl: data.user.avatar_url },
            likes: 0,
            commentsCount: 0,
            comments: [],
            group: group,
        };
        setPosts(prevPosts => [newPost, ...prevPosts]);
        if (currentPath.startsWith('profile')) {
            navigate('profile');
        } else if (!currentPath.startsWith('group/')) {
            window.scrollTo(0, 0);
        }
    }
  };


  const handleAddPage = (newPage: Fanpage) => {
    setFanpages(prev => [newPage, ...prev]);
  };

  const handleAddGroup = (newGroup: Group) => {
    setGroups(prev => [newGroup, ...prev]);
  };
  
  const handleAddEvent = (newEvent: Event) => {
    setEvents(prev => [newEvent, ...prev]);
  };
  
  const renderPage = () => {
      const [path, param] = currentPath.split('/');
      
      switch(path) {
          case 'profile':
              return <ProfilePage userPosts={posts.filter(p => p.user && user && p.user.id === user.id)} onAddPost={handleAddPost} navigate={navigate} />;
          case 'friends':
              return <FriendsPage />;
          case 'ads':
              return <AdCenterPage />;
          case 'settings':
              return <SettingsPage />;
          case 'my-pages':
              return <MyPages myPages={fanpages.filter(p => p.ownerEmail === user?.email)} navigate={navigate} />;
          case 'create-fanpage':
              return <CreateFanpage onAddPage={handleAddPage} navigate={navigate} />;
          case 'report':
              return <CitizenReportPage reportPosts={posts.filter(p => p.type === 'report')} onAddPost={handleAddPost} />;
          case 'reels':
              return <ReelsPage reels={posts.filter(p => p.format === 'reel')} addNotification={addNotification} />;
          case 'marketplace':
              return <MarketplacePage />;
          case 'groups':
              return <GroupsPage navigate={navigate} groups={groups} />;
          case 'group':
              const group = groups.find(g => g.id === param);
              return group ? <GroupDetailPage group={group} posts={posts.filter(p => p.group?.id === param)} onAddPost={handleAddPost} /> : <div>Grupo no encontrado</div>;
          case 'create-group':
                return <CreateGroupPage onAddGroup={handleAddGroup} navigate={navigate} />;
          case 'events':
              return <EventsPage navigate={navigate} events={events} />;
          case 'event':
              const event = events.find(e => e.id === param);
              return event ? <EventDetailPage event={event} /> : <div>Evento no encontrado</div>;
          case 'create-event':
              return <CreateEventPage onAddEvent={handleAddEvent} navigate={navigate} />;
          case 'admin':
              return user?.isAdmin ? <AdminDashboardPage fanpages={fanpages}/> : <Feed posts={posts.filter(p => p.type !== 'report' && p.format !== 'reel')} onAddPost={handleAddPost} loading={loading} addNotification={addNotification} />;
          case 'feed':
          default:
              const isNewUser = user ? posts.filter(p => p.user && p.user.id === user.id).length === 0 && !loading : false;
              return <Feed posts={posts.filter(p => p.type !== 'report' && p.format !== 'reel')} onAddPost={handleAddPost} loading={loading} addNotification={addNotification} isNewUser={isNewUser} />;
      }
  }

  return (
    <div className="min-h-screen bg-z-bg-primary dark:bg-z-bg-primary-dark animate-fadeIn">
      {currentPath !== 'reels' && <Header navigate={navigate} notificationCount={notificationCount} notifications={notifications} onNotificationsOpen={resetNotificationCount} />}
      <div className="flex">
        {currentPath !== 'reels' && <LeftSidebar navigate={navigate} />}
        {renderPage()}
        {currentPath !== 'reels' && <RightSidebar />}
      </div>
      <InstallPWA />
      {currentPath !== 'reels' && <BottomNavBar navigate={navigate} activePath={currentPath} />}
    </div>
  );
};

export default MainLayout;
