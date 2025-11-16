
import React from 'react';
import { Group, Post as PostType, Media } from '../types';
import CreatePost from '../components/CreatePost';
import Post from '../components/Post';

interface GroupDetailPageProps {
  group: Group;
  posts: PostType[];
  onAddPost: (content: string, mediaFiles: File[], postType?: 'standard' | 'report', group?: { id: string; name: string }, existingMedia?: Media[]) => Promise<void>;
}

const GroupDetailPage: React.FC<GroupDetailPageProps> = ({ group, posts, onAddPost }) => {
  return (
    <main className="flex-grow pt-14 lg:ml-20 xl:ml-80 lg:mr-72 overflow-x-hidden">
        <div className="max-w-4xl mx-auto">
            <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark shadow-md">
                <img src={group.coverUrl} alt={`Portada de ${group.name}`} className="w-full h-48 md:h-64 object-cover" />
                <div className="p-4">
                    <h1 className="text-3xl font-bold text-z-text-primary dark:text-z-text-primary-dark">{group.name}</h1>
                    <p className="text-z-text-secondary dark:text-z-text-secondary-dark">{group.memberCount} miembros</p>
                    <p className="text-z-text-primary dark:text-z-text-primary-dark mt-2">{group.description}</p>
                </div>
            </div>
            <div className="p-4">
                <CreatePost 
                    onAddPost={onAddPost}
                    group={{ id: group.id, name: group.name }}
                    placeholder={`Escribe algo en ${group.name}...`}
                />
                <div className="mt-6">
                    {posts.length > 0 ? (
                        posts.map((post, index) => <Post key={post.id} post={post} index={index} addNotification={() => {}} onAddPost={onAddPost} />)
                    ) : (
                        <div className="text-center py-10 text-z-text-secondary dark:text-z-text-secondary-dark bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-xl">
                            <p>Aún no hay publicaciones en este grupo. ¡Sé el primero!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </main>
  );
};

export default GroupDetailPage;