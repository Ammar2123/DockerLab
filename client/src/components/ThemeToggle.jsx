import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, Monitor } from 'lucide-react';

const ThemeToggle = ({ className = '' }) => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full 
      bg-surface-100 text-surface-600 
      hover:bg-surface-200 hover:text-primary-600
      dark:bg-surface-800 dark:text-surface-300 
      dark:hover:bg-surface-700 dark:hover:text-primary-400
      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
      dark:focus:ring-offset-surface-900 transition-colors duration-200 ease-in-out ${className}`}
    >
      <span className="sr-only">Toggle theme</span>
      {darkMode ? (
        <Sun size={20} className="transition-transform duration-200" />
      ) : (
        <Moon size={20} className="transition-transform duration-200" />
      )}
    </button>
  );
};

export default ThemeToggle;