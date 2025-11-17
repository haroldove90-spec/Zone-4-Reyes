

import React, { useState, useEffect, useCallback } from 'react';
import { Fanpage } from '../types';
import { supabase } from '../services/supabaseClient';
import { AuthUser } from '../contexts/AuthContext';

const UserChart: React.FC<{ data: { label: string, value: number }[] }> = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1); // Avoid division by zero
    return (
        <div className="bg-z-bg-primary dark:bg-z-hover-dark p-4 rounded-lg flex justify-around items-end h-64 animate-fadeIn">
            {data.map(item => (
                <div key={item.label} className="flex flex-col items-center w-1/12">
                    <div className="w-full bg-z-primary/70 hover:bg-z-primary transition-all duration-300 rounded-t-md" style={{ height: `${(item.value / maxValue) * 90}%` }}></div>
                    <span className="text-xs mt-2 font-semibold text-z-text-secondary dark:text-z-text-secondary-dark">{item.label}</span>
                </div>
            ))}
        </div>
    );
};

const AdminDashboardPage: React.FC = () => {
    const [users, setUsers] = useState<AuthUser[]>([]);
    const [fanpages, setFanpages] = useState<Fanpage[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [loadingPages, setLoadingPages] = useState(true);

    const fetchUsers = useCallback(async () => {
        setLoadingUsers(true);
        try {
            const { data, error } = await supabase.from('profiles').select('*');
            if (error) throw error;
            setUsers(data);
        } catch (err) {
            console.error("Error fetching users for admin:", err);
        } finally {
            setLoadingUsers(false);
        }
    }, []);

    const fetchFanpages = useCallback(async () => {
        setLoadingPages(true);
        try {
            const { data, error } = await supabase.from('fanpages').select('*, owner:profiles!owner_id(email)');
            if (error) throw error;
            const formattedPages = data.map((p: any) => ({
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
            console.error("Error fetching fanpages for admin:", err);
        } finally {
            setLoadingPages(false);
        }
    }, []);
    
    const handleToggleUserStatus = async (userId: string, currentStatus: boolean | undefined) => {
        const newStatus = currentStatus === false; // If it's false, make it true, otherwise make it false
        const { error } = await supabase.from('profiles').update({ is_active: newStatus }).eq('id', userId);
        if (error) console.error("Error updating user status:", error);
        else fetchUsers();
    };

    const handleToggleFanpageStatus = async (pageId: string, currentStatus: boolean | undefined) => {
        const newStatus = currentStatus === false;
        const { error } = await supabase.from('fanpages').update({ is_active: newStatus }).eq('id', pageId);
        if (error) console.error("Error updating fanpage status:", error);
        else fetchFanpages();
    };


    useEffect(() => {
        fetchUsers();
        fetchFanpages();
    }, [fetchUsers, fetchFanpages]);

    const chartData = [
        { label: 'Jul', value: 12 }, { label: 'Ago', value: 19 }, { label: 'Sep', value: 32 }, { label: 'Oct', value: 48 },
    ];
    return (
        <main className="flex-grow pt-14 lg:ml-20 xl:ml-80 lg:mr-72 overflow-x-hidden p-4 md:p-6">
            <h1 className="text-3xl font-bold text-z-text-primary dark:text-z-text-primary-dark mb-6">Panel de Administrador</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark p-5 rounded-xl shadow animate-slideInUp" style={{animationDelay: '100ms'}}><h3 className="text-z-text-secondary dark:text-z-text-secondary-dark text-sm font-semibold">Usuarios Totales</h3><p className="text-3xl font-bold">{loadingUsers ? '...' : users.length}</p></div>
                <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark p-5 rounded-xl shadow animate-slideInUp" style={{animationDelay: '200ms'}}><h3 className="text-z-text-secondary dark:text-z-text-secondary-dark text-sm font-semibold">Páginas Totales</h3><p className="text-3xl font-bold">{loadingPages ? '...' : fanpages.length}</p></div>
                <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark p-5 rounded-xl shadow animate-slideInUp" style={{animationDelay: '300ms'}}><h3 className="text-z-text-secondary dark:text-z-text-secondary-dark text-sm font-semibold">Usuarios Activos Hoy</h3><p className="text-3xl font-bold">12</p></div>
                <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark p-5 rounded-xl shadow animate-slideInUp" style={{animationDelay: '400ms'}}><h3 className="text-z-text-secondary dark:text-z-text-secondary-dark text-sm font-semibold">Reportes</h3><p className="text-3xl font-bold">3</p></div>
            </div>
            <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark p-4 rounded-xl shadow mb-6">
                <h2 className="text-xl font-bold mb-4">Nuevos Usuarios por Mes</h2>
                <UserChart data={chartData} />
            </div>

            <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark p-4 rounded-xl shadow mb-6">
                <h2 className="text-xl font-bold mb-4">Páginas de Negocio</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead><tr className="border-b dark:border-z-border-dark"><th className="p-3 text-sm font-semibold text-z-text-secondary dark:text-z-text-secondary-dark">Nombre</th><th className="p-3 text-sm font-semibold text-z-text-secondary dark:text-z-text-secondary-dark">Categoría</th><th className="p-3 text-sm font-semibold text-z-text-secondary dark:text-z-text-secondary-dark">Propietario</th><th className="p-3 text-sm font-semibold text-z-text-secondary dark:text-z-text-secondary-dark">Estado</th><th className="p-3 text-sm font-semibold text-z-text-secondary dark:text-z-text-secondary-dark">Acciones</th></tr></thead>
                        <tbody>
                            {loadingPages ? (
                                <tr><td colSpan={5} className="text-center p-4">Cargando páginas...</td></tr>
                            ) : (
                                fanpages.map(fp => <tr key={fp.id} className="border-b dark:border-z-border-dark hover:bg-gray-50 dark:hover:bg-z-hover-dark transition-colors">
                                    <td className="p-3">{fp.name}</td>
                                    <td className="p-3">{fp.category}</td>
                                    <td className="p-3">{fp.ownerEmail}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${fp.is_active !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {fp.is_active !== false ? 'Activa' : 'Inactiva'}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <button onClick={() => handleToggleFanpageStatus(fp.id, fp.is_active)} className={`text-sm font-medium ${fp.is_active !== false ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'}`}>
                                             {fp.is_active !== false ? 'Desactivar' : 'Activar'}
                                        </button>
                                    </td>
                                </tr>)
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark p-4 rounded-xl shadow">
                <h2 className="text-xl font-bold mb-4">Usuarios Registrados</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead><tr className="border-b dark:border-z-border-dark"><th className="p-3 text-sm font-semibold text-z-text-secondary dark:text-z-text-secondary-dark">Nombre</th><th className="p-3 text-sm font-semibold text-z-text-secondary dark:text-z-text-secondary-dark">Email</th><th className="p-3 text-sm font-semibold text-z-text-secondary dark:text-z-text-secondary-dark">Estado</th><th className="p-3 text-sm font-semibold text-z-text-secondary dark:text-z-text-secondary-dark">Acciones</th></tr></thead>
                        <tbody>
                            {loadingUsers ? (
                                 <tr><td colSpan={4} className="text-center p-4">Cargando usuarios...</td></tr>
                            ) : (
                                users.map(u => <tr key={u.id} className="border-b dark:border-z-border-dark hover:bg-gray-50 dark:hover:bg-z-hover-dark transition-colors">
                                    <td className="p-3">{u.name}</td>
                                    <td className="p-3">{u.email}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${u.is_active !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {u.is_active !== false ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <button onClick={() => handleToggleUserStatus(u.id, u.is_active)} className={`text-sm font-medium ${u.is_active !== false ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'}`}>
                                            {u.is_active !== false ? 'Desactivar' : 'Activar'}
                                        </button>
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