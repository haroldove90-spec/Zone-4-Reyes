
import React, { useState, useRef, useEffect } from 'react';
import { Post as PostType, User } from '../types';
import { ThumbsUpIcon, MessageSquareIcon, Share2Icon } from './icons';
import { useAuth } from '../contexts/AuthContext';

interface ReelItemProps {
  post: PostType;
  addNotification: (text: string, user: User, postContent?: string) => void;
  isVisible: boolean;
}

const ReelItem: React.FC<ReelItemProps> = ({ post, addNotification, isVisible }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (isVisible) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
      videoRef.current?.currentTime(0);
    }
  }, [isVisible]);
  
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
    if (!isLiked && user) {
        addNotification(`le ha gustado tu reel`, user, post.content);
    }
  };

  const handleVideoPress = () => {
    if (videoRef.current?.paused) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  };

  return (
    <div className="relative h-full w-full max-w-md mx-auto">
      <video
        ref={videoRef}
        src={post.media?.[0]?.url}
        loop
        className="h-full w-full object-contain"
        onClick={handleVideoPress}
      />
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white">
        <div className="flex items-center space-x-3 mb-2">
            <img src={post.user.avatarUrl} alt={post.user.name} className="h-10 w-10 rounded-full border-2 border-white" />
            <p className="font-bold">{post.user.name}</p>
        </div>
        <p className="text-sm">{post.content}</p>
      </div>
      <div className="absolute bottom-20 right-2 flex flex-col items-center space-y-5 text-white">
        <div className="flex flex-col items-center cursor-pointer" onClick={handleLike}>
            <div className={`p-3 rounded-full transition-colors ${isLiked ? 'bg-z-primary' : 'bg-black/40'}`}>
                <ThumbsUpIcon className="h-7 w-7" />
            </div>
            <span className="text-sm font-semibold">{likes}</span>
        </div>
        <div className="flex flex-col items-center cursor-pointer">
            <div className="p-3 bg-black/40 rounded-full">
                <MessageSquareIcon className="h-7 w-7" />
            </div>
            <span className="text-sm font-semibold">{post.commentsCount}</span>
        </div>
        <div className="flex flex-col items-center cursor-pointer">
            <div className="p-3 bg-black/40 rounded-full">
                <Share2Icon className="h-7 w-7" />
            </div>
        </div>
      </div>
    </div>
  );
};

export default ReelItem;
