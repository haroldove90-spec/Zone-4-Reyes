import React, { useState, useEffect } from 'react';
import { Post as PostType, Comment as CommentType, User } from '../types';
import { 
    ThumbsUpIcon, MessageSquareIcon, Share2Icon, MoreHorizontalIcon,
    ThumbsDownIcon, LaughIcon, WowIcon, AngryIcon, SendIcon 
} from './icons';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseClient';

export const PostSkeleton: React.FC = () => (
  <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-xl shadow-md my-6 p-4 animate-pulse">
    {/* Header */}
    <div className="flex items-center space-x-3">
      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-z-hover-dark"></div>
      <div>
        <div className="h-4 w-32 bg-gray-200 dark:bg-z-hover-dark rounded"></div>
        <div className="h-3 w-24 bg-gray-200 dark:bg-z-hover-dark rounded mt-1.5"></div>
      </div>
    </div>

    {/* Content */}
    <div className="my-4 space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-z-hover-dark rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-z-hover-dark rounded w-5/6"></div>
    </div>

    {/* Media */}
    <div className="aspect-video bg-gray-200 dark:bg-z-hover-dark rounded-lg"></div>

     {/* Actions */}
    <div className="border-t border-gray-200/80 dark:border-z-border-dark mx-4 my-1 mt-4"></div>
    <div className="p-1 flex justify-around mt-1">
        <div className="h-8 w-24 bg-gray-200 dark:bg-z-hover-dark rounded-lg"></div>
        <div className="h-8 w-24 bg-gray-200 dark:bg-z-hover-dark rounded-lg"></div>
        <div className="h-8 w-24 bg-gray-200 dark:bg-z-hover-dark rounded-lg"></div>
    </div>
  </div>
);


const reactions = [
    { name: 'Me gusta', icon: ThumbsUpIcon, color: 'text-z-primary', textColor: 'text-z-primary' },
    { name: 'Me divierte', icon: LaughIcon, color: 'text-yellow-500', textColor: 'text-yellow-500' },
    { name: 'Me sorprende', icon: WowIcon, color: 'text-yellow-400', textColor: 'text-yellow-400' },
    { name: 'Me enoja', icon: AngryIcon, color: 'text-red-500', textColor: 'text-red-500' },
    { name: 'No me gusta', icon: ThumbsDownIcon, color: 'text-z-text-secondary dark:text-z-text-secondary-dark', textColor: 'text-z-text-secondary dark:text-z-text-secondary-dark' },
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
  const [currentReaction, setCurrentReaction] = useState<string | null>(null);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentsCount, setCommentsCount] = useState(0);

  const [newComment, setNewComment] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const commentInputRef = React.useRef<HTMLInputElement>(null);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  
  const mediaCount = post.media?.length || 0;
  const author = post.fanpage || post.user;
  
  useEffect(() => {
    const fetchPostDetails = async () => {
        // Fetch likes
        const { count: likesData, error: likesError } = await supabase
            .from('likes')
            .select('*', { count: 'exact' })
            .eq('post_id', post.id);

        if (likesData !== null) setLikeCount(likesData);

        if(user) {
             const { data: userReaction, error: userReactionError } = await supabase
                .from('likes')
                .select('reaction_type')
                .eq('post_id', post.id)
                .eq('user_id', user.id)
                .maybeSingle();

            if(userReaction) {
                setCurrentReaction(userReaction.reaction_type);
            }
        }

        // Fetch comments
        const { data: commentsData, count: commentsCountData, error: commentsError } = await supabase
            .from('comments')
            .select('*, profile:profiles(id, name, avatar_url)', { count: 'exact' })
            .eq('post_id', post.id)
            .order('created_at', { ascending: true });

        if (commentsData) {
            const formattedComments: CommentType[] = commentsData.map((c: any) => {
                const commentUser = c.profile 
                    ? { id: c.profile.id, name: c.profile.name, avatarUrl: c.profile.avatar_url } 
                    : { id: 'unknown', name: 'Usuario Desconocido', avatarUrl: 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg' };
                
                return {
                    id: c.id,
                    text: c.text,
                    timestamp: new Date(c.created_at).toLocaleString(),
                    user: commentUser
                };
            });
            setComments(formattedComments);
        }
        if (commentsCountData !== null) setCommentsCount(commentsCountData);
    };

    fetchPostDetails();
  }, [post.id, user]);


  const handleReaction = async (reactionName: string) => {
    if (!user) return;
    setShowReactionPicker(false);

    const isUnreacting = currentReaction === reactionName;

    if (isUnreacting) {
        // Un-react
        const { error } = await supabase
            .from('likes')
            .delete()
            .eq('post_id', post.id)
            .eq('user_id', user.id);
        
        if (!error) {
            setCurrentReaction(null);
            setLikeCount(prev => prev - 1);
        }
    } else if (currentReaction) {
        // Change reaction
        const { error } = await supabase
            .from('likes')
            .update({ reaction_type: reactionName })
            .eq('post_id', post.id)
            .eq('user_id', user.id);
        
        if (!error) {
            setCurrentReaction(reactionName);
            addNotification(`ha reaccionado a la publicación de ${author.name}`, user, post.content);
        }
    } else {
        // New reaction
        const { error } = await supabase
            .from('likes')
            .insert({ post_id: post.id, user_id: user.id, reaction_type: reactionName });

        if (!error) {
            setCurrentReaction(reactionName);
            setLikeCount(prev => prev + 1);
            addNotification(`ha reaccionado a la publicación de ${author.name}`, user, post.content);
        }
    }
  };
  
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    const { data, error } = await supabase
        .from('comments')
        .insert({ post_id: post.id, user_id: user.id, text: newComment })
        .select('*, profile:profiles(id, name, avatar_url)')
        .single();
    
    if (!error && data) {
         const commentToAdd: CommentType = {
            id: data.id,
            user: { id: data.profile.id, name: data.profile.name, avatarUrl: data.profile.avatar_url },
            text: data.text,
            timestamp: new Date(data.created_at).toLocaleString()
        };
        setComments(prev => [...prev, commentToAdd]);
        setCommentsCount(prev => prev + 1);
        setNewComment('');
        addNotification(`ha comentado la publicación de ${author.name}: "${newComment}"`, user, post.content);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Publicación de ${author.name}`,
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
  const selectedReaction = reactions.find(r => r.name === currentReaction);
  const ReactionIcon = selectedReaction?.icon || ThumbsUpIcon;

  return (
    <div 
      className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-xl shadow-md my-6 border border-transparent dark:border-z-border-dark animate-slideInUp"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={author.avatarUrl} alt={author.name} className="h-10 w-10 rounded-full" loading="lazy" />
            <div>
              <p className="font-bold text-z-text-primary dark:text-z-text-primary-dark">{author.name}</p>
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
            {likeCount > 0 && <>
                <div className="p-1 bg-z-light-blue rounded-full">
                    <ThumbsUpIcon className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm">{likeCount}</span>
            </>}
         </div>
         {commentsCount > 0 && <span className="text-sm hover:underline cursor-pointer" onClick={() => setShowAllComments(!showAllComments)}>{commentsCount} comentarios</span>}
      </div>

      <div className="border-t border-gray-200/80 dark:border-z-border-dark mx-4 my-1"></div>

      <div className="p-1 flex justify-around text-z-text-secondary dark:text-z-text-secondary-dark">
         <div 
            className="relative flex-1"
            onMouseEnter={() => setShowReactionPicker(true)}
            onMouseLeave={() => setShowReactionPicker(false)}
         >
            {showReactionPicker && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 flex space-x-1 bg-z-bg-secondary dark:bg-z-bg-secondary-dark p-1.5 rounded-full shadow-lg border dark:border-z-border-dark animate-fadeIn" style={{ animationDuration: '0.2s' }}>
                    {reactions.map(reaction => (
                        <div key={reaction.name} onClick={() => handleReaction(reaction.name)} className="cursor-pointer transform hover:scale-125 transition-transform p-1" title={reaction.name}>
                            <reaction.icon className={`h-8 w-8 ${reaction.color}`} />
                        </div>
                    ))}
                </div>
            )}
            <div onClick={() => handleReaction(currentReaction || 'Me gusta')} className={`flex items-center justify-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-z-hover-dark cursor-pointer transition-colors group ${selectedReaction ? selectedReaction.textColor : ''}`}>
                <ReactionIcon className="h-6 w-6" />
                <span className={`font-medium group-hover:text-z-text-primary dark:group-hover:text-z-text-primary-dark transition-colors ${selectedReaction ? selectedReaction.textColor : ''}`}>{selectedReaction ? selectedReaction.name : 'Me gusta'}</span>
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