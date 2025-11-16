
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
    <main className="w-full md:w-3/5 lg:w-2/5 max-w-2xl mx-auto pt-6 px-2">
      <StoryReel />
      <div className="mb-6">
        <CreatePost onAddPost={onAddPost} />
      </div>
      {posts.length > 0 ? (
        posts.map((post) => <Post key={post.id} post={post} />)
      ) : (
        <div className="text-center py-10 text-z-text-secondary">Loading posts...</div>
      )}
    </main>
  );
};

export default Feed;
