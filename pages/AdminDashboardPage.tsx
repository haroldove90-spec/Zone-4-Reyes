
import React from 'react';
import { Fanpage } from '../types';

// Mock data, as it was in MainLayout
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
    const chartData = [
        { label: 'Jul', value: 12 }, { label: 'Ago', value: 19 }, { label: 'Sep', value: 32 }, { label: 'Oct', value: 48 },
    ];
    return (
        <main className="flex-grow pt-14 lg:ml-20 xl:ml-80 lg:mr-72 overflow-x-hidden p-4 md:p-6">
            <h1 className="text-3xl font-bold text-z-text-primary dark:text-z-text-primary-dark mb-6">Panel de Administrador</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark p-5 rounded-xl shadow animate-slideInUp" style={{animationDelay: '100ms'}}><h3 className="text-z-text-secondary dark:text-z-text-secondary-dark text-sm font-semibold">Usuarios Totales</h3><p className="text-3xl font-bold">{MOCK_USERS.length}</p></div>
                <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark p-5 rounded-xl shadow animate-slideInUp" style={{animationDelay: '200ms'}}><h3 className="text-z-text-secondary dark:text-z-text-secondary-dark text-sm font-semibold">Páginas Totales</h3><p className="text-3xl font-bold">{MOCK_FANPAGES.length}</p></div>
                <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark p-5 rounded-xl shadow animate-slideInUp" style={{animationDelay: '300ms'}}><h3 className="text-z-text-secondary dark:text-z-text-secondary-dark text-sm font-semibold">Usuarios Activos Hoy</h3><p className="text-3xl font-bold">12</p></div>
                <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark p-5 rounded-xl shadow animate-slideInUp" style={{animationDelay: '400ms'}}><h3 className="text-z-text-secondary dark:text-z-text-secondary-dark text-sm font-semibold">Reportes</h3><p className="text-3xl font-bold">3</p></div>
            </div>
            <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark p-4 rounded-xl shadow mb-6">
                <h2 className="text-xl font-bold mb-4">Nuevos Usuarios por Mes</h2>
                <UserChart data={chartData} />
            </div>
            <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark p-4 rounded-xl shadow">
                <h2 className="text-xl font-bold mb-4">Usuarios Registrados</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead><tr className="border-b dark:border-z-border-dark"><th className="p-3 text-sm font-semibold text-z-text-secondary dark:text-z-text-secondary-dark">Nombre</th><th className="p-3 text-sm font-semibold text-z-text-secondary dark:text-z-text-secondary-dark">Email</th><th className="p-3 text-sm font-semibold text-z-text-secondary dark:text-z-text-secondary-dark">Fecha de Registro</th></tr></thead>
                        <tbody>{MOCK_USERS.map(u => <tr key={u.email} className="border-b dark:border-z-border-dark hover:bg-gray-50 dark:hover:bg-z-hover-dark transition-colors"><td className="p-3">{u.name}</td><td className="p-3">{u.email}</td><td className="p-3">{u.joined}</td></tr>)}</tbody>
                    </table>
                </div>
            </div>
        </main>
    );
};

export default AdminDashboardPage;
