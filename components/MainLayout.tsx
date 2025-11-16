
import React, { useState, useEffect, useCallback } from 'react';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import Feed from './Feed';
import RightSidebar from './RightSidebar';
import { Post } from '../types';
import { generateSocialFeed } from '../services/geminiService';
import InstallPWA from './InstallPWA';
import BottomNavBar from './BottomNavBar';
import ProfilePage from '../pages/ProfilePage';
import FriendsPage from '../pages/FriendsPage';
import AdCenterPage from '../pages/AdCenterPage';

const MainLayout: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState('feed');

  const fetchPosts = useCallback(async () => {
    const generatedPosts = await generateSocialFeed();
    setPosts(generatedPosts);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleAddPost = (newPost: Post) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };
  
  const renderPage = () => {
      switch(currentPage) {
          case 'profile':
              return <ProfilePage userPosts={posts.slice(0,2)} />; // Show some posts on profile
          case 'friends':
              return <FriendsPage />;
          case 'ads':
              return <AdCenterPage />;
          case 'feed':
          default:
              return <Feed posts={posts} onAddPost={handleAddPost} />;
      }
  }

  return (
    <div className="min-h-screen bg-z-bg-primary dark:bg-z-bg-primary-dark animate-fadeIn">
      <Header setCurrentPage={setCurrentPage} />
      <div className="flex">
        <LeftSidebar setCurrentPage={setCurrentPage} />
        {renderPage()}
        <RightSidebar />
      </div>
      <InstallPWA />
      <BottomNavBar setCurrentPage={setCurrentPage} activePage={currentPage} />
    </div>
  );
};

export default MainLayout;
