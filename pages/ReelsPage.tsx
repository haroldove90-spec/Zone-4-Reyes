

import React, { useState } from 'react';
import { Post, User, Media } from '../types';
import ReelItem from '../components/ReelItem';

interface ReelsPageProps {
  reels: Post[];
  addNotification: (recipientId: string, text: string, postId?: string) => Promise<void>;
  onAddPost: (content: string, mediaFiles: File[], postType?: 'standard' | 'report', group?: { id: string; name: string }, existingMedia?: Media[]) => Promise<void>;
}

const ReelsPage: React.FC<ReelsPageProps> = ({ reels, addNotification, onAddPost }) => {
  const [currentReelIndex, setCurrentReelIndex] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight } = e.currentTarget;
    const newIndex = Math.round(scrollTop / clientHeight);
    if (newIndex !== currentReelIndex) {
      setCurrentReelIndex(newIndex);
    }
  };

  return (
    <main className="h-screen w-screen bg-black overflow-y-auto snap-y snap-mandatory" onScroll={handleScroll}>
      {reels.map((reel, index) => (
        <div key={reel.id} className="h-full w-full snap-start flex items-center justify-center">
          <ReelItem 
            post={reel} 
            addNotification={addNotification} 
            isVisible={index === currentReelIndex}
            onAddPost={onAddPost}
          />
        </div>
      ))}
    </main>
  );
};

export default ReelsPage;