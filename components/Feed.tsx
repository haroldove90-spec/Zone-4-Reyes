

import React, { useState } from 'react';
import { Post as PostType, User, Media } from '../types';
import CreatePost from './CreatePost';
import Post, { PostSkeleton } from './Post';
import AdBanner from './AdBanner';
import MobileSearch from './MobileSearch';
import AdPost from './AdPost';

interface FeedProps {
    posts: PostType[];
    onAddPost: (content: string, mediaFiles: File[], postType?: 'standard' | 'report', group?: { id: string; name: string }, existingMedia?: Media[]) => Promise<void>;
    loading: boolean;
    addNotification: (recipientId: string, text: string, postId?: string) => Promise<void>;
    isNewUser?: boolean;
    navigate: (path: string) => void;
}

const Feed: React.FC<FeedProps> = ({ posts, onAddPost, loading, addNotification, isNewUser, navigate }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'pages'>('all');

  const filteredPosts = activeFilter === 'pages'
    ? posts.filter(p => !!p.fanpage)
    : posts;

  return (
    <main className="flex-grow pt-14 lg:ml-20 xl:ml-80 lg:mr-72 overflow-x-hidden pb-20 md:pb-0">
      <div className="max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto px-4">
        <MobileSearch />
        <AdBanner />
        <div className="mb-6">
          <CreatePost onAddPost={onAddPost} isNewUser={isNewUser} />
        </div>

        {/* Feed Filters */}
        <div className="flex items-center space-x-2 mb-4 border-b dark:border-z-border-dark">
            <button 
                onClick={() => setActiveFilter('all')}
                className={`py-3 px-4 font-semibold transition-colors ${activeFilter === 'all' ? 'text-z-primary border-b-2 border-z-primary' : 'text-z-text-secondary dark:text-z-text-secondary-dark hover:bg-gray-100 dark:hover:bg-z-hover-dark rounded-t-md'}`}
            >
                Para ti
            </button>
            <button 
                onClick={() => setActiveFilter('pages')}
                className={`py-3 px-4 font-semibold transition-colors ${activeFilter === 'pages' ? 'text-z-primary border-b-2 border-z-primary' : 'text-z-text-secondary dark:text-z-text-secondary-dark hover:bg-gray-100 dark:hover:bg-z-hover-dark rounded-t-md'}`}
            >
                Páginas
            </button>
        </div>

        {loading ? (
            <div>
                <PostSkeleton />
                <PostSkeleton />
                <PostSkeleton />
            </div>
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map((post, index) => (
            <React.Fragment key={post.id}>
              <Post post={post} index={index} addNotification={addNotification} onAddPost={onAddPost} navigate={navigate} />
              {index === 1 && <AdPost />}
            </React.Fragment>
          ))
        ) : (
          <div className="text-center py-10 text-z-text-secondary dark:text-z-text-secondary-dark bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-lg">
            No hay publicaciones en esta sección.
          </div>
        )}
      </div>
    </main>
  );
};

export default Feed;