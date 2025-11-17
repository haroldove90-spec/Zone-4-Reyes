
import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import Feed from './Feed';
import RightSidebar from './RightSidebar';
import { Post, Fanpage, AppNotification, User, Group, AppEvent, Media } from '../types';
import { FAKE_GROUPS, FAKE_EVENTS } from '../services/geminiService';
import BottomNavBar from './BottomNavBar';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseClient';
import ErrorBanner from './ErrorBanner';

// Lazy load page components for code splitting
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const FriendsPage = lazy(() => import('../pages/FriendsPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const AdminDashboardPage = lazy(() => import('../pages/AdminDashboardPage'));
const MyPages = lazy(() => import('../pages/MyPages'));
const CreateFanpage = lazy(() => import('../pages/CreateFanpage'));
const FanpageDetailPage = lazy(() => import('../pages/FanpageDetailPage'));
const CitizenReportPage = lazy(() => import('../pages/CitizenReportPage'));
const GroupsPage = lazy(() => import('../pages/GroupsPage'));
const GroupDetailPage = lazy(() => import('../pages/GroupDetailPage'));
const CreateGroupPage = lazy(() => import('../pages/CreateGroupPage'));
const EventsPage = lazy(() => import('../pages/EventsPage'));
const EventDetailPage = lazy(() => import('../pages/EventDetailPage'));
const CreateEventPage = lazy(() => import('../pages/CreateEventPage'));
const NotificationsPage = lazy(() => import('../pages/NotificationsPage'));

const LoadingSpinner: React.FC = () => (
    <div className="flex-grow pt-14 flex items-center justify-center" style={{ minHeight: 'calc(100vh - 3.5rem)' }}>
        <div className="w-12 h-12 border-4 border-z-primary/30 border-t-z-primary rounded-full animate-spin"></div>
    </div>
);

const POSTS_PER_PAGE = 5;

const MainLayout: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageToFetch, setPageToFetch] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [groups, setGroups] = useState<Group[]>(FAKE_GROUPS);
  const [events, setEvents] = useState<AppEvent[]>(FAKE_EVENTS);
  const [fanpages, setFanpages] = useState<Fanpage[]>([]);
  const [currentPath, setCurrentPath] = useState(window.location.hash.substring(1) || 'feed');
  const { user } = useAuth();

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [friendRequests, setFriendRequests] = useState<User[]>([]);
  const [friends, setFriends] = useState<User[]>([]);

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
              .filter((req: any) => req.profiles)
              .map((req: any) => ({
                  id: req.profiles.id,
                  name: req.profiles.name,
                  avatarUrl: req.profiles.avatar_url,
              }));

          setFriendRequests(requests);
      } catch (error: any) {
          console.error("Error fetching friend requests:", error.message || error);
          setError("No se pudieron cargar las solicitudes de amistad.");
      }
  }, [user]);

  const fetchFriends = useCallback(async () => {
    if (!user) return;
    try {
      const { data: friendships, error: friendshipsError } = await supabase
        .from('friendships')
        .select('requester_id, addressee_id')
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
        .eq('status', 'accepted');

      if (friendshipsError) throw friendshipsError;

      const friendIds = friendships.map(f =>
        f.requester_id === user.id ? f.addressee_id : f.requester_id
      );

      if (friendIds.length === 0) {
        setFriends([]);
        return;
      }

      const { data: friendsData, error: friendsError } = await supabase
        .from('profiles')
        .select('id, name, avatar_url')
        .in('id', friendIds);

      if (friendsError) throw friendsError;

      const formattedFriends: User[] = friendsData.map((f: any) => ({
        id: f.id,
        name: f.name,
        avatarUrl: f.avatar_url,
      }));
      setFriends(formattedFriends);

    } catch (error: any) {
      console.error("Error fetching friends:", error.message || error);
      setError("No se pudieron cargar tus amigos.");
      setFriends([]);
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
            user: { id: n.actor.id, name: n.actor.name, avatarUrl: n.actor.avatar_url },
            text: n.text,
            timestamp: new Date(n.created_at).toLocaleString(),
            read: n.read,
            postContent: n.posts?.content ? n.posts.content.substring(0, 50) + '...' : undefined
        }));

        setNotifications(formattedNotifications);
        setNotificationCount(formattedNotifications.filter(n => !n.read).length);

    } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("No se pudieron cargar las notificaciones.");
    }
  }, [user]);

  const addNotification = useCallback(async (
    recipientId: string,
    text: string,
    postId?: string
  ) => {
      if (!user || recipientId === user.id) return;
      try {
          const { error } = await supabase.from('notifications').insert([{ user_id: recipientId, actor_id: user.id, text: text, post_id: postId }]);
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
            const { error } = await supabase.from('notifications').update({ read: true }).in('id', unreadIds);
            if (error) throw error;
        }
    } catch (err) {
        console.error("Error marking notifications as read:", err);
    }
  };

  useEffect(() => {
    const handleHashChange = () => setCurrentPath(window.location.hash.substring(1) || 'feed');
    window.addEventListener('hashchange', handleHashChange);
    if (window.location.hash === '' || window.location.hash === '#/') window.location.hash = 'feed';
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => window.location.hash = path;

  const loadMorePosts = useCallback(async (isInitial = false) => {
      if ((loadingMore || !hasMore) && !isInitial) return;

      const page = isInitial ? 1 : pageToFetch;
      if (isInitial) {
          setLoading(true);
          setPosts([]); // Clear posts for initial load
          setHasMore(true); // Reset hasMore
          setPageToFetch(1); // Reset page counter
      } else {
          setLoadingMore(true);
      }

      const from = (page - 1) * POSTS_PER_PAGE;
      const to = from + POSTS_PER_PAGE - 1;

      try {
          const { data: postsData, error: postsError } = await supabase
              .from('posts')
              .select('*, user:profiles!user_id(id, name, avatar_url), groups(id, name), fanpage:fanpages!fanpage_id(id, name, avatar_url), likes(count), comments(count)')
              .order('created_at', { ascending: false })
              .range(from, to);

          if (postsError) throw postsError;
          if (!postsData) {
              setHasMore(false);
              return;
          }

          const postIds = postsData.map(p => p.id);
          let likedPostIds = new Set<string>();

          if (user && postIds.length > 0) {
              const { data: likesData, error: likesError } = await supabase.from('likes').select('post_id').in('post_id', postIds).eq('user_id', user.id);
              if (likesError) console.error("Error fetching user likes:", likesError);
              else if (likesData) likedPostIds = new Set(likesData.map(l => l.post_id));
          }

          const fetchedPosts: Post[] = postsData.map((p: any) => ({
              id: p.id.toString(),
              timestamp: new Date(p.created_at).toLocaleString(),
              content: p.content, media: p.media, type: p.type, format: p.format,
              user: p.user ? { id: p.user.id, name: p.user.name, avatarUrl: p.user.avatar_url } : { id: p.user_id || 'unknown', name: 'Usuario Desconocido', avatarUrl: '...' },
              likes: p.likes[0]?.count ?? 0, commentsCount: p.comments[0]?.count ?? 0, comments: [],
              group: p.groups ? { id: p.groups.id, name: p.groups.name } : undefined,
              fanpage: p.fanpage ? { id: p.fanpage.id, name: p.fanpage.name, avatarUrl: p.fanpage.avatar_url } : undefined,
              isLikedByCurrentUser: likedPostIds.has(p.id.toString()),
          }));

          setPosts(prev => isInitial ? fetchedPosts : [...prev, ...fetchedPosts]);
          setPageToFetch(page + 1);
          if (fetchedPosts.length < POSTS_PER_PAGE) setHasMore(false);

      } catch (error: any) {
          console.error("Error fetching posts:", error.message || error);
          setError("No se pudieron cargar las publicaciones. Inténtalo de nuevo.");
      } finally {
          if (isInitial) setLoading(false);
          else setLoadingMore(false);
      }
  }, [user, pageToFetch, hasMore, loadingMore]);

  const fetchFanpages = useCallback(async () => {
      try {
          const { data, error } = await supabase.from('fanpages').select('*');
          if (error) throw error;
          const formattedPages = data.map((p: any) => ({
              id: p.id, name: p.name, category: p.category, avatarUrl: p.avatar_url,
              coverUrl: p.cover_url, bio: p.bio, ownerId: p.owner_id, is_active: p.is_active
          }));
          setFanpages(formattedPages);
      } catch (err) {
          console.error("Error fetching fanpages:", err);
          setError("No se pudieron cargar las páginas de negocio.");
      }
  }, []);

  useEffect(() => {
    if (user) {
        loadMorePosts(true);
        fetchFriendRequests();
        fetchNotifications();
        fetchFanpages();
        fetchFriends();
    }
  }, [user, loadMorePosts, fetchFriendRequests, fetchNotifications, fetchFanpages, fetchFriends]);

  const handleAddPost = async (content: string, mediaFiles: File[], postType: 'standard' | 'report' = 'standard', options?: { group?: { id: string; name: string; }; fanpageId?: string; }, existingMedia?: Media[]) => {
    if (!user) throw new Error("No estás autenticado.");
    try {
        let mediaToUpload: Media[] = existingMedia || [];
        if (!existingMedia && mediaFiles.length > 0) {
            for (const file of mediaFiles) {
                const fileName = `${user.id}/${Date.now()}.${file.name.split('.').pop()}`;
                const { error: uploadError } = await supabase.storage.from('media').upload(fileName, file);
                if (uploadError) throw new Error(`Error al subir el archivo: ${uploadError.message}`);
                const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(fileName);
                mediaToUpload.push({ type: file.type.startsWith('image/') ? 'image' : 'video', url: publicUrl });
            }
        }
        const postData = { user_id: user.id, content, media: mediaToUpload.length > 0 ? mediaToUpload : null, type: postType, format: 'post', group_id: options?.group?.id, fanpage_id: options?.fanpageId };
        const { error: insertError } = await supabase.from('posts').insert([postData]);
        if (insertError) throw new Error(`Error al guardar la publicación: ${insertError.message}`);
        await loadMorePosts(true);
    } catch(error) {
        console.error("Error en handleAddPost:", error);
        setError("No se pudo crear la publicación. Inténtalo de nuevo.");
        throw error;
    }
  };

  const handleAddGroup = (newGroup: Group) => setGroups(prev => [newGroup, ...prev]);
  const handleAddEvent = (newEvent: AppEvent) => setEvents(prev => [newEvent, ...prev]);
  
  const renderPage = () => {
      const [path, param] = currentPath.split('/');
      
      switch(path) {
          case 'profile':
              const profileId = param || user?.id;
              if (!profileId) return <LoadingSpinner />;
              return <ProfilePage key={profileId} userId={profileId} onAddPost={handleAddPost} navigate={navigate} addNotification={addNotification} />;
          case 'friends':
              return <FriendsPage navigate={navigate} addNotification={addNotification} />;
          case 'settings':
              return <SettingsPage />;
          case 'my-pages':
              return <MyPages navigate={navigate} />;
          case 'create-fanpage':
              return <CreateFanpage navigate={navigate} />;
          case 'fanpage':
              const fanpage = fanpages.find(f => f.id === param);
              return fanpage ? <FanpageDetailPage fanpage={fanpage} posts={posts.filter(p => p.fanpage?.id === param)} onAddPost={handleAddPost} navigate={navigate} addNotification={addNotification} /> : <div>Página no encontrada</div>;
          case 'report':
              return <CitizenReportPage reportPosts={posts.filter(p => p.type === 'report')} onAddPost={handleAddPost} navigate={navigate} />;
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
              return user?.isAdmin ? <AdminDashboardPage /> : <Feed posts={[]} onAddPost={() => Promise.resolve()} loading={true} addNotification={() => Promise.resolve()} navigate={navigate} loadMorePosts={() => {}} hasMore={false} loadingMore={false} onRefresh={() => Promise.resolve()} />;
          case 'feed':
          default:
              const isNewUser = user ? posts.filter(p => p.user && p.user.id === user.id).length === 0 && !loading : false;
              return <Feed posts={posts.filter(p => p.type !== 'report' && p.format !== 'reel')} onAddPost={handleAddPost} loading={loading} addNotification={addNotification} isNewUser={isNewUser} navigate={navigate} loadMorePosts={() => loadMorePosts(false)} hasMore={hasMore} loadingMore={loadingMore} onRefresh={() => loadMorePosts(true)} />;
      }
  }

  return (
    <div className="min-h-screen bg-z-bg-primary dark:bg-z-bg-primary-dark animate-fadeIn">
      <ErrorBanner message={error} onClose={() => setError(null)} />
      {currentPath !== 'reels' && <Header navigate={navigate} notificationCount={notificationCount} notifications={notifications} onNotificationsOpen={resetNotificationCount} friendRequests={friendRequests} onFriendRequestAction={fetchFriendRequests} />}
      <div className="flex">
        {currentPath !== 'reels' && <LeftSidebar navigate={navigate} />}
        <Suspense fallback={<LoadingSpinner />}>
            {renderPage()}
        </Suspense>
        {currentPath !== 'reels' && <RightSidebar friends={friends} navigate={navigate} />}
      </div>
      {currentPath !== 'reels' && <BottomNavBar navigate={navigate} activePath={currentPath} />}
    </div>
  );
};

export default MainLayout;
