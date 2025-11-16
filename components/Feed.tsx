
import React, { useState } from 'react';
import { Post as PostType, User } from '../types';
import CreatePost from './CreatePost';
import Post from './Post';
import StoryReel from './StoryReel';
import MobileSearch from './MobileSearch';
import AdPost from './AdPost';

// A simple spinner component to be used locally
const Spinner: React.FC = () => (
    <div className="flex justify-center items-center p-4">
        <div className="w-10 h-10 border-4 border-z-primary/30 border-t-z-primary rounded-full animate-spin"></div>
        <style>{`
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            .animate-spin {
                animation: spin 1s linear infinite;
            }
        `}</style>
    </div>
);

interface FeedProps {
    posts: PostType[];
    onAddPost: (post: PostType) => void;
    loading: boolean;
    addNotification: (text: string, user: User, postContent?: string) => void;
}

const Feed: React.FC<FeedProps> = ({ posts, onAddPost, loading, addNotification }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'pages'>('all');

  const filteredPosts = activeFilter === 'pages'
    ? posts.filter(p => !!p.fanpage)
    : posts;

  return (
    <main className="flex-grow pt-14 lg:ml-20 xl:ml-80 lg:mr-72 overflow-x-hidden pb-20 md:pb-0">
      <div className="max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto px-4">
        <MobileSearch />
        <StoryReel />
        <div className="mb-6">
          <CreatePost onAddPost={onAddPost} />
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
            <div className="text-center py-10 text-z-text-secondary">
                <Spinner />
                <p>Cargando publicaciones...</p>
            </div>
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map((post, index) => (
            <React.Fragment key={post.id}>
              <Post post={post} index={index} addNotification={addNotification} />
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