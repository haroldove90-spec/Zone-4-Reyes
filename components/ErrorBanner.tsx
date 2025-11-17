
import React from 'react';
import { AlertTriangleIcon } from './icons';

interface ErrorBannerProps {
  message: string | null;
  onClose: () => void;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 w-11/12 max-w-lg bg-red-600 text-white p-4 rounded-lg shadow-lg flex items-center justify-between z-[60] animate-slideInUp" role="alert">
      <div className="flex items-center">
        <AlertTriangleIcon className="h-6 w-6 mr-3 flex-shrink-0" />
        <span className="font-medium text-sm sm:text-base">{message}</span>
      </div>
      <button onClick={onClose} className="text-2xl font-bold leading-none hover:text-red-100 p-1 -mr-2" aria-label="Cerrar">&times;</button>
    </div>
  );
};

export default ErrorBanner;
