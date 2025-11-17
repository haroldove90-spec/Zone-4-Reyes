import React from 'react';
import { SearchIcon, PhotoIcon } from './icons';

const MobileSearch: React.FC = () => {
  return (
    <div className="lg:hidden bg-z-bg-primary dark:bg-z-bg-primary-dark p-2 border-b border-gray-200 dark:border-z-border-dark shadow-sm">
      <div className="flex items-center space-x-2">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400 dark:text-z-text-secondary-dark" />
          </div>
          <input
            type="text"
            placeholder="Buscar en Zone4Reyes"
            className="bg-z-bg-secondary dark:bg-z-hover-dark text-z-text-primary dark:text-z-text-primary-dark rounded-full py-2.5 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-z-primary/50 transition-colors"
          />
        </div>
        <div>
          <label htmlFor="mobile-file-upload" className="p-3 bg-z-bg-secondary dark:bg-z-hover-dark rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-z-border-dark transition-colors inline-block">
            <PhotoIcon className="h-6 w-6 text-green-500" />
          </label>
          <input id="mobile-file-upload" type="file" className="hidden" accept="image/*,video/*" />
        </div>
      </div>
    </div>
  );
};

export default MobileSearch;