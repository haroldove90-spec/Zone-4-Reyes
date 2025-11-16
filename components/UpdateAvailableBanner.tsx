import React from 'react';

interface UpdateAvailableBannerProps {
  onRefresh: () => void;
}

const UpdateAvailableBanner: React.FC<UpdateAvailableBannerProps> = ({ onRefresh }) => (
  <div className="fixed bottom-20 md:bottom-4 left-1/2 -translate-x-1/2 bg-z-dark-blue text-white p-4 rounded-lg shadow-lg flex items-center space-x-4 z-50 animate-fadeIn">
    <p>Hay una nueva versión disponible.</p>
    <button
      onClick={onRefresh}
      className="bg-white text-z-dark-blue font-bold py-1 px-3 rounded-md hover:bg-gray-200 transition-colors"
    >
      Actualizar
    </button>
  </div>
);

export default UpdateAvailableBanner;
