
import React, { useState, useEffect, useCallback } from 'react';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import Feed from './Feed';
import RightSidebar from './RightSidebar';
import { Post } from '../types';
import { generateSocialFeed } from '../services/geminiService';
import InstallPWA from './InstallPWA';
import BottomNavBar from './BottomNavBar';

const MainLayout: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = useCallback(async () => {
    const generatedPosts = await generateSocialFeed();
    setPosts(generatedPosts);
  }, []);

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddPost = (newPost: Post) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  return (
    <div className="min-h-screen animate-fadeIn">
      <Header />
      <div className="flex">
        <LeftSidebar />
        <Feed posts={posts} onAddPost={handleAddPost} />
        <RightSidebar />
      </div>
      <InstallPWA />
      <BottomNavBar />
    </div>
  );
};

export default MainLayout;