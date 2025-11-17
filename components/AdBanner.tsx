import React from 'react';
import { MegaphoneIcon } from './icons';

const AdBanner: React.FC = () => {
  return (
    <div className="relative rounded-xl overflow-hidden my-6 shadow-md cursor-pointer group animate-fadeIn">
      <img 
        src="https://picsum.photos/id/22/1200/400" 
        alt="Anuncio de negocio local" 
        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent p-6 flex flex-col justify-center">
        <div className="flex items-center space-x-2 mb-2">
          <MegaphoneIcon className="h-5 w-5 text-yellow-400" />
          <p className="text-sm font-semibold text-yellow-400 uppercase tracking-wider">Negocio Local Destacado</p>
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
          Descubre los sabores de "La Cocina de Mamá"
        </h2>
        <p className="text-white/80 mt-2 max-w-md">
          Auténtica comida casera en el corazón de Reyes Iztacala. ¡Visítanos y prueba nuestro platillo del día!
        </p>
        <button className="mt-4 bg-z-primary text-white font-bold py-2 px-5 rounded-lg hover:bg-z-dark-blue transition-colors self-start">
          Ver Menú
        </button>
      </div>
    </div>
  );
};

export default AdBanner;
