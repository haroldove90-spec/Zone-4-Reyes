
import React, { useState, useRef, useEffect } from 'react';
import { Post as PostType, User, Media } from '../types';
import { ThumbsUpIcon, MessageSquareIcon, Share2Icon } from './icons';
import { useAuth } from '../contexts/AuthContext';
import ShareModal from './modals/ShareModal';

interface ReelItemProps {
  post: PostType;
  addNotification: (text: string, user: User, postContent?: string) => void;
  isVisible: boolean;
  onAddPost: (content: string, mediaFiles: File[], postType?: 'standard' | 'report', group?: { id: string; name: string; }, existingMedia?: Media[]) => Promise<void>;
}

const ReelItem: React.FC<ReelItemProps> = ({ post, addNotification, isVisible, onAddPost }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isVisible) {
      videoElement.play().catch(error => {
        console.warn("Video autoplay was prevented:", error);
      });
    } else {
      videoElement.pause();
      videoElement.currentTime = 0;
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
      videoRef.current?.play().catch(error => console.warn("Video play failed", error));
    } else {
      videoRef.current?.pause();
    }
  };

  const handleInternalShare = async (comment: string) => {
    if (!user) return;
    const authorName = post.fanpage?.name || post.user.name;
    const quotedContent = post.content.split('\n').map(line => `> ${line}`).join('\n');
    const sharedPostContent = `${comment}\n\n--- Reposteando el reel de **${authorName}** ---\n${quotedContent}`;

    try {
      await onAddPost(sharedPostContent, [], 'standard', undefined, post.media);
      addNotification(`reposteaste el reel de ${authorName}`, user, post.content);
      setIsShareModalOpen(false);
    } catch(err) {
      console.error("Error al repostear el reel:", err);
    }
  };

  const handleExternalShare = () => {
    const authorName = post.fanpage?.name || post.user.name;
    const shareText = `Mira este reel de ${authorName} en Zone4Reyes Social: ${post.content}`;
    const shareUrl = window.location.href.split('#')[0];

    if (navigator.share) {
      navigator.share({
        title: `Reel de ${authorName}`,
        text: shareText,
        url: shareUrl,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(`${shareText}\n\nVer en: ${shareUrl}`);
      alert('¡Enlace del reel copiado al portapapeles!');
    }
    setIsShareModalOpen(false);
  };

  return (
    <>
      <div className="relative h-full w-full">
        <video
          ref={videoRef}
          src={post.media?.[0]?.url}
          loop
          className="h-full w-full object-contain"
          onClick={handleVideoPress}
          playsInline
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
          <div className="flex flex-col items-center cursor-pointer" onClick={() => setIsShareModalOpen(true)}>
              <div className="p-3 bg-black/40 rounded-full">
                  <Share2Icon className="h-7 w-7" />
              </div>
              <span className="text-sm font-semibold">Compartir</span>
          </div>
        </div>
      </div>
      {isShareModalOpen && <ShareModal post={post} onClose={() => setIsShareModalOpen(false)} onInternalShare={handleInternalShare} onExternalShare={handleExternalShare} />}
    </>
  );
};

export default ReelItem;
