
import React, { useState } from 'react';
import { Fanpage, Post as PostType, Media } from '../types';
import Post from '../components/Post';
import CreatePost from '../components/CreatePost';
import { useAuth } from '../contexts/AuthContext';
import EditFanpageModal from '../components/modals/EditFanpageModal';
import { supabase } from '../services/supabaseClient';


interface FanpageDetailPageProps {
  fanpage: Fanpage;
  posts: PostType[];
  onAddPost: (content: string, mediaFiles: File[], postType?: 'standard' | 'report', options?: { group?: { id: string; name: string; }; fanpageId?: string; }, existingMedia?: Media[]) => Promise<void>;
  navigate: (path: string) => void;
  addNotification: (recipientId: string, text: string, postId?: string) => Promise<void>;
}

const FanpageDetailPage: React.FC<FanpageDetailPageProps> = ({ fanpage, posts, onAddPost, navigate, addNotification }) => {
  const { user: currentUser } = useAuth();
  const [currentPage, setCurrentPage] = useState<Fanpage>(fanpage);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const isOwner = currentUser?.id === currentPage.ownerId;

  const handleUpdatePage = async (updatedData: { name: string; category: string; bio: string }) => {
      const { data, error } = await supabase
          .from('fanpages')
          .update({ 
              name: updatedData.name, 
              category: updatedData.category, 
              bio: updatedData.bio 
          })
          .eq('id', currentPage.id)
          .select()
          .single();

      if (error) {
          console.error("Error updating fanpage:", error);
          // Aquí se podría mostrar un mensaje de error al usuario
      } else if (data) {
          setCurrentPage(prev => ({
              ...prev,
              name: data.name,
              category: data.category,
              bio: data.bio,
          }));
      }
  };


  return (
    <>
    <main className="flex-grow pt-14 lg:ml-20 xl:ml-80 lg:mr-72 overflow-x-hidden">
        <div className="max-w-4xl mx-auto">
            <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark shadow-md">
                <img src={currentPage.coverUrl} alt={`Portada de ${currentPage.name}`} className="w-full h-48 md:h-64 object-cover" />
                <div className="p-4 flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-8 space-y-4 sm:space-y-0 sm:space-x-6 border-b dark:border-z-border-dark pb-4">
                    <img src={currentPage.avatarUrl} alt={`Avatar de ${currentPage.name}`} className="w-40 h-40 rounded-full border-4 border-z-bg-secondary dark:border-z-bg-secondary-dark" />
                    <div className="flex-grow text-center sm:text-left">
                        <h1 className="text-3xl font-bold text-z-text-primary dark:text-z-text-primary-dark">{currentPage.name}</h1>
                        <p className="text-z-text-secondary dark:text-z-text-secondary-dark">{currentPage.category}</p>
                    </div>
                     <div className="flex space-x-2">
                        {isOwner ? (
                             <button onClick={() => setIsEditModalOpen(true)} className="bg-z-primary text-white font-semibold py-2 px-6 rounded-md hover:bg-z-dark-blue transition-colors">Editar Página</button>
                        ) : (
                             <button className="bg-z-primary text-white font-semibold py-2 px-6 rounded-md hover:bg-z-dark-blue transition-colors">Seguir</button>
                        )}
                     </div>
                </div>
            </div>
            <div className="p-4">
                 {isOwner && (
                    <CreatePost 
                        onAddPost={onAddPost}
                        fanpageId={currentPage.id}
                        placeholder={`Escribe una publicación como ${currentPage.name}...`}
                    />
                 )}
                <div className="mt-6">
                    {posts.length > 0 ? (
                        posts.map((post, index) => <Post key={post.id} post={post} index={index} addNotification={addNotification} onAddPost={onAddPost} navigate={navigate} />)
                    ) : (
                        <div className="text-center py-10 text-z-text-secondary dark:text-z-text-secondary-dark bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-xl">
                            <p>Esta página aún no tiene publicaciones. ¡Sé el primero en ver su contenido!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </main>
    {isEditModalOpen && (
        <EditFanpageModal 
            fanpage={currentPage}
            onClose={() => setIsEditModalOpen(false)}
            onUpdate={handleUpdatePage}
        />
    )}
    </>
  );
};

export default FanpageDetailPage;
