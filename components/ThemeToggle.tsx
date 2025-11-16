
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { SunIcon, MoonIcon } from './icons';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 bg-z-bg-primary dark:bg-z-bg-secondary-dark rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-z-hover-dark"
      title="Cambiar tema"
      aria-label="Cambiar tema"
    >
      {theme === 'light' ? (
        <MoonIcon className="h-6 w-6 text-z-text-primary dark:text-z-text-primary-dark" />
      ) : (
        <SunIcon className="h-6 w-6 text-z-text-primary dark:text-z-text-primary-dark" />
      )}
    </button>
  );
};

export default ThemeToggle;