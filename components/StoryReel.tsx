import React, { useState, useRef } from 'react';
import { Story } from '../types';
import { PlusIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';

const StorySkeleton: React.FC = () => {
  return (
    <div className="relative h-56 w-36 rounded-xl shadow-md bg-z-bg-secondary dark:bg-z-bg-secondary-dark flex-shrink-0 animate-pulse">
       <div className="h-full w-full bg-gray-200 dark:bg-z-hover-dark rounded-xl"></div>
    </div>
  );
};

const initialStories: Story[] = [
  { id: '1', user: { name: 'Jane Smith', avatarUrl: 'https://picsum.photos/id/1025/200' }, imageUrl: 'https://picsum.photos/id/103/200/300' },
  { id: '2', user: { name: 'John Doe', avatarUrl: 'https://picsum.photos/id/1011/200' }, imageUrl: 'https://picsum.photos/id/104/200/300' },
  { id: '3', user: { name: 'Alice Johnson', avatarUrl: 'https://picsum.photos/id/1027/200' }, imageUrl: 'https://picsum.photos/id/105/200/300' },
  { id: '4', user: { name: 'Bob Williams', avatarUrl: 'https://picsum.photos/id/103/200' }, imageUrl: 'https://picsum.photos/id/106/200/300' },
  { id: '5', user: { name: 'Charlie Brown', avatarUrl: 'https://picsum.photos/id/1040/200' }, imageUrl: 'https://picsum.photos/id/107/200/300' },
];

const StoryCard: React.FC<{ story?: Story; isCreate?: boolean; onClick?: () => void; }> = ({ story, isCreate = false, onClick }) => {
  const { user } = useAuth();
  const currentUserAvatar = user?.avatarUrl || "https://picsum.photos/id/1/200/300";

  return (
    <div onClick={onClick} className="relative h-56 w-36 rounded-xl shadow-md cursor-pointer overflow-hidden group flex-shrink-0 transition-transform duration-300 ease-in-out hover:scale-[1.03]">
      {isCreate ? (
        <div className="h-full w-full flex flex-col">
          <div className="h-3/5 w-full overflow-hidden">
            <img src={currentUserAvatar} alt="Crear Historia" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
          </div>
          <div className="h-2/5 w-full bg-z-bg-secondary dark:bg-z-bg-secondary-dark text-center flex flex-col justify-end pb-2 relative">
             <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-z-primary rounded-full flex items-center justify-center border-4 border-z-bg-secondary dark:border-z-bg-secondary-dark group-hover:bg-blue-600 transition-colors">
               <PlusIcon className="h-6 w-6 text-white" />
             </div>
             <span className="text-sm font-semibold text-z-text-primary dark:text-z-text-primary-dark">Crear historia</span>
          </div>
        </div>
      ) : (
        story && <>
          <img src={story.imageUrl} alt={story.user.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <img src={story.user.avatarUrl} alt={story.user.name} className="absolute top-3 left-3 h-9 w-9 rounded-full border-[3px] border-z-primary" loading="lazy" />
          <span className="absolute bottom-2 left-0 right-0 px-2 text-white font-semibold text-sm truncate">{story.user.name}</span>
        </>
      )}
    </div>
  );
};

interface StoryReelProps {
  loading?: boolean;
}

const StoryReel: React.FC<StoryReelProps> = ({ loading = false }) => {
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>(initialStories);
  const storyInputRef = useRef<HTMLInputElement>(null);

  const handleCreateStoryClick = () => {
    storyInputRef.current?.click();
  };

  const handleStoryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newStory: Story = {
          id: new Date().toISOString(),
          user: { name: user.name, avatarUrl: user.avatarUrl },
          imageUrl: reader.result as string,
        };
        setStories(prevStories => [newStory, ...prevStories]);
      };
      reader.readAsDataURL(file);
    }
    if (e.target) {
        e.target.value = '';
    }
  };


  return (
    <div className="py-6">
      <input
        type="file"
        ref={storyInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleStoryFileChange}
      />
      <div className="flex space-x-3 overflow-x-auto pb-4 -mx-4 px-4">
        {loading ? (
          <>
            <StorySkeleton />
            <StorySkeleton />
            <StorySkeleton />
            <StorySkeleton />
            <StorySkeleton />
          </>
        ) : (
          <>
            <StoryCard isCreate={true} onClick={handleCreateStoryClick} />
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default StoryReel;