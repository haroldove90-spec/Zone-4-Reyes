

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
  const [notificationCount, setNotificationCount] = useState(3); // Start with some fake notifications

  const addNotification = useCallback((text: string, user: User, postContent?: string) => {
    const newNotification: AppNotification = {
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
        // Step 1: Fetch posts and their user_id
        const { data: postsData, error: postsError } = await supabase
            .from('posts')
            .select('id, created_at, content, media, type, format, group_id, user_id')
            .order('created_at', { ascending: false });

        if (postsError) throw postsError;

        if (!postsData) {
            setPosts([]);
            setLoading(false);
            return;
        }

        // Step 2: Collect all unique user IDs from the posts
        const userIds = [...new Set(postsData.map(p => p.user_id).filter(Boolean))];

        if (userIds.length === 0) {
            setPosts([]); // Set empty posts if no users
            setLoading(false);
            return;
        }

        // Step 3: Fetch the profiles for these user IDs
        const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, name, avatar_url')
            .in('id', userIds);

        if (profilesError) throw profilesError;

        // Step 4: Create a map of profiles for easy lookup
        // Fix: Explicitly type the map to ensure type safety for profile data from Supabase.
        const profilesMap = new Map<string, { id: string; name: string; avatar_url: string; }>((profilesData || []).map((profile: any) => [profile.id, profile]));

        // Step 5: Combine posts with their author's profile information
        const fetchedPosts: Post[] = postsData.map((p: any) => {
            const group = p.group_id ? FAKE_GROUPS.find(g => g.id === p.group_id) : undefined;
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
                group: group ? { id: group.id, name: group.name } : undefined,
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
  }, [fetchPosts]);

  const handleAddPost = async (content: string, mediaFiles: File[], postType: 'standard' | 'report' = 'standard', group?: { id: string; name: string }) => {
    if (!user) return;
    try {
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

        const { data: newPostData, error: insertError } = await supabase
        .from('posts')
        .insert(postData)
        .select()
        .single();

        if (insertError) {
            console.error('Error creating post:', insertError);
            throw insertError; // Throw error to be caught by the calling component
        }

        if (newPostData) {
            const postUser = { id: user.id, name: user.name, avatarUrl: user.avatarUrl };

            const newPost: Post = {
                id: newPostData.id.toString(),
                timestamp: new Date(newPostData.created_at).toLocaleString(),
                content: newPostData.content,
                media: newPostData.media,
                type: newPostData.type,
                format: newPostData.format,
                user: postUser,
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
    } catch(error) {
        console.error("Full error object in handleAddPost:", error);
        throw error;
    }
  };


  const handleAddPage = (newPage: Fanpage) => {
    setFanpages(prev => [newPage, ...prev]);
  };

  const handleAddGroup = (newGroup: Group) => {
    setGroups(prev => [newGroup, ...prev]);
  };
  
  const handleAddEvent = (newEvent: AppEvent) => {
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
      {currentPath !== 'reels' && <BottomNavBar navigate={navigate} activePath={currentPath} />}
    </div>
  );
};

export default MainLayout;
