
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import Feed from './components/Feed';
import { Post } from './types';
import { generateSocialFeed } from './services/geminiService';

const App: React.FC = () => {
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
    <div className="bg-z-bg-primary min-h-screen">
      <Header />
      <div className="flex">
        <LeftSidebar />
        <Feed posts={posts} onAddPost={handleAddPost} />
        <RightSidebar />
      </div>
    </div>
  );
};

export default App;
