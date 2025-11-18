
import React, { useState, useEffect, useCallback } from 'react';
import { Fanpage } from '../types';
import { supabase } from '../services/supabaseClient';
import { AuthUser } from '../contexts/AuthContext';
import { UsersIcon, FlagIcon, UserCheckIcon, AlertTriangleIcon } from '../components/icons';

const StatCard: React.FC<{ icon: React.ElementType, title: string, value: string | number, color: string, delay: number }> = ({ icon: Icon, title, value, color, delay }) => (
    <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark p-5 rounded-xl shadow flex items-center space-x-4 animate-slideInUp" style={{ animationDelay: `${delay}ms` }}>
        <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
            <h3 className="text-z-text-secondary dark:text-z-text-secondary-dark text-sm font-semibold">{title}</h3>
            <p className="text-3xl font-bold text-z-text-primary dark:text-z-text-primary-dark">{value}</p>
        </div>
    </div>
);

const AdminDashboardPage: React.FC = () => {
    const [users, setUsers] = useState<AuthUser[]>([]);
    const [fanpages, setFanpages] = useState<Fanpage[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const usersPromise = supabase.from('profiles').select('*').limit(50).order('name', { ascending: true });
            const fanpagesPromise = supabase.from('fanpages').select('*, owner:profiles!owner_id(email)').limit(50).order('name', { ascending: true });

            const [{ data: usersData, error: usersError }, { data: fanpagesData, error: fanpagesError }] = await Promise.all([usersPromise, fanpagesPromise]);

            if (usersError) throw usersError;
            if (fanpagesError) throw fanpagesError;

            setUsers(usersData || []);
            const formattedPages = (fanpagesData || []).map((p: any) => ({
                id: p.id,
                name: p.name,
                category: p.category,
                avatarUrl: p.avatar_url,
                coverUrl: p.cover_url,
                bio: p.bio,
                ownerId: p.owner_id,
                ownerEmail: p.owner?.email || 'N/A',
                is_active: p.is_active,
            }));
            setFanpages(formattedPages);
        } catch (err) {
            console.error("Error fetching admin data:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleToggleUserStatus = async (userId: string, currentStatus: boolean | undefined) => {
        const newStatus = currentStatus === false; // Toggle status
        const { error } = await supabase.from('profiles').update({ is_active: newStatus }).eq('id', userId);
        if (error) {
            console.error("Error updating user status:", error);
            alert(`Error al actualizar el estado del usuario: ${error.message}`);
        } else {
            // Update local state for immediate feedback
            setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, is_active: newStatus } : u));
        }
    };

    const handleToggleFanpageStatus = async (pageId: string, currentStatus: boolean | undefined) => {
        const newStatus = currentStatus === false; // Toggle status
        const { error } = await supabase.from('fanpages').update({ is_active: newStatus }).eq('id', pageId);
        if (error) {
            console.error("Error updating fanpage status:", error);
            alert(`Error al actualizar el estado de la página: ${error.message}`);
        } else {
            // Update local state for immediate feedback
            setFanpages(prevPages => prevPages.map(p => p.id === pageId ? { ...p, is_active: newStatus } : p));
        }
    };

    return (
        <main className="flex-grow pt-14 lg:ml-20 xl:ml-80 lg:mr-72 overflow-x-hidden p-4 md:p-6">
            <h1 className="text-3xl font-bold text-z-text-primary dark:text-z-text-primary-dark mb-6">Panel de Administrador</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard icon={UsersIcon} title="Usuarios Totales" value={loading ? '...' : users.length} color="bg-blue-500" delay={100} />
                <StatCard icon={FlagIcon} title="Páginas Totales" value={loading ? '...' : fanpages.length} color="bg-green-500" delay={200} />
                <StatCard icon={UserCheckIcon} title="Usuarios Activos Hoy" value="12" color="bg-yellow-500" delay={300} />
                <StatCard icon={AlertTriangleIcon} title="Reportes" value="3" color="bg-red-500" delay={400} />
            </div>
            
            {/* Charts section has been removed to improve performance and stability */}

            <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark p-4 rounded-xl shadow mb-6">
                <h2 className="text-xl font-bold mb-4 text-z-text-primary dark:text-z-text-primary-dark">Páginas de Negocio</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead><tr className="border-b dark:border-z-border-dark"><th className="p-3 text-sm font-semibold text-z-text-secondary dark:text-z-text-secondary-dark">Nombre</th><th className="p-3 text-sm font-semibold text-z-text-secondary dark:text-z-text-secondary-dark">Categoría</th><th className="p-3 text-sm font-semibold text-z-text-secondary dark:text-z-text-secondary-dark">Propietario</th><th className="p-3 text-sm font-semibold text-z-text-secondary dark:text-z-text-secondary-dark">Estado</th><th className="p-3 text-sm font-semibold text-z-text-secondary dark:text-z-text-secondary-dark">Acciones</th></tr></thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="text-center p-4">Cargando páginas...</td></tr>
                            ) : (
                                fanpages.map(fp => <tr key={fp.id} className="border-b dark:border-z-border-dark hover:bg-gray-50 dark:hover:bg-z-hover-dark transition-colors">
                                    <td className="p-3 text-z-text-primary dark:text-z-text-primary-dark">{fp.name}</td>
                                    <td className="p-3 text-z-text-primary dark:text-z-text-primary-dark">{fp.category}</td>
                                    <td className="p-3 text-z-text-primary dark:text-z-text-primary-dark">{fp.ownerEmail}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${fp.is_active !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{fp.is_active !== false ? 'Activa' : 'Inactiva'}</span>
                                    </td>
                                    <td className="p-3">
                                        <button onClick={() => handleToggleFanpageStatus(fp.id, fp.is_active)} className={`text-sm font-medium ${fp.is_active !== false ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-500 hover:text-green-700'}`}>{fp.is_active !== false ? 'Desactivar' : 'Activar'}</button>
                                    </td>
                                </tr>)
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark p-4 rounded-xl shadow">
                <h2 className="text-xl font-bold mb-4 text-z-text-primary dark:text-z-text-primary-dark">Usuarios Registrados</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead><tr className="border-b dark:border-z-border-dark"><th className="p-3 text-sm font-semibold text-z-text-secondary dark:text-z-text-secondary-dark">Nombre</th><th className="p-3 text-sm font-semibold text-z-text-secondary dark:text-z-text-secondary-dark">Email</th><th className="p-3 text-sm font-semibold text-z-text-secondary dark:text-z-text-secondary-dark">Estado</th><th className="p-3 text-sm font-semibold text-z-text-secondary dark:text-z-text-secondary-dark">Acciones</th></tr></thead>
                        <tbody>
                            {loading ? (
                                 <tr><td colSpan={4} className="text-center p-4">Cargando usuarios...</td></tr>
                            ) : (
                                users.map(u => <tr key={u.id} className="border-b dark:border-z-border-dark hover:bg-gray-50 dark:hover:bg-z-hover-dark transition-colors">
                                    <td className="p-3 text-z-text-primary dark:text-z-text-primary-dark">{u.name}</td>
                                    <td className="p-3 text-z-text-primary dark:text-z-text-primary-dark">{u.email}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${u.is_active !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{u.is_active !== false ? 'Activo' : 'Inactivo'}</span>
                                    </td>
                                    <td className="p-3">
                                        <button onClick={() => handleToggleUserStatus(u.id, u.is_active)} className={`text-sm font-medium ${u.is_active !== false ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-500 hover:text-green-700'}`}>{u.is_active !== false ? 'Desactivar' : 'Activar'}</button>
                                    </td>
                                </tr>)
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
};

export default AdminDashboardPage;
