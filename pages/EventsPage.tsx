
import React from 'react';
import { AppEvent } from '../types';
import { CalendarIcon, MapPinIcon } from '../components/icons';

interface EventsPageProps {
  navigate: (path: string) => void;
  events: AppEvent[];
}

const EventCard: React.FC<{ event: AppEvent; onClick: () => void }> = ({ event, onClick }) => {
    const creationDate = new Date(event.creationDate).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
    
    return (
        <div onClick={onClick} className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-lg shadow-md overflow-hidden group cursor-pointer flex flex-col sm:flex-row">
            <img src={event.coverUrl} alt={event.name} className="w-full sm:w-48 h-32 sm:h-auto object-cover" />
            <div className="p-4 flex flex-col flex-grow justify-between">
                <div>
                    <p className="text-sm font-bold text-z-primary">{event.date}</p>
                    <h3 className="text-xl font-bold text-z-text-primary dark:text-z-text-primary-dark group-hover:underline mt-1">{event.name}</h3>
                    <p className="text-sm text-z-text-secondary dark:text-z-text-secondary-dark mt-1 flex items-center"><MapPinIcon className="w-4 h-4 mr-1.5"/>{event.location}</p>
                </div>
                <div className="flex justify-between items-center mt-2 text-sm text-z-text-secondary dark:text-z-text-secondary-dark">
                    <span>{event.attendees} asistentes</span>
                    <span>Publicado el {creationDate}</span>
                </div>
            </div>
        </div>
    );
};

const EventsPage: React.FC<EventsPageProps> = ({ navigate, events }) => {
    return (
        <main className="flex-grow pt-14 lg:ml-20 xl:ml-80 lg:mr-72 overflow-x-hidden p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                    <div className="flex items-center space-x-3">
                        <CalendarIcon className="h-8 w-8 text-z-primary"/>
                        <h1 className="text-3xl font-bold text-z-text-primary dark:text-z-text-primary-dark">Eventos</h1>
                    </div>
                    <button onClick={() => navigate('create-event')} className="bg-z-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-z-dark-blue transition-colors w-full md:w-auto">
                        + Crear Evento
                    </button>
                </div>

                <div className="space-y-4">
                    {events.length > 0 ? (
                        events.map(event => (
                            <EventCard key={event.id} event={event} onClick={() => navigate(`event/${event.id}`)} />
                        ))
                    ) : (
                         <div className="text-center py-16 bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-xl">
                            <h2 className="text-xl font-bold text-z-text-primary dark:text-z-text-primary-dark">No hay eventos próximos</h2>
                            <p className="text-z-text-secondary dark:text-z-text-secondary-dark mt-2 mb-4">¡Anímate y crea el primer evento en la comunidad!</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default EventsPage;