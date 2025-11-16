
import React, { useState, useEffect, useCallback } from 'react';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import Feed from './Feed';
import RightSidebar from './RightSidebar';
import { Post, Fanpage } from '../types';
import { generateSocialFeed } from '../services/geminiService';
import InstallPWA from './InstallPWA';
import BottomNavBar from './BottomNavBar';
import ProfilePage from '../pages/ProfilePage';
import FriendsPage from '../pages/FriendsPage';
import AdCenterPage from '../pages/AdCenterPage';
import SettingsPage from '../pages/SettingsPage';
import { useAuth } from '../contexts/AuthContext';

// --- Mock Data ---
const MOCK_USERS = [
    { name: 'Juan Pérez', email: 'juan@example.com', joined: '2023-10-26' },
    { name: 'Ana García', email: 'ana@example.com', joined: '2023-10-25' },
    { name: 'Carlos Dev', email: 'carlos@example.com', joined: '2023-10-24' },
    { name: 'John Doe', email: 'john@example.com', joined: '2023-09-15' },
    { name: 'Jane Smith', email: 'jane@example.com', joined: '2023-09-14' },
    { name: 'Alice Johnson', email: 'alice@example.com', joined: '2023-09-12' },
];

const MOCK_FANPAGES: Fanpage[] = [
    { id: 'fp1', name: 'El Rincón del Café', category: 'Cafetería', bio: 'El mejor café de Reyes Iztacala.', ownerEmail: 'juan@example.com', avatarUrl: 'https://picsum.photos/id/55/200', coverUrl: 'https://picsum.photos/id/225/1600/400' },
    { id: 'fp2', name: 'Gaming Zone', category: 'Videojuegos', bio: 'Tu comunidad de gaming.', ownerEmail: 'carlos@example.com', avatarUrl: 'https://picsum.photos/id/44/200', coverUrl: 'https://picsum.photos/id/99/1600/400' },
];

// --- Sub-Components for New Pages (to avoid creating new files) ---

const Spinner: React.FC = () => (
    <div className="flex justify-center items-center p-4">
        <div className="w-10 h-10 border-4 border-z-primary/30 border-t-z-primary rounded-full animate-spin"></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } } .animate-spin { animation: spin 1s linear infinite; }`}</style>
    </div>
);

const UserChart: React.FC<{ data: { label: string, value: number }[] }> = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    return (
        <div className="bg-z-bg-primary dark:bg-z-hover-dark p-4 rounded-lg flex justify-around items-end h-64">
            {data.map(item => (
                <div key={item.label} className="flex flex-col items-center">
                    <div className="w-10 bg-z-primary/70 hover:bg-z-primary transition-colors rounded-t-md" style={{ height: `${(item.value / maxValue) * 100}%` }}></div>
                    <span className="text-xs mt-2 font-semibold text-z-text-secondary dark:text-z-text-secondary-dark">{item.label}</span>
                </div>
            ))}
        </div>
    );
};

const AdminDashboardPage: React.FC = () => {
    const chartData = [
        { label: 'Jul', value: 12 }, { label: 'Ago', value: 19 }, { label: 'Sep', value: 32 }, { label: 'Oct', value: 48 },
    ];
    return (
        <main className="flex-grow pt-14 lg:ml-20 xl:ml-80 lg:mr-72 overflow-x-hidden p-4 md:p-6">
            <h1 className="text-3xl font-bold text-z-text-primary dark:text-z-text-primary-dark mb-6">Panel de Administrador</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark p-4 rounded-xl shadow"><h3 className="text-z-text-secondary dark:text-z-text-secondary-dark">Usuarios Totales</h3><p className="text-2xl font-bold">{MOCK_USERS.length}</p></div>
                <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark p-4 rounded-xl shadow"><h3 className="text-z-text-secondary dark:text-z-text-secondary-dark">Páginas Totales</h3><p className="text-2xl font-bold">{MOCK_FANPAGES.length}</p></div>
                <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark p-4 rounded-xl shadow"><h3 className="text-z-text-secondary dark:text-z-text-secondary-dark">Usuarios Activos Hoy</h3><p className="text-2xl font-bold">12</p></div>
                <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark p-4 rounded-xl shadow"><h3 className="text-z-text-secondary dark:text-z-text-secondary-dark">Reportes</h3><p className="text-2xl font-bold">3</p></div>
            </div>
            <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark p-4 rounded-xl shadow mb-6">
                <h2 className="text-xl font-bold mb-4">Nuevos Usuarios por Mes</h2>
                <UserChart data={chartData} />
            </div>
            <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark p-4 rounded-xl shadow">
                <h2 className="text-xl font-bold mb-4">Usuarios Registrados</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead><tr className="border-b dark:border-z-border-dark"><th className="p-2">Nombre</th><th className="p-2">Email</th><th className="p-2">Fecha de Registro</th></tr></thead>
                        <tbody>{MOCK_USERS.map(u => <tr key={u.email} className="border-b dark:border-z-border-dark hover:bg-gray-50 dark:hover:bg-z-hover-dark"><td className="p-2">{u.name}</td><td className="p-2">{u.email}</td><td className="p-2">{u.joined}</td></tr>)}</tbody>
                    </table>
                </div>
            </div>
        </main>
    );
};

const CreateFanpage: React.FC<{ onAddPage: (page: Fanpage) => void, navigate: (path: string) => void }> = ({ onAddPage, navigate }) => {
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !category || !user) return;
        const newPage: Fanpage = {
            id: `fp${Date.now()}`,
            name, category, ownerEmail: user.email,
            bio: 'Bienvenido a nuestra nueva página.',
            avatarUrl: `https://picsum.photos/seed/${name}/200`,
            coverUrl: `https://picsum.photos/seed/${name}cover/1600/400`,
        };
        onAddPage(newPage);
        navigate('my-pages');
    };

    return (
        <main className="flex-grow pt-14 lg:ml-20 xl:ml-80 lg:mr-72 overflow-x-hidden p-4 md:p-6">
            <div className="max-w-2xl mx-auto bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-xl shadow-md p-6">
                <h1 className="text-2xl font-bold text-z-text-primary dark:text-z-text-primary-dark mb-4">Crear una Página</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nombre de la Página</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-z-bg-primary dark:bg-z-hover-dark rounded-md p-2.5" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Categoría</label>
                        <input type="text" value={category} onChange={e => setCategory(e.target.value)} required className="w-full bg-z-bg-primary dark:bg-z-hover-dark rounded-md p-2.5" />
                    </div>
                    <button type="submit" className="w-full bg-z-primary text-white font-bold py-2.5 rounded-lg hover:bg-z-dark-blue">Crear Página</button>
                </form>
            </div>
        </main>
    );
};

const MyPages: React.FC<{ myPages: Fanpage[], navigate: (path: string) => void }> = ({ myPages, navigate }) => (
    <main className="flex-grow pt-14 lg:ml-20 xl:ml-80 lg:mr-72 overflow-x-hidden p-4 md:p-6">
        <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-z-text-primary dark:text-z-text-primary-dark">Mis Páginas</h1>
                <button onClick={() => navigate('create-fanpage')} className="bg-z-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-z-dark-blue">Crear Nueva Página</button>
            </div>
            <div className="space-y-4">
                {myPages.length > 0 ? myPages.map(p => (
                    <div key={p.id} className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-xl shadow-md p-4 flex items-center space-x-4">
                        <img src={p.avatarUrl} alt={p.name} className="h-16 w-16 rounded-lg object-cover" loading="lazy" />
                        <div>
                            <h2 className="text-lg font-bold">{p.name}</h2>
                            <p className="text-sm text-z-text-secondary dark:text-z-text-secondary-dark">{p.category}</p>
                        </div>
                    </div>
                )) : <p>Aún no has creado ninguna página.</p>}
            </div>
        </div>
    </main>
);

const MainLayout: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [fanpages, setFanpages] = useState<Fanpage[]>(MOCK_FANPAGES);
  const [currentPath, setCurrentPath] = useState(window.location.hash.substring(1) || '/feed');
  const { user } = useAuth();

  useEffect(() => {
    const handleHashChange = () => {
        setCurrentPath(window.location.hash.substring(1) || '/feed');
    };
    window.addEventListener('hashchange', handleHashChange);
    // Set initial path
    if (window.location.hash === '' || window.location.hash === '#/') {
        window.location.hash = '/feed';
    }
    handleHashChange();
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
  };

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const generatedPosts = await generateSocialFeed();
    setPosts(generatedPosts);
    // Simulate a slightly longer loading time for better visual effect
    setTimeout(() => setLoading(false), 500);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleAddPost = (newPost: Post) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const handleAddPage = (newPage: Fanpage) => {
    setFanpages(prev => [newPage, ...prev]);
  };
  
  const renderPage = () => {
      const [path] = currentPath.split('/');
      
      switch(path) {
          case 'profile':
              return <ProfilePage userPosts={posts.slice(0,2)} onAddPost={handleAddPost} />;
          case 'friends':
              return <FriendsPage />;
          case 'ads':
              return <AdCenterPage />;
          case 'settings':
              return <SettingsPage />;
          case 'my-pages':
              return <MyPages myPages={fanpages.filter(p => p.ownerEmail === user?.email)} navigate={navigate} />;
          case 'create-fanpage':
              return <CreateFanpage onAddPage={handleAddPage} navigate={navigate} />;
          case 'admin':
              return user?.isAdmin ? <AdminDashboardPage /> : <Feed posts={posts} onAddPost={handleAddPost} loading={loading} />;
          case 'feed':
          default:
              return <Feed posts={posts} onAddPost={handleAddPost} loading={loading} />;
      }
  }

  return (
    <div className="min-h-screen bg-z-bg-primary dark:bg-z-bg-primary-dark animate-fadeIn">
      <Header navigate={navigate} />
      <div className="flex">
        <LeftSidebar navigate={navigate} />
        {renderPage()}
        <RightSidebar />
      </div>
      <InstallPWA />
      <BottomNavBar navigate={navigate} activePath={currentPath} />
    </div>
  );
};

export default MainLayout;
