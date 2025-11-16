
import React, { useState, useEffect, useCallback } from 'react';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import Feed from './Feed';
import RightSidebar from './RightSidebar';
import { Post, Fanpage, Notification, User, Group } from '../types';
import { generateSocialFeed, FAKE_GROUPS } from '../services/geminiService';
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
import { useAuth } from '../contexts/AuthContext';

const MOCK_FANPAGES: Fanpage[] = [
    { id: 'fp1', name: 'El Rincón del Café', category: 'Cafetería', bio: 'El mejor café de Reyes Iztacala.', ownerEmail: 'admin@example.com', avatarUrl: 'https://picsum.photos/id/55/200', coverUrl: 'https://picsum.photos/id/225/1600/400' },
    { id: 'fp2', name: 'Gaming Zone', category: 'Videojuegos', bio: 'Tu comunidad de gaming.', ownerEmail: 'carlos@example.com', avatarUrl: 'https://picsum.photos/id/44/200', coverUrl: 'https://picsum.photos/id/99/1600/400' },
];

const MainLayout: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [fanpages, setFanpages] = useState<Fanpage[]>(MOCK_FANPAGES);
  const [groups, setGroups] = useState<Group[]>(FAKE_GROUPS);
  const [currentPath, setCurrentPath] = useState(window.location.hash.substring(1) || 'feed');
  const { user } = useAuth();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationCount, setNotificationCount] = useState(3); // Start with some fake notifications

  const addNotification = useCallback((text: string, user: User, postContent?: string) => {
    const newNotification: Notification = {
        id: new Date().toISOString(),
        user: { name: user.name, avatarUrl: user.avatarUrl },
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
    const generatedPosts = await generateSocialFeed();
    setPosts(generatedPosts);
    setTimeout(() => setLoading(false), 500);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleAddPost = (newPost: Post) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
    if (currentPath.startsWith('profile')) {
      navigate('profile'); // stay on profile
    } else {
      window.scrollTo(0, 0);
    }
  };

  const handleAddPage = (newPage: Fanpage) => {
    setFanpages(prev => [newPage, ...prev]);
  };

  const handleAddGroup = (newGroup: Group) => {
    setGroups(prev => [newGroup, ...prev]);
  }
  
  const renderPage = () => {
      const [path, param] = currentPath.split('/');
      
      switch(path) {
          case 'profile':
              return <ProfilePage userPosts={posts.filter(p => p.user.name === user?.name)} onAddPost={handleAddPost} navigate={navigate} />;
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
          case 'admin':
              return user?.isAdmin ? <AdminDashboardPage fanpages={fanpages}/> : <Feed posts={posts.filter(p => p.type !== 'report' && p.format !== 'reel')} onAddPost={handleAddPost} loading={loading} addNotification={addNotification} />;
          case 'feed':
          default:
              return <Feed posts={posts.filter(p => p.type !== 'report' && p.format !== 'reel')} onAddPost={handleAddPost} loading={loading} addNotification={addNotification} />;
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