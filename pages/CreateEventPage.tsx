
import React, { useState } from 'react';
import { AppEvent } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface CreateEventPageProps {
    onAddEvent: (event: AppEvent) => void;
    navigate: (path: string) => void;
}

const CreateEventPage: React.FC<CreateEventPageProps> = ({ onAddEvent, navigate }) => {
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !date || !location || !description || !user) return;

        const newEvent: AppEvent = {
            id: `e${Date.now()}`,
            name,
            date,
            location,
            description,
            organizer: user,
            attendees: 1,
            coverUrl: `https://picsum.photos/seed/${name.replace(/\s/g, '')}/1600/900`,
        };
        onAddEvent(newEvent);
        navigate('events');
    };

    return (
        <main className="flex-grow pt-14 lg:ml-20 xl:ml-80 lg:mr-72 overflow-x-hidden p-4 md:p-6">
            <div className="max-w-2xl mx-auto bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-xl shadow-md p-6">
                <div className="flex items-center space-x-4 mb-6">
                    <button onClick={() => navigate('events')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-z-hover-dark transition-colors">&larr;</button>
                    <h1 className="text-2xl font-bold text-z-text-primary dark:text-z-text-primary-dark">Crear un Evento</h1>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="event-name" className="block text-sm font-medium mb-1 text-z-text-secondary dark:text-z-text-secondary-dark">Nombre del Evento</label>
                        <input id="event-name" type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-z-bg-primary dark:bg-z-hover-dark rounded-md p-2.5" placeholder="Ej: Kermés Anual" />
                    </div>
                     <div>
                        <label htmlFor="event-date" className="block text-sm font-medium mb-1 text-z-text-secondary dark:text-z-text-secondary-dark">Fecha y Hora</label>
                        <input id="event-date" type="text" value={date} onChange={e => setDate(e.target.value)} required className="w-full bg-z-bg-primary dark:bg-z-hover-dark rounded-md p-2.5" placeholder="Ej: SÁB, 25 NOV, 12:00 PM" />
                    </div>
                     <div>
                        <label htmlFor="event-location" className="block text-sm font-medium mb-1 text-z-text-secondary dark:text-z-text-secondary-dark">Ubicación</label>
                        <input id="event-location" type="text" value={location} onChange={e => setLocation(e.target.value)} required className="w-full bg-z-bg-primary dark:bg-z-hover-dark rounded-md p-2.5" placeholder="Ej: Parque Central de Reyes Iztacala" />
                    </div>
                     <div>
                        <label htmlFor="event-desc" className="block text-sm font-medium mb-1 text-z-text-secondary dark:text-z-text-secondary-dark">Descripción</label>
                        <textarea id="event-desc" value={description} onChange={e => setDescription(e.target.value)} rows={4} required className="w-full bg-z-bg-primary dark:bg-z-hover-dark rounded-md p-2.5 resize-none" placeholder="Describe de qué trata tu evento..."></textarea>
                    </div>
                    <button type="submit" className="w-full bg-z-primary text-white font-bold py-2.5 rounded-lg hover:bg-z-dark-blue disabled:bg-gray-400" disabled={!name || !description || !date || !location}>Crear Evento</button>
                </form>
            </div>
        </main>
    );
};

export default CreateEventPage;