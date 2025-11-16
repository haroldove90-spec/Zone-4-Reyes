
import React, { useState } from 'react';
import { Post, User } from '../types';
import ReelItem from '../components/ReelItem';

interface ReelsPageProps {
  reels: Post[];
  addNotification: (text: string, user: User, postContent?: string) => void;
}

const ReelsPage: React.FC<ReelsPageProps> = ({ reels, addNotification }) => {
  const [currentReelIndex, setCurrentReelIndex] = useState(0);

  // In a real app, you'd have more sophisticated logic for scrolling and loading.
  // This is a simplified version for demonstration.
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
          />
        </div>
      ))}
    </main>
  );
};

export default ReelsPage;
