
import React, { useState } from 'react';
import { Post as PostType, Comment as CommentType, User } from '../types';
import { 
    ThumbsUpIcon, MessageSquareIcon, Share2Icon, MoreHorizontalIcon,
    ThumbsDownIcon, LaughIcon, WowIcon, AngryIcon, SendIcon 
} from './icons';
import { useAuth } from '../contexts/AuthContext';

const reactions = [
    { name: 'Me gusta', icon: ThumbsUpIcon, color: 'text-z-primary', textColor: 'text-z-primary' },
    { name: 'No me gusta', icon: ThumbsDownIcon, color: 'text-red-500', textColor: 'text-red-500' },
    { name: 'Me divierte', icon: LaughIcon, color: 'text-yellow-500', textColor: 'text-yellow-500' },
    { name: 'Me asombra', icon: WowIcon, color: 'text-yellow-500', textColor: 'text-yellow-500' },
    { name: 'Me enoja', icon: AngryIcon, color: 'text-red-500', textColor: 'text-red-500' }
];

interface PostProps {
  post: PostType;
  index: number;
  addNotification: (text: string, user: User, postContent?: string) => void;
}

const Comment: React.FC<{ comment: CommentType }> = ({ comment }) => (
    <div className="flex items-start space-x-2 mt-2">
        <img src={comment.user.avatarUrl} alt={comment.user.name} className="h-8 w-8 rounded-full" loading="lazy" />
        <div className="bg-gray-100 dark:bg-z-hover-dark rounded-xl p-2 px-3 text-sm">
            <p className="font-bold text-z-text-primary dark:text-z-text-primary-dark">{comment.user.name}</p>
            <p className="text-z-text-primary dark:text-z-text-primary-dark">{comment.text}</p>
        </div>
    </div>
);

const Post: React.FC<PostProps> = ({ post, index, addNotification }) => {
  const { user } = useAuth();
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [comments, setComments] = useState<CommentType[]>(post.comments);
  const [newComment, setNewComment] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const commentInputRef = React.useRef<HTMLInputElement>(null);
  // FIX: Replaced `NodeJS.Timeout` with `number` and used `useRef` to persist the timeout ID across re-renders.
  const reactionTimeout = React.useRef<number>();
  
  const mediaCount = post.media?.length || 0;

  const handleReactionSelect = (reactionName: string) => {
    if (selectedReaction === reactionName) {
      // User is deselecting the reaction
      setSelectedReaction(null);
      setLikeCount(prev => prev - 1);
    } else {
      // New reaction or changing reaction
      if (!selectedReaction) {
        setLikeCount(prev => prev + 1);
      }
      setSelectedReaction(reactionName);
      if(user) {
        addNotification(`ha reaccionado a la publicación de ${post.user.name}`, user, post.content);
      }
    }
    setShowReactions(false);
  };
  
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    const commentToAdd: CommentType = {
        id: new Date().toISOString(),
        user: { name: user.name, avatarUrl: user.avatarUrl },
        text: newComment,
        timestamp: 'Justo ahora'
    };
    setComments(prev => [...prev, commentToAdd]);
    setNewComment('');
    addNotification(`ha comentado la publicación de ${post.user.name}: "${newComment}"`, user, post.content);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Publicación de ${post.user.name}`,
        text: post.content,
        url: window.location.href,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
    } else {
      alert('¡Publicación compartida! (Simulación)');
    }
  };

  const displayedComments = showAllComments ? comments : comments.slice(0, 2);
  const currentReaction = reactions.find(r => r.name === selectedReaction);
  const ReactionIcon = currentReaction?.icon || ThumbsUpIcon;

  return (
    <div 
      className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-xl shadow-md my-6 border border-transparent dark:border-z-border-dark animate-slideInUp"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={post.user.avatarUrl} alt={post.user.name} className="h-10 w-10 rounded-full" loading="lazy" />
            <div>
              <p className="font-bold text-z-text-primary dark:text-z-text-primary-dark">{post.user.name}</p>
              <p className="text-sm text-z-text-secondary dark:text-z-text-secondary-dark">{post.timestamp}</p>
            </div>
          </div>
          <div className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-z-hover-dark cursor-pointer transition-colors">
             <MoreHorizontalIcon className="h-6 w-6 text-z-text-secondary dark:text-z-text-secondary-dark" />
          </div>
        </div>
        {post.content && <p className="my-3 text-z-text-primary dark:text-z-text-primary-dark text-[15px] leading-relaxed whitespace-pre-wrap">{post.content}</p>}
      </div>

      {(post.media && mediaCount > 0) && (
        <div className="my-3 -mx-4 sm:mx-0">
            {mediaCount === 1 ? (
                <div className="bg-black">
                    {post.media[0].type === 'image' ? (
                        <img src={post.media[0].url} alt="Contenido de la publicación" className="w-full h-auto max-h-[70vh] object-contain" loading="lazy" />
                    ) : (
                        <video src={post.media[0].url} controls className="w-full h-auto max-h-[70vh] object-contain" />
                    )}
                </div>
            ) : (
                <div className={`grid gap-0.5 ${mediaCount > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    {post.media.slice(0, 4).map((media, index) => (
                        <div key={index} className="relative bg-black aspect-square">
                            {media.type === 'image' ? (
                                <img src={media.url} alt={`Contenido ${index + 1}`} className="w-full h-full object-cover" loading="lazy" />
                            ) : (
                                <video src={media.url} controls className="w-full h-full object-cover" />
                            )}
                            {mediaCount > 4 && index === 3 && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-2xl font-bold">
                                    +{mediaCount - 4}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
      )}

      <div className="p-2 px-4 flex justify-between items-center text-z-text-secondary dark:text-z-text-secondary-dark">
         <div className="flex items-center space-x-1">
            <div className="p-1 bg-z-light-blue rounded-full">
                <ThumbsUpIcon className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm">{likeCount}</span>
         </div>
         {comments.length > 0 && <span className="text-sm hover:underline cursor-pointer" onClick={() => setShowAllComments(!showAllComments)}>{comments.length} comentarios</span>}
      </div>

      <div className="border-t border-gray-200/80 dark:border-z-border-dark mx-4 my-1"></div>

      <div className="p-1 flex justify-around text-z-text-secondary dark:text-z-text-secondary-dark">
         <div 
            className="relative flex-1"
            onMouseEnter={() => { clearTimeout(reactionTimeout.current); setShowReactions(true); }}
            onMouseLeave={() => { reactionTimeout.current = window.setTimeout(() => setShowReactions(false), 300); }}
         >
            {showReactions && (
                <div 
                  className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-full shadow-lg p-1.5 flex space-x-2 border dark:border-z-border-dark animate-fadeIn"
                  style={{animationDuration: '0.15s'}}
                >
                    {reactions.map(r => (
                        <div key={r.name} onClick={() => handleReactionSelect(r.name)} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-z-hover-dark cursor-pointer transform hover:scale-125 transition-transform">
                            <r.icon className={`h-7 w-7 ${r.color}`} />
                        </div>
                    ))}
                </div>
            )}
            <div onClick={() => handleReactionSelect('Me gusta')} className={`flex items-center justify-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-z-hover-dark cursor-pointer transition-colors group ${currentReaction ? currentReaction.textColor : ''}`}>
                <ReactionIcon className="h-6 w-6" />
                <span className={`font-medium group-hover:text-z-text-primary dark:group-hover:text-z-text-primary-dark transition-colors ${currentReaction ? currentReaction.textColor : ''}`}>{selectedReaction || 'Me gusta'}</span>
            </div>
         </div>
         <div onClick={() => commentInputRef.current?.focus()} className="flex-1 flex items-center justify-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-z-hover-dark cursor-pointer transition-colors group">
            <MessageSquareIcon className="h-6 w-6" />
            <span className="font-medium group-hover:text-z-text-primary dark:group-hover:text-z-text-primary-dark transition-colors">Comentar</span>
         </div>
         <div onClick={handleShare} className="flex-1 flex items-center justify-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-z-hover-dark cursor-pointer transition-colors group">
            <Share2Icon className="h-6 w-6" />
            <span className="font-medium group-hover:text-z-text-primary dark:group-hover:text-z-text-primary-dark transition-colors">Compartir</span>
         </div>
      </div>
      
      {comments.length > 0 && <div className="border-t border-gray-200/80 dark:border-z-border-dark mx-4 mt-1"></div>}
      
      <div className="p-4 pt-2">
        {displayedComments.map(comment => <Comment key={comment.id} comment={comment}/>)}
        {comments.length > 2 && (
            <button onClick={() => setShowAllComments(!showAllComments)} className="text-sm font-semibold text-z-text-secondary dark:text-z-text-secondary-dark mt-2 hover:underline">
                {showAllComments ? 'Mostrar menos comentarios' : `Ver ${comments.length - 2} comentarios más`}
            </button>
        )}
        <div className="flex items-center space-x-2 mt-4">
            <img src={user?.avatarUrl} alt="Tu avatar" className="h-8 w-8 rounded-full" loading="lazy" />
            <form onSubmit={handleAddComment} className="flex-1 relative flex items-center">
                 <input
                    ref={commentInputRef}
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escribe un comentario..."
                    className="w-full bg-z-bg-primary dark:bg-z-hover-dark rounded-full pl-4 pr-10 py-2 text-z-text-primary dark:text-z-text-primary-dark focus:outline-none placeholder:text-z-text-secondary dark:placeholder:text-z-text-secondary-dark"
                />
                {newComment && (
                    <button type="submit" className="absolute right-2 text-z-primary hover:text-z-dark-blue p-1 rounded-full transition-colors">
                        <SendIcon className="w-5 h-5" />
                    </button>
                )}
            </form>
        </div>
      </div>
    </div>
  );
};

export default Post;