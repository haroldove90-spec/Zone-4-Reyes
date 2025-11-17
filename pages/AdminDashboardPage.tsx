

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Fanpage } from '../types';
import { supabase } from '../services/supabaseClient';
import { AuthUser } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { UsersIcon, FlagIcon, UserCheckIcon, AlertTriangleIcon } from '../components/icons';

declare const Chart: any;

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
    const { theme } = useTheme();

    const usersChartRef = useRef<HTMLCanvasElement>(null);
    const categoriesChartRef = useRef<HTMLCanvasElement>(null);
    const activeUsersChartRef = useRef<HTMLCanvasElement>(null);
    const activePagesChartRef = useRef<HTMLCanvasElement>(null);
    const chartInstances = useRef<any>({});

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const usersPromise = supabase.from('profiles').select('*');
            const fanpagesPromise = supabase.from('fanpages').select('*, owner:profiles!owner_id(email)');

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

    useEffect(() => {
        if (loading || typeof Chart === 'undefined') return;

        Object.values(chartInstances.current).forEach((chart: any) => chart.destroy());
        chartInstances.current = {};

        const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        const textColor = theme === 'dark' ? '#E4E6EB' : '#050505';

        if (usersChartRef.current) {
            const ctx = usersChartRef.current.getContext('2d');
            chartInstances.current.usersChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                    datasets: [{
                        label: 'Nuevos Usuarios',
                        data: [12, 19, 32, 48, 55, 68],
                        fill: true,
                        borderColor: 'rgb(24, 119, 242)',
                        backgroundColor: 'rgba(24, 119, 242, 0.2)',
                        tension: 0.4
                    }]
                },
                options: { responsive: true, plugins: { legend: { labels: { color: textColor } } }, scales: { x: { ticks: { color: textColor }, grid: { color: gridColor } }, y: { ticks: { color: textColor }, grid: { color: gridColor } } } }
            });
        }

        if (categoriesChartRef.current) {
            const ctx = categoriesChartRef.current.getContext('2d');
            const categoryCounts = fanpages.reduce((acc, page) => { acc[page.category] = (acc[page.category] || 0) + 1; return acc; }, {} as Record<string, number>);
            chartInstances.current.categoriesChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: Object.keys(categoryCounts),
                    datasets: [{
                        label: 'Páginas',
                        data: Object.values(categoryCounts),
                        backgroundColor: ['rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(255, 206, 86, 0.7)', 'rgba(75, 192, 192, 0.7)', 'rgba(153, 102, 255, 0.7)', 'rgba(255, 159, 64, 0.7)'],
                        borderWidth: 1
                    }]
                },
                options: { indexAxis: 'y', responsive: true, plugins: { legend: { display: false } }, scales: { x: { ticks: { color: textColor }, grid: { color: gridColor } }, y: { ticks: { color: textColor }, grid: { display: false } } } }
            });
        }

        if (activeUsersChartRef.current) {
             const ctx = activeUsersChartRef.current.getContext('2d');
             const activeUsers = users.filter(u => u.is_active !== false).length;
             const inactiveUsers = users.length - activeUsers;
              chartInstances.current.activeUsersChart = new Chart(ctx, {
                type: 'doughnut',
                data: { labels: ['Activos', 'Inactivos'], datasets: [{ data: [activeUsers, inactiveUsers], backgroundColor: ['rgba(75, 192, 192, 0.7)', 'rgba(255, 99, 132, 0.7)'], hoverOffset: 4 }] },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { color: textColor } } } }
              });
        }

        if (activePagesChartRef.current) {
            const ctx = activePagesChartRef.current.getContext('2d');
            const activePages = fanpages.filter(p => p.is_active !== false).length;
            const inactivePages = fanpages.length - activePages;
            chartInstances.current.activePagesChart = new Chart(ctx, {
                type: 'pie',
                data: { labels: ['Activas', 'Inactivas'], datasets: [{ data: [activePages, inactivePages], backgroundColor: ['rgba(54, 162, 235, 0.7)', 'rgba(255, 159, 64, 0.7)'], hoverOffset: 4 }] },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { color: textColor } } } }
            });
        }
        
        return () => { Object.values(chartInstances.current).forEach((chart: any) => chart.destroy()); };
    }, [loading, users, fanpages, theme]);

    const handleToggleUserStatus = async (userId: string, currentStatus: boolean | undefined) => {
        const newStatus = currentStatus === false;
        const { error } = await supabase.from('profiles').update({ is_active: newStatus }).eq('id', userId);
        if (error) {
            console.error("Error updating user status:", error);
            alert(`Error al actualizar el estado del usuario: ${error.message}`);
        } else {
            fetchData();
        }
    };

    const handleToggleFanpageStatus = async (pageId: string, currentStatus: boolean | undefined) => {
        const newStatus = currentStatus === false;
        const { error } = await supabase.from('fanpages').update({ is_active: newStatus }).eq('id', pageId);
        if (error) {
            console.error("Error updating fanpage status:", error);
            alert(`Error al actualizar el estado de la página: ${error.message}`);
        } else {
            fetchData();
        }
    };

    const handleDeleteFanpage = async (pageId: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta página? Esta acción no se puede deshacer.')) {
            const { error } = await supabase.from('fanpages').delete().eq('id', pageId);
            if (error) {
                console.error("Error deleting fanpage:", error);
                alert(`Error al eliminar la página: ${error.message}`);
            } else {
                fetchData();
            }
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (window.confirm('ADVERTENCIA: Esto eliminará el perfil del usuario de la base de datos, pero NO eliminará la cuenta de autenticación. El usuario aún podrá iniciar sesión (aunque su perfil estará en blanco). Para una eliminación completa se requiere una operación de servidor. ¿Deseas continuar?')) {
            const { error } = await supabase.from('profiles').delete().eq('id', userId);
            if (error) {
                console.error("Error deleting user profile:", error);
                alert(`Error al eliminar el usuario: ${error.message}`);
            } else {
                fetchData();
            }
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark p-4 rounded-xl shadow"><h2 className="text-xl font-bold mb-4 text-z-text-primary dark:text-z-text-primary-dark">Nuevos Usuarios por Mes</h2><canvas ref={usersChartRef}></canvas></div>
                <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark p-4 rounded-xl shadow"><h2 className="text-xl font-bold mb-4 text-z-text-primary dark:text-z-text-primary-dark">Páginas por Categoría</h2><canvas ref={categoriesChartRef}></canvas></div>
                <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark p-4 rounded-xl shadow"><h2 className="text-xl font-bold mb-4 text-z-text-primary dark:text-z-text-primary-dark">Estado de Usuarios</h2><div className="h-64 flex justify-center"><canvas ref={activeUsersChartRef}></canvas></div></div>
                <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark p-4 rounded-xl shadow"><h2 className="text-xl font-bold mb-4 text-z-text-primary dark:text-z-text-primary-dark">Estado de Páginas</h2><div className="h-64 flex justify-center"><canvas ref={activePagesChartRef}></canvas></div></div>
            </div>

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
                                        <button onClick={() => handleToggleFanpageStatus(fp.id, fp.is_active)} disabled className={`text-sm font-medium ${fp.is_active !== false ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-500 hover:text-green-700'} disabled:opacity-50 disabled:cursor-not-allowed`}>{fp.is_active !== false ? 'Desactivar' : 'Activar'}</button>
                                        <button onClick={() => handleDeleteFanpage(fp.id)} className="ml-4 text-sm font-medium text-red-500 hover:text-red-700">Eliminar</button>
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
                                        <button onClick={() => handleToggleUserStatus(u.id, u.is_active)} disabled className={`text-sm font-medium ${u.is_active !== false ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-500 hover:text-green-700'} disabled:opacity-50 disabled:cursor-not-allowed`}>{u.is_active !== false ? 'Desactivar' : 'Activar'}</button>
                                        <button onClick={() => handleDeleteUser(u.id)} className="ml-4 text-sm font-medium text-red-500 hover:text-red-700">Eliminar</button>
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