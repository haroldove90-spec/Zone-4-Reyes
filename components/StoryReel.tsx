
import React from 'react';
import { Story } from '../types';
import { PlusIcon } from './icons';

const stories: Story[] = [
  { id: '1', user: { name: 'Jane Smith', avatarUrl: 'https://picsum.photos/id/1025/200' }, imageUrl: 'https://picsum.photos/id/103/200/300' },
  { id: '2', user: { name: 'John Doe', avatarUrl: 'https://picsum.photos/id/1011/200' }, imageUrl: 'https://picsum.photos/id/104/200/300' },
  { id: '3', user: { name: 'Alice Johnson', avatarUrl: 'https://picsum.photos/id/1027/200' }, imageUrl: 'https://picsum.photos/id/105/200/300' },
  { id: '4', user: { name: 'Bob Williams', avatarUrl: 'https://picsum.photos/id/103/200' }, imageUrl: 'https://picsum.photos/id/106/200/300' },
  { id: '5', user: { name: 'Charlie Brown', avatarUrl: 'https://picsum.photos/id/1040/200' }, imageUrl: 'https://picsum.photos/id/107/200/300' },
];

const StoryCard: React.FC<{ story?: Story; isCreate?: boolean }> = ({ story, isCreate = false }) => {
  const currentUserAvatar = "https://picsum.photos/id/1/200/300";

  return (
    <div className="relative h-52 w-32 rounded-xl shadow-lg cursor-pointer overflow-hidden group">
      {isCreate ? (
        <>
          <img src={currentUserAvatar} alt="Create Story" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute bottom-0 w-full h-1/4 bg-z-bg-secondary text-center flex flex-col justify-end pb-2">
             <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-z-light-blue rounded-full flex items-center justify-center border-4 border-z-bg-secondary group-hover:bg-blue-600 transition-colors">
               <PlusIcon className="h-6 w-6 text-white" />
             </div>
             <span className="text-sm font-semibold text-z-text-primary">Create Story</span>
          </div>
        </>
      ) : (
        story && <>
          <img src={story.imageUrl} alt={story.user.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <img src={story.user.avatarUrl} alt={story.user.name} className="absolute top-3 left-3 h-9 w-9 rounded-full border-[3px] border-z-light-blue" />
          <span className="absolute bottom-2 left-0 right-0 px-2 text-white font-semibold text-sm truncate">{story.user.name}</span>
        </>
      )}
    </div>
  );
};

const StoryReel: React.FC = () => {
  return (
    <div className="py-6">
      <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide">
        <StoryCard isCreate={true} />
        {stories.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
    </div>
  );
};

export default StoryReel;
