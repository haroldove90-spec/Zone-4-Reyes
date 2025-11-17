
import React, { useState, useRef, useCallback } from 'react';
import { Post as PostType, Media } from '../types';
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
    loadMorePosts: () => void;
    hasMore: boolean;
    loadingMore: boolean;
    onRefresh: () => Promise<void>;
}

const Feed: React.FC<FeedProps> = ({ posts, onAddPost, loading, addNotification, isNewUser, navigate, loadMorePosts, hasMore, loadingMore, onRefresh }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'pages'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const observer = useRef<IntersectionObserver>();
  const lastPostElementRef = useCallback(node => {
      if (loadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting && hasMore) {
              loadMorePosts();
          }
      });
      if (node) observer.current.observe(node);
  }, [loadingMore, hasMore, loadMorePosts]);

  const handleRefreshClick = async () => {
    setIsRefreshing(true);
    try {
        await onRefresh();
    } catch (e) {
        console.error("Error refreshing feed", e);
    } finally {
        setIsRefreshing(false);
    }
  };

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

        <div className="mb-4">
            <button
                onClick={handleRefreshClick}
                disabled={isRefreshing || loading}
                className="w-full text-center bg-z-bg-secondary dark:bg-z-bg-secondary-dark py-2 px-4 rounded-lg border dark:border-z-border-dark text-z-primary font-semibold hover:bg-gray-100 dark:hover:bg-z-hover-dark transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {isRefreshing ? 'Cargando...' : 'Cargar nuevas publicaciones'}
            </button>
        </div>

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
          filteredPosts.map((post, index) => {
            const isLastElement = filteredPosts.length === index + 1;
            return (
              <React.Fragment key={post.id}>
                 <div ref={isLastElement ? lastPostElementRef : null}>
                    <Post post={post} index={index} addNotification={addNotification} onAddPost={onAddPost} navigate={navigate} />
                 </div>
                {index === 1 && <AdPost />}
              </React.Fragment>
            );
          })
        ) : (
          <div className="text-center py-10 text-z-text-secondary dark:text-z-text-secondary-dark bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-lg">
            No hay publicaciones en esta sección.
          </div>
        )}

        {loadingMore && (
            <div className="flex justify-center items-center py-8">
                <div className="w-8 h-8 border-4 border-z-primary/30 border-t-z-primary rounded-full animate-spin"></div>
            </div>
        )}

        {!hasMore && !loading && posts.length > 0 && (
             <div className="text-center py-10 text-z-text-secondary dark:text-z-text-secondary-dark">
                Has llegado al final.
            </div>
        )}
      </div>
    </main>
  );
};

export default Feed;
