
import React, { useState } from 'react';
import { Post } from '../types';
import { VideoIcon, PhotoIcon, SmileIcon } from './icons';

interface CreatePostProps {
  onAddPost: (post: Post) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onAddPost }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newPost: Post = {
      id: new Date().toISOString(),
      user: { name: 'Current User', avatarUrl: 'https://picsum.photos/id/1/200' },
      timestamp: 'Just now',
      content: input,
      likes: 0,
      commentsCount: 0,
      comments: [],
    };
    onAddPost(newPost);
    setInput('');
  };

  return (
    <div className="bg-z-bg-secondary rounded-xl shadow-md p-4">
      <div className="flex space-x-3">
        <img src="https://picsum.photos/id/1/200" alt="User Avatar" className="h-10 w-10 rounded-full" />
        <form onSubmit={handleSubmit} className="flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full bg-z-bg-primary rounded-full px-4 py-2.5 text-z-text-primary focus:outline-none placeholder:text-z-text-secondary"
          />
        </form>
      </div>
      <div className="border-t border-gray-200/80 mt-4 pt-3 flex justify-around">
        <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer w-1/3 justify-center">
          <VideoIcon className="h-7 w-7 text-red-500" />
          <span className="font-medium text-z-text-secondary">Live video</span>
        </div>
        <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer w-1/3 justify-center">
          <PhotoIcon className="h-7 w-7 text-green-500" />
          <span className="font-medium text-z-text-secondary">Photo/video</span>
        </div>
        <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer w-1/3 justify-center">
          <SmileIcon className="h-7 w-7 text-yellow-500" />
          <span className="font-medium text-z-text-secondary">Feeling/activity</span>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
