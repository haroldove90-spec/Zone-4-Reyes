
import React from 'react';
import { Post as PostType } from '../types';
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
}

const Feed: React.FC<FeedProps> = ({ posts, onAddPost, loading }) => {
  return (
    <main className="flex-grow pt-14 lg:ml-20 xl:ml-80 lg:mr-72 overflow-x-hidden pb-20 md:pb-0">
      <div className="max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto px-4">
        <MobileSearch />
        <StoryReel />
        <div className="mb-6">
          <CreatePost onAddPost={onAddPost} />
        </div>
        {loading ? (
            <div className="text-center py-10 text-z-text-secondary">
                <Spinner />
                <p>Cargando publicaciones...</p>
            </div>
        ) : posts.length > 0 ? (
          posts.map((post, index) => (
            <React.Fragment key={post.id}>
              <Post post={post} index={index} />
              {/* Inyecta un anuncio simulado después de la segunda publicación */}
              {index === 1 && <AdPost />}
            </React.Fragment>
          ))
        ) : (
          <div className="text-center py-10 text-z-text-secondary">No hay publicaciones para mostrar.</div>
        )}
      </div>
    </main>
  );
};

export default Feed;
