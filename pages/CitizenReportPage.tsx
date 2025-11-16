
import React from 'react';
import { Post as PostType, User, Media } from '../types';
import CreatePost from '../components/CreatePost';
import Post from '../components/Post';
import { AlertTriangleIcon } from '../components/icons';

interface CitizenReportPageProps {
    reportPosts: PostType[];
    onAddPost: (content: string, mediaFiles: File[], postType?: 'standard' | 'report', group?: { id: string; name: string }, existingMedia?: Media[]) => Promise<void>;
}

const CitizenReportPage: React.FC<CitizenReportPageProps> = ({ reportPosts, onAddPost }) => {
  return (
    <main className="flex-grow pt-14 lg:ml-20 xl:ml-80 lg:mr-72 overflow-x-hidden p-4 md:p-6">
      <div className="max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto">
        <div className="flex items-center space-x-3 mb-6">
            <AlertTriangleIcon className="h-8 w-8 text-yellow-500"/>
            <h1 className="text-3xl font-bold text-z-text-primary dark:text-z-text-primary-dark">Denuncia Ciudadana</h1>
        </div>
        <p className="text-z-text-secondary dark:text-z-text-secondary-dark mb-6">
            Este es un espacio para reportar incidentes, solicitar ayuda o informar a la comunidad de Reyes Iztacala. Publica con responsabilidad.
        </p>
        <div className="mb-6">
          <CreatePost 
            onAddPost={onAddPost} 
            postType="report" 
            placeholder="Describe tu denuncia o solicitud de ayuda..." 
          />
        </div>
        {reportPosts.length > 0 ? (
          reportPosts.map((post, index) => (
            <Post key={post.id} post={post} index={index} addNotification={() => {}} onAddPost={onAddPost} />
          ))
        ) : (
          <div className="text-center py-10 text-z-text-secondary dark:text-z-text-secondary-dark bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-xl">
            <p>Aún no hay denuncias ciudadanas. ¡Sé el primero en publicar!</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default CitizenReportPage;