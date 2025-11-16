
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import LeftSidebar from './components/LeftSidebar';
import Feed from './components/Feed';
import RightSidebar from './components/RightSidebar';
import { Post } from './types';
import { generateSocialFeed } from './services/geminiService';
import { ThemeProvider } from './contexts/ThemeContext';

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
    <ThemeProvider>
      <div className="min-h-screen">
        <Header />
        <div className="flex">
          <LeftSidebar />
          <Feed posts={posts} onAddPost={handleAddPost} />
          <RightSidebar />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
