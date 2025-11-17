

import React, { useState, useEffect } from 'react';
import { Post as PostType, Comment as CommentType, User, Media } from '../types';
import { 
    ThumbsUpIcon, MessageSquareIcon, Share2Icon, MoreHorizontalIcon, SendIcon 
} from './icons';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseClient';
import ShareModal from './modals/ShareModal';

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


interface PostProps {
  post: PostType;
  index: number;
  addNotification: (recipientId: string, text: string, postId?: string) => Promise<void>;
  onAddPost: (content: string, mediaFiles: File[], postType?: 'standard' | 'report', options?: { group?: { id: string; name: string; }; fanpageId?: string; }, existingMedia?: Media[]) => Promise<void>;
  navigate: (path: string) => void;
}

const Comment: React.FC<{ comment: CommentType; navigate: (path: string) => void; }> = ({ comment, navigate }) => (
    <div className="flex items-start space-x-2 mt-2">
        <img src={comment.user.avatarUrl} alt={comment.user.name} className="h-8 w-8 rounded-full cursor-pointer" loading="lazy" onClick={() => navigate(`profile/${comment.user.id}`)} />
        <div className="bg-gray-100 dark:bg-z-hover-dark rounded-xl p-2 px-3 text-sm">
            <p className="font-bold text-z-text-primary dark:text-z-text-primary-dark cursor-pointer hover:underline" onClick={() => navigate(`profile/${comment.user.id}`)}>{comment.user.name}</p>
            <p className="text-z-text-primary dark:text-z-text-primary-dark">{comment.text}</p>
        </div>
    </div>
);

const Post: React.FC<PostProps> = ({ post, index, addNotification, onAddPost, navigate }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentsCount, setCommentsCount] = useState(0);
  const [allCommentsLoaded, setAllCommentsLoaded] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const [newComment, setNewComment] = useState('');
  const commentInputRef = React.useRef<HTMLInputElement>(null);
  
  const mediaCount = post.media?.length || 0;
  const author = post.fanpage || post.user;
  const authorId = post.fanpage ? post.user.id : author.id; // The user ID of the author, regardless of fanpage

  const formatComment = (c: any): CommentType => {
      const commentUser = c.profiles 
          ? { id: c.profiles.id, name: c.profiles.name, avatarUrl: c.profiles.avatar_url } 
          : { id: 'unknown', name: 'Usuario Desconocido', avatarUrl: 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg' };
      
      return {
          id: c.id,
          text: c.text,
          timestamp: new Date(c.created_at).toLocaleString(),
          user: commentUser
      };
  };
  
  useEffect(() => {
    const fetchPostDetails = async () => {
        try {
            // Fetch likes
            const { count: likesData, error: likesError } = await supabase
                .from('likes')
                .select('*', { count: 'exact' })
                .eq('post_id', post.id);
    
            if (likesError) throw likesError;
            if (likesData !== null) setLikeCount(likesData);
    
            if(user) {
                 const { data: userLike, error: userLikeError } = await supabase
                    .from('likes')
                    .select('*')
                    .eq('post_id', post.id)
                    .eq('user_id', user.id)
                    .maybeSingle();
    
                if (userLikeError) throw userLikeError;
                if(userLike) {
                    setIsLiked(true);
                }
            }
    
            // Fetch initial comments (latest 2)
            const { data: commentsData, count: commentsCountData, error: commentsError } = await supabase
                .from('comments')
                .select('*, profiles!user_id(id, name, avatar_url)', { count: 'exact' })
                .eq('post_id', post.id)
                .order('created_at', { ascending: false })
                .limit(2);
    
            if (commentsError) throw commentsError;
            if (commentsData) {
                const formattedComments: CommentType[] = commentsData.map(formatComment).reverse();
                setComments(formattedComments);
            }
            if (commentsCountData !== null) {
                setCommentsCount(commentsCountData);
                 if (commentsData && commentsCountData <= commentsData.length) {
                    setAllCommentsLoaded(true);
                }
            }
        } catch (error) {
            console.error(`Error fetching details for post ${post.id}:`, (error as any).message || error);
        }
    };

    fetchPostDetails();
  }, [post.id, user]);


  const handleLoadAllComments = async () => {
    if (allCommentsLoaded) return;
    try {
        const { data: commentsData, error: commentsError } = await supabase
            .from('comments')
            .select('*, profiles!user_id(id, name, avatar_url)')
            .eq('post_id', post.id)
            .order('created_at', { ascending: true });
        
        if (commentsError) throw commentsError;
        if (commentsData) {
            setComments(commentsData.map(formatComment));
            setAllCommentsLoaded(true);
        }
    } catch (error) {
        console.error("Error fetching all comments:", error);
    }
  };


  const handleLike = async () => {
    if (!user) return;
    const originalIsLiked = isLiked;

    // Optimistic UI update
    setIsLiked(!originalIsLiked);
    setLikeCount(prev => originalIsLiked ? prev - 1 : prev + 1);

    try {
        if (originalIsLiked) {
            // Unlike
            const { error } = await supabase
                .from('likes')
                .delete()
                .eq('post_id', post.id)
                .eq('user_id', user.id);
            
            if (error) throw error;
        } else {
            // Like
            const { error } = await supabase
                .from('likes')
                .insert([{ post_id: post.id, user_id: user.id }]);

            if (error) throw error;
            
            if(user.id !== authorId) {
                addNotification(authorId, `le ha gustado tu publicación`, post.id);
            }
        }
    } catch (error) {
        console.error("Error handling like:", error);
        // Revert UI on error
        setIsLiked(originalIsLiked);
        setLikeCount(prev => originalIsLiked ? prev + 1 : prev - 1);
    }
  };
  
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    try {
        const { data, error } = await supabase
            .from('comments')
            .insert([{ post_id: post.id, user_id: user.id, text: newComment }])
            .select('*, profiles!user_id(id, name, avatar_url)')
            .single();
        
        if (error) throw error;
        
        if (data) {
             const commentToAdd = formatComment(data);
            setComments(prev => [...prev, commentToAdd]);
            setCommentsCount(prev => prev + 1);
            setNewComment('');
            if(user.id !== authorId) {
                 addNotification(authorId, `ha comentado tu publicación: "${newComment}"`, post.id);
            }
        }
    } catch (error) {
        console.error("Error adding comment:", error);
    }
  };

  const handleInternalShare = async (comment: string) => {
    if (!user) return;
    const authorName = post.fanpage?.name || post.user.name;
    const quotedContent = post.content.split('\n').map(line => `> ${line}`).join('\n');
    const sharedPostContent = `${comment}\n\n--- Reposteando de **${authorName}** ---\n${quotedContent}`;

    try {
        await onAddPost(sharedPostContent, [], 'standard', undefined, post.media);
        if(user.id !== authorId) {
            addNotification(authorId, `reposteó tu publicación`);
        }
        setIsShareModalOpen(false);
    } catch(err) {
        console.error("Error al repostear:", err);
    }
  };

  const handleExternalShare = () => {
    const authorName = post.fanpage?.name || post.user.name;
    const shareText = `Mira esta publicación de ${authorName} en Zone4Reyes Social: ${post.content}`;
    const shareUrl = window.location.href.split('#')[0];

    if (navigator.share) {
      navigator.share({
        title: `Publicación de ${authorName}`,
        text: shareText,
        url: shareUrl,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(`${shareText}\n\nVer en: ${shareUrl}`);
      alert('¡Enlace de la publicación copiado al portapapeles!');
    }
    setIsShareModalOpen(false);
  };

  const handleProfileClick = () => {
      if ('category' in author) { // It's a Fanpage
          navigate(`fanpage/${author.id}`);
      } else { // It's a User
          navigate(`profile/${author.id}`);
      }
  };


  return (
    <>
    <div 
      className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-xl shadow-md my-6 border border-transparent dark:border-z-border-dark animate-slideInUp"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3" >
            <img src={author.avatarUrl} alt={author.name} className="h-10 w-10 rounded-full cursor-pointer" loading="lazy" onClick={handleProfileClick} />
            <div>
              <p className="font-bold text-z-text-primary dark:text-z-text-primary-dark hover:underline cursor-pointer" onClick={handleProfileClick}>{author.name}</p>
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
         {commentsCount > 0 && <span className="text-sm hover:underline cursor-pointer" onClick={handleLoadAllComments}>{commentsCount} comentarios</span>}
      </div>

      <div className="border-t border-gray-200/80 dark:border-z-border-dark mx-4 my-1"></div>

      <div className="p-1 flex justify-around text-z-text-secondary dark:text-z-text-secondary-dark">
         <div 
            className="relative flex-1"
         >
            <div onClick={handleLike} className={`flex items-center justify-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-z-hover-dark cursor-pointer transition-colors group ${isLiked ? 'text-z-primary' : ''}`}>
                <ThumbsUpIcon className="h-6 w-6" />
                <span className={`font-medium group-hover:text-z-text-primary dark:group-hover:text-z-text-primary-dark transition-colors ${isLiked ? 'text-z-primary' : ''}`}>Me gusta</span>
            </div>
         </div>
         <div onClick={() => commentInputRef.current?.focus()} className="flex-1 flex items-center justify-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-z-hover-dark cursor-pointer transition-colors group">
            <MessageSquareIcon className="h-6 w-6" />
            <span className="font-medium group-hover:text-z-text-primary dark:group-hover:text-z-text-primary-dark transition-colors">Comentar</span>
         </div>
         <div onClick={() => setIsShareModalOpen(true)} className="flex-1 flex items-center justify-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-z-hover-dark cursor-pointer transition-colors group">
            <Share2Icon className="h-6 w-6" />
            <span className="font-medium group-hover:text-z-text-primary dark:group-hover:text-z-text-primary-dark transition-colors">Compartir</span>
         </div>
      </div>
      
      {comments.length > 0 && <div className="border-t border-gray-200/80 dark:border-z-border-dark mx-4 mt-1"></div>}
      
      <div className="p-4 pt-2">
        {comments.map(comment => <Comment key={comment.id} comment={comment} navigate={navigate} />)}
        {!allCommentsLoaded && commentsCount > comments.length && (
            <button onClick={handleLoadAllComments} className="text-sm font-semibold text-z-text-secondary dark:text-z-text-secondary-dark mt-2 hover:underline">
                {`Ver ${commentsCount - comments.length} comentarios más`}
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
    {isShareModalOpen && <ShareModal post={post} onClose={() => setIsShareModalOpen(false)} onInternalShare={handleInternalShare} onExternalShare={handleExternalShare} />}
    </>
  );
};

export default Post;