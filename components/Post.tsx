
import React, { useState } from 'react';
import { Post as PostType, Comment as CommentType } from '../types';
import { ThumbsUpIcon, MessageSquareIcon, Share2Icon, MoreHorizontalIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';

interface PostProps {
  post: PostType;
  index: number;
}

const Comment: React.FC<{ comment: CommentType }> = ({ comment }) => (
    <div className="flex items-start space-x-2 mt-2">
        <img src={comment.user.avatarUrl} alt={comment.user.name} className="h-8 w-8 rounded-full" />
        <div className="bg-gray-100 dark:bg-z-hover-dark rounded-xl p-2 px-3 text-sm">
            <p className="font-bold text-z-text-primary dark:text-z-text-primary-dark">{comment.user.name}</p>
            <p className="text-z-text-primary dark:text-z-text-primary-dark">{comment.text}</p>
        </div>
    </div>
);

const Post: React.FC<PostProps> = ({ post, index }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [comments, setComments] = useState<CommentType[]>(post.comments);
  const [newComment, setNewComment] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const commentInputRef = React.useRef<HTMLInputElement>(null);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
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

  return (
    <div 
      className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-xl shadow-md my-6 border border-transparent dark:border-z-border-dark animate-slideInUp"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={post.user.avatarUrl} alt={post.user.name} className="h-10 w-10 rounded-full" />
            <div>
              <p className="font-bold text-z-text-primary dark:text-z-text-primary-dark">{post.user.name}</p>
              <p className="text-sm text-z-text-secondary dark:text-z-text-secondary-dark">{post.timestamp}</p>
            </div>
          </div>
          <div className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-z-hover-dark cursor-pointer transition-colors">
             <MoreHorizontalIcon className="h-6 w-6 text-z-text-secondary dark:text-z-text-secondary-dark" />
          </div>
        </div>
        <p className="my-3 text-z-text-primary dark:text-z-text-primary-dark text-[15px] leading-relaxed whitespace-pre-wrap">{post.content}</p>
      </div>

      {(post.imageUrl || post.imagePreviewUrl) && (
        <div className="bg-black">
          <img src={post.imagePreviewUrl || post.imageUrl} alt="Contenido de la publicación" className="w-full h-auto max-h-[70vh] object-contain" />
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
         <div onClick={handleLike} className={`flex-1 flex items-center justify-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-z-hover-dark cursor-pointer transition-colors group ${isLiked ? 'text-z-primary' : ''}`}>
            <ThumbsUpIcon className="h-6 w-6" />
            <span className={`font-medium group-hover:text-z-text-primary dark:group-hover:text-z-text-primary-dark transition-colors ${isLiked ? 'text-z-primary' : ''}`}>Me gusta</span>
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
            <img src={user?.avatarUrl} alt="Tu avatar" className="h-8 w-8 rounded-full" />
            <form onSubmit={handleAddComment} className="flex-1">
                 <input
                    ref={commentInputRef}
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escribe un comentario..."
                    className="w-full bg-z-bg-primary dark:bg-z-hover-dark rounded-full px-4 py-2 text-z-text-primary dark:text-z-text-primary-dark focus:outline-none placeholder:text-z-text-secondary dark:placeholder:text-z-text-secondary-dark"
                />
            </form>
        </div>
      </div>
    </div>
  );
};

export default Post;
