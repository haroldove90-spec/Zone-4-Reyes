
import React from 'react';
import { Post as PostType } from '../types';
import CreatePost from './CreatePost';
import Post from './Post';
import StoryReel from './StoryReel';
import MobileSearch from './MobileSearch';
import AdPost from './AdPost';

interface FeedProps {
    posts: PostType[];
    onAddPost: (post: PostType) => void;
}

const Feed: React.FC<FeedProps> = ({ posts, onAddPost }) => {
  return (
    <main className="flex-grow pt-14 lg:ml-20 xl:ml-80 lg:mr-72 overflow-x-hidden pb-20 md:pb-0">
      <div className="max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto px-4">
        <MobileSearch />
        <StoryReel />
        <div className="mb-6">
          <CreatePost onAddPost={onAddPost} />
        </div>
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <React.Fragment key={post.id}>
              <Post post={post} index={index} />
              {/* Inyecta un anuncio simulado después de la segunda publicación */}
              {index === 1 && <AdPost />}
            </React.Fragment>
          ))
        ) : (
          <div className="text-center py-10 text-z-text-secondary">Cargando publicaciones...</div>
        )}
      </div>
    </main>
  );
};

export default Feed;
