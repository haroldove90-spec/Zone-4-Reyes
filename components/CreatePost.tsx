
import React, { useState, useRef } from 'react';
import { Post } from '../types';
import { VideoIcon, PhotoIcon, SmileIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';

interface CreatePostProps {
  onAddPost: (post: Post) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onAddPost }) => {
  const [input, setInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !imagePreview) || !user) return;

    const newPost: Post = {
      id: new Date().toISOString(),
      user: { name: user.name, avatarUrl: user.avatarUrl },
      timestamp: 'Justo ahora',
      content: input,
      imagePreviewUrl: imagePreview || undefined,
      likes: 0,
      commentsCount: 0,
      comments: [],
    };
    onAddPost(newPost);
    setInput('');
    setImagePreview(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  if (!user) return null;

  return (
    <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-xl shadow-md p-4">
      <div className="flex space-x-3 items-start">
        <img src={user.avatarUrl} alt="User Avatar" className="h-10 w-10 rounded-full" />
        <form onSubmit={handleSubmit} className="flex-1">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`¿Qué estás pensando, ${user.name}?`}
            className="w-full bg-z-bg-primary dark:bg-z-hover-dark rounded-2xl px-4 py-2.5 text-z-text-primary dark:text-z-text-primary-dark focus:outline-none placeholder:text-z-text-secondary dark:placeholder:text-z-text-secondary-dark hover:bg-gray-200 dark:hover:bg-z-bg-secondary-dark/60 transition-colors resize-none"
            rows={input || imagePreview ? 3 : 1}
          />
           {imagePreview && (
            <div className="mt-3 relative">
              <img src={imagePreview} alt="Vista previa" className="rounded-lg w-full" />
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="absolute top-2 right-2 bg-gray-800/50 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold text-xl hover:bg-gray-800"
              >
                &times;
              </button>
            </div>
          )}
          <button type="submit" className="hidden">Submit</button>
        </form>
      </div>
      <div className="border-t border-gray-200/80 dark:border-z-border-dark mt-4 pt-3 flex justify-around">
        <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-z-hover-dark cursor-pointer w-1/3 justify-center transition-colors group">
          <VideoIcon className="h-7 w-7 text-red-500" />
          <span className="font-medium text-z-text-secondary dark:text-z-text-secondary-dark group-hover:text-z-text-primary dark:group-hover:text-z-text-primary-dark hidden sm:inline transition-colors">Video en vivo</span>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageSelect}
        />
        <div onClick={() => fileInputRef.current?.click()} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-z-hover-dark cursor-pointer w-1/3 justify-center transition-colors group">
          <PhotoIcon className="h-7 w-7 text-green-500" />
          <span className="font-medium text-z-text-secondary dark:text-z-text-secondary-dark group-hover:text-z-text-primary dark:group-hover:text-z-text-primary-dark hidden sm:inline transition-colors">Foto/video</span>
        </div>
        <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-z-hover-dark cursor-pointer w-1/3 justify-center transition-colors group">
          <SmileIcon className="h-7 w-7 text-yellow-500" />
          <span className="font-medium text-z-text-secondary dark:text-z-text-secondary-dark group-hover:text-z-text-primary dark:group-hover:text-z-text-primary-dark hidden sm:inline transition-colors">Sentimiento/actividad</span>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
