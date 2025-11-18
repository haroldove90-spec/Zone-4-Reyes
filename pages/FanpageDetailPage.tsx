import React, { useState, useEffect } from 'react';
import { Fanpage, Post as PostType, Media } from '../types';
import Post from '../components/Post';
import CreatePost from '../components/CreatePost';
import { useAuth } from '../contexts/AuthContext';
import EditFanpageModal from '../components/modals/EditFanpageModal';
import { supabase } from '../services/supabaseClient';


interface FanpageDetailPageProps {
  fanpageId: string;
  posts: PostType[];
  onAddPost: (content: string, mediaFiles: File[], postType?: 'standard' | 'report', options?: { group?: { id: string; name: string; }; fanpageId?: string; }, existingMedia?: Media[]) => Promise<void>;
  navigate: (path: string) => void;
  addNotification: (recipientId: string, text: string, postId?: string) => Promise<void>;
}

const FanpageDetailPage: React.FC<FanpageDetailPageProps> = ({ fanpageId, posts, onAddPost, navigate, addNotification }) => {
  const { user: currentUser } = useAuth();
  const [currentPage, setCurrentPage] = useState<Fanpage | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchFanpage = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('fanpages')
          .select('*')
          .eq('id', fanpageId)
          .single();
        
        if (error) throw error;

        if (data) {
          const formattedPage: Fanpage = {
            id: data.id,
            name: data.name,
            category: data.category,
            avatarUrl: data.avatar_url,
            coverUrl: data.cover_url,
            bio: data.bio,
            ownerId: data.owner_id,
            ownerEmail: data.owner_email,
            is_active: data.is_active,
          };
          setCurrentPage(formattedPage);
        } else {
          setCurrentPage(null);
        }
      } catch (err) {
        console.error("Error fetching fanpage details:", err);
        setCurrentPage(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFanpage();
  }, [fanpageId]);

  const isOwner = currentUser?.id === currentPage?.ownerId;

  const handleUpdatePage = async (updatedData: { name: string; category: string; bio: string }) => {
      if (!currentPage) return;
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
      } else if (data) {
          setCurrentPage(prev => prev ? ({
              ...prev,
              name: data.name,
              category: data.category,
              bio: data.bio,
          }) : null);
      }
  };

   if (loading) {
    return (
        <main className="flex-grow pt-14 flex items-center justify-center" style={{ minHeight: 'calc(100vh - 3.5rem)' }}>
            <div className="w-12 h-12 border-4 border-z-primary/30 border-t-z-primary rounded-full animate-spin"></div>
        </main>
    );
  }

  if (!currentPage) {
     return (
        <main className="flex-grow pt-14 flex items-center justify-center" style={{ minHeight: 'calc(100vh - 3.5rem)' }}>
            <div className="text-center p-8 bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-lg shadow-md">
                <h2 className="text-2xl font-bold">Página no encontrada</h2>
                <p className="mt-2 text-z-text-secondary dark:text-z-text-secondary-dark">La página que buscas no existe o fue eliminada.</p>
                <button onClick={() => navigate('feed')} className="mt-4 bg-z-primary text-white font-semibold py-2 px-6 rounded-md hover:bg-z-dark-blue">
                  Volver al inicio
                </button>
            </div>
        </main>
    );
  }

  if (currentPage.is_active === false && !currentUser?.isAdmin) {
    return (
        <main className="flex-grow pt-14 lg:ml-20 xl:ml-80 lg:mr-72 overflow-x-hidden flex items-center justify-center" style={{ minHeight: 'calc(100vh - 3.5rem)' }}>
            <div className="text-center p-8 bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-lg shadow-md max-w-sm mx-auto">
                <h2 className="text-2xl font-bold text-z-text-primary dark:text-z-text-primary-dark">Página Desactivada</h2>
                <p className="text-z-text-secondary dark:text-z-text-secondary-dark mt-2">
                    Esta página ha sido desactivada por un administrador.
                </p>
                <button onClick={() => navigate('feed')} className="mt-6 bg-z-primary text-white font-semibold py-2 px-6 rounded-md hover:bg-z-dark-blue transition-colors">
                    Volver al Inicio
                </button>
            </div>
        </main>
    );
  }


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
                        posts.map((post, index) => <Post key={post.id} post={post} index={index} addNotification={addNotification} onAddPost={onAddPost} onUpdatePost={async () => {}} navigate={navigate} />)
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
