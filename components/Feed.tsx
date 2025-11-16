import React from 'react';
import { Post as PostType } from '../types';
import CreatePost from './CreatePost';
import Post from './Post';
import StoryReel from './StoryReel';

interface FeedProps {
    posts: PostType[];
    onAddPost: (post: PostType) => void;
}

const Feed: React.FC<FeedProps> = ({ posts, onAddPost }) => {
  return (
    <main className="flex-grow pt-14 lg:ml-20 xl:ml-80 lg:mr-72 overflow-x-hidden">
      <div className="max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto px-4">
        <StoryReel />
        <div className="mb-6">
          <CreatePost onAddPost={onAddPost} />
        </div>
        {posts.length > 0 ? (
          posts.map((post) => <Post key={post.id} post={post} />)
        ) : (
          <div className="text-center py-10 text-z-text-secondary">Loading posts...</div>
        )}
      </div>
    </main>
  );
};

export default Feed;