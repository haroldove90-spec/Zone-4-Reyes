import React, { useState, useRef } from 'react';
import { Post, Media } from '../types';
import { VideoIcon, PhotoIcon, SmileIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';

interface CreatePostProps {
  onAddPost: (post: Post) => void;
  postType?: 'standard' | 'report';
  placeholder?: string;
}

const CreatePost: React.FC<CreatePostProps> = ({ onAddPost, postType, placeholder }) => {
  const [input, setInput] = useState('');
  const [mediaPreviews, setMediaPreviews] = useState<Media[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setError(null);
      const newPreviews: Media[] = [];
      const filesToProcess = Array.from(files).slice(0, 4 - mediaPreviews.length);

      if (filesToProcess.length === 0) return;

      let filesRead = 0;
      // FIX: Explicitly type 'file' as 'File' to resolve type inference errors.
      filesToProcess.forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const type = file.type.startsWith('image/') ? 'image' : 'video';
          newPreviews.push({ type, url: reader.result as string });
          filesRead++;
          if (filesRead === filesToProcess.length) {
            setMediaPreviews(prev => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePreview = (url: string) => {
    setMediaPreviews(prev => prev.filter(item => item.url !== url));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && mediaPreviews.length === 0) {
      setError('No se puede crear una publicación vacía.');
      setTimeout(() => setError(null), 3000);
      return;
    }
    if (!user) return;

    const newPost: Post = {
      id: new Date().toISOString(),
      user: { name: user.name, avatarUrl: user.avatarUrl },
      timestamp: 'Justo ahora',
      content: input,
      media: mediaPreviews,
      likes: 0,
      commentsCount: 0,
      comments: [],
      // FIX: Use nullish coalescing operator to provide a default value for postType, ensuring type correctness.
      type: postType ?? 'standard',
    };
    onAddPost(newPost);
    setInput('');
    setMediaPreviews([]);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!user) return null;

  return (
    <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-xl shadow-md p-4">
      <form onSubmit={handleSubmit}>
        <div className="flex space-x-3 items-start">
          <img src={user.avatarUrl} alt="User Avatar" className="h-10 w-10 rounded-full" />
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (error) setError(null);
            }}
            placeholder={placeholder || `¿Qué estás pensando, ${user.name}?`}
            className={`w-full bg-z-bg-primary dark:bg-z-hover-dark rounded-2xl px-4 py-2.5 text-z-text-primary dark:text-z-text-primary-dark focus:outline-none placeholder:text-z-text-secondary dark:placeholder:text-z-text-secondary-dark hover:bg-gray-200 dark:hover:bg-z-bg-secondary-dark/60 transition-colors resize-none ${error ? 'ring-2 ring-red-500' : ''}`}
            rows={input || mediaPreviews.length > 0 ? 3 : 1}
          />
        </div>

        {mediaPreviews.length > 0 && (
          <div className="mt-3 grid gap-2 grid-cols-2 sm:grid-cols-4">
            {mediaPreviews.map((media) => (
              <div key={media.url} className="relative aspect-square">
                {media.type === 'image' ? (
                  <img src={media.url} alt="Vista previa" className="rounded-lg w-full h-full object-cover" />
                ) : (
                  <video src={media.url} className="rounded-lg w-full h-full object-cover" />
                )}
                <button type="button" onClick={() => removePreview(media.url)} className="absolute top-1 right-1 bg-gray-800/60 text-white rounded-full h-6 w-6 flex items-center justify-center font-bold text-lg hover:bg-gray-800 transition-colors">&times;</button>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        
        <div className="border-t border-gray-200/80 dark:border-z-border-dark mt-4 pt-3 flex justify-between items-center">
            <div className="flex">
                <input type="file" ref={fileInputRef} className="hidden" multiple accept="image/*,video/*" onChange={handleMediaSelect} />
                <div onClick={() => mediaPreviews.length < 4 && fileInputRef.current?.click()} className={`flex items-center space-x-2 p-2 rounded-lg ${mediaPreviews.length < 4 ? 'hover:bg-gray-100 dark:hover:bg-z-hover-dark cursor-pointer' : 'opacity-50 cursor-not-allowed'} justify-center transition-colors group`}>
                    <PhotoIcon className="h-7 w-7 text-green-500" />
                    <span className="font-medium text-z-text-secondary dark:text-z-text-secondary-dark group-hover:text-z-text-primary dark:group-hover:text-z-text-primary-dark hidden sm:inline transition-colors">Foto/Video</span>
                </div>
                <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-z-hover-dark cursor-pointer justify-center transition-colors group">
                    <SmileIcon className="h-7 w-7 text-yellow-500" />
                    <span className="font-medium text-z-text-secondary dark:text-z-text-secondary-dark group-hover:text-z-text-primary dark:group-hover:text-z-text-primary-dark hidden sm:inline transition-colors">Sentimiento</span>
                </div>
            </div>
            <button
                type="submit"
                disabled={!input.trim() && mediaPreviews.length === 0}
                className="bg-z-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-z-dark-blue transition-colors disabled:bg-gray-400 dark:disabled:bg-z-border-dark disabled:cursor-not-allowed"
                >
                Publicar
            </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;