import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for saved theme preference or system preference on mount
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
          // Fall back to system preference if no stored preference
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          setDarkMode(prefersDark);
          if (prefersDark) {
            document.documentElement.classList.add('dark');
          }
        }
      } catch (error) {
        console.error('Failed to initialize theme:', error);
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
        setDarkMode(e.matches);
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
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