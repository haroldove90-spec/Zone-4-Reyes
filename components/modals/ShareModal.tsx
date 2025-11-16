
import React, { useState } from 'react';
import { Post as PostType } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface ShareModalProps {
  post: PostType;
  onClose: () => void;
  onInternalShare: (comment: string) => Promise<void>;
  onExternalShare: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ post, onClose, onInternalShare, onExternalShare }) => {
  const { user } = useAuth();
  const [comment, setComment] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const author = post.fanpage || post.user;

  const handleShareSubmit = async () => {
    setIsSharing(true);
    try {
      await onInternalShare(comment);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-fadeIn" style={{ animationDuration: '0.2s' }}>
      <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-lg shadow-xl w-full max-w-md m-4">
        <div className="p-4 border-b dark:border-z-border-dark flex justify-between items-center">
          <h2 className="text-xl font-bold text-z-text-primary dark:text-z-text-primary-dark">Compartir Publicación</h2>
          <button onClick={onClose} className="text-2xl text-z-text-secondary dark:text-z-text-secondary-dark hover:text-z-text-primary dark:hover:text-z-text-primary-dark">&times;</button>
        </div>
        <div className="p-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={`Añade un comentario...`}
            className="w-full bg-z-bg-primary dark:bg-z-hover-dark rounded-xl px-4 py-2.5 text-z-text-primary dark:text-z-text-primary-dark focus:outline-none placeholder:text-z-text-secondary dark:placeholder:text-z-text-secondary-dark resize-none"
            rows={3}
          />
          <div className="mt-3 border dark:border-z-border-dark rounded-lg p-3 max-h-48 overflow-y-auto">
            <div className="flex items-center space-x-2">
              <img src={author.avatarUrl} alt={author.name} className="h-8 w-8 rounded-full" loading="lazy" />
              <div>
                <p className="font-bold text-sm text-z-text-primary dark:text-z-text-primary-dark">{author.name}</p>
                <p className="text-xs text-z-text-secondary dark:text-z-text-secondary-dark">{post.timestamp}</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-z-text-primary dark:text-z-text-primary-dark whitespace-pre-wrap truncate-3-lines">{post.content}</p>
            {post.media && post.media.length > 0 && post.media[0].type === 'image' && (
              <img src={post.media[0].url} alt="media preview" className="mt-2 rounded-lg w-full h-24 object-cover" loading="lazy"/>
            )}
             {post.media && post.media.length > 0 && post.media[0].type === 'video' && (
              <div className="mt-2 rounded-lg w-full h-24 bg-black flex items-center justify-center text-white font-bold">VISTA PREVIA DE VIDEO</div>
            )}
          </div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-z-bg-primary-dark/50 border-t dark:border-z-border-dark flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 rounded-b-lg">
          <button onClick={onExternalShare} className="w-full sm:w-auto bg-gray-200 dark:bg-z-hover-dark text-z-text-primary dark:text-z-text-primary-dark font-semibold py-2 px-4 rounded-md hover:bg-gray-300 dark:hover:bg-z-border-dark transition-colors">
            Compartir Externamente
          </button>
          <button onClick={handleShareSubmit} disabled={isSharing} className="w-full sm:w-auto bg-z-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-z-dark-blue transition-colors disabled:bg-gray-400">
            {isSharing ? 'Compartiendo...' : 'Publicar Ahora'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;