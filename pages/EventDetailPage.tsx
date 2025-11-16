
import React, { useState } from 'react';
import { Event } from '../types';
import { CalendarIcon, MapPinIcon } from '../components/icons';

interface EventDetailPageProps {
  event: Event;
}

const EventDetailPage: React.FC<EventDetailPageProps> = ({ event }) => {
  const [isAttending, setIsAttending] = useState(false);
  const [attendeeCount, setAttendeeCount] = useState(event.attendees);

  const handleAttendClick = () => {
    setAttendeeCount(prev => isAttending ? prev - 1 : prev + 1);
    setIsAttending(!isAttending);
  };

  const organizer = 'ownerEmail' in event.organizer ? event.organizer as any : event.organizer;

  return (
    <main className="flex-grow pt-14 lg:ml-20 xl:ml-80 lg:mr-72 overflow-x-hidden">
        <div className="max-w-4xl mx-auto">
            <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark shadow-md">
                <img src={event.coverUrl} alt={`Portada de ${event.name}`} className="w-full h-48 md:h-72 object-cover" />
                <div className="p-4 md:p-6">
                    <h1 className="text-4xl font-bold text-z-text-primary dark:text-z-text-primary-dark">{event.name}</h1>
                    <div className="flex items-center space-x-4 mt-4 text-z-text-secondary dark:text-z-text-secondary-dark">
                         <div className="flex items-center space-x-2">
                            <CalendarIcon className="w-5 h-5"/>
                            <span className="font-semibold">{event.date}</span>
                         </div>
                         <div className="flex items-center space-x-2">
                            <MapPinIcon className="w-5 h-5"/>
                            <span className="font-semibold">{event.location}</span>
                         </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mt-6 border-t dark:border-z-border-dark pt-4 gap-4">
                        <div className="flex items-center space-x-3">
                            <img src={organizer.avatarUrl} alt={organizer.name} className="h-12 w-12 rounded-full" />
                            <div>
                                <p className="text-sm text-z-text-secondary dark:text-z-text-secondary-dark">Organizado por</p>
                                <p className="font-bold text-z-text-primary dark:text-z-text-primary-dark">{organizer.name}</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleAttendClick}
                            className={`font-bold py-2 px-8 rounded-lg transition-colors w-full sm:w-auto ${isAttending ? 'bg-gray-200 dark:bg-z-hover-dark text-z-text-primary dark:text-z-text-primary-dark' : 'bg-z-primary text-white hover:bg-z-dark-blue'}`}
                        >
                            {isAttending ? 'Asistiendo' : 'Asistiré'}
                        </button>
                    </div>

                </div>
            </div>
            <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <h2 className="text-2xl font-bold mb-3 text-z-text-primary dark:text-z-text-primary-dark">Detalles</h2>
                    <p className="text-z-text-primary dark:text-z-text-primary-dark whitespace-pre-wrap">{event.description}</p>
                </div>
                <div className="md:col-span-1">
                    <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-xl shadow-md p-4">
                        <h3 className="text-xl font-bold mb-3 text-z-text-primary dark:text-z-text-primary-dark">Asistentes ({attendeeCount})</h3>
                        {/* Placeholder for attendee list */}
                        <p className="text-sm text-z-text-secondary dark:text-z-text-secondary-dark">Próximamente: mira quién más asistirá.</p>
                    </div>
                </div>
            </div>
        </div>
    </main>
  );
};

export default EventDetailPage;