
import React from 'react';
import { Post as PostType } from '../types';
import { ThumbsUpIcon, MessageSquareIcon, Share2Icon, MoreHorizontalIcon } from './icons';

interface PostProps {
  post: PostType;
}

const Post: React.FC<PostProps> = ({ post }) => {
  return (
    <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-xl shadow-md my-6 border border-transparent dark:border-z-border-dark">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={post.user.avatarUrl} alt={post.user.name} className="h-10 w-10 rounded-full" />
            <div>
              <p className="font-bold text-z-text-primary dark:text-z-text-primary-dark">{post.user.name}</p>
              <p className="text-sm text-z-text-secondary dark:text-z-text-secondary-dark">{post.timestamp}</p>
            </div>
          </div>
          <div className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-z-hover-dark cursor-pointer">
             <MoreHorizontalIcon className="h-6 w-6 text-z-text-secondary dark:text-z-text-secondary-dark" />
          </div>
        </div>
        <p className="my-3 text-z-text-primary dark:text-z-text-primary-dark text-[15px] leading-relaxed">{post.content}</p>
      </div>

      {post.imageUrl && (
        <img src={post.imageUrl} alt="Post content" className="w-full h-auto" />
      )}

      <div className="p-2 px-4 flex justify-between items-center text-z-text-secondary dark:text-z-text-secondary-dark">
         <div className="flex items-center space-x-1">
            <div className="p-1 bg-z-light-blue rounded-full">
                <ThumbsUpIcon className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm">{post.likes}</span>
         </div>
         <span className="text-sm hover:underline cursor-pointer">{post.commentsCount} comments</span>
      </div>

      <div className="border-t border-gray-200/80 dark:border-z-border-dark mx-4 my-1"></div>

      <div className="p-1 flex justify-around text-z-text-secondary dark:text-z-text-secondary-dark">
         <div className="flex-1 flex items-center justify-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-z-hover-dark cursor-pointer">
            <ThumbsUpIcon className="h-6 w-6" />
            <span className="font-medium">Like</span>
         </div>
         <div className="flex-1 flex items-center justify-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-z-hover-dark cursor-pointer">
            <MessageSquareIcon className="h-6 w-6" />
            <span className="font-medium">Comment</span>
         </div>
         <div className="flex-1 flex items-center justify-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-z-hover-dark cursor-pointer">
            <Share2Icon className="h-6 w-6" />
            <span className="font-medium">Share</span>
         </div>
      </div>
    </div>
  );
};

export default Post;
