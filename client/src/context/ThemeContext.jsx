import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Initialize darkMode to true as default
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);

  // Check for saved theme preference on mount
  useEffect(() => {
    const initTheme = () => {
      try {
        // Check stored preference first
        const storedTheme = localStorage.getItem('theme');
        
        if (storedTheme === 'dark') {
          setDarkMode(true);
          document.documentElement.classList.add('dark');
        } else if (storedTheme === 'light') {
          setDarkMode(false);
          document.documentElement.classList.remove('dark');
        } else {
          // No stored preference, use dark mode as default
          setDarkMode(true);
          document.documentElement.classList.add('dark');
          // Store this preference
          localStorage.setItem('theme', 'dark');
        }
      } catch (error) {
        console.error('Failed to initialize theme:', error);
        // Even on error, ensure dark mode is set
        setDarkMode(true);
        document.documentElement.classList.add('dark');
      } finally {
        setLoading(false);
      }
    };

    initTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      // Only apply system preference if user hasn't set a preference
      if (!localStorage.getItem('theme')) {
        setDarkMode(true); // Always default to dark regardless of system
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setDarkMode(prev => {
      const newDarkMode = !prev;
      
      // Update DOM
      if (newDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // Store preference
      localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
      
      // Notify Electron if available
      if (window.electronAPI?.setTheme) {
        window.electronAPI.setTheme(newDarkMode ? 'dark' : 'light');
      }
      
      return newDarkMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme, loading }}>
      {children}
    </ThemeContext.Provider>
  );
};