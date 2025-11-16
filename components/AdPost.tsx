
import React from 'react';
import { MoreHorizontalIcon, ThumbsUpIcon } from './icons';

const AdPost: React.FC = () => {
    return (
        <div className="bg-z-bg-secondary dark:bg-z-bg-secondary-dark rounded-xl shadow-md my-6 border border-transparent dark:border-z-border-dark animate-slideInUp">
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <img src="https://picsum.photos/id/55/200" alt="Cafe Local" className="h-10 w-10 rounded-full" />
                        <div>
                            <p className="font-bold text-z-text-primary dark:text-z-text-primary-dark">El Rincón del Café</p>
                            <p className="text-sm text-z-text-secondary dark:text-z-text-secondary-dark">Publicidad</p>
                        </div>
                    </div>
                    <div className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-z-hover-dark cursor-pointer transition-colors">
                        <MoreHorizontalIcon className="h-6 w-6 text-z-text-secondary dark:text-z-text-secondary-dark" />
                    </div>
                </div>
                <p className="my-3 text-z-text-primary dark:text-z-text-primary-dark text-[15px] leading-relaxed">
                    ¿Necesitas un descanso? Ven a El Rincón del Café en el corazón de Reyes Iztacala y disfruta de nuestro nuevo Frappé de Caramelo. ¡Te esperamos! ☕️✨
                </p>
            </div>

            <div className="bg-z-bg-primary dark:bg-z-bg-primary-dark relative">
                <img src="https://picsum.photos/id/225/800/500" alt="Anuncio de café" className="w-full h-auto max-h-[60vh] object-contain" />
                 <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-3 flex justify-between items-center">
                    <div>
                        <p className="text-white/80 text-xs uppercase">ELRINCONDELCAFE.COM</p>
                        <p className="text-white font-bold text-lg">Frappé de Caramelo a solo $50</p>
                    </div>
                    <button className="bg-white text-black font-bold py-2 px-4 rounded-md hover:bg-gray-200 transition-colors">
                        Ver Menú
                    </button>
                </div>
            </div>

            <div className="p-2 px-4 flex justify-between items-center text-z-text-secondary dark:text-z-text-secondary-dark">
                <div className="flex items-center space-x-1">
                    <div className="p-1 bg-z-light-blue rounded-full">
                        <ThumbsUpIcon className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-sm">451</span>
                </div>
                <span className="text-sm">34 comentarios</span>
            </div>
        </div>
    );
};

export default AdPost;
